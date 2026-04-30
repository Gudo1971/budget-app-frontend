import { useEffect, useState } from "react";
import { BudgetOverviewPage } from "@/features/budget/pages/BudgetOverviewPage";
import { apiGet } from "@/lib/api/api";

type Budget = {
  id: number;
  month: string;
  total: number;
  // voeg hier toe wat je backend nog meer teruggeeft
};

export function BudgetOverviewContainer() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet<Budget[]>("/budget");
        setBudgets(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return <BudgetOverviewPage budgets={budgets} loading={loading} />;
}
