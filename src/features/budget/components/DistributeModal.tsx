import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  Box,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { distributeRemaining } from "@/features/budget/api/budgetApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  year: string | undefined;
  month: string | undefined;
  refreshBudget: () => void;
  bg: string;
  border: string;
}

export function DistributeModal({
  isOpen,
  onClose,
  remaining,
  year,
  month,
  refreshBudget,
  bg,
  border,
}: Props) {
  const toast = useToast();

  // Alleen sparen is editable
  const [savingsAmount, setSavingsAmount] = useState(0);

  // rollover wordt automatisch berekend
  const rolloverAmount = Number((remaining - savingsAmount).toFixed(2));

  useEffect(() => {
    if (isOpen) {
      setSavingsAmount(0);
    }
  }, [isOpen, remaining]);

  const isInvalid = savingsAmount < 0 || savingsAmount > remaining;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={bg} border="1px solid" borderColor={border}>
        <ModalHeader>Verdeel het resterende bedrag</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Box fontSize="sm" color="gray.400">
                Totaal over
              </Box>
              <Box fontSize="2xl" fontWeight="bold">
                € {remaining.toFixed(2)}
              </Box>
            </Box>

            {/* Automatisch berekend */}
            <Box>
              <Box fontSize="sm" color="gray.400">
                Meenemen naar volgende maand
              </Box>
              <NumberInput value={rolloverAmount} precision={2} isReadOnly>
                <NumberInputField />
              </NumberInput>
            </Box>

            {/* Enige invoerveld */}
            <Box>
              <Box fontSize="sm" color="gray.400">
                Sparen
              </Box>
              <NumberInput
                value={savingsAmount}
                min={0}
                max={remaining}
                precision={2}
                onChange={(_, valueAsNumber) =>
                  setSavingsAmount(
                    Number.isNaN(valueAsNumber) ? 0 : valueAsNumber,
                  )
                }
              >
                <NumberInputField />
              </NumberInput>
            </Box>

            {isInvalid && (
              <Box fontSize="sm" color="red.300">
                Ongeldig bedrag. Het moet tussen 0 en € {remaining.toFixed(2)}{" "}
                liggen.
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Annuleren
          </Button>

          <Button
            colorScheme="cyan"
            isDisabled={isInvalid}
            onClick={async () => {
              await distributeRemaining(`${year}-${month?.padStart(2, "0")}`, {
                rollover: rolloverAmount,
                savings: savingsAmount,
              });

              await refreshBudget();
              onClose();

              toast({
                title: "Verdeling opgeslagen",
                description: `Rollover: €${rolloverAmount.toFixed(
                  2,
                )}, Sparen: €${savingsAmount.toFixed(2)}`,
                status: "success",
              });
            }}
          >
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
