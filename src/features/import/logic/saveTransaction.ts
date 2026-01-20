export async function saveTransaction(tx: any) {
  const payload = {
    amount: tx.amount,
    date: tx.date ?? "",
    merchant: tx.merchant,
    description: tx.description ?? tx.merchant,
    category: tx.category ?? "Overige",
    subcategory: tx.subcategory ?? "",
    receiptId: null,
    userId: "demo-user",
  };

  const res = await fetch("http://localhost:3001/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save CSV transaction");
  }

  return res.json();
}
