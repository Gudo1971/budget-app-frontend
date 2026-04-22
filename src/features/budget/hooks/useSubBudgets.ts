import { useEffect, useState, useCallback } from "react";
import {
  getSubBudgets,
  createSubBudget,
  updateSubBudget,
  deleteSubBudget,
} from "../api/subBudgetApi";
import { SubBudget } from "../types/SubBudget";

export function useSubBudgets(month: string) {
  const [data, setData] = useState<SubBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getSubBudgets(month);
      setData(result);
      setError(null);
    } catch (err) {
      setError("Kon sub-budgetten niet laden");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,

    async add(payload: { category_id: number; amount: number; month: string }) {
      await createSubBudget(payload);
      await fetchData();
    },

    async update(
      id: number,
      payload: { category_id: number; amount: number; month: string },
    ) {
      await updateSubBudget(id, payload);
      await fetchData();
    },

    async remove(id: number) {
      await deleteSubBudget(id);
      await fetchData();
    },
  };
}
