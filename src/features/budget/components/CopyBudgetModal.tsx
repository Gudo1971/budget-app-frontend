import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

type CopyBudgetModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  previousMonth: string;
  currentMonth: string;
};

export function CopyBudgetModal({
  isOpen,
  onConfirm,
  onCancel,
  previousMonth,
  currentMonth,
}: CopyBudgetModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Budgetten van vorige maand overnemen?</ModalHeader>

        <ModalBody>
          <Text>
            We hebben budgetten gevonden voor {previousMonth}. Wil je deze
            gebruiken als basis voor {currentMonth}?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onConfirm}>
            Ja
          </Button>
          <Button ml={3} onClick={onCancel}>
            Nee
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
