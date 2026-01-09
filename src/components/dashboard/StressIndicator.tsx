import { Box, Text, VStack, useColorMode } from "@chakra-ui/react";
import { StressScoreBar } from "./StressScoreBar";

export function StressIndicator({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) {
  const { colorMode } = useColorMode();

  return (
    <VStack
      w="full"
      align="start"
      spacing={3}
      p={4}
      borderRadius="md"
      bg={colorMode === "light" ? "white" : "gray.800"}
      border="1px solid"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      boxShadow={colorMode === "light" ? "sm" : "md"}
    >
      <Text fontWeight="bold" color={color}>
        Budget Stress Score: {score.toFixed(0)}% — {label}
      </Text>

      <StressScoreBar score={score} />
    </VStack>
  );
}
