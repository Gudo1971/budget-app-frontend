export type Category = {
  name: string; // <-- geen id meer
  label: string;
  tint: string;
  icon?: string;
  aiKeywords?: string[];
};

export const CATEGORIES: Category[] = [
  {
    name: "Boodschappen",
    label: "Boodschappen",
    tint: "#f6fdf8",
    aiKeywords: ["supermarkt", "ah", "albert heijn", "boodschappen"],
  },
  {
    name: "Vervoer",
    label: "Vervoer",
    tint: "#f4faff",
    aiKeywords: ["trein", "bus", "ns", "vervoer"],
  },
  {
    name: "Abonnementen",
    label: "Abonnementen",
    tint: "#faf6ff",
    aiKeywords: ["spotify", "netflix", "abonnement"],
  },
  {
    name: "Uit eten",
    label: "Uit eten",
    tint: "#fffdf5",
    aiKeywords: ["restaurant", "eten", "horeca"],
  },
  {
    name: "Online aankopen",
    label: "Online aankopen",
    tint: "#fef7f9",
    aiKeywords: ["bol.com", "amazon", "online"],
  },
  {
    name: "Zorg",
    label: "Zorg",
    tint: "#f5faff",
    aiKeywords: ["zorg", "verzekering", "ziektekosten"],
  },
  {
    name: "Wonen",
    label: "Wonen",
    tint: "#fffaf5",
    aiKeywords: ["huur", "energie", "woonlasten"],
  },
  {
    name: "Overig",
    label: "Overig",
    tint: "#f7f7f7",
    aiKeywords: [],
  },
  {
    name: "Inkomsten",
    label: "Inkomsten",
    tint: "#f6fff8",
    aiKeywords: ["salaris", "inkomsten", "betaling"],
  },
];

export function getCategoryByName(name: string) {
  return CATEGORIES.find((c) => c.name === name);
}

export function getTintForCategory(name: string) {
  return getCategoryByName(name)?.tint ?? "#f7f7f7";
}

export function getAllCategoryOptions() {
  return CATEGORIES.map((c) => ({
    value: c.name,
    label: c.label,
  }));
}
