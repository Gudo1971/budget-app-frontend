import { useBudget } from "./useBudget";

export function useBudgetAmount(month: string) {
  const { budget, loading, error, refetch } = useBudget(month);

  return {
    amount: budget?.total_budget ?? null,
    loading,
    error,
    refetch,
  };
}
