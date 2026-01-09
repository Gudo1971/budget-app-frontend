import { Box, Text, HStack, VStack } from "@chakra-ui/react"
import { LuSparkles } from "react-icons/lu"
import { t } from "../../i18n/i18n"

export type AIConfidenceIndicatorProps = {
  value?: number
  label?: string
}

export function AIConfidenceIndicator({ value, label }: AIConfidenceIndicatorProps) {
  const safeValue =
    typeof value === "number" && !isNaN(value)
      ? value * 100
      : 0

  return (
    <VStack align="start" gap={1} w="100%">
      <HStack gap={1}>
        <LuSparkles size={16} color="#805AD5" strokeWidth={2} />
        <Text fontSize="sm" color="gray.600">
          {label ?? t("transaction.aiConfidence")}: {safeValue.toFixed(0)}%
        </Text>
      </HStack>

      <Box
        w="100%"
        h="6px"
        bg="gray.200"
        borderRadius="4px"
        overflow="hidden"
      >
        <Box
          h="100%"
          w={`${safeValue}%`}
          bg="purple.400"
          transition="width 0.3s ease"
        />
      </Box>
    </VStack>
  )
}
