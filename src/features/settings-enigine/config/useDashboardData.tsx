import { useTransactions } from "@/features/transactions/shared/hooks/useTransactions";
import { calculateRealisticStress } from "@/lib/ai/realisticInsights";

export function useDashboardData() {
  const { data: transactions = [] } = useTransactions();

  const uiTransactions = transactions.map((t) => ({
    ...t,
    id: String(t.id),
    category: t.category?.name?.toLowerCase().trim() || "onbekend",
  }));

  const categories = uiTransactions.reduce<Record<string, number>>((acc, t) => {
    const cat = t.category;
    const amount = Math.abs(Number(t.amount));
    acc[cat] = (acc[cat] || 0) + amount;
    return acc;
  }, {});

  const entries = Object.entries(categories) as [string, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const categoryStats = sorted.map(([name, amount]) => ({
    name,
    amount,
    count: uiTransactions.filter((t) => t.category === name).length,
  }));

  const FIXED_COST_CATEGORY_IDS = ["wonen", "abonnementen", "zorg"];

  const fixedCostTransactions = uiTransactions.filter((t) =>
    FIXED_COST_CATEGORY_IDS.includes(t.category)
  );

  const fixedCosts = fixedCostTransactions.reduce(
    (sum, t) => sum + Math.abs(Number(t.amount)),
    0
  );

  const fixedCostBreakdown = fixedCostTransactions.map((t) => ({
    name: t.category,
    amount: Math.abs(Number(t.amount)),
  }));

  const spent = uiTransactions.reduce(
    (sum, t) => sum + Math.abs(Number(t.amount) || 0),
    0
  );

  const budget = 1500;

  const today = new Date();
  const daysPassed = today.getDate();
  const daysInPeriod = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const stressPercentage = Math.round(
    calculateRealisticStress({
      budget,
      spent,
      daysPassed,
      daysInPeriod,
      fixedCosts,
    }) * 100
  );

  return {
    uiTransactions,
    categories,
    categoryStats,
    fixedCosts,
    fixedCostBreakdown,
    spent,
    budget,
    daysPassed,
    daysInPeriod,
    stressPercentage,
    sorted,
  };
}
