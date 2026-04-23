import {
  Box,
  VStack,
  Text,
  Skeleton,
  useColorModeValue,
  HStack,
  Divider,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { getNeonColor } from "@/hooks/getNeonColor";

import type { Budget } from "../types/Budget";

type BudgetOverviewProps = {
  budgets: Budget[];
  loading: boolean;
};

export function BudgetOverviewPage({ budgets, loading }: BudgetOverviewProps) {
  const navigate = useNavigate();

  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  return (
    <VStack align="stretch" spacing={5} p={5}>
      <Text fontSize="xl" fontWeight="bold" color="gray.200">
        Budgetoverzicht
      </Text>

      {loading ? (
        <Skeleton height="40px" />
      ) : budgets.length === 0 ? (
        <Text color="gray.500">Je hebt nog geen budgetten ingesteld.</Text>
      ) : (
        budgets.map((budget) => {
          const neon = getNeonColor(budget.month); // ✔ PURE FUNCTIE, GEEN HOOK

          return (
            <Box
              key={budget.id}
              p={5}
              borderRadius="lg"
              bg={bg}
              border="1px solid"
              borderColor={border}
              backdropFilter="blur(8px)"
              cursor="pointer"
              transition="0.25s ease"
              onClick={() => navigate(`/budget/${budget.id}`)}
              _hover={{
                transform: "scale(1.015)",
                boxShadow: `0 0 25px ${neon.glow}`,
              }}
            >
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    bgGradient={`linear(to-r, ${neon.text}, ${neon.color})`}
                    bgClip="text"
                  >
                    {budget.month}
                  </Text>

                  <Text fontSize="md" color="gray.300">
                    €{budget.total_budget}
                  </Text>
                </HStack>

                <Divider borderColor="whiteAlpha.200" />

                <Text fontSize="sm" color="gray.400">
                  {budget.subBudgets?.length ?? 0} subbudgetten
                </Text>
              </VStack>
            </Box>
          );
        })
      )}
    </VStack>
  );
}
