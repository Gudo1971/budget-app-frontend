// src/features/budget/hooks/useDonutTransactions.ts

interface DonutTransaction {
  id: number;
  amount: number;
  category_id: number | null;
  category_name?: string;
  emoji?: string;
  date?: string;
  description?: string;
}

interface DonutCategory {
  id: number;
  name: string;
  emoji?: string;
  color?: string | null; // ⬅️ FIX HIER
}

export function useDonutTransactions(
  transactions: DonutTransaction[],
  categories: DonutCategory[],
) {
  const enriched = transactions.map((t: DonutTransaction) => {
    const cat = categories.find((c: DonutCategory) => c.id === t.category_id);

    return {
      ...t,
      category_name: cat?.name ?? t.category_name ?? "Overig",
      emoji: cat?.emoji ?? t.emoji ?? "❓",
    };
  });

  return enriched;
}
