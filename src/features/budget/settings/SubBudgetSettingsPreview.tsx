import { useState } from "react";
import { SubBudgetList } from "../components/SubBudgetList";
import { SubBudgetModal } from "../components/SubBudgetModal";
import { useSubBudgets } from "../hooks/useSubBudgets";
import { SubBudget } from "../types/SubBudget";
import { useDateFilter } from "../../../context/DateFilterContext";

export function SubBudgetSettingsPreview({ month }: { month?: string }) {
  const { range } = useDateFilter();

  const effectiveMonth = month || (range?.from ? 
    range.from.getFullYear() + "-" + String(range.from.getMonth() + 1).padStart(2, "0") 
    : "");

  const {
    data: subBudgets,
    add,
    update,
    remove,
    refetch,
  } = useSubBudgets(effectiveMonth);

  const [selected, setSelected] = useState<SubBudget | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  function openModal(item: SubBudget | null) {
    setSelected(item);
    setModalOpen(true);
  }

  return (
    <>
      <SubBudgetList
        data={subBudgets}
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
