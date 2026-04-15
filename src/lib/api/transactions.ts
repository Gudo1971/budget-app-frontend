export async function updateTransactionCategory(
  id: number,
  categoryId: number,
) {
  return fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category_id: categoryId }),
  });
}
