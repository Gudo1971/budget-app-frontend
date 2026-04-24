// src/config/categoryMeta.ts
export type CategoryMeta = {
  emoji: string;
  color: string;
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  Boodschappen: { emoji: "🛒", color: "#FF4D4D" },
  Horeca: { emoji: "🍽️", color: "#FFD93D" },
  "Persoonlijke verzorging": { emoji: "🧴", color: "#4DFF88" },
  Vervoer: { emoji: "🚌", color: "#6B9FFF" },
  Gezondheid: { emoji: "💊", color: "#A78BFA" },
  Abonnementen: { emoji: "🔄", color: "#FF8C42" },
  Woonkosten: { emoji: "🏠", color: "#2DD4BF" },
  Shopping: { emoji: "🛍️", color: "#FF69B4" },
  Kinderen: { emoji: "🧸", color: "#FB923C" },
  Telecom: { emoji: "📱", color: "#FBBF24" },
  Uitjes: { emoji: "🎉", color: "#F472B6" },
  Inkomen: { emoji: "💶", color: "#34D399" },
  Overig: { emoji: "✨", color: "#C084FC" },
};
