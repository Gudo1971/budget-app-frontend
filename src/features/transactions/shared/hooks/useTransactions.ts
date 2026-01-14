import { useState, useEffect } from "react";
import { apiGet } from "../../../../lib/api/api";

export type BackendTransaction = {
  id: number;
  description: string;
  amount: number;
  date: string;
  merchant?: string;

  category: {
    name: string;
    subcategory: string | null;
  };
};

type TransactionsResponse = {
  success: boolean;
  data: BackendTransaction[];
  error: string | null;
};

export function useTransactions() {
  const [data, setData] = useState<BackendTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<TransactionsResponse>("/transactions")
      .then((res) => setData(res.data)) // <-- DIT IS DE FIX
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
