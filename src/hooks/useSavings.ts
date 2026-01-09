import { useState, useEffect } from "react";
import { apiGet } from "../lib/api";

export type Saving = {
  id: number;
  name: string;
  amount: number;
};

export function useSavings() {
  const [data, setData] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Saving[]>("/savings")
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
