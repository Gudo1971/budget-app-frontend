import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/api";
import { SubBudget } from "../types/SubBudget";

/**
 * ⭐ GET — haal alle sub‑budgetten op voor een maand
 * Backend route: GET /api/sub-budgets/:month
 */
export async function getSubBudgets(month: string): Promise<SubBudget[]> {
  if (!month || month === "undefined") return [];

  const data = await apiGet<SubBudget[]>(`/sub-budgets/${month}`);

  return data ?? [];
}

/**
 * ⭐ CREATE — nieuw sub‑budget
 */
export async function createSubBudget(data: {
  month: string;
  category_id: number;
  amount: number;
}): Promise<SubBudget> {
  return apiPost<SubBudget>("/sub-budgets", {
    ...data,
    userId: "demo-user",
  });
}

/**
 * ⭐ UPDATE — bestaand sub‑budget aanpassen
 */
export async function updateSubBudget(
  id: number,
  data: { category_id: number; amount: number; month: string },
) {
  return apiPut(`/sub-budgets/${id}`, {
    ...data,
    userId: "demo-user",
  });
}

/**
 * ⭐ DELETE — sub‑budget verwijderen
 */
export async function deleteSubBudget(id: number) {
  return apiDelete(`/sub-budgets/${id}`);
}
