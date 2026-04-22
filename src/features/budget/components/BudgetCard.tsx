import {
  Box,
  Text,
  Button,
  Collapse,
  useDisclosure,
  VStack,
  HStack,
  Progress,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";

// ✔ Props type — clean, simpel, geen coupling
type BudgetCardProps = {
  budget: number;
  total_budget: number;
  spent: number;
  remaining: number;
  onEdit: () => void;
};

export function BudgetCard({
  budget,
  total_budget,
  spent,
  remaining,
  onEdit,
}: BudgetCardProps) {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const text =
    colorMode === "light" ? theme.colors.light.text : theme.colors.dark.text;

  const surface =
    colorMode === "light"
      ? theme.colors.light.surface
      : theme.colors.dark.surface;

  const border =
    colorMode === "light"
      ? theme.colors.light.border
      : theme.colors.dark.border;

  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <Box
      w="full"
      p={4}
      border="1px solid"
      borderColor={border}
      borderRadius="lg"
      bg={surface}
      boxShadow="0 0 12px rgba(0, 255, 255, 0.08)"
    >
      <VStack align="start" spacing={3}>
        {/* Hoofdweergave */}
        <Text fontSize="2xl" fontWeight="bold" color={text}>
          €{total_budget || 0}
        </Text>

        <Text fontSize="sm" opacity={0.7} color={text}>
          Maandbudget
        </Text>

        <HStack spacing={3}>
          <Button size="sm" variant="outline" onClick={onEdit}>
            Wijzig budget
          </Button>

          <Button size="sm" variant="ghost" onClick={onToggle}>
            {isOpen ? "Details verbergen" : "Details tonen"}
          </Button>
        </HStack>

        {/* Collapse met details */}
        <Collapse in={isOpen} animateOpacity>
          <VStack align="start" spacing={3} mt={3}>
            <HStack justify="space-between" w="full">
              <Text color={text}>Uitgegeven:</Text>
              <Text fontWeight="bold" color={text}>
                €{spent}
              </Text>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text color={text}>Over:</Text>
              <Text fontWeight="bold" color={text}>
                €{remaining}
              </Text>
            </HStack>

            <Progress
              value={percentage}
              w="full"
              borderRadius="md"
              colorScheme="cyan"
            />
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  );
}
