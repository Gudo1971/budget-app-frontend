import { apiGet, apiPost } from "@/lib/api/api";
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
export async function saveBudget(payload: SaveBudgetPayload) {
  return apiPost("/budget", payload);
}
