import { useState } from "react";
import { VStack, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import type { Transaction } from "@/shared/types/Transaction";
import type { Category } from "@/features/categories/types/Category";

import { TransactionCard } from "@/features/transactions/components/create/list/TransactionCard";

import { CategorySelectModal } from "@/components/categories/CategorySelectModal";
import { ReceiptViewerModal } from "@/components/receiptViewer/ReceiptViewerModal";

import { updateMerchantMemory } from "@/lib/api/merchantMemory";
import { updateTransactionCategory } from "@/lib/api/transactions";
import { apiPost } from "@/lib/api/api";

export function TransactionsList({
  items,
  categories,
  refetchCategories,
}: {
  items: Transaction[];
  categories: Category[];
  refetchCategories: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure(); // categorie-modal
  const {
    isOpen: isReceiptOpen,
    onOpen: openReceiptModal,
    onClose: closeReceiptModal,
  } = useDisclosure(); // receipt viewer modal

  const navigate = useNavigate();

  // ⭐ Categorie-modal openen
  const openModal = (t: Transaction) => {
    setSelected(t);
    onOpen();
  };

  const closeModal = () => {
    setSelected(null);
    onClose();
  };

  // ⭐ Receipt viewer openen
  function onOpenReceiptPreview(t: Transaction) {
    setSelectedReceipt(t.receipt?.url ?? null);
    openReceiptModal();
  }

  // ⭐ Categorie selecteren
  const handleSelectCategory = async (categoryId: number) => {
    if (!selected) return;

    await updateTransactionCategory(selected.id, categoryId);
    await updateMerchantMemory(selected.merchant ?? "Onbekend", categoryId);

    selected.category_id = categoryId;

    await refetchCategories();
    closeModal();
  };

  // ⭐ Nieuwe categorie aanmaken (via API-client)
  const handleCreateCategory = async (name: string) => {
    if (!selected) return;

    const newCat = await apiPost<Category>("/categories", {
      userId: "demo-user",
      name,
    });

    categories.push(newCat);

    await updateMerchantMemory(selected.merchant ?? "Onbekend", newCat.id);

    selected.category_id = newCat.id;
  };

  // ⭐ Upload-flow
  const handleUploadReceipt = (transaction: Transaction) => {
    navigate("/upload-receipt", {
      state: { transactionId: transaction.id },
    });
  };

  return (
    <>
      <VStack w="100%" spacing={4} align="stretch">
        {items.map((t) => (
          <TransactionCard
            key={t.id}
            transaction={t}
            categories={categories}
            onOpenModal={openModal}
            onUploadReceipt={handleUploadReceipt}
            onOpenReceiptPreview={onOpenReceiptPreview} // ⭐ BELANGRIJK
          />
        ))}
      </VStack>

      {/* ⭐ Categorie-modal */}
      <CategorySelectModal
        isOpen={isOpen}
        onClose={closeModal}
        merchant={selected?.merchant ?? null}
        categories={categories}
        onSelectCategory={handleSelectCategory}
        onCreateCategory={handleCreateCategory}
      />

      {/* ⭐ Fullscreen neon receipt viewer */}
      <ReceiptViewerModal
        isOpen={isReceiptOpen}
        onClose={closeReceiptModal}
        imageUrl={selectedReceipt ?? ""}
      />
    </>
  );
}
