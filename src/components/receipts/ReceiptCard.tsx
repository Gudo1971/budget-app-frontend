import {
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";

export type Receipt = {
  id: number;
  filename: string;
  original_name: string;
  uploaded_at: string;
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
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box
      p={4}
      bg={bg}
      borderRadius="md"
      boxShadow={isSelected ? "md" : "sm"}
      border={isSelected ? "2px solid #3182CE" : "1px solid transparent"}
      cursor="pointer"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.15s ease"
      onClick={onClick}
    >
      <HStack justify="space-between" mb={4}>
        {/* Thumbnail */}
        <Box
          boxSize="48px"
          borderRadius="md"
          overflow="hidden"
          bg="gray.100"
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
        <VStack align="start" spacing={0} flex="1" ml={3}>
          <Text fontWeight="bold">{receipt.original_name}</Text>
          <Text fontSize="sm" color="gray.500">
            Geüpload op {new Date(receipt.uploaded_at).toLocaleString()}
          </Text>
        </VStack>

        {/* Acties */}
        <HStack>
          <IconButton
            aria-label="Download"
            icon={<DownloadIcon />}
            colorScheme="blue"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(receipt.id);
            }}
          />

          <IconButton
            aria-label="Verwijder"
            icon={<DeleteIcon />}
            colorScheme="red"
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
