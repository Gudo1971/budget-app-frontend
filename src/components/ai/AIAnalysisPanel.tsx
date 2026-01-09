import { Box, Text, VStack, HStack } from "@chakra-ui/react"
import { LuSparkles } from "react-icons/lu"

export type AIAnalysisPanelProps = {
  category: string
  confidence?: number
}

export function AIAnalysisPanel({ category, confidence }: AIAnalysisPanelProps) {
  const safeValue =
    typeof confidence === "number" && !isNaN(confidence)
      ? confidence * 100
      : 0

  return (
    <VStack
      align="start"
      gap={1}
      w="100%"
      p={3}
      bg="gray.50"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
    >
      <HStack gap={2}>
        <LuSparkles size={18} color="#805AD5" strokeWidth={2} />
        <Text fontWeight="medium" color="gray.700">
          AI-analyse
        </Text>
      </HStack>

      <Text fontSize="sm" color="gray.600">
        Categorie: <strong>{category}</strong> ({safeValue.toFixed(0)}%)
      </Text>
    </VStack>
  )
}
