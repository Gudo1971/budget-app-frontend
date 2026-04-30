import { apiPost } from "@/lib/api/api";

export async function startMatchFlow(receiptId: number) {
  return apiPost(`/receipts/${receiptId}/link`, {});
}
