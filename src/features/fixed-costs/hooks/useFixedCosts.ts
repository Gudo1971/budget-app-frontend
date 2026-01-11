import { useState, useEffect } from "react";
import { apiGet } from "../lib/api";

export type FixedCost = {
  id: number;
  name: string;
  amount: number;
  category?: string;
};

export function useFixedCosts() {
  const [data, setData] = useState<FixedCost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<FixedCost[]>("/fixed-costs")
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
