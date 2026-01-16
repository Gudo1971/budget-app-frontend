export function mapPdfRowToTransaction(row: any) {
  return {
    date: row.date,
    merchant: row.description,
    amount: parseFloat(String(row.amount).replace(",", ".")),
    category: null,
    source: "pdf",
  };
}
