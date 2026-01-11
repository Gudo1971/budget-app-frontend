import {
  MatchCandidate,
  CreateTransactionFromReceiptInput,
} from "../types/matchTypes";

export async function getMatchCandidates(
  receiptId: number
): Promise<MatchCandidate[]> {
  const res = await fetch(`/api/receipts/${receiptId}/match`);

  return res.json();
}

export async function linkReceiptToTransaction(
  receiptId: number,
  transactionId: number
) {
  await fetch(`/api/receipts/${receiptId}/link-transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionId }),
  });
}

export async function createTransactionFromReceipt(
  receiptId: number,
  data: CreateTransactionFromReceiptInput
) {
  await fetch(`/api/transactions/from-receipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      receiptId,
      ...data,
    }),
  });
}
