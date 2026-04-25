import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../lib/api/api";
import type { Transaction } from "@/shared/types/Transaction";

type TransactionsResponse = {
  success: boolean;
  data: Transaction[];
  error: string | null;
};

export function useTransactions(
  refreshKey?: string,
  from?: string,
  to?: string,
) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams();

      // ⭐ Alleen toevoegen als ze bestaan
      if (from) query.append("from", from);
      if (to) query.append("to", to);

      // ⭐ Als er GEEN from/to zijn → haal ALLE transacties op
      const url =
        query.toString().length > 0
          ? `/transactions?${query.toString()}`
          : "/transactions";

      const res = await apiGet<TransactionsResponse>(url);

      setData([...res.data]); // nieuwe referentie
    } catch (err: any) {
      setError(err.message ?? "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    // ⭐ Als refreshKey undefined is, niet fetchen (wacht op datums)
    if (refreshKey === undefined) {
      setLoading(false);
      return;
    }

    // ⭐ Anders fetchen (ook zonder from/to voor alle transacties)
    fetchTransactions();
  }, [refreshKey, fetchTransactions]);

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions,
  };
}
