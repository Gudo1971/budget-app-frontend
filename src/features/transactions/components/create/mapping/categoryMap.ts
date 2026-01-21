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
  Restaurant: "Restaurant",
};

export function normalizeCategory(cat?: string | null): string {
  if (!cat) return "";
  return CATEGORY_MAP[cat] ?? cat;
}

/**
 * Map normalized merchant names to display format
 * yoghurtbarn → "Yoghurt Barn"
 * albertheijn → "Albert Heijn"
 */
const MERCHANT_DISPLAY_MAP: Record<string, string> = {
  yoghurtbarn: "Yoghurt Barn",
  albertheijn: "Albert Heijn",
  jumbo: "Jumbo",
  lidl: "Lidl",
  mcdonalds: "McDonald's",
};

/**
 * Normalize merchant name (same logic as backend)
 * Converts raw merchant to normalized form, then maps to display format
 */
export function normalizeMerchant(raw: string): string {
  if (!raw) return "";

  // Lowercase + trim
  let m = raw.toLowerCase().trim();

  // Verwijder alle niet-alfanumerieke tekens
  m = m.replace(/[^a-z0-9]/g, "");

  // Alias mapping (same as backend)
  const aliases: Record<string, string> = {
    ah: "albertheijn",
    ahxl: "albertheijn",
    albert: "albertheijn",
    albertheijn: "albertheijn",
    jumbo: "jumbo",
    jumbosupermarkten: "jumbo",
    lidl: "lidl",
    mcdonalds: "mcdonalds",
    mcdo: "mcdonalds",
    yb: "yoghurtbarn",
    yoghurtbarn: "yoghurtbarn",
  };

  for (const key in aliases) {
    if (m.includes(key)) {
      m = aliases[key];
      break;
    }
  }

  // Display map gebruiken als bekend
  if (MERCHANT_DISPLAY_MAP[m]) {
    return MERCHANT_DISPLAY_MAP[m];
  }

  // Fallback: capitaliseren (eerste letter groot)
  return m.charAt(0).toUpperCase() + m.slice(1);
}
