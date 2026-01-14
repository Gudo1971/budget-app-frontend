// ===============================
// mapCsvRowToTransaction.ts
// ===============================

import { autoCategory } from "./autoCategory";

// 1. Income detection
function detectIncome(description: string) {
  if (!description) return false;

  const incomeKeywords = [
    "salaris",
    "loon",
    "bijschrijving",
    "storting",
    "inkomen",
    "refund",
    "terugbetaling",
    "credit",
    "deposit",
    "interest",
    "rente",
    "creditrente",
    "ing interest",
    "credit interest",
  ];

  const lower = description.toLowerCase();
  return incomeKeywords.some((word) => lower.includes(word));
}

// 2. Always sign amounts correctly
function normalizeSignedAmount(raw: string, isIncome: boolean) {
  const value = Number(raw.replace(",", "."));

  if (isIncome) {
    return Math.abs(value); // always positive
  }

  return -Math.abs(value); // everything else is an expense
}

export function mapCsvRowToTransaction(row: any) {
  // 3. Combine Rabobank description fields
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
    amount: normalizeSignedAmount(row["Bedrag"], isIncome),
    date: row["Datum"],
    merchant: row["Naam tegenpartij"] || "Onbekend",
    description,
    categoryId: autoCategory(description),
    userId: "demo-user",
    receiptId: null,
  };
}
