// src/pages/BudgetDetailPage.tsx
import {
  Collapse,
  Box,
  VStack,
  HStack,
  Text,
  Skeleton,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getNeonColor } from "@/hooks/getNeonColor";
import { useTransactions } from "@/hooks/useTransactions";
import { PremiumDonut } from "@/components/charts/PremiumDonut";
import { useHoverSync } from "@/hooks/useHoverSync";
import { useScrollSync } from "@/hooks/useScrollSync";

type BudgetResponse = {
  id: number | null;
  month: string | null;
  total_budget: number;
  subBudgets: {
    id: number;
    category_id: number;
    amount: number;
    category_name: string;
    category_color: string;
  }[];
};

export function BudgetDetailPage() {
  const { id } = useParams();
  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const refreshKey = from && to ? `${from}-${to}` : "no-range";

  const { data: transactions = [], loading: transactionsLoading } =
    useTransactions(refreshKey, from ?? undefined, to ?? undefined);

  const neon = getNeonColor(budget?.month ?? null);

  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const border = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  const {
    hoverCategory,
    isHoverLocked,
    setHoverWithDelay,
    lockHoverFromList,
    clearHover,
  } = useHoverSync();

  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useScrollSync(hoverCategory, isHoverLocked, itemRefs);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    fetch(`/api/budget/by-id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBudget(data);
        setLoading(false);
      })
      .catch(() => {
        setBudget(null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!budget?.month) return;

    const [year, rawMonth] = budget.month.split("-");
    const monthIndex = Number(rawMonth) - 1;
    const lastDay = new Date(Number(year), monthIndex + 1, 0).getDate();

    setFrom(`${year}-${rawMonth}-01`);
    setTo(`${year}-${rawMonth}-${String(lastDay).padStart(2, "0")}`);
  }, [budget?.month]);

  const grouped =
    budget?.subBudgets
      .map((sb) => {
        const items =
          transactions?.filter((t) => t.category_id === sb.category_id) ?? [];

        const spent = Number(
          items
            .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
            .toFixed(2),
        );

        return {
          ...sb,
          transactions: items,
          spent,
          remaining: Number((sb.amount - spent).toFixed(2)),
        };
      })
      .sort((a, b) => b.spent - a.spent) ?? [];

  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const toggle = (id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <VStack align="stretch" spacing={6} p={6}>
      <HStack justify="space-between">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          bgGradient={`linear(to-r, ${neon.text}, ${neon.color})`}
          bgClip="text"
        >
          Budget {budget?.month ?? id}
        </Text>
      </HStack>

      <Divider borderColor="whiteAlpha.200" />

      <HStack align="flex-start" spacing={8}>
        <Box position="sticky" top="0" zIndex="20" bg="transparent">
          <PremiumDonut
            transactions={transactions.map((t) => ({
              ...t,
              category_name:
                budget?.subBudgets.find(
                  (sb) => sb.category_id === t.category_id,
                )?.category_name ?? "Onbekend",
            }))}
            size={280}
            strokeWidth={32}
            glow={neon.glow}
            hoverCategory={hoverCategory}
            setHoverWithDelay={setHoverWithDelay}
            setIsHoverLocked={() => {}}
          />
        </Box>

        <VStack
          align="stretch"
          spacing={4}
          flex="1"
          maxH="40vh"
          overflowY="auto"
          pr={2}
        >
          {loading || transactionsLoading ? (
            <Skeleton height="40px" />
          ) : (
            grouped.map((sb) => {
              const isOpen = openMap[sb.id] ?? false;
              const isHovered = hoverCategory === sb.category_id;

              return (
                <Box
                  key={sb.id}
                  ref={(el) => (itemRefs.current[sb.category_id] = el)}
                  p={4}
                  borderRadius="lg"
                  bg={isHovered ? "rgba(255,255,255,0.08)" : bg}
                  border="1px solid"
                  borderColor={isHovered ? neon.color : border}
                  onMouseEnter={() => lockHoverFromList(sb.category_id)}
                  onMouseLeave={clearHover}
                  transition="0.2s"
                >
                  <HStack
                    justify="space-between"
                    cursor="pointer"
                    onClick={() => toggle(sb.id)}
                  >
                    <VStack align="flex-start" spacing={0}>
                      <Text color="gray.200" fontWeight="bold">
                        {sb.category_name}
                      </Text>

                      <Text color="gray.500" fontSize="sm">
                        Uitgegeven: €{sb.spent.toFixed(2)} — Resterend: €
                        {sb.remaining.toFixed(2)}
                      </Text>
                    </VStack>

                    <HStack spacing={3}>
                      <Text color="gray.400">€{sb.amount.toFixed(2)}</Text>

                      <Box
                        transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                        transition="0.2s"
                      >
                        ▼
                      </Box>
                    </HStack>
                  </HStack>

                  <Collapse in={isOpen} animateOpacity>
                    <VStack align="stretch" mt={3} spacing={2}>
                      {sb.transactions.map((t) => (
                        <HStack
                          key={t.id}
                          justify="space-between"
                          p={2}
                          borderRadius="md"
                          bg="rgba(255,255,255,0.03)"
                        >
                          <Text color="gray.300">{t.description}</Text>
                          <Text color="gray.400">€{t.amount.toFixed(2)}</Text>
                        </HStack>
                      ))}

                      {sb.transactions.length === 0 && (
                        <Text color="gray.600" fontSize="sm">
                          Geen transacties voor deze categorie.
                        </Text>
                      )}
                    </VStack>
                  </Collapse>
                </Box>
              );
            })
          )}
        </VStack>
      </HStack>
    </VStack>
  );
}
