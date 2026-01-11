import { VStack, Text } from "@chakra-ui/react";
import { ExtractedReceipt } from "../types/extractTypes";

export function ReceiptMetadata({ r }: { r: ExtractedReceipt }) {
  const ignore = [
    "merchant",
    "merchant_category",
    "date",
    "total",
    "subtotal",
    "tax",
    "currency",
    "items",
  ];

  return (
    <VStack align="stretch" spacing={1}>
      {Object.entries(r).map(([key, value]) => {
        if (ignore.includes(key)) return null;
        if (value == null) return null;

        return (
          <Text key={key} fontSize="sm" color="gray.400">
            {key}: {String(value)}
          </Text>
        );
      })}
    </VStack>
  );
}
