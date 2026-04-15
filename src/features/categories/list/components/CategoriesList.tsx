import { Box, Text, VStack } from "@chakra-ui/react";
import {
  Category,
  useCategories,
} from "@/features/categories/hooks/useCategories";

export function CategoriesList() {
  const { categories, loading } = useCategories();

  if (loading) {
    return <Text>Loading categories...</Text>;
  }

  if (categories.length === 0) {
    return <Text>Geen categorieën gevonden.</Text>;
  }

  return (
    <VStack align="stretch" spacing={3}>
      {categories.map((c: Category) => (
        <Box
          key={c.id}
          p={3}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
          _dark={{ bg: "gray.700" }}
        >
          <Text fontWeight="bold">{c.name}</Text>
        </Box>
      ))}
    </VStack>
  );
}
