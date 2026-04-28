// src/features/budget/components/SubBudgetHeader.tsx
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

interface SubBudgetHeaderProps {
  sb: any;
  isOpen: boolean;
  isHovered: boolean;
  bg: string;
  border: string;
  neon: { color: string };
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SubBudgetHeader({
  sb,
  isOpen,
  isHovered,
  bg,
  border,
  neon,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}: SubBudgetHeaderProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      px={4}
      py={3}
      borderBottom="1px solid"
      borderColor={isHovered ? neon.color : border}
      bg={isHovered ? "rgba(255,255,255,0.06)" : bg}
      borderRadius="lg"
      cursor="pointer"
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      transition="0.2s"
    >
      <Flex direction="column">
        <Text fontWeight="bold" color="white">
          {sb.category_name}
        </Text>
        <Text fontSize="sm" color="gray.400">
          €{sb.amount?.toFixed(2) ?? "0.00"}
        </Text>
      </Flex>

      <IconButton
        aria-label="toggle"
        icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        size="sm"
        variant="ghost"
        color={isHovered ? neon.color : "gray.300"}
      />
    </Flex>
  );
}
