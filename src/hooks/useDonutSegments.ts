// src/hooks/useDonutSegments.ts
import { useMemo, useEffect } from "react";
import { CATEGORY_META } from "@/config/categoryMeta";

export type DonutSegment = {
  category_id: number;
  name: string;
  emoji: string;
  color: string;
  amount: number;
  percentage: number;
  length: number;
  offset: number;
};

type DonutTransaction = {
  amount: number;
  category_id: number | null;
  category_name?: string;
};

const colorPalette = [
  "#FF4D4D",
  "#4DFF88",
  "#6B9FFF",
  "#FFD93D",
  "#FF69B4",
  "#A78BFA",
  "#2DD4BF",
  "#FF8C42",
  "#34D399",
  "#FBBF24",
  "#F472B6",
  "#C084FC",
];

export function useDonutSegments(
  transactions: DonutTransaction[],
  size: number,
  strokeWidth: number,
) {
  // ⭐ Maak een stabiele hash van transactions voor dependency tracking
  const transactionsHash = useMemo(
    () => transactions.map((t) => `${t.category_id}:${t.amount}`).join("|"),
    [transactions],
  );

  // ⭐ Debug: Log wanneer transactions veranderen
  useEffect(() => {
    console.log("🔍 useDonutSegments - transactions:", transactions.length);
    console.log("First 3 transactions:", transactions.slice(0, 3));
    console.log(
      "Transactions hash:",
      transactionsHash.substring(0, 50) + "...",
    );
  }, [transactions, transactionsHash]);

  const expenses = useMemo(() => {
    console.log(
      "⚡ Filtering expenses from",
      transactions.length,
      "transactions",
    );
    return transactions.filter((t) => t.amount !== 0);
  }, [transactions, transactionsHash]);

  const total = useMemo(
    () => expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [expenses],
  );

  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const segments: DonutSegment[] = useMemo(() => {
    console.log(
      "⚙️ useDonutSegments - Recalculating segments. Total:",
      total,
      "Expenses:",
      expenses.length,
    );
    if (total === 0) return [];

    const grouped = new Map<
      number,
      { name: string; amount: number; emoji: string; color: string }
    >();

    for (const t of expenses) {
      if (t.category_id == null) continue;

      const name = t.category_name ?? "Onbekend";
      const meta = CATEGORY_META[name] ?? { emoji: "❓", color: "#888" };

      const current = grouped.get(t.category_id) ?? {
        name,
        amount: 0,
        emoji: meta.emoji,
        color: meta.color,
      };

      current.amount += Math.abs(t.amount);
      grouped.set(t.category_id, current);
    }

    const sorted = Array.from(grouped.entries()).sort(
      (a, b) => b[1].amount - a[1].amount,
    );

    console.log("🎯 useDonutSegments - Grouped categories:", grouped.size);
    let offset = 0;
    return sorted.map(([category_id, data], index) => {
      const value = data.amount / total;
      const length = value * circumference;

      const color =
        sorted.length > 1
          ? colorPalette[index % colorPalette.length]
          : data.color;

      const seg: DonutSegment = {
        category_id,
        name: data.name,
        emoji: data.emoji,
        color,
        amount: Number(data.amount.toFixed(2)),
        percentage: Number((value * 100).toFixed(1)),
        length,
        offset,
      };

      offset += length;
      return seg;
    });
  }, [expenses, total, circumference]);

  return { segments, total, radius, circumference };
}
