export type SubBudget = {
  id: number;
  month: string;
  amount: number;
  category_id: number;
  category_name: string;
  category_type: string;
  category_color: string;

  // ⭐ Frontend‑only enriched fields
  spent?: number;
  transactions?: {
    id: number;
    description: string;
    amount: number;
    category_id: number;
  }[];
};
