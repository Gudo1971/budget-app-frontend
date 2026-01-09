import {
  VStack,
  HStack,
  Text,
  Box,
  Collapse,
  Switch,
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

import { InsightsCarousel } from "@/components/insights/InsightsCarousel";
import { TransactionAnalysisCard } from "@/components/cards/TransactionAnalysisCard";
import { BudgetProgressCard } from "@/components/cards/BudgetProgressCard";
import { CategoryStatsCard } from "@/components/cards/CategoryStatsCard";
import { VasteLastenCard } from "@/components/cards/VasteLastenCard";
import { SavingsGoalCard } from "@/components/cards/SavingsGoalCard";

export type CardKey =
  | "transaction"
  | "budget"
  | "categories"
  | "fixed"
  | "savings";

type HeaderConfig = {
  key: CardKey;
  label: string;
};

const HEADERS: HeaderConfig[] = [
  { key: "transaction", label: "Transacties" },
  { key: "budget", label: "Budgetoverzicht" },
  { key: "categories", label: "Categorie‑trends" },
  { key: "fixed", label: "Vaste lasten" },
  { key: "savings", label: "Spaardoelen" },
];

export default function DashboardInsightsPage() {
  const [order, setOrder] = useState<CardKey[]>([
    "transaction",
    "budget",
    "categories",
    "fixed",
    "savings",
  ]);

  const [enabled, setEnabled] = useState<Record<CardKey, boolean>>({
    transaction: true,
    budget: true,
    categories: true,
    fixed: true,
    savings: true,
  });

  const [openPreview, setOpenPreview] = useState<CardKey | null>(null);

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

  const renderCard = (key: CardKey) => {
    switch (key) {
      case "transaction":
        return (
          <TransactionAnalysisCard
            total={0}
            categories={{}}
            transactions={[]}
          />
        );
      case "budget":
        return <BudgetProgressCard />;
      case "categories":
        return (
          <CategoryStatsCard name="Boodschappen" amount={320} count={12} />
        );
      case "fixed":
        return (
          <VasteLastenCard
            totalPerMonth={214.47}
            insights={[
              { name: "Netflix", amount: 15.99 },
              { name: "Ziggo", amount: 52.5 },
              { name: "Spotify", amount: 9.99 },
            ]}
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
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
    if (openPreview === key) setOpenPreview(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as CardKey);
      const newIndex = order.indexOf(over.id as CardKey);
      setOrder(arrayMove(order, oldIndex, newIndex));
    }
  };

  return (
    <VStack w="full" align="stretch" spacing={6}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((key) => {
            if (!enabled[key]) return null;

            const config = HEADERS.find((h) => h.key === key);
            if (!config) return null;

            return (
              <SortableHeader
                key={key}
                id={key}
                label={config.label}
                isOpen={openPreview === key}
                onTogglePreview={() =>
                  setOpenPreview((prev) => (prev === key ? null : key))
                }
                onToggleEnabled={() => toggleCard(key)}
                neonColor={neonColor}
                monitorGlow={monitorGlow}
              >
                <Collapse in={openPreview === key} animateOpacity>
                  <Box mt={3}>
                    <InsightsCarousel initialSlide={sectionToSlide[key]}>
                      {order
                        .filter((k) => enabled[k])
                        .map((k) => renderCard(k))}
                    </InsightsCarousel>
                  </Box>
                </Collapse>
              </SortableHeader>
            );
          })}
        </SortableContext>
      </DndContext>
    </VStack>
  );
}

/* ---------------------------------------------
   SORTABLE HEADER COMPONENT
---------------------------------------------- */

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
        {/* LEFT SIDE: drag + monitor */}
        <HStack position="absolute" left={0} pl={1} spacing={3} align="center">
          {/* Drag handle */}
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

          {/* Monitor button */}
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

        {/* CENTER: title */}
        <Text fontSize="lg" fontWeight="bold">
          {label}
        </Text>

        {/* RIGHT: toggle */}
        <Box position="absolute" right={0} pr={2}>
          <Switch size="md" onChange={onToggleEnabled} isChecked />
        </Box>
      </HStack>

      {children}
    </Box>
  );
}
