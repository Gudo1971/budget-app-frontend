import { VStack, Text } from "@chakra-ui/react";
import { useTransactions } from "../../../shared/hooks/useTransactions";
import type { Transaction } from "@shared/types/Transaction";
import { TransactionCard } from "../../../../dashboard/components/TransactionCard";
import { useLocation } from "react-router-dom";
import { mapBackendToTransaction } from "@/features/transactions/utils/mapBackendTransaction";

type Props = {
  items: Transaction[];
};

export function TransactionsList({ items }: Props) {
  return (
    <VStack align="stretch" spacing={3}>
      {items.map((t) => (
        <TransactionCard key={t.id} transaction={mapBackendToTransaction(t)} />
      ))}
    </VStack>
  );
}
