export const CATEGORY_MAP: Record<string, string> = {
  // Engels → Nederlands
  Dining: "Eten & Drinken",
  "Food & Drink": "Eten & Drinken",
  "Food & Drinks": "Eten & Drinken",
  "Food & Dining": "Eten & Drinken",
  Food: "Eten & Drinken",
  Drink: "Eten & Drinken",
  Restaurant: "Restaurant",
  Café: "Café",
  Groceries: "Boodschappen",
  "Grocery Store": "Boodschappen",
  Supermarket: "Boodschappen",
  grocery: "Boodschappen", // lowercase variants
  groceries: "Boodschappen",
  "grocery store": "Boodschappen",
  supermarket: "Boodschappen",
  Transportation: "Vervoer",
  Electronics: "Elektronica",
  // Already Dutch (pass-through)
  Boodschappen: "Boodschappen",
};

export function normalizeCategory(cat?: string | null): string {
  if (!cat) return "";
  return CATEGORY_MAP[cat] ?? cat;
}
