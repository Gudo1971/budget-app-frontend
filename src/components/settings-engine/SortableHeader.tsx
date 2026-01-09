import { HStack, Text, Box, Switch, Tooltip } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMonitor } from "react-icons/fi";

export type SortableHeaderProps = {
  id: string;
  label: string;
  isOpen: boolean;
  onTogglePreview: () => void;
  onToggleEnabled: () => void;
  actions?: ReactNode;
  openPreviewFor: (key: string) => void;
  shouldBlink?: boolean; // ⭐ nieuw
  children?: ReactNode;
};

export function SortableHeader({
  id,
  label,
  isOpen,
  onTogglePreview,
  onToggleEnabled,
  actions,
  shouldBlink = false,
  children,
}: SortableHeaderProps) {
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

  const blinkStyle = shouldBlink
    ? {
        animation: "blink 0.8s ease-in-out 2",
      }
    : {};

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        "@keyframes blink": {
          "0%": { opacity: 1 },
          "50%": { opacity: 0.2 },
          "100%": { opacity: 1 },
        },
      }}
    >
      <HStack
        w="full"
        py={2}
        px={1}
        justify="center"
        position="relative"
        borderRadius="md"
      >
        {/* LEFT: drag + preview */}
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

          {/* Preview button + tooltip + blink */}
          <Tooltip
            label="Open / sluit preview"
            placement="right"
            openDelay={300}
          >
            <Box
              as="button"
              onClick={onTogglePreview}
              borderRadius="full"
              p={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#00C8FF"
              sx={blinkStyle} // ⭐ blink hier
            >
              <FiMonitor size={18} />
            </Box>
          </Tooltip>
        </HStack>

        {/* CENTER: title */}
        <Text fontSize="lg" fontWeight="bold">
          {label}
        </Text>

        {/* RIGHT: actions */}
        <Box position="absolute" right={50} pr={2}>
          {actions}
        </Box>

        {/* RIGHT: toggle */}
        <Box position="absolute" right={0} pr={2}>
          <Switch size="md" onChange={onToggleEnabled} isChecked={isOpen} />
        </Box>
      </HStack>

      {children}
    </Box>
  );
}
