import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFocusBudget: () => void;
};

export function BudgetRequiredAlertModal({
  isOpen,
  onClose,
  onFocusBudget,
}: Props) {
  const bg = useColorModeValue("#1a1a1a", "#111");
  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.65)" backdropFilter="blur(4px)" />

      <ModalContent
        bg={bg}
        border="1px solid"
        borderColor={border}
        p={4}
        borderRadius="lg"
        boxShadow="0 0 25px rgba(255,0,0,0.4)"
      >
        <ModalHeader color="red.300" fontSize="xl" fontWeight="bold">
          Budget niet opgeslagen
        </ModalHeader>

        <ModalBody>
          <Text color="gray.300" fontSize="md">
            Je probeert deze pagina te verlaten, maar je maandbudget is nog niet
            opgeslagen.
            <br />
            <br />
            Sla eerst je budget op om verder te gaan.
          </Text>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" color="gray.400" onClick={onClose}>
            Annuleren
          </Button>

          <Button
            bg="red.400"
            color="white"
            _hover={{ bg: "red.500" }}
            onClick={onFocusBudget}
          >
            Budget invullen
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
