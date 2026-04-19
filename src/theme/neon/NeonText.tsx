// src/theme/neon/NeonText.tsx
import { Text, TextProps } from "@chakra-ui/react";
import { useMemo } from "react";
import { useNeon, useNeonCategory } from "./NeonContext";

type NeonTextProps = TextProps & {
  categoryName?: string;
};

export function NeonText({ categoryName, children, ...rest }: NeonTextProps) {
  const { brandGradient, brandColor } = useNeon();

  // ⭐ Stabiliseer category neon + voorkom fallback als categoryName bestaat
  const catNeon = useMemo(() => {
    if (!categoryName) return null;
    return useNeonCategory(categoryName);
  }, [categoryName]);

  const gradient = catNeon
    ? `linear(to-r, ${catNeon.neonColor}, ${catNeon.neonColor})`
    : brandGradient;

  return (
    <Text
      bgGradient={gradient}
      bgClip="text"
      color={brandColor}
      transition="0.25s ease"
      {...rest}
    >
      {children}
    </Text>
  );
}
