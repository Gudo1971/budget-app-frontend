import { HStack, VStack, IconButton, Text } from "@chakra-ui/react";
import { FiImage, FiEdit } from "react-icons/fi";
import { ReceiptIcon } from "@/components/icons/ReceiptIcon";
import type { Transaction } from "@shared/types/Transaction";
import type { Category } from "@/features/categories/types/Category";

import { NeonCard } from "@/theme/neon/NeonCard";
import { NeonBadge } from "@/theme/neon/NeonBadge";
import { NeonText } from "@/theme/neon/NeonText";

type Props = {
  transaction: Transaction;
  categories: Category[];
  onOpenModal: (t: Transaction) => void;
  onUploadReceipt: (t: Transaction) => void;
  onOpenReceiptPreview: (t: Transaction) => void;
};

export function TransactionCard({
  transaction,
  categories,
  onOpenModal,
  onUploadReceipt,
  onOpenReceiptPreview,
}: Props) {
  const hasReceipt = !!transaction.receipt;

  // ⭐ Category altijd veilig ophalen
  const category = categories.find((c) => c.id == transaction.category_id);

  // ⭐ categoryName mag NOOIT undefined zijn
  const categoryName = category?.name ?? "Onbekend";
  console.log("CATEGORYNAME:", categoryName);

  return (
    <NeonCard depth={2} categoryName={categoryName}>
      <HStack justify="space-between" align="flex-start">
        {/* LINKERKOLOM */}
        <VStack align="flex-start" spacing={1}>
          <Text fontWeight="bold" fontSize="md">
            {transaction.merchant}
          </Text>

          <Text fontSize="sm" opacity={0.6}>
            {transaction.date}
          </Text>

          <Text fontSize="sm" opacity={0.7}>
            {transaction.description}
          </Text>

          <NeonBadge categoryName={categoryName}>
            {categoryName || "Onbekend"}
          </NeonBadge>
        </VStack>

        {/* RECHTERKOLOM */}
        <VStack spacing={2} align="flex-end">
          <NeonText categoryName={categoryName} fontWeight="bold" fontSize="md">
            {transaction.amount.toFixed(2)} €
          </NeonText>

          <IconButton
            aria-label="Bewerk transactie"
            icon={<FiEdit />}
            size="sm"
            variant="ghost"
            onClick={() => onOpenModal(transaction)}
          />

          <IconButton
            aria-label="Upload bon"
            icon={<FiImage />}
            size="sm"
            variant="ghost"
            onClick={() => onUploadReceipt(transaction)}
          />

          {hasReceipt && (
            <IconButton
              aria-label="Bekijk bon"
              icon={<ReceiptIcon hasReceipt />}
              size="sm"
              variant="ghost"
              onClick={() => onOpenReceiptPreview(transaction)}
            />
          )}
        </VStack>
      </HStack>
    </NeonCard>
  );
}
