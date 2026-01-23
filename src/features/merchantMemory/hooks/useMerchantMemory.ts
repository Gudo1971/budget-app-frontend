import { useEffect, useState, useCallback } from "react";
import { MerchantMemoryRecord } from "@shared/types/merchantMemory";
import { normalizeMerchant } from "@shared/services/normalizeMerchant";

export function useMerchantMemory() {
  const [merchants, setMerchants] = useState<MerchantMemoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3001/debug/merchant-memory");
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
      await fetch("http://localhost:3001/debug/retrain", {
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

  // ⭐ NEW: Suggest category based on merchant memory
  function suggestCategory(merchant: string) {
    if (!merchant || merchants.length === 0) return null;

    const normalized = normalizeMerchant(merchant).key.toLowerCase();

    const record = merchants.find((m) => m.key.toLowerCase() === normalized);

    if (!record) return null;

    return {
      category_id: record.category_id,
      subcategory_id: null, // backend ondersteunt dit nog niet
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
    suggestCategory, // ⭐ added
  };
}
