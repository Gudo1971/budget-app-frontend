import { Box, Text, VStack } from "@chakra-ui/react";
import { useCategories } from "../../hooks/useCategories";
import type { Category } from "../../hooks/useCategories";

export function CategoriesList() {
  const { data: categories, loading } = useCategories();

  if (loading) {
    return <Text>Loading categories...</Text>;
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
          <Text fontSize="sm" opacity={0.8}>
            Type: {c.type}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
