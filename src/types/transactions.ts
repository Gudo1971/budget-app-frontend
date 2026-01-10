export type Transaction = {
  id: string;
  description: string;
  amount: number;
  category: string;
  merchant: string;
  recurring: boolean;
  date: string;
  category_name?: string;
};
export type ExtractedItem = {
  name: string;
  quantity: number;
  price: number;
  total?: number | null;
  category?: string | null;
  co2_grams?: number | null;
  [key: string]: any; // HIER
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
  [key: string]: any; // EN HIER
};
