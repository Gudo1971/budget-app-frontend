// frontend/src/hooks/useAllTransactions.ts
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/api";
import type { Transaction } from "@/shared/types/Transaction";

type TransactionsResponse = {
  success: boolean;
  data: Transaction[];
  error: string | null;
};

export function useAllTransactions() {
  return useQuery({
    queryKey: ["all-transactions"],
    queryFn: () => apiGet<TransactionsResponse>("/transactions"),
    select: (res) => res.data,
  });
}
