import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api/api";
export function useBudget(month: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`/budget/${month}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [month]);

  return { data, loading };
}
