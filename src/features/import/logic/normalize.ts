// logic/normalize.ts
import { NormalizedTransaction } from "../components/types/NormalizedTransaction";

export function normalize(tx: NormalizedTransaction): NormalizedTransaction {
  return {
    ...tx,
    amount: Number(tx.amount.toFixed(2)),
    merchant: tx.merchant.toLowerCase().trim().replace(/\s+/g, " "),
    description: tx.description.toLowerCase().trim().replace(/\s+/g, " "),
  };
}
