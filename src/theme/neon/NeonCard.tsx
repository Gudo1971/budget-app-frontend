// src/theme/neon/NeonCard.tsx
import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useNeon, useNeonCategory } from "./NeonContext";

type NeonCardProps = BoxProps & {
  children: ReactNode;
  depth?: 0 | 1 | 2 | 3 | 4;
  categoryName?: string;
};

export function NeonCard({
  children,
  depth = 2,
  categoryName,
  ...rest
}: NeonCardProps) {
  const { brandColor, brandAura, getDepthShadow } = useNeon();
  const bg = useColorModeValue("rgba(255,255,255,0.06)", "rgba(0,0,0,0.35)");
  const hoverBg = useColorModeValue(
    "rgba(255,255,255,0.12)",
    "rgba(0,0,0,0.55)",
  );

  // Always call hook
  const catNeon = useNeonCategory(categoryName ?? "");

  // NEW ENGINE
  const color = categoryName ? catNeon.neonColor : brandColor;
  const aura = categoryName ? catNeon.aura : brandAura;

  return (
    <Box
      borderRadius="lg"
      bg={bg}
      border={`1px solid ${color}55`}
      boxShadow={`${getDepthShadow(depth)}, 0 0 10px ${color}33`}
      p={4}
      transition="0.25s ease"
      _hover={{
        bg: hoverBg,
        transform: "scale(1.02)",
        boxShadow: `
          ${getDepthShadow(
            (depth + 1 > 4 ? 4 : depth + 1) as 0 | 1 | 2 | 3 | 4,
          )},
          0 0 14px ${color},
          0 0 28px ${color}
        `,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
