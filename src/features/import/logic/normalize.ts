// logic/normalize.ts
import { ImportedTransaction } from "@shared/types/ImportedTransaction";
import { NormalizedTransaction } from "../components/types/NormalizedTransaction";
import { cleanMerchant } from "../../../../../backend/src/utils/cleanMerchant";

export function normalize(tx: ImportedTransaction): NormalizedTransaction {
  const raw = tx.merchant_raw ?? tx.merchant ?? "";

  return {
    amount: Number(tx.amount.toFixed(2)),
    merchant: cleanMerchant(raw),
    description: tx.description?.trim().replace(/\s+/g, " ") ?? "",
    date: tx.date,
  };
}
