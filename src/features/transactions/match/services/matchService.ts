export async function startMatchFlow(receiptId: number) {
  const API = import.meta.env.VITE_API_URL;

  const res = await fetch(`${API}/receipts/${receiptId}/link`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to link receipt");

  return res.json();
}
