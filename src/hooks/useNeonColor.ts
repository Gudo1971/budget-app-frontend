import { useMemo } from "react";
import { generateSoftNeonColor } from "@/features/categories/utils/categoryColors";
import { wrapNeonColor } from "@/features/categories/utils/neonWrapper";

export function useNeonColor(month: string | null) {
  return useMemo(() => {
    if (!month) {
      // fallback kleur
      return wrapNeonColor("#8a2be2");
    }

    // Maak een index op basis van de maand (bijv. "2025-04" → 202504 → % 12)
    const index = Number(month.replace("-", "")) % 12;

    // generateSoftNeonColor geeft een string → wrap naar neon-object
    const raw = generateSoftNeonColor(index);
    return wrapNeonColor(raw);
  }, [month]);
}
