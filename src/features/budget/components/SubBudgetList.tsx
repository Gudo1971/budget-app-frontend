import { useState, useRef } from "react";
import {
  VStack,
  HStack,
  Text,
  Box,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { SubBudget } from "../types/SubBudget";
import { useCategories } from "../../categories/hooks/useCategories";
import { SubBudgetItem } from "./SubBudgetItem";

type Props = {
  data: SubBudget[];
  onAdd: () => void;
  onEdit: (item: SubBudget) => void;
  onDelete: (id: number) => Promise<void>; // belangrijk: async
  refetchAll: () => Promise<void>;
  onMoveTransaction: (tx: any) => void;
  // subbudgets + transactions
};

export function SubBudgetList({
  data,
  onAdd,
  onEdit,
  onDelete,
  refetchAll,
  onMoveTransaction,
}: Props) {
  const { categories } = useCategories();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirmDelete() {
    if (!deleteId) return;

    setLoading(true);

    await onDelete(deleteId); // backend delete
    await refetchAll(); // subbudgets + transactions opnieuw ophalen

    setLoading(false);
    setDeleteId(null);
  }

  return (
    <>
      <VStack align="stretch" spacing={3} mt={4}>
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="bold" color="gray.200">
            Sub‑budgetten
          </Text>

          <Button size="xs" colorScheme="purple" onClick={onAdd}>
            + Toevoegen
          </Button>
        </HStack>

        {data.length === 0 && (
          <Text fontSize="xs" color="gray.500">
            Nog geen sub‑budgetten ingesteld.
          </Text>
        )}

        {data.map((item: SubBudget) => (
          <SubBudgetItem
            key={item.id}
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => setDeleteId(item.id)} // ⭐ open modal
            onMoveTransaction={onMoveTransaction}
          />
        ))}
      </VStack>

      {/* ⭐ DELETE CONFIRM MODAL */}
      <AlertDialog
        isOpen={deleteId !== null}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteId(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" border="1px solid #333">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.100">
              Sub‑budget verwijderen?
            </AlertDialogHeader>

            <AlertDialogBody color="gray.300">
              Als je dit sub‑budget verwijdert, worden alle transacties
              automatisch verplaatst naar <strong>Overig</strong>.
              <br />
              Weet je zeker dat je wilt doorgaan?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteId(null)}>
                Annuleren
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                isLoading={loading}
                onClick={handleConfirmDelete}
              >
                a Verwijderen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
