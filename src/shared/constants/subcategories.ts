import { SubcategoryDictionary } from "@shared/types/Subcategory";

export const SUBCATEGORIES: SubcategoryDictionary = {
  1: "Groente & Fruit",
  2: "Dranken",
  3: "Snacks",
  4: "Restaurants",
  5: "Cafés",
  6: "Haarverzorging",
  7: "Huidverzorging",
  8: "Trein",
  9: "Bus",
};

export function getSubcategoryName(id: number | null | undefined) {
  if (!id) return null;
  return SUBCATEGORIES[id] ?? null;
}
