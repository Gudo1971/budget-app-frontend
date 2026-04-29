import { apiGet, apiPost, apiPut } from "@/lib/api/api";
import type { Budget } from "../types/Budget";

export type SaveBudgetPayload = {
  amount: number;
  month: string;
  userId: string;
};

// ⭐ Budget ophalen
export async function getBudget(month: string): Promise<Budget | null> {
  const res = await apiGet(`/budget/${month}`);
  return res as Budget | null;
}

// ⭐ Budget opslaan
export async function saveBudget(payload: {
  month: string;
  total_budget: number;
  remaining: number;
}) {
  return apiPost("/budget", payload);
}

// ⭐ Budget updaten
export async function updateBudget(
  month: string,
  data: { total_budget: number; remaining: number },
) {
  return apiPut(`/budget/${month}`, data);
}

export function copyBudgets(from: string, to: string) {
  return apiPost(`/budget/copy/${from}/${to}`, {});
}
