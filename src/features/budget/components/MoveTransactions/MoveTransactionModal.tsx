import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { SubBudget } from "../../types/SubBudget";

export function MoveTransactionModal({
  isOpen,
  onClose,
  transaction,
  subBudgets,
  onMove,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  subBudgets: SubBudget[];
  onMove: (newCategoryId: number) => Promise<void>;
}) {
  const [target, setTarget] = useState(transaction?.category_id ?? 0);

  // Update target wanneer transaction verandert
  useEffect(() => {
    if (transaction?.category_id) {
      setTarget(transaction.category_id);
    }
  }, [transaction]);

  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800" border="1px solid #333">
        <ModalHeader color="gray.100">Transactie verplaatsen</ModalHeader>

        <ModalBody color="gray.300">
          <Text fontSize="sm" mb={3}>
            Verplaats: <strong>{transaction?.description}</strong> (€
            {transaction?.amount?.toFixed(2)})
          </Text>
          <Select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          >
            {subBudgets.map((sb) => (
              <option key={sb.id} value={sb.category_id}>
                {sb.category_name}
              </option>
            ))}
          </Select>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Annuleren</Button>
          <Button colorScheme="purple" ml={3} onClick={() => onMove(target)}>
            Verplaatsen
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
