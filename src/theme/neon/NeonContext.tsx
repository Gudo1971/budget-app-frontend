// src/theme/neon/NeonContext.tsx
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useColorMode } from "@chakra-ui/react";
import { getCategoryNeonColor } from "@/hooks/useCategoryNeonColor";

type NeonDepth = 0 | 1 | 2 | 3 | 4;

type NeonTheme = {
  brandColor: string;
  brandAura: string; // ⭐ nieuw
  brandGradient: string;
  getDepthShadow: (depth: NeonDepth) => string;
};

const NeonContext = createContext<NeonTheme | null>(null);

type NeonThemeProviderProps = {
  children: ReactNode;
};

export function NeonThemeProvider({ children }: NeonThemeProviderProps) {
  const { colorMode } = useColorMode();

  const value = useMemo<NeonTheme>(() => {
    // ⭐ Clean premium brand color
    const brandColor = "#00E5FF";

    // ⭐ Clean aura (subtiel, stijl A)
    const brandAura =
      colorMode === "dark"
        ? "0 0 18px rgba(0, 229, 255, 0.25)"
        : "0 0 14px rgba(0, 180, 220, 0.25)";

    const brandGradient = "linear-gradient(135deg, #00E5FF, #4F46E5, #00F6FF)";

    // ⭐ Clean depth shadows (veel subtieler dan oude versie)
    const getDepthShadow = (depth: NeonDepth) => {
      const base =
        colorMode === "dark"
          ? "rgba(0, 229, 255, 0.25)"
          : "rgba(0, 180, 220, 0.25)";

      switch (depth) {
        case 0:
          return "none";
        case 1:
          return `0 0 4px ${base}`;
        case 2:
          return `0 0 6px ${base}, 0 0 10px ${base}`;
        case 3:
          return `0 0 10px ${base}, 0 0 18px ${base}`;
        case 4:
          return `0 0 14px ${base}, 0 0 26px ${base}`;
        default:
          return "none";
      }
    };

    return {
      brandColor,
      brandAura,
      brandGradient,
      getDepthShadow,
    };
  }, [colorMode]);

  return <NeonContext.Provider value={value}>{children}</NeonContext.Provider>;
}

export function useNeon() {
  const ctx = useContext(NeonContext);
  if (!ctx) {
    throw new Error("useNeon must be used within NeonThemeProvider");
  }
  return ctx;
}

// Category neon (infinite engine)
export function useNeonCategory(name: string) {
  return getCategoryNeonColor(name);
}
