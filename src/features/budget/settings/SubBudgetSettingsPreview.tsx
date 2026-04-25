import { useState, useMemo } from "react";
import { SubBudgetList } from "../components/SubBudgetList";
import { SubBudgetModal } from "../components/SubBudgetModal";
import { useSubBudgets } from "../hooks/useSubBudgets";
import { SubBudget } from "../types/SubBudget";
import { useDateFilter } from "../../../context/DateFilterContext";
import { useTransactions } from "@/hooks/useTransactions";

export function SubBudgetSettingsPreview({ month }: { month?: string }) {
  const { range } = useDateFilter();

  const effectiveMonth =
    month ||
    (range?.from
      ? range.from.getFullYear() +
        "-" +
        String(range.from.getMonth() + 1).padStart(2, "0")
      : "");

  const {
    data: subBudgets,
    add,
    update,
    remove,
    refetch,
  } = useSubBudgets(effectiveMonth);

  const { data: transactions } = useTransactions(effectiveMonth);

  const [selected, setSelected] = useState<SubBudget | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // ⭐ FIX: openModal terug
  function openModal(item: SubBudget | null) {
    setSelected(item);
    setModalOpen(true);
  }

  const monthFiltered = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((tx) => {
      if (!tx.date) return false;
      return tx.date.startsWith(effectiveMonth); // ⭐ match YYYY-MM
    });
  }, [transactions, effectiveMonth]);

  // 1️⃣ Group transactions by category
  const grouped = useMemo(() => {
    if (!transactions) return [];

    const map: Record<
      number,
      { category_id: number; spent: number; transactions: any[] }
    > = {};

    for (const tx of monthFiltered) {
      if (tx.category_id == null) continue;
      if (tx.amount >= 0) continue;

      if (!map[tx.category_id]) {
        map[tx.category_id] = {
          category_id: tx.category_id,
          spent: 0,
          transactions: [],
        };
      }

      map[tx.category_id].spent += tx.amount;
      map[tx.category_id].transactions.push(tx);
    }

    return Object.values(map);
  }, [transactions]);
  console.log("TX SAMPLE", transactions?.[0]);

  // 2️⃣ Enrich subbudgets with grouped data
  const enriched = useMemo(() => {
    if (!subBudgets) return [];

    return subBudgets.map((sb) => {
      const g = grouped.find((g) => g.category_id === sb.category_id);

      return {
        ...sb,
        spent: g?.spent ?? 0,
        transactions: g?.transactions ?? [],
      };
    });
  }, [subBudgets, grouped]);

  console.log("TRANSACTIONS LOADED", transactions);
  console.log("EFFECTIVE MONTH", effectiveMonth);

  return (
    <>
      <SubBudgetList
        data={enriched}
        onAdd={() => openModal(null)}
        onEdit={(item) => openModal(item)}
        onDelete={async (id) => {
          await remove(id);
          await refetch();
        }}
      />

      {isModalOpen && (
        <SubBudgetModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={async (data) => {
            if (selected) {
              await update(selected.id, data);
            } else {
              await add(data);
            }
            await refetch();
            setModalOpen(false);
          }}
          initial={selected}
        />
      )}
    </>
  );
}
