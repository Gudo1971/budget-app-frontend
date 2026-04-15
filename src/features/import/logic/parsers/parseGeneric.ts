// features/import/logic/parsers/parseGeneric.ts

import { safeString, normalizeAmount, detectIncome } from "../shared";

export function parseGeneric(row: any) {
  const description = safeString(row.description);
  const isIncome = detectIncome(description);

  return {
    date: safeString(row.date),
    description,
    merchant: safeString(row.category_name) || "Onbekend",
    amount: normalizeAmount(row.amount, isIncome),
  };
}
