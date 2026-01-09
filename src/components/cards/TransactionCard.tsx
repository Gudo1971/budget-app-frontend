import { Box, HStack, VStack, Text, Badge, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  category: string;
  merchant?: string;
  recurring?: boolean;
  reasoning?: string;
  confidence?: number;
  date?: string;
};

type TransactionCardProps = {
  transaction: Transaction;
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const navigate = useNavigate();

  const isExpense = transaction.amount < 0;
  const sign = isExpense ? "-" : "+";
  const amount = Math.abs(transaction.amount).toFixed(2);

  return (
    <Box
      w="100%"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      bg="white"
      boxShadow="sm"
      px={4}
      py={3}
      transition="all 0.2s ease"
      _hover={{
        boxShadow: "md",
        borderColor: "gray.300",
        bg: "gray.50",
        transform: "translateY(-1px)",
      }}
    >
      <HStack justify="space-between" align="flex-start" gap={4}>
        {/* Linkerzijde */}
        <VStack align="start" gap={1}>
          <HStack gap={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.900">
              {transaction.description}
            </Text>

            {transaction.recurring && (
              <Badge
                fontSize="0.6rem"
                colorScheme="purple"
                borderRadius="full"
                px={2}
              >
                Terugkerend
              </Badge>
            )}
          </HStack>

          <HStack gap={2}>
            {transaction.merchant && (
              <Text fontSize="xs" color="gray.500">
                {transaction.merchant}
              </Text>
            )}
            <Text fontSize="xs" color="gray.400">
              •
            </Text>
            <Text fontSize="xs" color="gray.500">
              {transaction.category}
            </Text>
          </HStack>

          {transaction.date && (
            <Text fontSize="xs" color="gray.400">
              {transaction.date}
            </Text>
          )}
        </VStack>

        {/* Rechterzijde */}
        <VStack align="flex-end" gap={2} minW="100px">
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color={isExpense ? "red.500" : "green.500"}
          >
            {sign}€{amount}
          </Text>

          <Text fontSize="xs" color="gray.400">
            {isExpense ? "Uitgave" : "Inkomst"}
          </Text>

          {/* Split-knop */}
          {isExpense && (
            <Button
              size="xs"
              colorScheme="blue"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/split/${transaction.id}`);
              }}
            >
              Split
            </Button>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}
