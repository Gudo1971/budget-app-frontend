import { useEffect, useState, useCallback } from "react";
import { MerchantMemoryRecord } from "../../../../../shared/types/merchantMemory";

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
          merchant: m.merchant,
        }),
      });

      load(); // refresh after retrain
    },
    [load],
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    merchants,
    loading,
    error,
    reload: load,
    retrain,
  };
}
