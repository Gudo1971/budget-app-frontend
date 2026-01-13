import {
  VStack,
  HStack,
  Text,
  Box,
  Collapse,
  Switch,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiMonitor } from "react-icons/fi";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { InsightsCarousel } from "@/features/insights/components/InsightsCarousel";
import { TransactionAnalysisCard } from "@/features/dashboard/components/TransactionAnalysisCard";
import { BudgetProgressCard } from "@/features/dashboard/components/BudgetProgressCard";
import { CategoryStatsCard } from "@/features/dashboard/components/CategoryStatsCard";
import { VasteLastenCard } from "@/features/dashboard/components/VasteLastenCard";
import { SavingsGoalCard } from "@/features/dashboard/components/SavingsGoalCard";
import { calculateRealisticStress } from "@/lib/ai/realisticInsights";

import { useTransactions } from "@/features/transactions/shared/hooks/useTransactions";

export type CardKey =
  | "transaction"
  | "budget"
  | "categories"
  | "fixed"
  | "savings";

const HEADERS = [
  { key: "transaction", label: "Transacties" },
  { key: "budget", label: "Budgetoverzicht" },
  { key: "categories", label: "Categorie‑trends" },
  { key: "fixed", label: "Vaste lasten" },
  { key: "savings", label: "Spaardoelen" },
];

export default function DashboardInsightsPage() {
  const { data: transactions = [] } = useTransactions();

  const uiTransactions = transactions.map((t) => ({
    ...t,
    id: String(t.id),
    category: t.category?.name?.toLowerCase().trim() || "onbekend",
  }));

  const categories = uiTransactions.reduce<Record<string, number>>((acc, t) => {
    const cat = t.category;
    const amount = Math.abs(Number(t.amount));

    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += amount;

    return acc;
  }, {});

  const entries = Object.entries(categories) as [string, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const categoryStats = sorted.map(([name, amount]) => ({
    name,
    amount,
    count: uiTransactions.filter((t) => t.category === name).length,
  }));

  const FIXED_COST_CATEGORY_IDS = ["wonen", "abonnementen", "zorg"];

  const fixedCostTransactions = uiTransactions.filter((t) =>
    FIXED_COST_CATEGORY_IDS.includes(t.category)
  );

  const fixedCosts = fixedCostTransactions.reduce(
    (sum, t) => sum + Math.abs(Number(t.amount)),
    0
  );

  const fixedCostBreakdown = fixedCostTransactions.map((t) => ({
    name: t.category,
    amount: Math.abs(Number(t.amount)),
  }));

  const [cardOrder, setCardOrder] = useState<CardKey[]>([
    "transaction",
    "budget",
    "categories",
    "fixed",
    "savings",
  ]);

  const [cardSettings, setCardSettings] = useState<Record<CardKey, boolean>>({
    transaction: true,
    budget: true,
    categories: true,
    fixed: true,
    savings: true,
  });

  const [openPreviewFor, setOpenPreviewFor] = useState<CardKey | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const neonColor = "#00C8FF";
  const monitorGlow = useColorModeValue(
    "0 0 10px rgba(0, 120, 180, 0.7)",
    "0 0 10px rgba(0, 200, 255, 0.7)"
  );

  const sectionToSlide: Record<CardKey, number> = {
    transaction: 0,
    budget: 1,
    categories: 2,
    fixed: 3,
    savings: 4,
  };
  // ⭐ Totale uitgaven
  const spent = uiTransactions.reduce(
    (sum, t) => sum + Math.abs(Number(t.amount) || 0),
    0
  );

  // ⭐ Tijdelijke budgetwaarde (later dynamisch)
  const budget = 1500;

  // ⭐ Datumgegevens
  const today = new Date();
  const daysPassed = today.getDate();
  const daysInPeriod = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // ⭐ Stress-score berekenen (0–100)

  const stressPercentage = Math.round(
    calculateRealisticStress({
      budget,
      spent,
      daysPassed,
      daysInPeriod,
      fixedCosts,
    }) * 100
  );

  const renderCard = (key: CardKey) => {
    switch (key) {
      case "transaction":
        return (
          <TransactionAnalysisCard
            total={uiTransactions.reduce(
              (sum, t) => sum + Math.abs(Number(t.amount) || 0),
              0
            )}
            categories={categories}
            transactions={uiTransactions}
            stressScore={stressPercentage} // ← jouw berekende stress
            sortedCategories={sorted} // ← jouw gesorteerde categorieën
            budget={budget} // ← totaal budget
            spent={spent} // ← totaal uitgegeven
            daysPassed={daysPassed} // ← dagen voorbij
            daysInPeriod={daysInPeriod} // ← totaal aantal dagen
          />
        );

      case "budget":
        return <BudgetProgressCard />;

      case "categories":
        return <CategoryStatsCard stats={categoryStats} />;

      case "fixed":
        return (
          <VasteLastenCard
            totalPerMonth={fixedCosts}
            insights={fixedCostBreakdown}
            onOpenOverview={() => {}}
          />
        );

      case "savings":
        return <SavingsGoalCard />;

      default:
        return null;
    }
  };

  const toggleCard = (key: CardKey) => {
    setCardSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    if (openPreviewFor === key) setOpenPreviewFor(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = cardOrder.indexOf(active.id as CardKey);
      const newIndex = cardOrder.indexOf(over.id as CardKey);
      setCardOrder(arrayMove(cardOrder, oldIndex, newIndex));
    }
  };

  return (
    <VStack w="full" align="stretch" spacing={8}>
      <Heading size="lg">Inzichten</Heading>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => setOpenPreviewFor(null)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cardOrder}
          strategy={verticalListSortingStrategy}
        >
          <VStack w="full" align="stretch" spacing={4}>
            {cardOrder.map((key) => {
              if (!cardSettings[key]) return null;

              const config = HEADERS.find((h) => h.key === key);
              if (!config) return null;

              return (
                <SortableHeader
                  key={key}
                  id={key}
                  label={config.label}
                  isOpen={openPreviewFor === key}
                  onTogglePreview={() =>
                    setOpenPreviewFor((prev) => (prev === key ? null : key))
                  }
                  onToggleEnabled={() => toggleCard(key)}
                  neonColor={neonColor}
                  monitorGlow={monitorGlow}
                >
                  <Collapse in={openPreviewFor === key} animateOpacity>
                    <Box mt={3}>
                      <InsightsCarousel initialSlide={sectionToSlide[key]}>
                        {cardOrder
                          .filter((k) => cardSettings[k])
                          .map((k) => (
                            <Box key={k}>{renderCard(k)}</Box>
                          ))}
                      </InsightsCarousel>
                    </Box>
                  </Collapse>
                </SortableHeader>
              );
            })}
          </VStack>
        </SortableContext>
      </DndContext>
    </VStack>
  );
}

