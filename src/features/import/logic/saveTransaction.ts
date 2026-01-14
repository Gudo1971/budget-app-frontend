export async function saveTransaction(tx: any) {
  const payload = {
    source: "csv",
    receiptId: tx.receiptId ?? null,
    extracted: {}, // CSV gebruikt extracted niet
    form: {
      amount: tx.amount,
      date: tx.date,
      merchant: tx.merchant,
      description: tx.description,
      category_id: tx.categoryId ?? null,
    },
  };

  await fetch("http://localhost:3001/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
