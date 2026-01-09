import {
  Box,
  Text,
  Progress,
  VStack,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import { CardWrapper } from "../ui/CardWrapper";

function getBudgetColor(score: number) {
  if (score < 40) return "green.400";
  if (score < 70) return "orange.400";
  return "red.400";
}

export function BudgetProgressCard() {
  const { colorMode } = useColorMode();
  const muted = colorMode === "light" ? "gray.600" : "gray.400";
  // Dummy data – later vervang je dit met echte data
  const totalBudget = 1500;
  const spent = 820;
  const percentage = (spent / totalBudget) * 100;

  const stressScore = 31; // ← komt straks uit je echte analyse
  const accent = getBudgetColor(stressScore);
  const barColor = getBudgetColor(stressScore).split(".")[0];

  return (
    <CardWrapper>
      <VStack align="stretch" spacing={4}>
        {/* Titel */}
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Budget Voortgang
          </Text>
          <Text fontSize="sm" color={muted}>
            Hoeveel je deze maand hebt uitgegeven
          </Text>
        </Box>

        {/* Statistieken */}
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text color={muted}>Uitgegeven</Text>
            <Text fontWeight="bold">€{spent}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text color={muted}>Totaal Budget</Text>
            <Text fontWeight="bold">€{totalBudget}</Text>
          </HStack>
        </VStack>

        {/* Progress bar */}
        <VStack align="stretch" spacing={1}>
          <Progress
            value={percentage}
            size="lg"
            colorScheme={barColor}
            borderRadius="md"
          />

          <Text
            textAlign="right"
            fontSize="sm"
            fontWeight="medium"
            color={accent}
          >
            {percentage.toFixed(0)}% gebruikt
          </Text>
        </VStack>
      </VStack>
    </CardWrapper>
  );
}
