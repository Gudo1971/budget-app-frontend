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
