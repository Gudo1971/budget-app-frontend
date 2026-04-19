// src/theme/neon/NeonBadge.tsx
import { Badge, BadgeProps } from "@chakra-ui/react";
import { useNeon, useNeonCategory } from "./NeonContext";

type NeonBadgeProps = BadgeProps & {
  categoryName?: string;
};

export function NeonBadge({ categoryName, children, ...rest }: NeonBadgeProps) {
  const { brandColor, brandAura } = useNeon();

  // Dynamische neon kleur (infinite engine)
  const catNeon = categoryName ? useNeonCategory(categoryName) : null;

  const color = catNeon?.neonColor ?? brandColor;
  const aura = catNeon?.aura ?? brandAura;

  return (
    <Badge
      px={2}
      py={0.5}
      borderRadius="md"
      bg={`${color}22`}
      color={color}
      border={`1px solid ${color}55`}
      boxShadow={`0 0 6px ${color}55`}
      fontSize="xs"
      transition="0.25s ease"
      _hover={{
        boxShadow: `0 0 10px ${color}, 0 0 18px ${color}`,
        transform: "scale(1.03)",
      }}
      {...rest}
    >
      {children}
    </Badge>
  );
}
