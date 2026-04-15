import { VStack } from "@chakra-ui/react";
import type { Transaction } from "@shared/types/Transaction";
import { TransactionCard } from "../../../../dashboard/components/TransactionCard";
import { mapBackendToTransaction } from "@/features/transactions/utils/mapBackendTransaction";

type Props = {
  items: Transaction[];
  refetchTransactions: () => Promise<void>;
};

export function TransactionsList({ items, refetchTransactions }: Props) {
  return (
    <VStack align="stretch" spacing={3}>
      {items.map((t) => (
        <TransactionCard
          key={t.id}
          transaction={mapBackendToTransaction(t)}
          refetchTransactions={refetchTransactions}
        />
      ))}
    </VStack>
  );
}
