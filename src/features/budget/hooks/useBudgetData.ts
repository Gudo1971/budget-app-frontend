import { useEffect, useState, useCallback } from "react";

export function useBudgetData(
  year: string | undefined,
  month: string | undefined,
) {
  const [budget, setBudget] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_URL;

  // -------------------------
  // FETCH BUDGET
  // -------------------------
  useEffect(() => {
    if (!year || !month) return;

    setLoading(true);

    const paddedMonth = month.padStart(2, "0");
    const monthString = `${year}-${paddedMonth}`;

    fetch(`${API}/budget/${monthString}`)
      .then((res) => res.json())
      .then((data) => {
        setBudget(data);
        setIsSaved(data?.total_budget > 0);
        setLoading(false);
      })
      .catch(() => {
        setBudget(null);
        setIsSaved(false);
        setLoading(false);
      });
  }, [year, month, API]);

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

    const res = await fetch(`${API}/budget/${monthString}`);
    const data = await res.json();

    setBudget(data);
    setIsSaved(data.total_budget > 0);
  }, [year, month, API]);

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
