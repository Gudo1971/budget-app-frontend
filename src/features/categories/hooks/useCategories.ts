import { useEffect, useState, useCallback, useRef } from "react";
import type { Category } from "@/features/categories/types/Category";
import { assignCategoryColors } from "../utils/categoryColors";

const userId = "demo-user";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      const res = await fetch(`/api/categories?userId=${userId}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Kon categorieën niet laden");

      const data: Category[] = await res.json();

      if (!controller.signal.aborted) {
        // ⭐ Dynamische soft‑neon kleuren toepassen
        const colored = assignCategoryColors(data);
        setCategories(colored);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err.message ?? "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
