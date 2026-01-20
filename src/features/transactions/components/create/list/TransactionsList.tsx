import { VStack, Text } from "@chakra-ui/react";
import { useTransactions } from "../../../shared/hooks/useTransactions";
import type { BackendTransaction } from "../../../shared/hooks/useTransactions";
import { TransactionCard } from "../../../../dashboard/components/TransactionCard";
import { useLocation } from "react-router-dom";

export function TransactionsList() {
  const location = useLocation();

  // ⭐ Geef refreshKey door aan de hook
  const { data: transactions, loading } = useTransactions(location.search);

  if (loading) {
    return <Text>Loading transactions...</Text>;
  }

  return (
    <VStack align="stretch" spacing={3}>
      {transactions.map((t: BackendTransaction) => (
        <TransactionCard
          key={t.id}
          transaction={{
            id: t.id,
            description: t.description ?? "",
            amount: t.amount,
            date: t.date,
            merchant: t.merchant ?? "Onbekend",

            category: t.category ?? null,
            subcategory: t.subcategory ?? null,

            receipt_id: t.receipt_id ?? null,
            recurring: t.recurring ?? false,
            receipt: t.receipt ?? undefined,
          }}
        />
      ))}
    </VStack>
  );
}
