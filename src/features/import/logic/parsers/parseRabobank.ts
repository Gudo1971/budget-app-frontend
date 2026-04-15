// features/import/logic/parsers/parseRabobank.ts

import { safeString, normalizeAmount, detectIncome } from "../shared";

export function parseRabobank(row: any) {
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
  };
}
