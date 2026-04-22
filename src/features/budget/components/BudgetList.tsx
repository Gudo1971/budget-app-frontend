import {
  Box,
  VStack,
  Text,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";

import type { Budget } from "../types/Budget";
import type { SubBudget } from "../types/SubBudget";

import { useNeonColor } from "@/hooks/useNeonColor";
import { BudgetAllocationBar } from "./BudgetAllocationBar";

type BudgetListProps = {
  budget: Budget | null;
  subBudgets: SubBudget[];
  loading: boolean;
};

export function BudgetList({ budget, subBudgets, loading }: BudgetListProps) {
  // ⭐ categorieën data zit nu in subBudgets

  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  const neon = useNeonColor(budget?.month ?? null);

  const segments = subBudgets
    .filter((x) => x.amount > 0)
    .reduce(
      (acc, sb) => {
        const existing = acc.find((s) => s.color === sb.category_color);
        if (existing) {
          existing.amount += sb.amount;
          existing.label += `, ${sb.category_name}`;
        } else {
          acc.push({
            label: sb.category_name,
            amount: sb.amount,
            color: sb.category_color ?? "#666",
          });
        }
        return acc;
      },
      [] as { label: string; amount: number; color: string }[],
    );

  const subCount = subBudgets.length;
  const totalCount = 1 + subCount;

  return (
    <VStack align="stretch" spacing={3}>
      <Text fontSize="sm" color="gray.400">
        Huidig budget
      </Text>

      <Box
        p={5}
        borderRadius="lg"
        bg={bg}
        border="1px solid"
        borderColor={border}
        backdropFilter="blur(8px)"
        boxShadow={`0 0 25px ${neon.glow}`}
        transition="0.25s ease"
        _hover={{
          transform: "scale(1.015)",
          boxShadow: `0 0 35px ${neon.glow}`,
        }}
      >
        {loading ? (
          <Skeleton height="24px" />
        ) : !budget ? (
          <Text fontSize="sm" color="gray.500">
            Je hebt nog geen budget ingesteld.
          </Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient={`linear(to-r, ${neon.text}, ${neon.color})`}
              bgClip="text"
            >
              €{budget.total_budget}
            </Text>

            <Text fontSize="sm" color="gray.400">
              Verdeeld over {totalCount} budget{totalCount === 1 ? "" : "ten"}
            </Text>

            <Text fontSize="sm" color="gray.400">
              Voor {budget.month}
            </Text>

            <BudgetAllocationBar
              total={budget.total_budget}
              segments={segments} // ⭐ nu correct getype
            />
          </VStack>
        )}
      </Box>
    </VStack>
  );
}
