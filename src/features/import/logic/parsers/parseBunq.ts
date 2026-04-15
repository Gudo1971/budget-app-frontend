// features/import/logic/parsers/parseBunq.ts

import { safeString, normalizeAmount, detectIncome } from "../shared";

export function parseBunq(row: any) {
  const description = safeString(row.description);
  const isIncome = detectIncome(description);

  return {
    date: safeString(row.date),
    description,
    merchant: safeString(row.counterparty_name) || "Onbekend",
    amount: normalizeAmount(row.amount, isIncome),
  };
}
