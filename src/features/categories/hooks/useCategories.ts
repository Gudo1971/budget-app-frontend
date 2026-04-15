import { useEffect, useState, useCallback, useRef } from "react";

export type Category = {
  id: number;
  name: string;
};

const userId = "demo-user";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ⭐ Houd de huidige fetch bij zodat we hem kunnen annuleren
  const abortRef = useRef<AbortController | null>(null);

  // ⭐ Stabiele fetch functie
  const fetchCategories = useCallback(async () => {
    try {
      // Annuleer vorige request als die nog loopt
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

      const data = await res.json();

      // ⭐ Alleen updaten als de request niet is geannuleerd
      if (!controller.signal.aborted) {
        setCategories(data);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return; // ⭐ geen fout tonen bij annuleren
      setError(err.message ?? "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }, []);

  // ⭐ Initial load
  useEffect(() => {
    fetchCategories();

    // Cleanup bij unmount
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories, // ⭐ stabiele refetch
  };
}
