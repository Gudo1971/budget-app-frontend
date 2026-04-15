export function mapPdfRowToTransaction(row: any) {
  // 1. Datum converteren (DD-MM-YYYY → YYYY-MM-DD)
  let transaction_date = row.date;
  if (row.date.includes("-")) {
    const [day, month, year] = row.date.split("-");
    transaction_date = `${year}-${month}-${day}`;
  }

  // 2. Merchant extraheren uit description
  // Voorbeeld: "BBR: ... WarmteStad; WS20007451 - ..."
  let merchant = "Onbekend";
  if (row.description.includes(";")) {
    merchant = row.description.split(";")[1].trim();
  }

  // 3. Amount fixen (komma → punt)
  const amount = parseFloat(String(row.amount).replace(",", "."));

  return {
    transaction_date,
    merchant,
    amount,
    description: row.description,
    category_id: null, // later merchant-memory
    source: "pdf",
  };
}
