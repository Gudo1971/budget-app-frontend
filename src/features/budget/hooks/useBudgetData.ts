import { useEffect, useState, useCallback } from "react";
import { apiGet } from "@/lib/api/api";

type BudgetResponse = {
  id: string;
  month: string;
  total_budget: number;
  // voeg hier toe wat jouw backend nog meer teruggeeft
};

export function useBudgetData(
  year: string | undefined,
  month: string | undefined,
) {
  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  // -------------------------
  // FETCH BUDGET
  // -------------------------
  useEffect(() => {
    if (!year || !month) return;

    setLoading(true);

    const paddedMonth = month.padStart(2, "0");
    const monthString = `${year}-${paddedMonth}`;

    apiGet<BudgetResponse>(`/budget/${monthString}`)
      .then((data) => {
        setBudget(data);
        setIsSaved(data?.total_budget > 0);
      })
      .catch(() => {
        setBudget(null);
        setIsSaved(false);
      })
      .finally(() => setLoading(false));
  }, [year, month]);

  // -------------------------
  // SET FROM/TO RANGE
  // -------------------------
  useEffect(() => {
    if (!year || !month) return;

    const paddedMonth = month.padStart(2, "0");
    const monthIndex = Number(month) - 1;
    const lastDay = new Date(Number(year), monthIndex + 1, 0).getDate();

    setFrom(`${year}-${paddedMonth}-01`);
    setTo(`${year}-${paddedMonth}-${String(lastDay).padStart(2, "0")}`);
  }, [year, month]);

  // -------------------------
  // REFRESH BUDGET
  // -------------------------
  const refreshBudget = useCallback(async () => {
    if (!year || !month) return;

    const padded = month.padStart(2, "0");
    const monthString = `${year}-${padded}`;

    const data = await apiGet<BudgetResponse>(`/budget/${monthString}`);
    setBudget(data);
    setIsSaved(data.total_budget > 0);
  }, [year, month]);

  return {
    budget,
    isSaved,
    loading,
    from,
    to,
    refreshBudget,
    setBudget,
    setIsSaved,
  };
}
