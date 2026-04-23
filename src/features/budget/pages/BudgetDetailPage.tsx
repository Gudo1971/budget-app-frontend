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
import { useEffect, useState } from "react";
import { getNeonColor } from "@/hooks/getNeonColor";
import { useTransactions } from "@/hooks/useTransactions";

// ⭐ PREMIUM DONUT MET TOOLTIP
function PremiumDonut({
  transactions,
  size = 280,
  strokeWidth = 32,
  glow = "rgba(255,255,255,0.25)",
}: {
  transactions: { amount: number; category_id: number | null }[];
  size?: number;
  strokeWidth?: number;
  glow?: string;
}) {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    label: string;
    amount: number;
    percentage: number;
  } | null>(null);

  const expenses = transactions.filter((t) => t.amount < 0);
  const total = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <Box
        w={size}
        h={size}
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        opacity={0.3}
      >
        <Text color="gray.500">Geen uitgaven</Text>
      </Box>
    );
  }

  const categories = expenses.reduce<Record<number, number>>((acc, t) => {
    const id = t.category_id ?? -1;
    acc[id] = (acc[id] ?? 0) + Math.abs(t.amount);
    return acc;
  }, {});

  let offset = 0;

  const segments = Object.entries(categories).map(([catId, amount]) => {
    const value = amount / total;
    const length = value * circumference;

    const segment = {
      catId: Number(catId),
      amount,
      percentage: value * 100,
      length,
      offset,
    };

    offset += length;
    return segment;
  });

  return (
    <Box
      w={size}
      h={size}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      boxShadow={`0 0 45px ${glow}`}
    >
      <svg
        width={size}
        height={size}
        onMouseLeave={() => setHover(null)}
        style={{ cursor: "pointer" }}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={`hsl(${(s.catId * 47) % 360}, 90%, 60%)`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${s.length} ${circumference}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${glow})`,
                transition: "0.2s",
                opacity: hover
                  ? hover.label === String(s.catId)
                    ? 1
                    : 0.35
                  : 1,
              }}
              onMouseMove={(e) => {
                const rect = (e.target as SVGElement).getBoundingClientRect();
                setHover({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  label: String(s.catId),
                  amount: s.amount,
                  percentage: s.percentage,
                });
              }}
            />
          ))}
        </g>
      </svg>

      {/* ⭐ Tooltip */}
      {hover && (
        <Box
          position="absolute"
          top={hover.y - 50}
          left={hover.x}
          transform="translate(-50%, -100%)"
          px={3}
          py={2}
          borderRadius="md"
          bg="rgba(0,0,0,0.75)"
          color="white"
          fontSize="sm"
          whiteSpace="nowrap"
          pointerEvents="none"
          boxShadow={`0 0 12px ${glow}`}
          border="1px solid rgba(255,255,255,0.2)"
        >
          <Text fontWeight="bold">Categorie {hover.label}</Text>
          <Text>€{hover.amount.toFixed(2)}</Text>
          <Text>{hover.percentage.toFixed(0)}%</Text>
        </Box>
      )}
    </Box>
  );
}

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

  const grouped =
    budget?.subBudgets.map((sb) => {
      const items =
        transactions?.filter((t) => t.category_id === sb.category_id) ?? [];

      const spent = items.reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return {
        ...sb,
        transactions: items,
        spent,
        remaining: sb.amount - spent,
      };
    }) ?? [];

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

    const fromDate = `${year}-${rawMonth}-01`;
    const toDate = `${year}-${rawMonth}-${String(lastDay).padStart(2, "0")}`;

    setFrom(fromDate);
    setTo(toDate);
  }, [budget]);

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

        <Box
          p={2}
          borderRadius="md"
          bg={bg}
          border="1px solid"
          borderColor={border}
          cursor="pointer"
        >
          <Text fontSize="sm" color="gray.300">
            Instellingen
          </Text>
        </Box>
      </HStack>

      <Divider borderColor="whiteAlpha.200" />

      <HStack align="flex-start" spacing={8}>
        {/* ⭐ PREMIUM DONUT MET TOOLTIP */}
        <PremiumDonut
          transactions={transactions}
          size={280}
          strokeWidth={32}
          glow={neon.glow}
        />

        {/* ⭐ SUBBUDGET LIST */}
        <VStack align="stretch" spacing={4} flex="1">
          {loading || transactionsLoading ? (
            <Skeleton height="40px" />
          ) : (
            grouped.map((sb) => {
              const isOpen = openMap[sb.id] ?? false;

              return (
                <Box
                  key={sb.id}
                  p={4}
                  borderRadius="lg"
                  bg={bg}
                  border="1px solid"
                  borderColor={border}
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
                        Uitgegeven: €{sb.spent} — Resterend: €{sb.remaining}
                      </Text>
                    </VStack>

                    <HStack spacing={3}>
                      <Text color="gray.400">€{sb.amount}</Text>

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
                          <Text color="gray.400">€{t.amount}</Text>
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
