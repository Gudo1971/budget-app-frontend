// src/features/budget/pages/BudgetDetailPage.tsx
import React, { useRef, useState } from "react";
import { Box, VStack, useColorModeValue, HStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { BudgetHeader } from "../components/BudgetHeader";
import { BudgetForm } from "../components/BudgetForm";
import { BudgetRequiredAlert } from "../components/BudgetRequiredAlert";
import { CategoryList } from "../components/CategoryList";
import { DonutSection } from "../components/DonutSection";

import { useBudgetData } from "../hooks/useBudgetData";
import { useBudgetGrouping } from "../hooks/useBudgetGrouping";
import { useDonutTransactions } from "../hooks/useDonutTransactions";
import { useBudgetNavigationGuard } from "../hooks/useBudgetNavigationGuard";

import { useCategories } from "@/features/categories/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { useHoverSync } from "@/hooks/useHoverSync";
import { useScrollSync } from "@/hooks/useScrollSync";
import { getNeonColor } from "@/hooks/getNeonColor";
import type { Budget } from "@/features/budget/types/Budget";

export function BudgetDetailPage() {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const [moveTx, setMoveTx] = useState<any | null>(null);
  const onMoveTransaction = (t: any) => {
    setMoveTx(t);
  };

  const { budget, isSaved, loading, from, to, refreshBudget, setIsSaved } =
    useBudgetData(year, month) as {
      budget: Budget | null;
      isSaved: boolean;
      loading: boolean;
      from: string | null;
      to: string | null;
      refreshBudget: () => void;
      setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
    };

  const { categories } = useCategories();

  const refreshKey = from && to ? `${from}-${to}` : "no-range";
  const shouldFetch = from !== null && to !== null;

  const { data: transactions = [], loading: transactionsLoading } =
    useTransactions(
      shouldFetch ? refreshKey : undefined,
      shouldFetch ? from : undefined,
      shouldFetch ? to : undefined,
    );

  const neon = getNeonColor(`${year}-${month?.padStart(2, "0")}`);
  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  const {
    hoverCategory,
    isHoverLocked,
    setHoverWithDelay,
    lockHoverFromList,
    clearHover,
  } = useHoverSync();

  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  useScrollSync(hoverCategory, isHoverLocked, itemRefs);

  const donutTransactions = useDonutTransactions(transactions, categories);

  const { grouped } = useBudgetGrouping(transactions, categories, budget);

  const [suggested] = useState<number | null>(null);
  const [message] = useState("");

  // ✔ Total income
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  // ✔ Total expenses (positive number)
  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // ✔ Remaining = budget – expenses
  const remaining = (budget?.total_budget ?? 0) - totalExpenses;

  const { showModal, setShowModal, focusBudget, requireSave } =
    useBudgetNavigationGuard(isSaved);

  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const toggle = (id: number) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [openTxMap, setOpenTxMap] = useState<Record<number, boolean>>({});
  const toggleTx = (id: number) => {
    setOpenTxMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Box p={4}>
      <BudgetRequiredAlert
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onFocusBudget={focusBudget}
      />

      <VStack align="stretch" spacing={4}>
        <BudgetHeader
          year={year}
          month={month}
          neon={neon}
          onNavigate={(y, m) => navigate(`/budget/${y}/${m}`)}
        />

        <BudgetForm
          month={`${year}-${month?.padStart(2, "0")}`}
          suggested={suggested ?? totalIncome}
          message={message}
          isSaved={isSaved}
          onRequireSave={requireSave}
          onUpdated={refreshBudget}
          setIsSaved={setIsSaved}
        />

        <HStack
          align="flex-start"
          spacing={12}
          w="full"
          alignItems="flex-start"
          mt={8}
        >
          {/* DONUT LINKS */}
          <Box flexShrink={0} mt={24}>
            <DonutSection
              loading={loading}
              transactionsLoading={transactionsLoading}
              donutTransactions={donutTransactions}
              hoverCategory={hoverCategory}
              isHoverLocked={isHoverLocked}
              bg={bg}
              border={border}
              setHoverWithDelay={setHoverWithDelay}
              totalBudget={budget?.total_budget ?? totalIncome}
            />
          </Box>

          {/* RECHTERKOLOM */}
          <Box flex="1" minW="0">
            {/* ⭐ Income + Budget Summary Bar */}
            <Box
              bg={bg}
              border="1px solid"
              borderColor={border}
              borderRadius="lg"
              p={4}
              mb={4}
            >
              <HStack justify="space-between">
                <Box>
                  <Box fontSize="sm" color="gray.400">
                    Inkomen
                  </Box>
                  <Box fontSize="lg" fontWeight="bold">
                    € {totalIncome.toFixed(2)}
                  </Box>
                </Box>

                <Box>
                  <Box fontSize="sm" color="gray.400">
                    Budget
                  </Box>
                  <Box fontSize="lg" fontWeight="bold">
                    € {(budget?.total_budget ?? 0).toFixed(2)}
                  </Box>
                </Box>

                <Box textAlign="right">
                  <Box fontSize="sm" color="gray.400">
                    Over
                  </Box>
                  <Box
                    fontSize="lg"
                    fontWeight="bold"
                    color={remaining >= 0 ? "green.300" : "red.300"}
                  >
                    € {remaining.toFixed(2)}
                  </Box>
                </Box>
              </HStack>
            </Box>

            {/* CATEGORY LIST */}
            <Box flex="1" minW="0" maxH="40vh" overflowY="auto" pr={2} mt={6}>
              <CategoryList
                grouped={grouped}
                loading={loading}
                transactionsLoading={transactionsLoading}
                bg={bg}
                border={border}
                neon={neon.text}
                hoverCategory={hoverCategory}
                lockHoverFromList={lockHoverFromList}
                clearHover={clearHover}
                openMap={openMap}
                toggle={toggle}
                openTxMap={openTxMap}
                toggleTx={toggleTx}
                itemRefs={itemRefs}
                onMoveTransaction={onMoveTransaction}
              />
            </Box>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}
