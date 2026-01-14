// logic/detectIncome.ts

export function detectIncome(description: string): boolean {
  if (!description) return false;

  const incomeKeywords = [
    "salaris",
    "loon",
    "bijschrijving",
    "storting",
    "inkomen",
    "uitbetaling",
    "refund",
    "terugbetaling",
    "credit",
    "deposit",
    "interest",
    "rente",
    "creditrente",
    "dividend",
    "uitkering",
  ];

  const text = description.toLowerCase();

  return incomeKeywords.some((word) => text.includes(word));
}
