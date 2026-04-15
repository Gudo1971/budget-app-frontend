// features/import/logic/mapper.ts

import { autoCategory } from "./autoCategory";

export function mapToTransaction(parsed: any) {
  return {
    date: parsed.date,
    description: parsed.description,
    merchant: parsed.merchant,
    amount: parsed.amount,
    categoryId: autoCategory(parsed.description),
    userId: "demo-user",
    receiptId: null,
  };
}
