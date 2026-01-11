import { Box, Text, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import { LuSparkles } from "react-icons/lu";

export type AIAnalysisPanelProps = {
  category: string;
  confidence?: number;
};

export function AIAnalysisPanel({
  category,
  confidence,
}: AIAnalysisPanelProps) {
  const safeValue =
    typeof confidence === "number" && !isNaN(confidence) ? confidence * 100 : 0;

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

  return (
    <VStack
      align="start"
      gap={1}
      w="100%"
      p={3}
      bg={useColorModeValue("gray.50", "gray.800")}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
    >
      <HStack gap={2}>
        <LuSparkles size={18} color="#805AD5" strokeWidth={2} />
        <Text
          fontWeight="medium"
          color={useColorModeValue("gray.700", "gray.200")}
        >
          AI-analyse
        </Text>
      </HStack>

      <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
        Categorie: <strong>{category}</strong> ({safeValue.toFixed(0)}%)
      </Text>
    </VStack>
  );
}
