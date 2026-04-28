// src/features/budget/components/DonutSection.tsx
import { Box } from "@chakra-ui/react";
import { PremiumDonut } from "@/components/charts/PremiumDonut";

interface DonutSectionProps {
  donutTransactions: any[];
  hoverCategory: number | null;
  isHoverLocked: boolean;
  bg: string;
  border: string;
  loading?: boolean;
  transactionsLoading?: boolean;

  setHoverWithDelay: (id: number | null) => void;
  totalBudget?: number;
}

export function DonutSection({
  donutTransactions,
  hoverCategory,
  isHoverLocked,
  bg,
  border,
  loading,
  transactionsLoading,
  setHoverWithDelay,
  totalBudget,
}: DonutSectionProps) {
  return (
    <Box display="flex" justifyContent="center" py={4}>
      <PremiumDonut
        transactions={donutTransactions}
        hoverCategory={hoverCategory}
        setHoverWithDelay={setHoverWithDelay}
        isHoverLocked={isHoverLocked}
        totalBudget={totalBudget}
      />
    </Box>
  );
}
