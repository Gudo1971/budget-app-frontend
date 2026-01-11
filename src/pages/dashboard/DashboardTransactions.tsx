import {
  VStack,
  HStack,
  Input,
  Text,
  useTheme,
  useColorMode,
} from "@chakra-ui/react";
import TransactionCard from "../dashboard/DashboardPage";
const TransactionCardAny = TransactionCard as any;
import { useState } from "react";
import { useTransactions } from "@/features/transactions/shared/hooks/useTransactions";

export function DashboardTransactions() {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const [search, setSearch] = useState("");

  // ⭐ Echte backend transacties
  const { data: transactions = [] } = useTransactions();

  // ⭐ Fallback voor categorie + lowercase normalisatie
  const uiTransactions = transactions.map((t) => ({
    ...t,
    id: String(t.id), // ⭐ FIX: forceer id naar string
    category: t.category?.name?.trim() || "Onbekend",
  }));

  // ⭐ Zoeken
  const filtered = uiTransactions.filter((t) =>
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <VStack w="full" align="stretch" gap={6}>
      <HStack justify="space-between">
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={
            colorMode === "light"
              ? theme.colors.light.text
              : theme.colors.dark.text
          }
        >
          Transacties
        </Text>

        <Input
          placeholder="Zoeken..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          w="200px"
          size="sm"
        />
      </HStack>

      <VStack w="full" align="stretch" gap={3}>
        {filtered.map((t) => (
          <TransactionCardAny key={t.id} transaction={t} />
        ))}

        {filtered.length === 0 && (
          <Text
            fontSize="sm"
            color={
              colorMode === "light"
                ? theme.colors.light.textMuted
                : theme.colors.dark.textMuted
            }
          >
            Geen transacties gevonden.
          </Text>
        )}
      </VStack>
    </VStack>
  );
}
