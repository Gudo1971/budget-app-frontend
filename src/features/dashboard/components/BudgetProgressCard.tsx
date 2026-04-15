import {
  Box,
  Text,
  Progress,
  VStack,
  HStack,
  useColorMode,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { CardWrapper } from "../../../components/ui/CardWrapper";
import { useDateFilter } from "@/context/DateFilterContext";

// -----------------------------
// ⭐ Props type (UI-only, not shared)
// -----------------------------
export type BudgetProgressCardProps = {
  budget: number;
  spent: number;
  stressScore: number;
  remainingBudget: number;
  daysPassed: number;
  daysInPeriod: number;
  daysLeft: number;
};

// -----------------------------
// ⭐ Helpers
// -----------------------------
function getBudgetColor(score: number) {
  if (score < 40) return "green.400";
  if (score < 70) return "orange.400";
  return "red.400";
}

// -----------------------------
// ⭐ Component
// -----------------------------
export function BudgetProgressCard({
  budget,
  spent,
  stressScore,
  remainingBudget,
  daysPassed,
  daysInPeriod,
  daysLeft,
}: BudgetProgressCardProps) {
  const { colorMode } = useColorMode();
  const muted = colorMode === "light" ? "gray.600" : "gray.400";

  const { range } = useDateFilter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ⭐ Is de maand voorbij?

  const monthIsOver = daysLeft <= 0;

  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const accent = getBudgetColor(stressScore);
  const barColor = getBudgetColor(stressScore).split(".")[0];

  // ⭐ Handlers (later koppel je deze aan backend)
  const handleSaveToSavings = () => {
    console.log("Sparen:", remainingBudget);
    onClose();
  };

  const handleRolloverToNextMonth = () => {
    console.log("Rollover:", remainingBudget);
    onClose();
  };

  return (
    <CardWrapper>
      <VStack align="stretch" spacing={4}>
        {/* Titel */}
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Budget Voortgang
          </Text>
          <Text fontSize="sm" color={muted}>
            Hoeveel je deze maand hebt uitgegeven
          </Text>
        </Box>

        {/* Statistieken */}
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text color={muted}>Uitgegeven</Text>
            <Text fontWeight="bold">€{spent.toFixed(0)}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text color={muted}>Totaal Budget</Text>
            <Text fontWeight="bold">€{budget.toFixed(0)}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text color={muted}>Resterend</Text>
            <Text fontWeight="bold">€{remainingBudget.toFixed(0)}</Text>
          </HStack>
        </VStack>

        {/* Progress bar */}
        <VStack align="stretch" spacing={1}>
          <Progress
            value={percentage}
            size="lg"
            colorScheme={barColor}
            borderRadius="md"
          />

          <Text
            textAlign="right"
            fontSize="sm"
            fontWeight="medium"
            color={accent}
          >
            {percentage.toFixed(0)}% gebruikt
          </Text>
        </VStack>

        {/* ⭐ Klikbare rollover-actie (alleen als maand voorbij is) */}
        {monthIsOver && remainingBudget > 0 && (
          <Text
            mt={2}
            fontSize="sm"
            color="blue.300"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={onOpen}
          >
            Wat wil je doen met €{remainingBudget.toFixed(0)}?
          </Text>
        )}
      </VStack>

      {/* ⭐ Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Wat wil je doen met €{remainingBudget.toFixed(0)}?
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack align="stretch" spacing={3} pb={4}>
              <Button colorScheme="green" onClick={handleSaveToSavings}>
                Sparen
              </Button>

              <Button colorScheme="blue" onClick={handleRolloverToNextMonth}>
                Meenemen naar volgende maand
              </Button>

              <Button variant="ghost" onClick={onClose}>
                Niets doen
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </CardWrapper>
  );
}
