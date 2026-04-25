// src/pages/BudgetDetailPage.tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Skeleton,
  useColorModeValue,
  Divider,
  Collapse,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";

import { getNeonColor } from "@/hooks/getNeonColor";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { PremiumDonut } from "@/components/charts/PremiumDonut";
import { useHoverSync } from "@/hooks/useHoverSync";
import { useScrollSync } from "@/hooks/useScrollSync";
import { CollapsibleMonthSelector } from "@/features/budget/components/MonthSelector/CollapsibleMonthSelector";

// ⭐ BudgetForm importeren
import { BudgetForm } from "@/features/budget/components/BudgetForm";

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
  const { year, month } = useParams();
  const navigate = useNavigate();

  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const { categories } = useCategories();

  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const refreshKey = from && to ? `${from}-${to}` : "no-range";
  const shouldFetch = from !== null && to !== null;

  const { data: transactions = [], loading: transactionsLoading } =
    useTransactions(
      shouldFetch ? refreshKey : undefined,
      shouldFetch ? from : undefined,
      shouldFetch ? to : undefined,
    );

  const neon = getNeonColor(`${year}-${month?.padStart(2, "0")}`);

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

  // -------------------------
  // FETCH BUDGET
  // -------------------------
  useEffect(() => {
    if (!year || !month) return;

    setLoading(true);

    const paddedMonth = month.padStart(2, "0");
    const monthString = `${year}-${paddedMonth}`;

    fetch(`/api/budget/${monthString}`)
      .then((res) => res.json())
      .then((data) => {
        setBudget(data);
        setLoading(false);
      })
      .catch(() => {
        setBudget(null);
        setLoading(false);
      });
  }, [year, month]);

  // -------------------------
  // SET FROM/TO RANGE
  // -------------------------
  useEffect(() => {
    if (!year || !month) return;

    const paddedMonth = month.padStart(2, "0");
    const monthIndex = Number(month) - 1;
    const lastDay = new Date(Number(year), monthIndex + 1, 0).getDate();

    setFrom(`${year}-${paddedMonth}-01`);
    setTo(`${year}-${paddedMonth}-${String(lastDay).padStart(2, "0")}`);
  }, [year, month]);

  // -------------------------
  // GROUPING
  // -------------------------
  const grouped = categories
    .map((cat) => {
      const items = transactions?.filter((t) => t.category_id === cat.id) ?? [];

      const spent = Number(
        items
          .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
          .toFixed(2),
      );

      const subBudget = budget?.subBudgets?.find(
        (sb) => sb.category_id === cat.id,
      );
      const budgetAmount = subBudget?.amount ?? 0;

      return {
        id: cat.id,
        category_id: cat.id,
        category_name: cat.name,
        category_color: cat.color,
        amount: budgetAmount,
        transactions: items,
        spent,
        remaining: Number((budgetAmount - spent).toFixed(2)),
      };
    })
    .sort((a, b) => b.spent - a.spent);

  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const toggle = (id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ⭐ Donut-transacties (alleen uitgaven)
  const donutTransactions = useMemo(() => {
    const filtered = transactions.filter((t) => t.amount < 0);

    return filtered.map((t) => {
      const cat = categories.find((c) => c.id === t.category_id);
      return {
        ...t,
        category_name: cat?.name ?? "Onbekend",
        category_color: cat?.color ?? "#888",
      };
    });
  }, [transactions, categories]);

  // -------------------------
  // ⭐ BudgetForm state (zoals oude BudgetPage)
  // -------------------------
  const [suggested, setSuggested] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!budget) {
      setSuggested(0);
      setMessage("");
    } else {
      setSuggested(null);
      setMessage("");
    }
  }, [budget]);

  const totalBudget = budget?.total_budget ?? 0;

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <VStack align="stretch" spacing={6} p={6} maxW="900px" mx="auto">
      {/* ⭐ Maand selector */}
      <CollapsibleMonthSelector
        selectedMonth={`${year}-${month?.padStart(2, "0")}`}
        onChange={(value) => {
          if (!value) return;
          const [newYear, newMonth] = value.split("-");
          navigate(`/budget/${newYear}/${newMonth}`);
        }}
      />

      {/* ⭐ Header + BudgetForm */}
      <HStack justify="space-between" align="center" w="100%">
        <VStack align="flex-start" spacing={0}>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            bgGradient={`linear(to-r, ${neon.text}, ${neon.color})`}
            bgClip="text"
          >
            {year}-{month?.padStart(2, "0")}
          </Text>

          <Text fontSize="md" color="gray.400">
            {transactions.length} transacties, {donutTransactions.length}{" "}
            uitgaven
          </Text>
        </VStack>

        {year && month && (
          <BudgetForm
            month={`${year}-${month.padStart(2, "0")}`}
            suggested={suggested}
            message={message}
            onUpdated={async () => {
              const padded = month.padStart(2, "0");
              const monthString = `${year}-${padded}`;

              const res = await fetch(`/api/budget/${monthString}`);
              const data = await res.json();
              setBudget(data);

              setSuggested(null);
              setMessage("");
            }}
          />
        )}
      </HStack>

      <Divider borderColor="whiteAlpha.200" />

      {/* ⭐ Donut + categorie lijst */}
      <HStack align="flex-start" spacing={"75px"}>
        {/* ⭐ Donut */}
        <Box
          position="sticky"
          top="50px"
          zIndex="20"
          bg="transparent"
          flexShrink={0}
          mt={12}
        >
          <PremiumDonut
            transactions={donutTransactions}
            totalBudget={budget?.total_budget ?? 0}
            size={240}
            strokeWidth={32}
            glow={neon.glow}
            hoverCategory={hoverCategory}
            setHoverWithDelay={setHoverWithDelay}
            setIsHoverLocked={() => {}}
          />
        </Box>

        {/* ⭐ Categorie lijst */}
        <VStack
          align="stretch"
          spacing={3}
          w="350px"
          maxH="40vh"
          overflowY="auto"
          pr={2}
          ml={10}
        >
          {loading || transactionsLoading ? (
            <>
              <Skeleton height="80px" />
              <Skeleton height="80px" />
              <Skeleton height="80px" />
            </>
          ) : grouped.length === 0 ? (
            <Text color="gray.500">Geen categorieën beschikbaar.</Text>
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
                  w="100%"
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