function SortableHeader({
  id,
  label,
  isOpen,
  onTogglePreview,
  onToggleEnabled,
  neonColor,
  monitorGlow,
  children,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <HStack
        w="full"
        py={2}
        px={1}
        justify="center"
        position="relative"
        borderRadius="md"
        bg={isOpen ? "whiteAlpha.100" : "transparent"}
      >
        <HStack position="absolute" left={0} pl={1} spacing={3} align="center">
          <Box
            fontSize="20px"
            opacity={0.6}
            cursor="grab"
            userSelect="none"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </Box>

          <Box
            as="button"
            onClick={onTogglePreview}
            borderRadius="full"
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.18s ease"
            boxShadow={isOpen ? monitorGlow : "none"}
            _hover={{
              transform: "scale(1.08)",
              boxShadow: "0 0 14px rgba(0, 200, 255, 0.9)",
            }}
            _active={{
              transform: "scale(0.95)",
              boxShadow: "0 0 18px rgba(0, 200, 255, 1)",
            }}
            color={neonColor}
            filter="drop-shadow(0 0 2px rgba(0,0,0,0.25))"
          >
            <FiMonitor size={18} />
          </Box>
        </HStack>

        <Text fontSize="lg" fontWeight="bold">
          {label}
        </Text>

        <Box position="absolute" right={0} pr={2}>
          <Switch size="md" isChecked onChange={onToggleEnabled} />
        </Box>
      </HStack>

      {children}
    </Box>
  );
}
