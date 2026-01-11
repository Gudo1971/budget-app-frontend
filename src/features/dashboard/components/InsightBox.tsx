import { Box, VStack, Text, SimpleGrid, useColorMode } from "@chakra-ui/react";
import { StressIndicator } from "./StressIndicator";
import { ProgressRing } from "../../../components/charts/ProgressRing";
import { SectionHeader } from "../../../components/ui/SectionHeader";

export function InsightBox({
  showStress,
  stress,
  stressLabel,
  stressColor,
  insight,
  remainingInsight,
  dailyInsight,
  weeklyInsight,
  percentageInsight,
  spentPercentage,
}: {
  showStress: boolean;
  stress: number;
  stressLabel: string;
  stressColor: string;
  insight: string;
  remainingInsight: string;
  dailyInsight: string;
  weeklyInsight: string;
  percentageInsight: string;
  spentPercentage: number;
}) {
  const { colorMode } = useColorMode();

  const bg = colorMode === "light" ? "white" : "gray.800";
  const border = colorMode === "light" ? "gray.200" : "gray.700";
  const muted = colorMode === "light" ? "gray.600" : "gray.400";

  return (
    <Box
      w="100%"
      maxW="500px"
      p={5}
      borderRadius="lg"
      bg={bg}
      border="1px solid"
      borderColor={border}
      boxShadow={colorMode === "light" ? "sm" : "md"}
    >
      <VStack align="start" spacing={5}>
        {/* Header */}
        {showStress ? (
          <SectionHeader
            label="Budgetanalyse"
            info="Je budgetanalyse combineert je budgetverbruik, tempo en resterende dagen om je stressniveau te bepalen."
          />
        ) : (
          <SectionHeader
            label="Inzicht"
            info="Dit inzicht helpt je beter begrijpen hoe je budget zich ontwikkelt."
          />
        )}

        {/* Stress Indicator */}
        {showStress && (
          <StressIndicator
            score={stress}
            label={stressLabel}
            color={stressColor}
          />
        )}

        {/* Progress Ring */}
        {showStress && (
          <Box w="full" display="flex" justifyContent="center">
            <ProgressRing percentage={spentPercentage} />
          </Box>
        )}

        {/* Budget inzichten */}
        {showStress && (
          <SimpleGrid columns={1} spacing={1} w="full">
            <Text fontSize="sm" fontWeight="medium">
              {remainingInsight}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {dailyInsight}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {weeklyInsight}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {percentageInsight}
            </Text>
          </SimpleGrid>
        )}

        {/* Insight tekst — altijd tonen */}
        <Text fontSize="sm" color={muted}>
          {insight}
        </Text>
      </VStack>
    </Box>
  );
}
