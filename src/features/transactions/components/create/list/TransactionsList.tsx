import { VStack, Text } from "@chakra-ui/react";
import { useTransactions } from "../../../shared/hooks/useTransactions";
import type { Transaction } from "@shared/types/Transaction";
import { TransactionCard } from "../../../../dashboard/components/TransactionCard";
import { useLocation } from "react-router-dom";
import { mapBackendToTransaction } from "@/features/transactions/utils/mapBackendTransaction";

export function TransactionsList() {
  const location = useLocation();

  const { data: transactions, loading } = useTransactions(location.search);

  if (loading) {
    return <Text>Loading transactions...</Text>;
  }

  return (
    <VStack align="stretch" spacing={3}>
      {transactions.map((t: Transaction) => (
        <TransactionCard
          key={t.id}
          transaction={mapBackendToTransaction(t)} // ⭐ FIX
        />
      ))}
    </VStack>
  );
}
