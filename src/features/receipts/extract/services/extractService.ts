import { ExtractedReceipt } from "../types/extractTypes";

export async function analyzeReceipt(
  receiptId: number
): Promise<ExtractedReceipt> {
  const res = await fetch(`/api/receipts/${receiptId}/extract`, {
    method: "POST",
  });

  const data = await res.json();
  return data.extracted.parsedJson;
}

export async function saveMerchantCategory(merchant: string, category: string) {
  await fetch("/merchant-category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant,
      category,
    }),
  });
}
