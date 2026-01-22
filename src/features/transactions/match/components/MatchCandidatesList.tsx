import { Box, Button, VStack, Text, HStack } from "@chakra-ui/react";
import { MatchCandidate } from "@shared/types/matching";
export function MatchCandidatesList({
  candidates,
  onSelect,
}: {
  candidates: MatchCandidate[];
  onSelect: (id: number) => void;
}) {
  return (
    <VStack align="stretch" spacing={3}>
      {candidates.map((c) => (
        <Box
          key={c.id}
          p={4}
          bg="gray.800" // LICHTER DAN JE PAGINA
          borderRadius="md"
          border="1px solid"
          borderColor="gray.600" // DUIDELIJK CONTRAST
          color="white"
          _hover={{ bg: "gray.700" }}
        >
          <HStack justify="space-between">
            <Text fontWeight="medium">
              {c.merchant ?? "Onbekend"} — €{c.amount}
            </Text>

            <Button
              size="sm"
              bg="gray.700"
              color="white"
              border="1px solid"
              borderColor="gray.500"
              _hover={{ bg: "gray.600" }}
              onClick={() => onSelect(c.id)}
            >
              Koppel
            </Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
