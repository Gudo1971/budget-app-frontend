export async function updateMerchantMemory(
  merchant: string,
  categoryId: number,
) {
  return fetch(`${import.meta.env.VITE_API_URL}/merchant-memory/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant,
      category_id: categoryId,
    }),
  });
}
