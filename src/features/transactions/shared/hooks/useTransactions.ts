import { useState, useEffect } from "react";
import { apiGet } from "../../../../lib/api/api";

export type BackendTransaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  category_id: number | null;
  merchant: string | null; // ← HIER
  category: {
    id: number;
    name: string;
    type: string;
  } | null;
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
