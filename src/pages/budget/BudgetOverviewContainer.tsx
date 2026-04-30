import { useEffect, useState } from "react";
import { BudgetOverviewPage } from "@/features/budget/pages/BudgetOverviewPage";

export function BudgetOverviewContainer() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/budget`);
        const data = await res.json();
        setBudgets(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [API]);

  return <BudgetOverviewPage budgets={budgets} loading={loading} />;
}
