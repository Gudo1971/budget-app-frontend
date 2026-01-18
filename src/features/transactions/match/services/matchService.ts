export async function startMatchFlow(receiptId: number) {
  const res = await fetch(`/api/receipts/${receiptId}/link`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to link receipt");

  return res.json();
}
