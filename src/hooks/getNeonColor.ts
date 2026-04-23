import { generateSoftNeonColor } from "@/features/categories/utils/categoryColors";
import { wrapNeonColor } from "@/features/categories/utils/neonWrapper";

export function getNeonColor(month: string | null) {
  if (!month) {
    return wrapNeonColor("#8a2be2");
  }

  const index = Number(month.replace("-", "")) % 12;
  const raw = generateSoftNeonColor(index);
  return wrapNeonColor(raw);
}
