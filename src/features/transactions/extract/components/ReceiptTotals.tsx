import { VStack, HStack, Text } from "@chakra-ui/react";
import { ExtractedReceipt } from "../types/extractTypes";

export function ReceiptTotals({ r }: { r: ExtractedReceipt }) {
  const fields = [
    ["subtotal", "Subtotaal"],
    ["tax", "BTW"],
    ["total", "Totaal"],
  ];

  return (
    <VStack align="stretch" spacing={1}>
      {fields.map(([key, label]) =>
        r[key] != null ? (
          <HStack key={key} justify="space-between">
            <Text>{label}</Text>
            <Text>
              {r[key]} {r.currency}
            </Text>
          </HStack>
        ) : null
      )}
    </VStack>
  );
}
