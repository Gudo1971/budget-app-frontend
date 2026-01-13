import { SettingsItem } from "../SettingsEngine";
import { InsightsCarousel } from "@/features/insights/components/InsightsCarousel";

import { TransactionAnalysisCard } from "@/features/dashboard/components/TransactionAnalysisCard";
import { BudgetProgressCard } from "@/features/dashboard/components/BudgetProgressCard";
import { CategoryStatsCard } from "@/features/dashboard/components/CategoryStatsCard";
import { VasteLastenCard } from "@/features/dashboard/components/VasteLastenCard";
import { SavingsGoalCard } from "@/features/dashboard/components/SavingsGoalCard";

import { useDashboardData } from "./useDashboardData";

export const dashboardSettingsConfig: SettingsItem[] = [
  {
    key: "transaction",
    label: "Transacties",
    preview: function TransactionPreview() {
      const data = useDashboardData();

      return (
        <InsightsCarousel initialSlide={0}>
          <TransactionAnalysisCard
            total={data.spent}
            categories={data.categories}
            transactions={data.uiTransactions}
            stressScore={data.stressPercentage}
            sortedCategories={data.sorted}
            budget={data.budget}
            spent={data.spent}
            daysPassed={data.daysPassed}
            daysInPeriod={data.daysInPeriod}
          />
        </InsightsCarousel>
      );
    },
  },

  {
    key: "budget",
    label: "Budgetoverzicht",
    preview: function BudgetPreview() {
      return (
        <InsightsCarousel initialSlide={1}>
          <BudgetProgressCard />
        </InsightsCarousel>
      );
    },
  },

  {
    key: "categories",
    label: "Categorie‑trends",
    preview: function CategoriesPreview() {
      const data = useDashboardData();

      return (
        <InsightsCarousel initialSlide={2}>
          <CategoryStatsCard stats={data.categoryStats} />
        </InsightsCarousel>
      );
    },
  },

  {
    key: "fixed",
    label: "Vaste lasten",
    preview: function FixedPreview() {
      const data = useDashboardData();

      return (
        <InsightsCarousel initialSlide={3}>
          <VasteLastenCard
            totalPerMonth={data.fixedCosts}
            insights={data.fixedCostBreakdown}
            onOpenOverview={() => {}}
          />
        </InsightsCarousel>
      );
    },
  },

  {
    key: "savings",
    label: "Spaardoelen",
    preview: function SavingsPreview() {
      return (
        <InsightsCarousel initialSlide={4}>
          <SavingsGoalCard />
        </InsightsCarousel>
      );
    },
  },
];
