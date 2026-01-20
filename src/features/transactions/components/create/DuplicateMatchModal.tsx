import {
  Box,
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  duplicate: {
    id: number;
    date: string;
    merchant: string;
    amount: number;
  } | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DuplicateMatchModal({
  isOpen,
  duplicate,
  isLoading,
  onConfirm,
  onCancel,
}: Props) {
  if (!duplicate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Mogelijke overeenkomst gevonden</ModalHeader>

        <ModalBody>
          <VStack align="start" spacing={4}>
            <Text>
              We hebben een bestaande transactie gevonden die overeenkomt met
              deze bon. Wil je deze bon koppelen?
            </Text>

            <Divider />

            <Box bg="gray.900" p={4} borderRadius="md" w="100%">
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Bestaande transactie:</Text>
                <Text fontSize="sm">📅 {duplicate.date}</Text>
                <Text fontSize="sm">🏪 {duplicate.merchant}</Text>
                <Text fontSize="sm" fontWeight="bold" color="green.300">
                  💰 € {duplicate.amount}
                </Text>
              </VStack>
            </Box>

            <Divider />

            <Text fontSize="sm" color="gray.400">
              Kies "Ja, koppelen" om deze bon aan de bestaande transactie te
              koppelen, of "Annuleren" om een nieuwe transactie aan te maken.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onCancel}>
              Annuleren
            </Button>
            <Button
              colorScheme="green"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              Ja, koppelen
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
