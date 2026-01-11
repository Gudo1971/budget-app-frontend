import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { VStack, Box } from "@chakra-ui/react";
import type { CardKey } from "@/pages/dashboard/DashboardInsights";

type Props = {
  order: CardKey[];
  onChange: (newOrder: CardKey[]) => void;
};

function SortableItem({ id }: { id: CardKey }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "12px",
    borderRadius: "8px",
    background: "#1A202C",
    color: "white",
    cursor: "grab",
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </Box>
  );
}

export function CardOrderEditor({ order, onChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as CardKey);
      const newIndex = order.indexOf(over.id as CardKey);
      onChange(arrayMove(order, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={order as string[]}
        strategy={verticalListSortingStrategy}
      >
        <VStack spacing={3} align="stretch">
          {order.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </VStack>
      </SortableContext>
    </DndContext>
  );
}
