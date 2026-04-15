// ===============================
// universalCsvMapper.ts
// ===============================

import { autoCategory } from "./autoCategory";

// -------------------------------
// 1. Helpers
// -------------------------------

function safeString(v: any) {
  return v === undefined || v === null ? "" : String(v).trim();
}

function normalizeAmount(raw: any, isIncome: boolean) {
  if (!raw) return 0;

  const cleaned = String(raw).replace("€", "").replace(",", ".").trim();

  const value = Number(cleaned);
  if (isNaN(value)) return 0;

  return isIncome ? Math.abs(value) : -Math.abs(value);
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

// -------------------------------
// 2. Format detectors
// -------------------------------

function isRabobank(row: any) {
  return row["Datum"] && row["Bedrag"];
}

function isGeneric(row: any) {
  return row["date"] && row["amount"];
}

// -------------------------------
// 3. Parsers per formaat
// -------------------------------

function parseRabobankRow(row: any) {
  const description = [
    row["Omschrijving-1"],
    row["Omschrijving-2"],
    row["Omschrijving-3"],
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const isIncome = detectIncome(description);

  return {
    date: safeString(row["Datum"]),
    description,
    merchant: safeString(row["Naam tegenpartij"]) || "Onbekend",
    amount: normalizeAmount(row["Bedrag"], isIncome),
    categoryId: autoCategory(description),
    userId: "demo-user",
    receiptId: null,
  };
}

function parseGenericRow(row: any) {
  const description = safeString(row.description);
  const isIncome = detectIncome(description);

  return {
    date: safeString(row.date),
    description,
    merchant: safeString(row.category_name) || "Onbekend",
    amount: normalizeAmount(row.amount, isIncome),
    categoryId: autoCategory(description),
    userId: "demo-user",
    receiptId: null,
  };
}

// -------------------------------
// 4. Universele mapper
// -------------------------------

export function mapCsvRowToTransaction(row: any) {
  // Skip lege rijen
  if (!row || Object.values(row).every((v) => !v)) return null;

  if (isRabobank(row)) return parseRabobankRow(row);
  if (isGeneric(row)) return parseGenericRow(row);

  // Fallback: probeer generiek
  return parseGenericRow(row);
}
