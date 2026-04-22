import { useEffect, useState } from "react";
import { getMonthMarkers } from "../api/markersApi";

export function useMonthMarkers(year: number) {
  const [markers, setMarkers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      const results: Record<string, any> = {};

      for (let m = 1; m <= 12; m++) {
        const month = `${year}-${String(m).padStart(2, "0")}`;
        try {
          const data = await getMonthMarkers(month);
          results[month] = data;
        } catch {
          results[month] = {
            hasBudget: false,
            hasTransactions: false,
            hasIncome: false,
          };
        }
      }

      if (active) {
        setMarkers(results);
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [year]);

  return { markers, loading };
}
