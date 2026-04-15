import { useState } from "react";
import { apiPost } from "@/lib/api/api";
import type { Transaction } from "@shared/types/Transaction";

type FilterParams = {
  userId: string;
  year?: number;
  month?: number;
  week?: number;
  categoryId?: number;
};

type TransactionsResponse = {
  success: boolean;
  data: Transaction[];
  error: string | null;
};

export function useFilteredTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  async function filter(params: FilterParams) {
    setLoading(true);
    try {
      const res = await apiPost<TransactionsResponse>(
        "/transactions/filter",
        params,
      );
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, filter };
}
