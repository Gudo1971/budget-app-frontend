import { Transaction } from "./transactionTypes";
export type MatchResponse = {
  duplicate: Transaction | null;
  aiMatch: Transaction | null;
  candidates: Transaction[];
};

export type CreateTransactionFromReceiptInput = {
  amount: number;
  date: string;
  merchant: string;
  category_id: number | null;
  description: string;
};
