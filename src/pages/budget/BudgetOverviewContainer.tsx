import { useEffect, useState } from "react";
import { BudgetOverviewPage } from "@/features/budget/pages/BudgetOverviewPage";

export function BudgetOverviewContainer() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/budget");
        const data = await res.json();
        setBudgets(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return <BudgetOverviewPage budgets={budgets} loading={loading} />;
}
