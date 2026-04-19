import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Transaction } from "@shared/types/Transaction";

type Props = {
  transaction: Transaction;
};

export function TransactionCard({ transaction }: Props) {
  const navigate = useNavigate();
  const hasReceipt = !!transaction.receipt;

  const bg = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  const openReceipt = () => {
    if (!transaction.receipt?.id) return;

    navigate("/receipts", {
      state: {
        autoAnalyze: false,
        receiptId: transaction.receipt.id,
      },
    });
  };

  return (
    <Box
      p={4}
      borderRadius="lg"
      bg={bg}
      _hover={{ bg: hoverBg }}
      transition="0.2s"
      cursor="pointer"
      onClick={() => navigate(`/transactions/${transaction.id}`)}
    >
      <HStack justify="space-between" align="flex-start">
        <VStack align="flex-start" spacing={1}>
          <Text fontWeight="bold" fontSize="md">
            {transaction.merchant}
          </Text>

          <Text fontSize="sm" opacity={0.7}>
            {transaction.description}
          </Text>

          <HStack spacing={2}>
            <Badge colorScheme="blue">{transaction.category_id}</Badge>

            <Text fontSize="sm" opacity={0.6}>
              {transaction.date}
            </Text>
          </HStack>
        </VStack>

        <VStack align="flex-end" spacing={2}>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color={transaction.amount < 0 ? "red.400" : "green.400"}
          >
            {transaction.amount.toFixed(2)}
          </Text>

          {hasReceipt && (
            <IconButton
              aria-label="Bekijk bon"
              icon={<FiImage />}
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                openReceipt();
              }}
            />
          )}
        </VStack>
      </HStack>

      {hasReceipt && (
        <Box
          mt={3}
          borderRadius="md"
          overflow="hidden"
          maxH="180px"
          cursor="pointer"
          onClick={(e) => {
            e.stopPropagation();
            openReceipt();
          }}
        >
          <img
            src={transaction.receipt?.url ?? ""}
            alt="Bon"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </Box>
      )}
    </Box>
  );
}
