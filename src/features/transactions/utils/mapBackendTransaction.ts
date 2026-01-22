import type { Transaction } from "@shared/types/Transaction";

export function mapBackendToTransaction(t: Transaction): Transaction {
  return {
    id: t.id,

    // Datums
    date: t.date,
    transaction_date: undefined, // backend stuurt dit niet

    // Beschrijving & bedrag
    description: t.description,
    amount: t.amount,

    // Merchant
    merchant: t.merchant,
    merchant_raw: undefined, // backend stuurt dit niet

    // Koppelingen
    receipt_id: t.receipt_id,
    user_id: undefined, // backend stuurt dit niet

    // Categorieën
    // Backend stuurt IDs → frontend toont labels via getCategoryName/getSubcategoryName
    category_id: t.category_id ?? null,
    subcategory_id: t.subcategory_id ?? null,

    recurring: t.recurring,

    // Bon / AI
    receipt: t.receipt
      ? {
          url: t.receipt.url,
          thumbnail: t.receipt.thumbnail,
          aiResult: t.receipt.aiResult,
          thumbnailUrl: undefined,
        }
      : undefined,
  };
}
