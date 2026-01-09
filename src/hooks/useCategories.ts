import { useState, useEffect } from "react";
import { apiGet } from "../lib/api";

export type Category = {
  id: string;
  name: string;
};

export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Category[]>("/categories")
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
