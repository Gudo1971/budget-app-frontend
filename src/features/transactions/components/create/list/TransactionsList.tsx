import { VStack, Text } from "@chakra-ui/react";
import { useTransactions } from "../../../shared/hooks/useTransactions";
import type { BackendTransaction } from "../../../shared/hooks/useTransactions";
import { TransactionCard } from "../../../../dashboard/components/TransactionCard";
import { useLocation } from "react-router-dom";

export function TransactionsList() {
  const location = useLocation();

  const { data: transactions, loading } = useTransactions(location.search);

  if (loading) {
    return <Text>Loading transactions...</Text>;
  }

  return (
    <VStack align="stretch" spacing={3}>
      {transactions.map((t: BackendTransaction) => (
        <TransactionCard key={t.id} transaction={t} />
      ))}
    </VStack>
  );
}
