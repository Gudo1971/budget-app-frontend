export type Receipt = {
  id: number;
  filename: string;
  original_name: string;
  uploaded_at: string;
};

export type ExtractedItem = {
  name: string;
  quantity: number;
  price: number;
  total?: number | null;
  category?: string | null;
  co2_grams?: number | null;
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
  [key: string]: any;
};
