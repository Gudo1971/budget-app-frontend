import { useState, useEffect } from "react";
import { apiGet } from "../../../../lib/api/api";
import type { Transaction } from "@shared/types/Transaction";

type TransactionsResponse = {
  success: boolean;
  data: Transaction[];
  error: string | null;
};

// ⭐ Hook accepteert refreshKey
export function useTransactions(refreshKey?: string) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // ⭐ Lichte vertraging om backend-writes af te wachten
    const timer = setTimeout(() => {
      console.log(`🔄 Fetching transactions with refreshKey: ${refreshKey}`);

      apiGet<TransactionsResponse>("/transactions")
        .then((res) => {
          console.log(`✅ Fetched ${res.data.length} transactions`);
          setData(res.data);
        })
        .catch((err) => console.error("❌ Transaction fetch failed:", err))
        .finally(() => setLoading(false));
    }, 1500); // 1.5s buffer voor database-sync

    return () => clearTimeout(timer);
  }, [refreshKey]); // ⭐ luister naar refreshKey

  return { data, loading };
}
