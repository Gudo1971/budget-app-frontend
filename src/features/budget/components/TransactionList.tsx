// src/features/budget/components/TransactionList.tsx
import { VStack } from "@chakra-ui/react";
import { TransactionItem } from "./TransactionItem";

interface TransactionListProps {
  sb: any;
  openTxMap: Record<number, boolean>;
  toggleTx: (id: number) => void;
  onMoveTransaction: (t: any) => void; // ⭐ toegevoegd
}

export function TransactionList({
  sb,
  openTxMap,
  toggleTx,
  onMoveTransaction, // ⭐ toegevoegd
}: TransactionListProps) {
  return (
    <VStack align="stretch" spacing={0}>
      {sb.transactions?.map((t: any) => (
        <TransactionItem
          key={t.id}
          t={t}
          sb={sb}
          openTxMap={openTxMap}
          toggleTx={toggleTx}
          onMove={onMoveTransaction} // ⭐ belangrijk
        />
      ))}
    </VStack>
  );
}
