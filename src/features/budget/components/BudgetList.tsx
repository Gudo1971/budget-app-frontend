import {
  Box,
  VStack,
  Text,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Budget } from "../types/Budget";

import { useNeonColor } from "@/hooks/useNeonColor";

type BudgetListProps = {
  budget: Budget | null;
  loading: boolean;
};

export function BudgetList({ budget, loading }: BudgetListProps) {
  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");

  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  // Dynamische neon kleur op basis van maand
  const neon = useNeonColor(budget?.month ?? null);

  // generateSoftNeonColor geeft een string → we wrappen het

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
          <VStack align="stretch" spacing={1}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient={`linear(to-r, ${neon.text}, ${neon.color})`}
              bgClip="text"
            >
              €{budget.amount}
            </Text>

            <Text fontSize="sm" color="gray.400">
              Voor {budget.month}
            </Text>
          </VStack>
        )}
      </Box>
    </VStack>
  );
}
