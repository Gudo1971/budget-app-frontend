// src/features/budget/hooks/useBudgetGrouping.ts

interface BudgetCategory {
  id: number;
  name: string;
  emoji?: string;
  color?: string | null;
}

interface Budget {
  id: number;
  total_budget: number;
  sub_budgets?: {
    id: number;
    category_id: number;
    amount: number;
  }[];
}

export interface Transaction {
  id: number;
  amount: number;
  category_id: number | null;
  category_name?: string;
  emoji?: string;
  date?: string;
  description?: string;
}

export interface GroupedCategory {
  category: BudgetCategory | null;
  amount: number; // sub‑budget
  spent: number; // total spent
  remaining: number; // amount - spent
  transactions: Transaction[];
}

export function useBudgetGrouping(
  transactions: Transaction[],
  categories: BudgetCategory[],
  budget: Budget | null,
) {
  const grouped: GroupedCategory[] = [];

  categories.forEach((cat) => {
    // 1️⃣ Sub‑budget voor deze categorie
    const subBudget = budget?.sub_budgets?.find(
      (sb) => sb.category_id === cat.id,
    );
    const amount = subBudget?.amount ?? 0;

    // 2️⃣ Alle transacties voor deze categorie
    const tx = transactions.filter((t) => t.category_id === cat.id);

    // 3️⃣ Spent (alle negatieve bedragen)
    const spent = tx
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // 4️⃣ Remaining
    const remaining = amount - spent;

    grouped.push({
      category: cat,
      amount,
      spent,
      remaining,
      transactions: tx,
    });
  });

  // 5️⃣ Ongecategoriseerd
  const uncategorizedTx = transactions.filter((t) => t.category_id === null);

  const uncategorizedSpent = uncategorizedTx
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  grouped.push({
    category: {
      id: -1,
      name: "Overig",
      emoji: "❓",
      color: "#888",
    },
    amount: 0,
    spent: uncategorizedSpent,
    remaining: -uncategorizedSpent,
    transactions: uncategorizedTx,
  });

  // 6️⃣ Sorteren op hoogste uitgaven
  grouped.sort((a, b) => b.spent - a.spent);

  return {
    grouped,
    totalBudget: budget?.total_budget ?? 0,
  };
}
