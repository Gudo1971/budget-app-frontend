import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";

import { Transaction } from "@shared/types/Transaction";

export function AiMatchModal({
  transaction,
  onConfirm,
  onReject,
}: {
  transaction: Transaction;
  onConfirm: () => void;
  onReject: () => void;
}) {
  return (
    <Modal isOpen onClose={onReject} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Waarschijnlijk een match</ModalHeader>

        <ModalBody>
          <Text mb={3}>
            De AI denkt dat deze transactie waarschijnlijk bij deze bon hoort.
          </Text>

          <Box
            p={3}
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
            fontSize="sm"
          >
            <Text>
              <strong>Bedrag:</strong> €{transaction.amount}
            </Text>
            <Text>
              <strong>Datum:</strong> {transaction.date}
            </Text>
            <Text>
              <strong>Merchant:</strong> {transaction.merchant}
            </Text>
          </Box>

          <Text mt={4}>Wil je deze bon koppelen aan deze transactie?</Text>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button colorScheme="blue" onClick={onConfirm}>
            Ja, koppelen
          </Button>

          <Button variant="ghost" onClick={onReject}>
            Nee, toon andere opties
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
