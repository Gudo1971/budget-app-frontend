import { useState, useEffect, useCallback } from "react";
import { getBudget } from "../api/budgetApi";
import type { Budget } from "../types/Budget";

export function useBudget(month: string) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getBudget(month); // ⭐ res is Budget | null
      setBudget(res);
    } catch (err: any) {
      setError(err.message ?? "Kon budget niet laden");
      setBudget(null);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  return {
    budget,
    loading,
    error,
    refetch: fetchBudget,
  };
}
