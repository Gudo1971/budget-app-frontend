import {
  VStack,
  HStack,
  Heading,
  Select,
  Box,
  useColorMode,
  IconButton,
  Text,
} from "@chakra-ui/react";

import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

import { InsightsCarousel } from "@/features/insights/components/InsightsCarousel";
import { TransactionAnalysisCard } from "@/features/dashboard/components/TransactionAnalysisCard";
import { CategoryStatsCard } from "@/features/dashboard/components/CategoryStatsCard";
import { BudgetProgressCard } from "@/features/dashboard/components/BudgetProgressCard";
import { InsightBox } from "@/features/dashboard/components/InsightBox";

import {
  calculateRealisticStress,
  generateRealisticInsight,
} from "@/lib/ai/realisticInsights";

import { useDateFilter } from "@/context/DateFilterContext";
import type { DateRange } from "@/context/DateFilterContext";

import { useTransactions } from "@/hooks/useTransactions";
import { getCategoryName } from "@shared/constants/categories_old";

function isInRange(dateString: string, range: DateRange) {
  const d = new Date(dateString);
  return d >= range.from && d <= range.to;
}

function extractAvailableMonths(transactions: any[]) {
  const set = new Set<string>();

  transactions.forEach((t) => {
    const d = new Date(t.date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    set.add(`${year}-${month}`);
  });

  return Array.from(set).sort().reverse();
}

export default function DashboardPage() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(0);

  const { range, setRange } = useDateFilter();
  const { data: transactions = [] } = useTransactions();

  const availableMonths = useMemo(
    () => extractAvailableMonths(transactions),
    [transactions],
  );

  const uiTransactions = transactions
    .filter((t) => isInRange(t.date, range))
    .map((t) => ({
      ...t,
      id: String(t.id),
    }));

  const income = uiTransactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const incomeTransactions = uiTransactions.filter((t) => Number(t.amount) > 0);

  const incomeByCategory = incomeTransactions.reduce<Record<string, number>>(
    (acc, t) => {
      const cat = getCategoryName(t.category_id) ?? "Overig";
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += Number(t.amount);
      return acc;
    },
    {},
  );

  const categories = uiTransactions.reduce<Record<string, number>>((acc, t) => {
    const amount = Number(t.amount);

    if (amount < 0) {
      const catName = getCategoryName(t.category_id);
      if (!acc[catName]) acc[catName] = 0;
      acc[catName] += Math.abs(amount);
    }

    return acc;
  }, {});

  const totalExpenses = Object.values(categories).reduce((a, b) => a + b, 0);

  const entries = Object.entries(categories) as [string, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const FIXED_COST_CATEGORY_IDS = [7, 6];

  const fixedCosts = uiTransactions
    .filter((t) => FIXED_COST_CATEGORY_IDS.includes(t.category_id ?? 0))
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  // ⭐ Correct aantal dagen in de geselecteerde maand
  const daysInPeriod = new Date(
    range.from.getFullYear(),
    range.from.getMonth() + 1,
    0,
  ).getDate();

  // ⭐ Is dit de huidige maand?
  const isCurrentMonth =
    range.from.getMonth() === new Date().getMonth() &&
    range.from.getFullYear() === new Date().getFullYear();

  // ⭐ Aantal dagen verstreken
  const daysPassed = isCurrentMonth ? new Date().getDate() : daysInPeriod;

  // ⭐ Aantal dagen over
  const daysLeft = daysInPeriod - daysPassed;

  const autoBudget = income;
  const userBudget = null;
  const budget = userBudget ?? autoBudget;

  const stress = calculateRealisticStress({
    budget,
    spent: totalExpenses,
    daysPassed,
    daysInPeriod,
    fixedCosts,
  });

  const stressPercentage = Math.round(stress * 100);
  const stressLevel = stress > 66 ? "red" : stress > 33 ? "orange" : "green";

  const insight = generateRealisticInsight({
    sortedCategories: sorted,
    budget,
    spent: totalExpenses,
    daysPassed,
    daysInPeriod,
  });

  const remainingBudget = budget - totalExpenses;
  const remainingDays = daysLeft;

  const dailyAllowance =
    remainingDays > 0 ? remainingBudget / remainingDays : 0;

  const weeklyAllowance =
    remainingDays > 0 ? (remainingBudget / remainingDays) * 7 : 0;

  const weeksRemainingRounded = Math.ceil(remainingDays / 7);

  const remainingInsight = `Je hebt nog €${remainingBudget.toFixed(
    0,
  )} over voor ${remainingDays} dagen.`;

  const dailyInsight = `Dat is ongeveer €${dailyAllowance.toFixed(0)} per dag.`;

  const weeklyInsight = `Met nog ${weeksRemainingRounded} weken te gaan komt dat neer op ongeveer €${weeklyAllowance.toFixed(
    0,
  )} per week.`;

  const spentPercentage = budget > 0 ? (totalExpenses / budget) * 100 : 0;
  const remainingPercentage = 100 - spentPercentage;

  const percentageInsight = `Je hebt ${spentPercentage.toFixed(
    0,
  )}% van je budget uitgegeven. Er is nog ${remainingPercentage.toFixed(
    0,
  )}% over.`;

  const stressColorMap = {
    green: colorMode === "light" ? "green.300" : "green.200",
    orange: colorMode === "light" ? "orange.300" : "orange.200",
    red: colorMode === "light" ? "red.300" : "red.200",
  };

  const dynamic = {
    showStress: activeCard === 0,
    remainingInsight: activeCard === 0 ? remainingInsight : "",
    dailyInsight: activeCard === 0 ? dailyInsight : "",
    weeklyInsight: activeCard === 0 ? weeklyInsight : "",
    percentageInsight: activeCard === 0 ? percentageInsight : "",
    spentPercentage: activeCard === 0 ? spentPercentage : 0,
  };

  const categoryStats = sorted.map(([name, amount]) => {
    const example = uiTransactions.find((t) => {
      const catName = getCategoryName(t.category_id);
      return catName === name;
    });

    return {
      id: example?.category_id ?? 0,
      name,
      amount,
      count: uiTransactions.filter(
        (t) => getCategoryName(t.category_id) === name,
      ).length,
    };
  });

  return (
    <VStack w="full" align="stretch" gap={6}>
      <HStack justify="space-between" w="full">
        <Heading size="lg">Dashboard</Heading>

        <HStack spacing={3}>
          <Select
            value={`${range.from.getFullYear()}-${String(
              range.from.getMonth() + 1,
            ).padStart(2, "0")}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              const from = new Date(Number(year), Number(month) - 1, 1);
              const to = new Date(Number(year), Number(month), 0);
              setRange({ from, to });
            }}
            w="160px"
            size="sm"
          >
            {availableMonths.map((ym) => {
              const [y, m] = ym.split("-");
              const label = new Date(Number(y), Number(m) - 1).toLocaleString(
                "nl-NL",
                { month: "long", year: "numeric" },
              );

              return (
                <option key={ym} value={ym}>
                  {label}
                </option>
              );
            })}
          </Select>

          <IconButton
            aria-label="Dashboard instellingen"
            icon={<FiSettings />}
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/insights")}
          />
        </HStack>
      </HStack>

      {/* Inkomensoverzicht */}
      <Box
        w="full"
        maxW="500px"
        mx="auto"
        p={4}
        borderRadius="md"
        bg={colorMode === "light" ? "gray.50" : "gray.700"}
        boxShadow="sm"
        cursor="pointer"
        transition="0.15s ease"
        _hover={{
          boxShadow: "md",
          transform: "scale(1.01)",
          bg: colorMode === "light" ? "gray.100" : "gray.600",
        }}
        onClick={() => navigate("/transactions?type=income")}
      >
        <HStack justify="space-between">
          <Heading size="sm">Inkomen deze maand</Heading>
          <Text fontWeight="bold">€{income.toFixed(2)}</Text>
        </HStack>

        <Text fontSize="xs" color="gray.500" mt={1}>
          {incomeTransactions.length} inkomens-transacties
        </Text>

        <VStack align="stretch" spacing={1} mt={3}>
          {Object.entries(incomeByCategory).map(([cat, amount]) => (
            <HStack key={cat} justify="space-between">
              <Text fontSize="sm">{cat}</Text>
              <Text fontSize="sm">€{amount.toFixed(2)}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>

      <Box w="full" maxW="500px" mx="auto">
        <InsightsCarousel onCardChange={setActiveCard}>
          <TransactionAnalysisCard
            total={totalExpenses}
            categories={categories}
            transactions={uiTransactions}
            stressScore={stressPercentage}
            sortedCategories={sorted}
            budget={budget}
            spent={totalExpenses}
            daysPassed={daysPassed}
            daysInPeriod={daysInPeriod}
          />
          <Box w="full" maxW="500px" mx="auto" mt={4}>
            <BudgetProgressCard
              budget={budget}
              spent={totalExpenses}
              stressScore={stressPercentage}
              remainingBudget={remainingBudget}
              daysPassed={daysPassed}
              daysInPeriod={daysInPeriod}
              daysLeft={daysLeft}
            />
          </Box>

          <CategoryStatsCard
            stats={categoryStats}
            onSelectCategory={(id) => {
              const params = new URLSearchParams({
                category: String(id),
                from: range.from.toISOString(),
                to: range.to.toISOString(),
              });

              navigate(`/transactions?${params.toString()}`);
            }}
          />
        </InsightsCarousel>
      </Box>

      <Box w="full" display="flex" justifyContent="center">
        <InsightBox
          showStress={dynamic.showStress}
          stress={stressPercentage}
          stressLabel={
            stressLevel === "red"
              ? "Hoog"
              : stressLevel === "orange"
                ? "Gemiddeld"
                : "Laag"
          }
          stressColor={stressColorMap[stressLevel]}
          insight={insight}
          remainingInsight={dynamic.remainingInsight}
          dailyInsight={dynamic.dailyInsight}
          weeklyInsight={dynamic.weeklyInsight}
          percentageInsight={dynamic.percentageInsight}
          spentPercentage={dynamic.spentPercentage}
        />
      </Box>
    </VStack>
  );
}
