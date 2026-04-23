// ===============================================
// importPipeline.ts
// Universele CSV import pipeline
// detect → parse → map
// ===============================================

import { NormalizedTransaction } from "@/shared/types/NormalizedTransaction";
import { autoCategory } from "./autoCategory";

// -----------------------------------------------
// 1. Helpers
// -----------------------------------------------

function safeString(v: any) {
  return v === undefined || v === null ? "" : String(v).trim();
}

function detectIncome(description: string) {
  const lower = description.toLowerCase();
  return [
    "salaris",
    "loon",
    "inkomen",
    "bijschrijving",
    "storting",
    "refund",
    "credit",
  ].some((w) => lower.includes(w));
}

function normalizeAmount(raw: any, isIncome: boolean) {
  if (!raw) return 0;

  const cleaned = String(raw).replace("€", "").replace(",", ".").trim();
  const value = Number(cleaned);

  if (isNaN(value)) return 0;
  return isIncome ? Math.abs(value) : -Math.abs(value);
}
function notNull<T>(value: T | null): value is T {
  return value !== null;
}

// -----------------------------------------------
// 2. Format detector
// -----------------------------------------------

type CsvFormat = "rabobank" | "ing" | "generic" | "bunq" | "unknown";

function detectFormat(columns: string[]): CsvFormat {
  const cols = columns.map((c) => c.trim().toLowerCase());

  if (cols.includes("omschrijving-1")) return "rabobank";
  if (cols.includes("naam/omschrijving") || cols.includes("af bij"))
    return "ing";
  if (
    cols.includes("date") &&
    cols.includes("amount") &&
    cols.includes("external_id")
  )
    return "bunq";
  if (
    cols.includes("date") &&
    cols.includes("description") &&
    cols.includes("amount")
  )
    return "generic";

  return "unknown";
}

// -----------------------------------------------
// 3. Parsers per formaat
// -----------------------------------------------

// Rabobank
function parseRabobank(row: any): NormalizedTransaction {
  const description = [
    row["Omschrijving-1"],
    row["Omschrijving-2"],
    row["Omschrijving-3"],
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const isIncome = detectIncome(description);
  const amount = normalizeAmount(row["Bedrag"], isIncome);

  return {
    date: safeString(row["Datum"]),
    amount,
    description,
    merchant: safeString(row["Naam tegenpartij"]) || "onbekend",
    merchant_raw: safeString(row["Naam tegenpartij"]) || "onbekend",
  };
}

// ING
function parseIng(row: any): NormalizedTransaction {
  const description =
    row["Naam/Omschrijving"] ||
    row["Naam / Omschrijving"] ||
    row["Omschrijving"] ||
    row["NaamOmschrijving"] ||
    "onbekend";

  const date = row["Datum"] || row["Boekdatum"] || "";
  const rawAmount = row["Bedrag"] || row["Bedrag (EUR)"] || "0";

  const afBij = row["Af Bij"] || row["AfBij"] || "";
  const isIncome = afBij.toLowerCase() === "bij" || detectIncome(description);

  const amount = normalizeAmount(rawAmount, isIncome);

  return {
    date,
    amount,
    description,
    merchant: description,
    merchant_raw: description,
  };
}

// Generic (jouw CSV)
function parseGeneric(row: any): NormalizedTransaction {
  const description = safeString(row.description);
  const isIncome = detectIncome(description);

  return {
    date: safeString(row.date),
    amount: normalizeAmount(row.amount, isIncome),
    description,
    merchant: safeString(row.category_name) || "onbekend",
    merchant_raw: safeString(row.category_name) || "onbekend",
  };
}

// -----------------------------------------------
// 4. Universal parser selector
// -----------------------------------------------

function universalParse(
  row: any,
  columns: string[],
): NormalizedTransaction | null {
  if (!row || Object.values(row).every((v) => !v)) return null;

  const format = detectFormat(columns);

  switch (format) {
    case "rabobank":
      return parseRabobank(row);
    case "ing":
      return parseIng(row);
    case "generic":
      return parseGeneric(row);
    default:
      return parseGeneric(row); // fallback
  }
}

// -----------------------------------------------
// 5. Mapper → Transaction model
// -----------------------------------------------

function mapToTransaction(n: NormalizedTransaction) {
  return {
    date: n.date,
    amount: n.amount,
    description: n.description,
    merchant: n.merchant,
    categoryId: autoCategory(n.description),
    userId: "demo-user",
    receiptId: null,
  };
}

// -----------------------------------------------
// 6. Entry point
// -----------------------------------------------

export function importCsvRows(rows: any[]) {
  if (!rows.length) return [];

  const columns = Object.keys(rows[0]);

  return rows
    .map((row) => universalParse(row, columns))
    .filter(notNull)
    .map(mapToTransaction);
}
