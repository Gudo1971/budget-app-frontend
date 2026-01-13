import { VStack, Text } from "@chakra-ui/react";
import { useTransactions } from "../../../shared/hooks/useTransactions";
import type { BackendTransaction } from "../../../shared/hooks/useTransactions";
import { TransactionCard } from "../../../../dashboard/components/TransactionCard";

export function TransactionsList() {
  const { data: transactions, loading } = useTransactions();

  if (loading) {
    return <Text>Loading transactions...</Text>;
  }

  return (
    <VStack align="stretch" spacing={3}>
      {transactions.map((t: BackendTransaction) => (
        <TransactionCard
          key={t.id}
          transaction={{
            id: String(t.id),
            description: t.description,
            amount: t.amount,
            date: t.date,
            categoryName: t.category?.name ?? "Onbekend",
            merchant: t.merchant ?? undefined,
          }}
        />
      ))}
    </VStack>
  );
}
