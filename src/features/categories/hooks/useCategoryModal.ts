import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { Transaction } from "@/shared/types/Transaction";
export function useCategoryModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  function openCategoryModal(t: Transaction) {
    setTransaction(t);
    onOpen();
  }

  return {
    isOpen,
    onOpen,
    onClose,
    openCategoryModal,
    transaction,
  };
}
