// logic/bankDetector.ts
export function detectBank(columns: string[]) {
  if (columns.includes("Omschrijving-1")) return "rabobank";
  if (columns.includes("Naam/Omschrijving")) return "ing";
  return "unknown";
}
