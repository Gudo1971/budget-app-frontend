import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet } from "../lib/api/api";
import type { Transaction } from "@shared/types/Transaction";

type TransactionsResponse = {
  success: boolean;
  data: Transaction[];
  error: string | null;
};

export function useTransactions(refreshKey?: string) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      if (abortRef.current) abortRef.current.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      const res = await apiGet<TransactionsResponse>("/transactions", {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setData(res.data);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err.message ?? "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchTransactions, refreshKey]);

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions,
  };
}
