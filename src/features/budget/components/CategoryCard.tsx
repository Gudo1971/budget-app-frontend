// src/features/budget/components/CategoryList/CategoryCard.tsx
import { Box } from "@chakra-ui/react";
import { SubBudgetHeader } from "./SubBudgetHeader";
interface CategoryCardProps {
  sb: any;
  isOpen: boolean;
  isHovered: boolean;
  bg: string;
  border: string;
  neon: { color: string };
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

export function CategoryCard({
  sb,
  isOpen,
  isHovered,
  bg,
  border,
  neon,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  children,
}: CategoryCardProps) {
  return (
    <Box
      p={0}
      borderRadius="lg"
      border="1px solid"
      borderColor={isHovered ? neon.color : border}
      bg={isHovered ? "rgba(255,255,255,0.08)" : bg}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      transition="0.2s"
      w="100%"
    >
      <SubBudgetHeader
        sb={sb}
        isOpen={isOpen}
        isHovered={isHovered}
        bg={bg}
        border={border}
        neon={neon}
        onToggle={onToggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      {children}
    </Box>
  );
}
