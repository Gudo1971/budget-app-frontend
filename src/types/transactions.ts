export type Transaction = {
  id: string; // UI always uses string IDs
  description: string;
  amount: number;
  category: string; // always normalized to string
  merchant?: string;
  recurring?: boolean;
  date?: string;
  category_name?: string; // optional AI metadata
};

export type ExtractedItem = {
  name: string;
  quantity: number;
  price: number;
  total?: number | null;
  category?: string | null;
  co2_grams?: number | null;

  // Allow AI or OCR to add extra fields
  [key: string]: any;
};

export type ExtractedReceipt = {
  merchant: string | null;
  merchant_category?: string | null;
  date: string | null;
  total: number | null;
  subtotal?: number | null;
  tax?: number | null;
  currency: string | null;
  items: ExtractedItem[];

  // Allow OCR/AI to attach metadata
  [key: string]: any;
};

export function adaptBackendTransaction(t: any): Transaction {
  return {
    id: String(t.id),
    description: t.description,
    amount: t.amount,
    category: t.category?.name ?? "Onbekend",
    merchant: t.merchant ?? undefined,
    recurring: t.recurring ?? false,
    date: t.date ?? undefined,
  };
}
export function adaptCsvTransaction(t: any, index: number): Transaction {
  return {
    id: String(t.id ?? index),
    description: t.description,
    amount: Number(t.amount),
    category: t.category ?? "Onbekend",
    merchant: t.merchant ?? undefined,
    recurring: false,
    date: t.date ?? undefined,
  };
}
