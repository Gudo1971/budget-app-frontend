import { Box, HStack, VStack, Text, Badge, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  categoryName: string;
  merchant?: string;
  recurring?: boolean;
  reasoning?: string;
  confidence?: number;
  date?: string;
};

type TransactionCardProps = {
  transaction: Transaction;
};
console.log("TRANSACTION CARD LOADED");

export function TransactionCard({ transaction }: TransactionCardProps) {
  const navigate = useNavigate();
  console.log("MERCHANT RAW:", transaction.merchant);
  console.log("MERCHANT TYPE:", typeof transaction.merchant);
  console.log("MERCHANT VALUE:", JSON.stringify(transaction.merchant));
  const isExpense = transaction.amount < 0;
  const sign = isExpense ? "-" : "+";
  const amount = Math.abs(transaction.amount).toFixed(2);
  console.log("TRANSACTION:", transaction);
  console.log("ID TYPE:", transaction.id, typeof transaction.id);
  console.log("AMOUNT TYPE:", transaction.amount, typeof transaction.amount);
  console.log(
    "CATEGORY TYPE:",
    transaction.categoryName,
    typeof transaction.categoryName
  );

  return (
    <Box
      w="100%"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      bg="gray.50"
      _dark={{ bg: "gray.800" }}
      boxShadow="sm"
      px={4}
      py={3}
      transition="0.2s"
      _hover={{
        boxShadow: "md",
        borderColor: "gray.300",
        bg: "gray.50",
        _dark: { bg: "gray.800" },
        transform: "translateY(-1px)",
      }}
    >
      <HStack justify="space-between" align="flex-start" spacing={4}>
        {/* Linkerzijde */}
        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.300">
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

          <HStack spacing={2}>
            {transaction.merchant && (
              <Text
                fontSize="xs"
                color="gray.600"
                _dark={{ color: "gray.300" }}
              >
                {transaction.merchant}
              </Text>
            )}

            <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.300" }}>
              •
            </Text>

            <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.300" }}>
              {transaction.categoryName}
            </Text>
          </HStack>

          {transaction.date && (
            <Text fontSize="xs" color="gray.400">
              {transaction.date}
            </Text>
          )}
        </VStack>

        {/* Rechterzijde */}
        <VStack align="flex-end" spacing={2} minW="100px">
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
