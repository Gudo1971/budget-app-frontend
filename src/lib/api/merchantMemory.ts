export async function updateMerchantMemory(
  merchant: string,
  categoryId: number,
) {
  return fetch("/api/merchant-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant,
      category: categoryId, // backend expects "category"
    }),
  });
}
