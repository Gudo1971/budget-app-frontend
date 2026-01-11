import { VStack, Box, HStack, Text } from "@chakra-ui/react";
import { ExtractedItem } from "../types/extractTypes";

export function ReceiptItems({ items }: { items: ExtractedItem[] }) {
  return (
    <VStack align="stretch" spacing={2}>
      {items.map((item, i) => (
        <Box key={i} p={2} bg="gray.700" borderRadius="md">
          <HStack justify="space-between">
            <Text fontWeight="bold">{item.name}</Text>
            <Text>
              {item.price} × {item.quantity}
            </Text>
          </HStack>

          {item.category && (
            <Text fontSize="sm" color="gray.400">
              Categorie: {item.category}
            </Text>
          )}

          {item.co2_grams != null && (
            <Text fontSize="sm" color="green.300">
              CO₂: {item.co2_grams} g
            </Text>
          )}

          {Object.entries(item).map(([key, value]) => {
            if (
              ["name", "price", "quantity", "category", "co2_grams"].includes(
                key
              )
            )
              return null;

            return (
              <Text key={key} fontSize="sm" color="gray.500">
                {key}: {String(value)}
              </Text>
            );
          })}
        </Box>
      ))}
    </VStack>
  );
}
