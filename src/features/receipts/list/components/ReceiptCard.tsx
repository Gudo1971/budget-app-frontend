import { Box, HStack, VStack, Text, IconButton, Badge } from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";

export type Receipt = {
  id: number;
  filename: string;
  original_name: string;
  uploaded_at: string;
  status: "pending" | "linked" | "archived"; // ← status toevoegen
};

export function ReceiptCard({
  receipt,
  onDelete,
  onDownload,
  onClick,
  isSelected,
}: {
  receipt: Receipt;
  onDelete: (id: number) => void;
  onDownload: (id: number) => void;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  return (
    <Box
      p={4}
      bg="gray.900"
      borderRadius="md"
      border={isSelected ? "2px solid #3182CE" : "1px solid gray.700"}
      cursor="pointer"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
      transition="all 0.15s ease"
      color="white"
      onClick={onClick}
    >
      <HStack justify="space-between" align="flex-start">
        {/* Thumbnail */}
        <Box
          boxSize="48px"
          borderRadius="md"
          overflow="hidden"
          bg="gray.800"
          border="1px solid gray.700"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/api/receipts/${receipt.id}/file`, "_blank");
          }}
        >
          <img
            src={`/api/receipts/${receipt.id}/file`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Info */}
        <VStack align="start" spacing={1} flex="1" ml={3}>
          <HStack spacing={2}>
            <Text fontWeight="bold" color="white">
              {receipt.original_name}
            </Text>

            {/* STATUS BADGES */}
            {receipt.status === "pending" && (
              <Badge colorScheme="yellow">In afwachting</Badge>
            )}

            {receipt.status === "linked" && (
              <Badge colorScheme="green">Gekoppeld</Badge>
            )}
          </HStack>

          <Text fontSize="sm" color="gray.400">
            Geüpload op {new Date(receipt.uploaded_at).toLocaleString()}
          </Text>
        </VStack>

        {/* Acties */}
        <HStack spacing={2}>
          <IconButton
            aria-label="Download"
            icon={<DownloadIcon />}
            size="sm"
            bg="gray.800"
            color="white"
            border="1px solid gray.700"
            _hover={{ bg: "gray.700" }}
            onClick={(e) => {
              e.stopPropagation();
              onDownload(receipt.id);
            }}
          />

          <IconButton
            aria-label="Verwijder"
            icon={<DeleteIcon />}
            size="sm"
            bg="gray.800"
            color="red.300"
            border="1px solid gray.700"
            _hover={{ bg: "gray.700" }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(receipt.id);
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
}
