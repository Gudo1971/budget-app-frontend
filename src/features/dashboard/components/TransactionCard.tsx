import { Box, HStack, VStack, Text, Badge, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  merchant?: string;
  date?: string;

  category: {
    name: string;
    subcategory: string | null;
  };

  recurring?: boolean;
};

type TransactionCardProps = {
  transaction: Transaction;
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const navigate = useNavigate();
  const isExpense = transaction.amount < 0;
  const sign = isExpense ? "-" : "+";
  const amount = Math.abs(transaction.amount).toFixed(2);
  console.log("CATEGORY CHECK:", transaction.id, transaction.category);

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

          {transaction.merchant && (
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.700"
              _dark={{ color: "gray.200" }}
            >
              {transaction.merchant}
            </Text>
          )}

          <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.300" }}>
            {transaction.category?.name ?? "Onbekend"}{" "}
            {transaction.category?.subcategory
              ? ` • ${transaction.category.subcategory}`
              : ""}
          </Text>

          {transaction.date && (
            <Text fontSize="xs" color="gray.400">
              {transaction.date}
            </Text>
          )}
        </VStack>

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
