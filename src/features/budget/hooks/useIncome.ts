import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api/api";

export function useIncome(month: string) {
  const [income, setIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchIncome() {
      try {
        setLoading(true);

        // ⭐ FIX: correcte syntax
        const res = (await apiGet(`/transactions/income/${month}`)) as {
          amount: number;
        }[];

        if (!active) return;

        const total = res.reduce((sum, t) => sum + t.amount, 0);
        setIncome(total);
      } catch (err) {
        if (active) setIncome(0);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchIncome();

    return () => {
      active = false;
    };
  }, [month]);

  return { income, loading };
}
