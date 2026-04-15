// features/import/logic/shared.ts

export function safeString(v: any) {
  return v === undefined || v === null ? "" : String(v).trim();
}

export function detectIncome(description: string) {
  const lower = description.toLowerCase();
  return [
    "salaris",
    "loon",
    "inkomen",
    "bijschrijving",
    "storting",
    "refund",
    "credit",
  ].some((w) => lower.includes(w));
}

export function normalizeAmount(raw: any, isIncome: boolean) {
  if (!raw) return 0;

  const cleaned = String(raw).replace("€", "").replace(",", ".").trim();

  const value = Number(cleaned);
  if (isNaN(value)) return 0;

  return isIncome ? Math.abs(value) : -Math.abs(value);
}
