import { Box, Text, VStack } from "@chakra-ui/react";
import { useTransactions } from "../../hooks/useTransactions";
import type { Transaction } from "../../hooks/useTransactions";

export function TransactionsList() {
  const { data: transactions, loading } = useTransactions();

  if (loading) {
    return <Text>Loading transactions...</Text>;
  }

  return (
    <VStack align="stretch" spacing={3}>
      {transactions.map((t: Transaction) => (
        <Box
          key={t.id}
          p={3}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
          _dark={{ bg: "gray.700" }}
        >
          <Text fontWeight="bold">{t.description}</Text>
          <Text fontSize="sm" opacity={0.8}>
            {t.date}
          </Text>
          <Text color={t.amount < 0 ? "red.400" : "green.400"}>
            €{t.amount}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
