// src/features/budget/components/CategoryList/TransactionDetails.tsx
import { VStack, Text } from "@chakra-ui/react";

interface TransactionDetailsProps {
  t: any;
}

export function TransactionDetails({ t }: TransactionDetailsProps) {
  return (
    <VStack align="start" spacing={1} p={2}>
      <Text fontSize="sm" color="gray.300">
        {t.description}
      </Text>
      <Text fontSize="xs" color="gray.500">
        {t.date}
      </Text>
      <Text fontSize="sm" fontWeight="bold" color="green.300">
        € {t.amount}
      </Text>
    </VStack>
  );
}
