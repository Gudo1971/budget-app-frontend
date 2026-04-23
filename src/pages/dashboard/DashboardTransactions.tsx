import { VStack, HStack, Heading, Box, Text, Divider } from "@chakra-ui/react";

import { useSearchParams } from "react-router-dom";
import { useTransactions } from "@/hooks/useTransactions";
import { useDateFilter } from "@/context/DateFilterContext";
import type { DateRange } from "@/context/DateFilterContext";

import { getCategoryName } from "@/shared/constants/categories";

// ⭐ Helper
function isInRange(dateString: string, range: DateRange) {
  const d = new Date(dateString);
  return d >= range.from && d <= range.to;
}

export default function TransactionsPage() {
  // ⭐ URL parameters
  const [params] = useSearchParams();
  const categoryParam = params.get("category");
  const categoryId = categoryParam ? Number(categoryParam) : null;

  // ⭐ Date filter context
  const { range } = useDateFilter();

  // ⭐ Backend data
  const { data: transactions = [] } = useTransactions();

  // ⭐ Filter op maand + categorie (indien aanwezig)
  const filtered = transactions
    .filter((t) => isInRange(t.date, range))
    .filter((t) => (categoryId ? t.category_id === categoryId : true))
    .map((t) => ({
      ...t,
      id: String(t.id),
    }));

  // ⭐ Titel bepalen
  const title = categoryId ? getCategoryName(categoryId) : "Alle transacties";

  return (
    <VStack w="full" align="stretch" spacing={4}>
      <Heading size="lg">{title}</Heading>

      <Text opacity={0.7}>
        {filtered.length} transacties in{" "}
        {range.from.toLocaleDateString("nl-NL", {
          month: "long",
          year: "numeric",
        })}
      </Text>

      <Divider />

      <VStack align="stretch" spacing={3}>
        {filtered.map((t) => (
          <Box key={t.id} p={3} borderWidth="1px" borderRadius="md">
            <HStack justify="space-between">
              <Text fontWeight="bold">{t.description}</Text>
              <Text color={Number(t.amount) < 0 ? "red.400" : "green.400"}>
                €{Math.abs(Number(t.amount)).toFixed(2)}
              </Text>
            </HStack>

            <Text fontSize="sm" opacity={0.7}>
              {new Date(t.date).toLocaleDateString("nl-NL")}
            </Text>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
