// ===============================
// autoCategory.ts
// ===============================

const categoryRules = [
  { keywords: ["albert heijn", "ah", "gall"], id: 1 }, // boodschappen
  { keywords: ["ns", "trein", "ov", "bus"], id: 3 }, // vervoer
  { keywords: ["netflix", "spotify"], id: 4 }, // abonnementen
  { keywords: ["huur"], id: 5 }, // huur
  { keywords: ["restaurant", "mcdonald", "kfc"], id: 2 }, // uit eten
];

export function autoCategory(description: string) {
  const lower = description.toLowerCase();

  for (const rule of categoryRules) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.id;
    }
  }

  return 99; // uncategorized
}
