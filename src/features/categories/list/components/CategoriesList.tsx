import { Box, Text, VStack } from "@chakra-ui/react";
import { useCategories } from "../../list/components/shared/components/hooks/useCategories";

export function CategoriesList() {
  const { data: categories, loading } = useCategories();

  if (loading) {
    return <Text>Loading categories...</Text>;
  }

  if (categories.length === 0) {
    return <Text>Geen categorieën gevonden.</Text>;
  }

  return (
    <VStack align="stretch" spacing={3}>
      {categories.map((c) => (
        <Box
          key={c.id}
          p={3}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
          _dark={{ bg: "gray.700" }}
        >
          <Text fontWeight="bold">{c.name}</Text>
          <Text fontSize="sm" opacity={0.8}>
            Type: {c.type}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
