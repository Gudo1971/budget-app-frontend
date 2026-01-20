import { useState, useEffect } from "react";
import { apiGet } from "../../../../lib/api/api";

export type BackendTransaction = {
  id: number;
  description: string;
  amount: number;
  date: string;
  merchant?: string;

  category: string | null;
  subcategory: string | null;

  receipt_id: number | null;

  recurring?: boolean;

  receipt?: {
    url: string;
    thumbnail?: string;
    aiResult?: {
      merchant?: string;
      amount?: number;
      date?: string;
      category?: string;
      subcategory?: string;
      recurring?: boolean;
      total?: number;
      items?: Array<{
        name: string;
        quantity?: number;
        price?: number;
        total?: number;
      }>;
    };
  };
};

type TransactionsResponse = {
  success: boolean;
  data: BackendTransaction[];
  error: string | null;
};

// ⭐ Hook accepteert refreshKey
export function useTransactions(refreshKey?: string) {
  const [data, setData] = useState<BackendTransaction[]>([]);
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
