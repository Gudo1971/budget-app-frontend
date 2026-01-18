import { useEffect, useState } from "react";
import { startMatchFlow } from "../services/matchService";

export function useMatch(receiptId: number) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!receiptId) return;

    async function load() {
      setLoading(true);

      const data = await startMatchFlow(receiptId);
      setResult(data);

      setLoading(false);
    }

    load();
  }, [receiptId]);

  return {
    loading,
    result,
  };
}
