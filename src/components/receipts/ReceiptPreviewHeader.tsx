import { Box, Flex, Text, Spinner, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

type ReceiptPreviewHeaderProps = {
  loading: boolean;
  data: {
    merchant?: string;
    date?: string;
    total?: number;
    items?: {
      name: string;
      quantity: number;
      price: number;
      total?: number;
      category?: string;
    }[];
  } | null;
  onClose: () => void;
};

export function ReceiptPreviewHeader({
  loading,
  data,
  onClose,
}: ReceiptPreviewHeaderProps) {
  return (
    <Box
      bg="gray.50"
      borderBottom="1px solid"
      borderColor="gray.200"
      p={4}
      rounded="md"
      shadow="sm"
      transition="all 0.25s ease"
    >
      <Flex justify="space-between" align="flex-start">
        <Box flex="1">
          {loading && (
            <Flex align="center" gap={2}>
              <Spinner size="sm" />
              <Text fontSize="sm">AI is de bon aan het lezen…</Text>
            </Flex>
          )}

          {!loading && data && (
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {data.merchant || "Onbekende winkel"}
              </Text>

              <Text fontSize="sm" color="gray.600">
                {data.date || "Geen datum gevonden"}
              </Text>

              <Text mt={2} fontSize="md" fontWeight="semibold">
                Totaal: €{data.total?.toFixed(2) ?? "—"}
              </Text>

              <Box mt={4}>
                {data.items?.map((item, i) => (
                  <Flex
                    key={i}
                    justify="space-between"
                    py={1}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                  >
                    <Text>{item.name}</Text>
                    <Text>€{item.price.toFixed(2)}</Text>
                  </Flex>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <IconButton
          aria-label="Close"
          icon={<CloseIcon />}
          size="sm"
          variant="ghost"
          onClick={onClose}
        />
      </Flex>
    </Box>
  );
}
