import { VStack, Collapse, Box } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { SortableHeader } from "./components/SortableHeader";
import { BackButton } from "@/components/back-button/BackButton";

// -------------------------------------------------------------
// ⭐ TYPE-SAFE SETTINGS ITEM
// -------------------------------------------------------------
export type SettingsItem = {
  key: string;
  label: string;

  // ⭐ preview-component krijgt props (zoals month)
  preview: React.ComponentType<{ month?: string }>;

  actions?: (helpers: { openPreviewFor: (key: string) => void }) => JSX.Element;
};

// -------------------------------------------------------------
// ⭐ PREMIUM SETTINGS ENGINE
// -------------------------------------------------------------
export function SettingsEngine({
  config,
  month,
}: {
  config: SettingsItem[];
  month?: string;
}) {
  const navigate = useNavigate();

  const [order, setOrder] = useState<string[]>(config.map((c) => c.key));
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(config.map((c) => [c.key, true])),
  );

  const [openPreview, setOpenPreview] = useState<string | null>(null);

  const openPreviewFor = (key: string) => {
    setOpenPreview(key);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      setOrder(arrayMove(order, oldIndex, newIndex));
    }
  };

  // -------------------------------------------------------------
  // ⭐ MODE 2 — PREVIEW OPEN
  // -------------------------------------------------------------
  if (openPreview) {
    const activeItem = config.find((c) => c.key === openPreview);
    if (!activeItem) return null;

    const PreviewComponent = activeItem.preview;

    return (
      <VStack w="full" align="stretch" spacing={6}>
        <BackButton />

        <SortableHeader
          key={activeItem.key}
          id={activeItem.key}
          label={activeItem.label}
          isOpen={true}
          onTogglePreview={() => setOpenPreview(null)}
          onToggleEnabled={() =>
            setEnabled((prev) => ({
              ...prev,
              [activeItem.key]: !prev[activeItem.key],
            }))
          }
          openPreviewFor={openPreviewFor}
          actions={activeItem.actions?.({ openPreviewFor })}
        >
          <Collapse in={true} animateOpacity>
            <Box mt={3}>
              {/* ⭐ month wordt nu doorgegeven */}
              <PreviewComponent month={month} />
            </Box>
          </Collapse>
        </SortableHeader>
      </VStack>
    );
  }

  // -------------------------------------------------------------
  // ⭐ MODE 1 — ALLE TEGELS
  // -------------------------------------------------------------
  return (
    <VStack w="full" align="stretch" spacing={6}>
      <BackButton />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((key: string) => {
            if (!enabled[key]) return null;

            const item = config.find((c) => c.key === key);
            if (!item) return null;

            return (
              <SortableHeader
                key={key}
                id={key}
                label={item.label}
                isOpen={false}
                onTogglePreview={() => setOpenPreview(key)}
                onToggleEnabled={() =>
                  setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                openPreviewFor={openPreviewFor}
                actions={item.actions?.({ openPreviewFor })}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </VStack>
  );
}
