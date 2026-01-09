import {
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";

export type Receipt = {
  id: number;
  filename: string;
  original_name: string;
  uploaded_at: string;
};

type Props = {
  receipt: Receipt;
  onDelete: (id: number) => void;
  onDownload: (id: number) => void;
};

export function ReceiptCard({ receipt, onDelete, onDownload }: Props) {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box
      p={4}
      bg={bg}
      borderRadius="md"
      boxShadow="sm"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.15s ease"
    >
      <HStack justify="space-between" mb={4}>
        {/* Thumbnail */}
        <Box
          boxSize="48px"
          borderRadius="md"
          overflow="hidden"
          bg="gray.100"
          cursor="pointer"
          onClick={() =>
            window.open(
              `http://localhost:3001/api/receipts/${receipt.id}/file`,
              "_blank"
            )
          }
        >
          <img
            src={`http://localhost:3001/api/receipts/${receipt.id}/file`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <VStack align="start" spacing={0} flex="1" ml={3}>
          <Text fontWeight="bold">{receipt.original_name}</Text>
          <Text fontSize="sm" color="gray.500">
            Geüpload op {new Date(receipt.uploaded_at).toLocaleString()}
          </Text>
        </VStack>

        <HStack>
          <IconButton
            aria-label="Download"
            icon={<DownloadIcon />}
            colorScheme="blue"
            onClick={() => onDownload(receipt.id)}
          />

          <IconButton
            aria-label="Delete"
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={() => onDelete(receipt.id)}
          />
        </HStack>
      </HStack>
    </Box>
  );
}
