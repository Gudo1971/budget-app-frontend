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

// ⭐ Budget opslaan of updaten
export async function saveBudget(payload: {
  month: string;
  total_budget: number;
}) {
  return apiPost("/budget", payload);
}

export async function updateBudget(month: string, total_budget: number) {
  return apiPut(`/budget/${month}`, { total_budget });
}

export function copyBudgets(from: string, to: string) {
  return apiPost(`/budget/copy/${from}/${to}`, {});
}
