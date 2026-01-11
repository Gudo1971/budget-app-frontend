import { useState, useEffect } from "react";
import { apiGet } from "../../../../lib/api/api";

export type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  category_id: number | null;
  category: {
    id: number;
    name: string;
    type: string;
  } | null;
};

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Transaction[]>("/transactions")
      .then((res) => setData(res)) // <-- GEEN MAPPING NODIG
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
