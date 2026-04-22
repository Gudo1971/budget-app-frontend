import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Input,
  VStack,
} from "@chakra-ui/react";

import { SubBudget } from "../types/SubBudget";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { CategoryModal } from "@/features/categories/components/CategoryModal";
import { useDateFilter } from "@/context/DateFilterContext";

type SubBudgetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    month: string;
    category_id: number;
    amount: number;
  }) => void;

  initial: SubBudget | null;
  month?: string;
};

export function SubBudgetModal({
  isOpen,
  onClose,
  onSubmit,
  initial,
  month,
}: SubBudgetModalProps) {
  const { range } = useDateFilter();

  const effectiveMonth = month || (range?.from ? 
    range.from.getFullYear() + "-" + String(range.from.getMonth() + 1).padStart(2, "0") 
    : "");

  const [categoryId, setCategoryId] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");

  const { categories, refetch: refetchCategories } = useCategories();
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (initial) {
      setCategoryId(initial.category_id);
      setAmount(initial.amount);
    } else {
      setCategoryId("");
      setAmount("");
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!categoryId || !amount) {
      alert("Kies een categorie en vul een bedrag in.");
      return;
    }

    onSubmit({
      month: effectiveMonth,
      category_id: Number(categoryId),
      amount: Number(amount),
    });

    onClose();
  }

  console.log("MODAL MONTH =", effectiveMonth);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />

        <ModalContent bg="gray.900">
          {/* ⭐ Render inhoud ALLEEN als month geldig is */}
          {!effectiveMonth || effectiveMonth === "undefined" ? (
            <></>
          ) : (
            <>
              <ModalHeader color="white">
                {initial ? "Sub‑budget bewerken" : "Nieuw sub‑budget"}
              </ModalHeader>

              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <VStack spacing={3}>
                    <Select
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      placeholder="Kies categorie"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="purple"
                      w="full"
                      onClick={() => setCategoryModalOpen(true)}
                    >
                      Nieuwe categorie toevoegen
                    </Button>

                    <Input
                      type="number"
                      placeholder="Bedrag"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button mr={3} onClick={onClose}>
                    Annuleren
                  </Button>

                  <Button colorScheme="purple" type="submit" isDisabled={!categoryId || !amount}>
                    Opslaan
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCreated={async (cat) => {
          await refetchCategories();
          setCategoryId(cat.id);
          setCategoryModalOpen(false);
        }}
      />
    </>
  );
}
