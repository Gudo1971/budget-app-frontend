export type Transaction = {
  id: number;
  date: string;
  transaction_date?: string;
  description?: string;
  amount: number;

  merchant?: string;
  merchant_raw?: string;

  receipt_id: number | null;
  user_id?: string;

  category_id: number | null;
  subcategory_id?: number | null;

  type: "expense" | "income";
  recurring?: boolean;

  receipt?: {
    id: number;
    url: string;
    thumbnail?: string | null;

    aiResult?: {
      merchant?: string;
      amount?: number;
      date?: string;

      category?: string | null;
      subcategory?: string | null;

      recurring?: boolean;
      total?: number;

      items?: Array<{
        name: string;
        quantity?: number;
        price?: number;
        total?: number;
      }>;
    };

    thumbnailUrl?: string;
  } | null;
};
