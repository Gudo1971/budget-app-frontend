import {
  VStack,
  HStack,
  Heading,
  Select,
  Box,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";

import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Carousel
import { InsightsCarousel } from "@/features/insights/components/InsightsCarousel";

// Cards
import { TransactionAnalysisCard } from "@/features/dashboard/components/TransactionAnalysisCard";
import { CategoryStatsCard } from "@/features/dashboard/components/CategoryStatsCard";
import { BudgetProgressCard } from "@/features/dashboard/components/BudgetProgressCard";

// InsightBox
import { InsightBox } from "../../features/dashboard/components/InsightBox";

// AI engine
import {
  calculateRealisticStress,
  generateRealisticInsight,
} from "@/lib/ai/realisticInsights";

// Hooks
import { useTransactions } from "@/features/transactions/shared/hooks/useTransactions";

// Category helpers
import { getCategoryName } from "@shared/constants/categories";

export default function DashboardPage() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const [month, setMonth] = useState("2025-01");
  const [activeCard, setActiveCard] = useState(0);

  // ⭐ Backend transacties
  const { data: transactions = [] } = useTransactions();

  // ⭐ ID-based transaction normalization
  const uiTransactions = transactions.map((t) => ({
    ...t,
    id: String(t.id),
  }));

  // ⭐ Categorie-totalen (ID-based)
  const categories = uiTransactions.reduce<Record<string, number>>((acc, t) => {
    const catName = getCategoryName(t.category_id);
    const amount = Math.abs(Number(t.amount));

    if (!acc[catName]) acc[catName] = 0;
    acc[catName] += amount;

    return acc;
  }, {});

  // ⭐ Totale uitgaven
  const total = Object.values(categories).reduce((a, b) => a + b, 0);

  // ⭐ Budget parameters (later backend)
  const budget = 1500;
  const daysInPeriod = 30;
  const daysPassed = 12;

  // ⭐ AI calculations
  const entries = Object.entries(categories) as [string, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  // ⭐ Vaste lasten (ID-based)
  const FIXED_COST_CATEGORY_IDS = [7, 6]; // Woonkosten, Abonnementen

  const fixedCosts = uiTransactions
    .filter((t) => FIXED_COST_CATEGORY_IDS.includes(t.category_id ?? 0))
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  // ⭐ Stress (ratio 0–1)
  const stress = calculateRealisticStress({
    budget,
    spent: total,
    daysPassed,
    daysInPeriod,
    fixedCosts,
  });

  // ⭐ FIX: stressPercentage (0–100)

  const stressPercentage = Math.round(stress * 100);
  console.log("RAW stress:", stress);
  console.log("stressPercentage:", stressPercentage);
  const stressLevel = stress > 66 ? "red" : stress > 33 ? "orange" : "green";

  const insight = generateRealisticInsight({
    sortedCategories: sorted,
    budget,
    spent: total,
    daysPassed,
    daysInPeriod,
  });

  // ⭐ Remaining budget
  const remainingBudget = budget - total;
  const remainingDays = daysInPeriod - daysPassed;

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

  const spentPercentage = budget > 0 ? (total / budget) * 100 : 0;
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

  // ⭐ Dynamic insight router
  function getDynamicInsight(active: number) {
    const isMainCard = active === 0;
    return {
      showStress: isMainCard,
      remainingInsight: isMainCard ? remainingInsight : "",
      dailyInsight: isMainCard ? dailyInsight : "",
      weeklyInsight: isMainCard ? weeklyInsight : "",
      percentageInsight: isMainCard ? percentageInsight : "",
      spentPercentage: isMainCard ? spentPercentage : 0,
    };
  }

  const dynamic = getDynamicInsight(activeCard);

  // ⭐ Category stats (ID-based)
  const categoryStats = sorted.map(([name, amount]) => ({
    name,
    amount,
    count: uiTransactions.filter((t) => getCategoryName(t.category_id) === name)
      .length,
  }));

  return (
    <VStack w="full" align="stretch" gap={6}>
      {/* Header */}
      <HStack justify="space-between" w="full">
        <Heading size="lg">Dashboard</Heading>

        <HStack spacing={3}>
          <Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            w="160px"
            size="sm"
          >
            <option value="2025-01">Januari 2025</option>
            <option value="2024-12">December 2024</option>
            <option value="2024-11">November 2024</option>
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

      {/* Analyse-zone */}
      <Box w="full" maxW="500px" mx="auto">
        <InsightsCarousel onCardChange={setActiveCard}>
          <TransactionAnalysisCard
            total={total}
            categories={categories}
            transactions={uiTransactions}
            stressScore={stressPercentage} // ⭐ FIXED
            sortedCategories={sorted}
            budget={budget}
            spent={total}
            daysPassed={daysPassed}
            daysInPeriod={daysInPeriod}
          />

          <BudgetProgressCard />

          <CategoryStatsCard
            stats={categoryStats}
            onSelectCategory={(name) => console.log("Klik op categorie:", name)}
          />
        </InsightsCarousel>
      </Box>

      {/* InsightBox */}
      <Box w="full" display="flex" justifyContent="center">
        <InsightBox
          showStress={dynamic.showStress}
          stress={stressPercentage} // ⭐ FIXED
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
