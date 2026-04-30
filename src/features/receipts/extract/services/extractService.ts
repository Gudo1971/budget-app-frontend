import { ExtractedReceipt } from "../types/extractTypes";

const API = import.meta.env.VITE_API_URL;

// ⭐ Receipt analyseren
export async function analyzeReceipt(
  receiptId: number,
): Promise<ExtractedReceipt> {
  const res = await fetch(`${API}/receipts/${receiptId}/extract`, {
    method: "POST",
  });

  const data = await res.json();
  return data.extracted.parsedJson;
}

// ⭐ Merchant category opslaan (merchantMemory)
export async function saveMerchantCategory(merchant: string, category: string) {
  await fetch(`${API}/merchant-memory/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant,
      category_id: category,
    }),
  });
}
