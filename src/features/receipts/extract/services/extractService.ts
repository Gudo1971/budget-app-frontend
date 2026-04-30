import { ExtractedReceipt } from "../types/extractTypes";
import { apiPost } from "@/lib/api/api";

// ⭐ Receipt analyseren
export async function analyzeReceipt(
  receiptId: number,
): Promise<ExtractedReceipt> {
  const data = await apiPost<{ extracted: { parsedJson: ExtractedReceipt } }>(
    `/receipts/${receiptId}/extract`,
    {},
  );

  return data.extracted.parsedJson;
}

// ⭐ Merchant category opslaan (merchantMemory)
export async function saveMerchantCategory(merchant: string, category: string) {
  await apiPost("/merchant-memory/update", {
    merchant,
    category_id: category,
  });
}
