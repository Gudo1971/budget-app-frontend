import { useEffect, useState, useCallback } from "react";
import { MerchantMemoryRecord } from "@/shared/types/merchantMemory";

// ⭐ FRONTEND‑SAFE normalizer (backend versie mag je niet importeren)
function normalizeMerchantFrontend(name: string) {
  return name.trim().toLowerCase();
}

export function useMerchantMemory() {
  const [merchants, setMerchants] = useState<MerchantMemoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/debug/merchant-memory`,
      );
      const data: MerchantMemoryRecord[] = await res.json();

      setMerchants(data);
    } catch (err) {
      setError("Failed to load merchant memory");
    } finally {
      setLoading(false);
    }
  }, []);

  const retrain = useCallback(
    async (m: MerchantMemoryRecord) => {
      await fetch(`${import.meta.env.VITE_API_URL}/debug/retrain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: m.user_id,
          merchant: m.key,
        }),
      });

      load(); // refresh after retrain
    },
    [load],
  );

  // ⭐ Suggest category based on merchant memory
  function suggestCategory(merchant: string) {
    if (!merchant || merchants.length === 0) return null;

    const normalized = normalizeMerchantFrontend(merchant);

    const record = merchants.find((m) => m.key.toLowerCase() === normalized);

    if (!record) return null;

    return {
      category_id: record.category_id,
      subcategory_id: null,
      confidence: record.confidence ?? 1,
    };
  }

  useEffect(() => {
    load();
  }, [load]);

  return {
    merchants,
    loading,
    error,
    reload: load,
    retrain,
    suggestCategory,
  };
}
