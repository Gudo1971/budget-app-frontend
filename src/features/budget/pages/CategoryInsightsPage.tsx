import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function CategoryInsightsPage() {
  const { id } = useParams();

  return (
    <Box p={6}>
      <VStack align="start" spacing={4}>
        <Heading size="lg" color="cyan.300">
          Category Insights
        </Heading>

        <Text fontSize="md" color="gray.400">
          Categorie ID: {id}
        </Text>

        <Text fontSize="sm" color="gray.500">
          Deze pagina wordt later uitgebreid met:
        </Text>

        <VStack align="start" spacing={1} pl={2}>
          <Text fontSize="sm" color="gray.400">
            • Mini‑grafiekjes
          </Text>
          <Text fontSize="sm" color="gray.400">
            • Volledige trend‑analyse
          </Text>
          <Text fontSize="sm" color="gray.400">
            • Merchant breakdown
          </Text>
          <Text fontSize="sm" color="gray.400">
            • Maand‑vergelijking
          </Text>
          <Text fontSize="sm" color="gray.400">
            • Recurring detection
          </Text>
          <Text fontSize="sm" color="gray.400">
            • Transacties & pieken/dalen
          </Text>
        </VStack>

        <Text fontSize="sm" color="gray.500" mt={4}>
          Voor nu is dit een placeholder. De volledige analyse komt in Phase 2.
        </Text>
      </VStack>
    </Box>
  );
}
