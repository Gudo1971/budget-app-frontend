export type Transaction = {
  id: number;
  amount: number;
  date: string; // ISO string
  merchant: string;
  category?: string | null;
  description?: string | null;
};
