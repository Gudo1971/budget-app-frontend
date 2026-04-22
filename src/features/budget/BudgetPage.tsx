import { VStack, Heading, Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { BudgetForm } from "./components/BudgetForm";
import { BudgetList } from "./components/BudgetList";
import { CopyBudgetModal } from "./components/CopyBudgetModal";

import { useBudget } from "./hooks/useBudget";
import { useIncome } from "./hooks/useIncome";
import { copyBudgets } from "./api/budgetApi";

import { CollapsibleMonthSelector } from "./components/MonthSelector/CollapsibleMonthSelector";
import { BudgetPageInfoButton } from "./components/BudgetPageInfoButton";

import { useSubBudgets } from "./hooks/useSubBudgets";

import { useDateFilter } from "@/context/DateFilterContext";

export function BudgetPage() {
  const { range, setRange } = useDateFilter();

  // ⛔ als range.from nog niet klaar is → niks renderen
  if (!range?.from) {
    console.log("BUDGET PAGE: range.from is nog niet klaar");
    return null;
  }

  const budgetMonth =
    range.from.getFullYear() +
    "-" +
    String(range.from.getMonth() + 1).padStart(2, "0");

  console.log("BUDGET PAGE MONTH =", budgetMonth);

  const previousMonth = useMemo(() => {
    const d = new Date(range.from);
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 7);
  }, [range.from]);

  const { budget: currentBudget, loading, refetch } = useBudget(budgetMonth);
  const { data: subBudgets, refetch: refetchSubBudgets } =
    useSubBudgets(budgetMonth);

  const { budget: previousBudget } = useBudget(previousMonth);
  const { income } = useIncome(budgetMonth);

  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [suggested, setSuggested] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentBudget) return;

    if (previousBudget) {
      setShowCopyPopup(true);
      return;
    }

    if (income > 0) {
      setSuggested(income);
      setMessage(`Budget gebaseerd op je inkomen (€${income})`);
      return;
    }

    setSuggested(0);
  }, [currentBudget, previousBudget, income]);

  return (
    <>
      <VStack w="full" align="stretch" spacing={4} p={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Heading size="md">Budgetten</Heading>
          <BudgetPageInfoButton />
        </Box>

        <CollapsibleMonthSelector
          selectedMonth={budgetMonth}
          onChange={(value) => {
            if (!value) return;
            const [year, month] = value.split("-");
            setRange({
              from: new Date(Number(year), Number(month) - 1, 1),
              to: new Date(Number(year), Number(month), 0),
            });
          }}
        />

        <BudgetForm
          month={budgetMonth}
          suggested={suggested}
          message={message}
          onUpdated={async () => {
            await refetch();
            await refetchSubBudgets();
            setSuggested(null);
            setMessage("");
          }}
        />

        <Box>
          <BudgetList
            budget={currentBudget}
            subBudgets={subBudgets ?? []}
            loading={loading}
          />
        </Box>
      </VStack>

      <CopyBudgetModal
        isOpen={showCopyPopup}
        onConfirm={async () => {
          await copyBudgets(previousMonth, budgetMonth);
          await refetch();
          await refetchSubBudgets();
          setShowCopyPopup(false);
        }}
        onCancel={() => {
          if (income > 0) {
            setSuggested(income);
            setMessage(`Budget gebaseerd op je inkomen (€${income})`);
          } else {
            setSuggested(0);
          }
          setShowCopyPopup(false);
        }}
        previousMonth={previousMonth}
        currentMonth={budgetMonth}
      />
    </>
  );
}
