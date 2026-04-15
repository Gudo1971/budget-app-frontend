// features/import/logic/bankDetector.ts

export type CsvFormat = "rabobank" | "ing" | "bunq" | "generic" | "unknown";

export function detectBank(columns: string[]): CsvFormat {
  const cols = columns.map((c) => c.trim().toLowerCase());

  // Rabobank
  if (
    cols.includes("omschrijving-1") ||
    (cols.includes("bedrag") && cols.includes("datum"))
  ) {
    return "rabobank";
  }

  // ING
  if (
    cols.includes("naam/omschrijving") ||
    cols.includes("af bij") ||
    cols.includes("mutatiecode")
  ) {
    return "ing";
  }

  // Bunq
  if (
    cols.includes("date") &&
    cols.includes("amount") &&
    cols.includes("description") &&
    cols.includes("external_id")
  ) {
    return "bunq";
  }

  // Jouw eigen CSV
  if (
    cols.includes("date") &&
    cols.includes("description") &&
    cols.includes("amount")
  ) {
    return "generic";
  }

  return "unknown";
}
