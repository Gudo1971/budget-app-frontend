import { useBudget } from "./useBudget";

export function useBudgetAmount(month: string) {
  const { budget, loading, error, refetch } = useBudget(month);

  return {
    amount: budget?.amount ?? null,
    loading,
    error,
    refetch,
  };
}
