export interface MatchCandidate {
  id: number;
  amount: number;
  date: string;
  merchant: string | null;
}

export type CreateTransactionFromReceiptInput = {
  amount: number;
  date: string;
  merchant: string;
  category_id: number | null;
  description: string;
};
