import { useState, useMemo, useEffect } from "react";
import { SubBudgetList } from "../components/SubBudgetList";
import { SubBudgetModal } from "../components/SubBudgetModal";
import { useSubBudgets } from "../hooks/useSubBudgets";
import { SubBudget } from "../types/SubBudget";
import { useTransactions } from "@/hooks/useTransactions";
import { SubBudgetSuggestionModal } from "./components/SubBudgetSuggestionModal";
import { CATEGORY_MAP } from "@/features/categories/constants";
import { apiPut } from "@/lib/api/api";
import { MoveTransactionModal } from "../components/MoveTransactions/MoveTransactionModal";

// ⭐ FIX: helper zodat CATEGORY_MAP (string) → { id, name, color }
function getCategoryMeta(id: number) {
  const name = CATEGORY_MAP[id] ?? `Categorie ${id}`;

  const colors = [
    "#5FFFD4",
    "#FF6B6B",
    "#FFD93D",
    "#6C63FF",
    "#4ECDC4",
    "#FF9F1C",
    "#2EC4B6",
    "#E71D36",
    "#9B5DE5",
    "#00BBF9",
    "#00F5D4",
    "#F15BB5",
    "#FEE440",
  ];

  const color = colors[(id - 1) % colors.length];

  return { id, name, color };
}

export function SubBudgetSettingsPreview({ month }: { month?: string }) {
  if (!month) {
    console.error("❌ SubBudgetSettingsPreview: month is missing!");
    return null;
  }

  const effectiveMonth = month;

  const [showSuggestion, setShowSuggestion] = useState(false);
  const [hasSeenSuggestion, setHasSeenSuggestion] = useState(false);

  const {
    data: subBudgets,
    add,
    update,
    remove,
    refetch,
  } = useSubBudgets(effectiveMonth);

  // ⭐ Calculate from/to for the month
  const from = `${effectiveMonth}-01`;
  const to = `${effectiveMonth}-31`; // good enough for filtering

  const { data: transactions, refetch: refetchTransactions } = useTransactions(
    effectiveMonth,
    from,
    to,
  );

  const [selected, setSelected] = useState<SubBudget | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [moveTx, setMoveTx] = useState<any | null>(null);
  const [isMoveOpen, setMoveOpen] = useState(false);

  function openModal(item: SubBudget | null) {
    setSelected(item);
    setModalOpen(true);
  }

  // ⭐ Filter transacties op maand
  const monthFiltered = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => tx.date?.startsWith(effectiveMonth));
  }, [transactions, effectiveMonth]);

  // ⭐ Grouping (alleen expenses, amounts positief)
  const grouped = useMemo(() => {
    if (!monthFiltered) return [];

    const map: Record<
      number,
      { category_id: number; spent: number; transactions: any[] }
    > = {};

    for (const tx of monthFiltered) {
      if (tx.category_id == null) continue;

      // ⬅️ FIX: inkomen nooit tonen als categorie
      if (tx.category_id === 12) continue;

      if (tx.amount >= 0) continue;

      const positiveAmount = Math.abs(tx.amount);

      if (!map[tx.category_id]) {
        map[tx.category_id] = {
          category_id: tx.category_id,
          spent: 0,
          transactions: [],
        };
      }

      map[tx.category_id].spent += positiveAmount;

      map[tx.category_id].transactions.push({
        ...tx,
        amount: positiveAmount,
      });
    }

    return Object.values(map);
  }, [monthFiltered]);

  // ⭐ Enriched subbudgets (met echte naam + kleur)
  const enriched = useMemo(() => {
    if (!subBudgets) return [];

    return subBudgets.map((sb) => {
      const g = grouped.find((g) => g.category_id === sb.category_id);
      const cat = getCategoryMeta(sb.category_id);

      return {
        ...sb,
        spent: g?.spent ?? 0,
        transactions: g?.transactions ?? [],
        categoryName: cat.name,
        categoryColor: cat.color,
      };
    });
  }, [subBudgets, grouped]);

  // ⭐ Slimme categorie‑suggesties
  const suggestedCategories = useMemo(() => {
    if (!transactions) return [];

    const map = new Map<number, { id: number; name: string; color: string }>();

    for (const tx of transactions) {
      if (tx.category_id == null) continue;

      map.set(tx.category_id, getCategoryMeta(tx.category_id));
    }

    return Array.from(map.values());
  }, [transactions]);

  // ⭐ Automatisch tonen bij eerste keer (optie C)
  useEffect(() => {
    if (!subBudgets) return;

    const missing = suggestedCategories.filter(
      (cat) => !subBudgets.some((sb) => sb.category_id === cat.id),
    );

    // toon modal alleen als er iets te tonen is
    if (missing.length > 0 && !hasSeenSuggestion) {
      setShowSuggestion(true);
      setHasSeenSuggestion(true);
    }
  }, [subBudgets, suggestedCategories, hasSeenSuggestion]);

  async function refetchAll() {
    await Promise.all([
      refetch(), // subbudgets
      refetchTransactions(), // transactions
    ]);
  }

  async function moveTransaction(id: number, newCategoryId: number) {
    await apiPut(`/transactions/${id}`, {
      category_id: newCategoryId,
      user_id: "demo-user",
    });

    await refetchAll();
  }

  return (
    <>
      {/* Slim voorstel knop */}
      <button
        onClick={() => setShowSuggestion(true)}
        className="mb-3 px-3 py-1.5 text-sm rounded-md bg-slate-800 text-slate-200 border border-slate-700"
      >
        Slim voorstel bekijken
      </button>

      <SubBudgetList
        data={enriched}
        onAdd={() => openModal(null)}
        onEdit={(item) => openModal(item)}
        onDelete={async (id) => {
          await remove(id);
          await refetchAll();
        }}
        refetchAll={refetchAll}
        onMoveTransaction={(tx) => {
          setMoveTx(tx);
          setMoveOpen(true);
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

      {/* Slim voorstel modal */}
      <SubBudgetSuggestionModal
        isOpen={showSuggestion}
        onClose={() => setShowSuggestion(false)}
        month={effectiveMonth}
        categories={suggestedCategories}
        existingSubBudgets={subBudgets ?? []}
        onCreateMany={async (items) => {
          for (const item of items) {
            await add({
              ...item,
              month: effectiveMonth,
            });
          }
          await refetch();
        }}
      />

      <MoveTransactionModal
        isOpen={isMoveOpen}
        onClose={() => setMoveOpen(false)}
        transaction={moveTx}
        subBudgets={subBudgets ?? []}
        onMove={async (newCat: number) => {
          if (!moveTx) return;
          await moveTransaction(moveTx.id, newCat);
          setMoveOpen(false);
        }}
      />
    </>
  );
}
