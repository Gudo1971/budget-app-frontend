import type { SubBudget } from "./SubBudget";

export type Budget = {
  id: number;
  month: string;
  total_budget: number;
  remaining: number;
  subBudgets: SubBudget[]; // ⭐ toevoegen
};
