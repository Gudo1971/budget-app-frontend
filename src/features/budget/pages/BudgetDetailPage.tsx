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

// --------------------------------------------------
// CATEGORY META
// --------------------------------------------------

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  Boodschappen: { emoji: "🛒", color: "#FF4D4D" },
  Horeca: { emoji: "🍽️", color: "#FFD93D" },
  "Persoonlijke verzorging": { emoji: "🧴", color: "#4DFF88" },
  Vervoer: { emoji: "🚌", color: "#6B9FFF" },
  Gezondheid: { emoji: "💊", color: "#A78BFA" },
  Abonnementen: { emoji: "🔄", color: "#FF8C42" },
  Woonkosten: { emoji: "🏠", color: "#2DD4BF" },
  Shopping: { emoji: "🛍️", color: "#FF69B4" },
  Kinderen: { emoji: "🧸", color: "#FB923C" },
  Telecom: { emoji: "📱", color: "#FBBF24" },
  Uitjes: { emoji: "🎉", color: "#F472B6" },
  Inkomen: { emoji: "💶", color: "#34D399" },
  Overig: { emoji: "✨", color: "#C084FC" },
};

// --------------------------------------------------
// PREMIUM DONUT (met hover‑delay + hover‑lock)
// --------------------------------------------------
function PremiumDonut({
  transactions,
  size = 280,
  strokeWidth = 32,
  glow = "rgba(255,255,255,0.25)",
  hoverCategory,
  setHoverCategory,
  setIsHoverLocked,
}: {
  transactions: {
    amount: number;
    category_id: number | null;
    category_name?: string;
  }[];
  size?: number;
  strokeWidth?: number;
  glow?: string;
  hoverCategory: number | null;
  setHoverCategory: (id: number | null) => void;
  setIsHoverLocked: (v: boolean) => void;
}) {
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // 1) GROEPEN OP CATEGORY_ID
  const grouped = new Map<
    number,
    { name: string; amount: number; emoji: string; color: string }
  >();

  for (const t of expenses) {
    if (t.category_id == null) continue;

    const name = t.category_name ?? "Onbekend";
    const meta = CATEGORY_META[name] ?? { emoji: "❓", color: "#888" };

    const current = grouped.get(t.category_id) ?? {
      name,
      amount: 0,
      emoji: meta.emoji,
      color: meta.color,
    };

    current.amount += Math.abs(t.amount);
    grouped.set(t.category_id, current);
  }

  // 2) SORTEREN VOOR PERCENTAGES (hoog → laag)
  const sorted = Array.from(grouped.entries()).sort(
    (a, b) => b[1].amount - a[1].amount,
  );

  // Palet met contrasterende kleuren
  const colorPalette = [
    "#FF4D4D", // Rood
    "#4DFF88", // Groen
    "#6B9FFF", // Blauw
    "#FFD93D", // Geel
    "#FF69B4", // Roze
    "#A78BFA", // Paars
    "#2DD4BF", // Cyaan
    "#FF8C42", // Oranje
    "#34D399", // Zeegroen
    "#FBBF24", // Goud
    "#F472B6", // Magenta
    "#C084FC", // Lichtpaars
  ];

  // 3) SEGMENTEN MAKEN met afwisselende kleuren voor contrast
  let offset = 0;
  const segments = sorted.map(([category_id, data], index) => {
    const value = data.amount / total;
    const length = value * circumference;

    // Gebruik de originele kleur uit CATEGORY_META, of val terug op palet
    const baseColor = data.color;
    // Als we meer dan 1 segment hebben, gebruik palet voor betere spreiding
    const color =
      sorted.length > 1 ? colorPalette[index % colorPalette.length] : baseColor;

    const seg = {
      category_id,
      name: data.name,
      emoji: data.emoji,
      color,
      amount: Number(data.amount.toFixed(2)),
      percentage: Number((value * 100).toFixed(1)),
      length,
      offset,
    };

    offset += length;
    return seg;
  });

  // 4) Berekenen welk segment op een hoek zit
  const getSegmentAtAngle = (mouseX: number, mouseY: number) => {
    const centerX = size / 2;
    const centerY = size / 2;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;

    // Bereken de hoek (in radialen, dan naar graden)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Normaliseer naar 0-360 en compenseer voor de -90 graden rotatie
    angle = (angle + 90 + 360) % 360;

    // Converteer naar circumference positie
    const position = (angle / 360) * circumference;

    // Vind het segment op deze positie
    for (const seg of segments) {
      const segmentEnd = seg.offset + seg.length;
      if (position >= seg.offset && position < segmentEnd) {
        return seg.category_id;
      }
    }

    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const categoryId = getSegmentAtAngle(mouseX, mouseY);

    if (categoryId !== null && categoryId !== hoverCategory) {
      setIsHoverLocked(true);
      clearTimeout(hoverTimeout.current!);
      hoverTimeout.current = setTimeout(() => {
        setHoverCategory(categoryId);
      }, 80);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current!);
    setIsHoverLocked(false);
    setHoverCategory(null);
  };

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
        style={{ cursor: "pointer" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((s) => {
            const active = hoverCategory === s.category_id;

            return (
              <circle
                key={s.category_id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={s.color}
                strokeWidth={active ? strokeWidth * 1.1 : strokeWidth}
                strokeDasharray={`${s.length} ${circumference}`}
                strokeDashoffset={-s.offset}
                strokeLinecap="round"
                style={{ pointerEvents: "none" }}
              />
            );
          })}
        </g>
      </svg>

      {/* CENTER LABEL */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
        pointerEvents="none"
      >
        {!hoverCategory && (
          <VStack spacing={0}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              €{total.toFixed(2)}
            </Text>
            <Text fontSize="sm" color="gray.400">
              Totaal budget
            </Text>
          </VStack>
        )}

        {hoverCategory &&
          (() => {
            const seg = segments.find((s) => s.category_id === hoverCategory);
            if (!seg) return null;

            return (
              <VStack spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                  {seg.emoji} {seg.name}
                </Text>
                <Text fontSize="md" color="gray.300">
                  €{seg.amount.toFixed(2)} ({seg.percentage}%)
                </Text>
              </VStack>
            );
          })()}
      </Box>
    </Box>
  );
}

// --------------------------------------------------
// MAIN PAGE
// --------------------------------------------------

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

  // ⭐ HOVER STATE + LOCK
  const [hoverCategory, setHoverCategory] = useState<number | null>(null);
  const [isHoverLocked, setIsHoverLocked] = useState(false);

  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // ⭐ SMOOTH SCROLL (alleen bij donut-hover)
  useEffect(() => {
    if (!hoverCategory) return;
    if (!isHoverLocked) return;

    const el = itemRefs.current[hoverCategory];
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    const fullyVisible =
      rect.top >= parentRect.top && rect.bottom <= parentRect.bottom;

    if (fullyVisible) return;

    const timeout = setTimeout(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [hoverCategory, isHoverLocked]);

  // ⭐ BUDGET OPHALEN
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

  // ⭐ from/to berekenen
  useEffect(() => {
    if (!budget?.month) return;

    const [year, rawMonth] = budget.month.split("-");
    const monthIndex = Number(rawMonth) - 1;
    const lastDay = new Date(Number(year), monthIndex + 1, 0).getDate();

    setFrom(`${year}-${rawMonth}-01`);
    setTo(`${year}-${rawMonth}-${String(lastDay).padStart(2, "0")}`);
  }, [budget?.month]);

  // ⭐ GROUPING + SORTERING HOOG → LAAG
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

  // UI
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const toggle = (id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <VStack align="stretch" spacing={6} p={6}>
      {/* HEADER */}
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

      {/* MAIN LAYOUT */}
      <HStack align="flex-start" spacing={8}>
        {/* LEFT: DONUT */}
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
            setHoverCategory={setHoverCategory}
            setIsHoverLocked={setIsHoverLocked}
          />
        </Box>

        {/* RIGHT: LIST */}
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
                  onMouseEnter={() => {
                    setIsHoverLocked(true);
                    setHoverCategory(sb.category_id);
                  }}
                  onMouseLeave={() => {
                    setIsHoverLocked(false);
                    setHoverCategory(null);
                  }}
                  transition="0.2s"
                >
                  {/* CATEGORY HEADER */}
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

                  {/* COLLAPSE */}
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
