// PREMIUM DYNAMIC NEON DONUTCHART — HOOK-SAFE + ARC-CORRECT VERSION + OVER-SEGMENT
// -------------------------------------------------------------

import {
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDateFilter } from "@/context/DateFilterContext";

type DonutChartProps = {
  data: { name: string; value: number; category_id: number }[] | undefined;
  onReady?: () => void;
};

export function DonutChart({ data, onReady }: DonutChartProps) {
  // ⭐ HOOKS
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  const theme = useTheme();
  const navigate = useNavigate();
  const { range } = useDateFilter();

  const trackColor = useColorModeValue(
    theme.colors.light.border,
    theme.colors.dark.border,
  );
  const centerValueColor = useColorModeValue(
    theme.colors.light.text,
    theme.colors.dark.text,
  );
  const centerLabelColor = useColorModeValue(
    theme.colors.light.textMuted,
    theme.colors.dark.textMuted,
  );
  const tooltipBg = useColorModeValue("gray.800", "black");

  // ⭐ ANIMATIE
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(1);
      onReady?.();
    }, 50);
    return () => clearTimeout(timeout);
  }, [onReady]);

  // ⭐ DATA
  const safeData = Array.isArray(data) ? [...data] : [];
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const totalSpent = safeData.reduce((sum, item) => sum + item.value, 0);

  if (!safeData.length) {
    return (
      <VStack gap={2} w="full" align="center">
        <Text fontSize="sm" color="gray.500">
          Geen uitgaven om te tonen.
        </Text>
      </VStack>
    );
  }

  // ⭐ BUDGET → OVER / NIET BESTEED
  const budget = 3490; // TODO: dynamisch maken
  const leftover = budget - totalSpent;

  if (leftover > 0) {
    safeData.push({
      name: "Over",
      value: leftover,
      category_id: -1,
    });
  }

  const total = safeData.reduce((sum, item) => sum + item.value, 0);

  // ⭐ SORTERING
  const sortedLegend = [...safeData].sort((a, b) => b.value - a.value); // legenda groot → klein
  const sortedForArcs = [...safeData].sort((a, b) => a.value - b.value); // arcs klein → groot

  const top = sortedLegend[0];
  const pct = (top.value / total) * 100;

  const neonPalette = [
    "#5FFFD4",
    "#6FB7FF",
    "#C68CFF",
    "#FFB38A",
    "#7FFFFF",
    "#FFD966",
    "#FF6F91",
    "#9BFF6F",
    "#6FFFFF",
  ];

  const dynamicNeonMap = Object.fromEntries(
    safeData.map((item, i) => [item.name, neonPalette[i % neonPalette.length]]),
  );

  // ⭐ OFFSET — JOUW FIX (offset -= dash)
  let offset = 0;

  return (
    <HStack
      align="flex-start"
      spacing={4}
      w="full"
      justify="space-between"
      flexWrap="wrap"
    >
      {/* DONUT */}
      <Box position="relative" w="140px" h="140px" flexShrink={0}>
        <Box
          position="absolute"
          top="0"
          left="0"
          w="140px"
          h="140px"
          borderRadius="full"
          overflow="hidden"
          bg="rgba(20,20,20,0.35)"
          backdropFilter="blur(6px)"
        >
          <svg width="140" height="140">
            {/* TRACK */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={trackColor}
              strokeWidth="14"
              fill="none"
              transform="rotate(-90 70 70)"
            />

            {/* ARCS */}
            {sortedForArcs.map((item) => {
              const { name, value, category_id } = item;

              const segmentPct = value / total;
              const dash = segmentPct * circumference * progress;

              const dashOffset = offset;
              offset -= dash; // ⭐ jouw fix

              // ⭐ KLEUR: Over = zwart
              const neon = name === "Over" ? "#000000" : dynamicNeonMap[name];

              return (
                <g
                  key={name}
                  onMouseEnter={() => setHovered(name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    category_id !== -1 &&
                    navigate(
                      `/transactions?category=${category_id}&from=${range.from.toISOString()}&to=${range.to.toISOString()}`,
                    )
                  }
                  style={{
                    cursor: category_id === -1 ? "default" : "pointer",
                    transform: hovered === name ? "scale(1.015)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "transform 0.4s ease, filter 0.4s ease",
                  }}
                >
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={neon}
                    strokeWidth={hovered === name ? "18" : "16"}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeDashoffset={dashOffset}
                    transform="rotate(90 70 70)" // ⭐ jouw fix
                    style={{
                      transition:
                        "stroke-dashoffset 0.8s ease, stroke-width 0.4s ease",
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* CENTER TEXT */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
          >
            <Text
              fontSize="2xl"
              fontWeight="800"
              color={centerValueColor}
              style={{ textShadow: `0 0 6px ${centerValueColor}55` }}
            >
              {pct.toFixed(0)}%
            </Text>
            <Text
              fontSize="sm"
              fontWeight="600"
              opacity={0.8}
              color={centerLabelColor}
            >
              {top.name}
            </Text>
          </Box>
        </Box>

        {/* TOOLTIP */}
        {hovered && (
          <Box
            position="absolute"
            top="-10px"
            left="50%"
            transform="translateX(-50%)"
            bg={tooltipBg}
            color="white"
            px={3}
            py={1}
            borderRadius="md"
            fontSize="xs"
            pointerEvents="none"
            whiteSpace="nowrap"
          >
            {hovered === "Over" ? "Niet besteed" : hovered}: €
            {sortedLegend.find((i) => i.name === hovered)?.value.toFixed(2)} (
            {(
              (sortedLegend.find((i) => i.name === hovered)?.value! / total) *
              100
            ).toFixed(0)}
            %)
          </Box>
        )}
      </Box>

      {/* LEGEND */}
      <Box w="160px" maxH="180px" overflowY="auto" pr={1} pb={2}>
        <VStack align="stretch" spacing={1}>
          {sortedLegend.map((item) => {
            const neon =
              item.name === "Over" ? "#000000" : dynamicNeonMap[item.name];

            return (
              <HStack
                key={item.name}
                justify="space-between"
                px={2}
                py={1}
                borderRadius="md"
                bg="rgba(20,20,20,0.6)"
                border="1px solid rgba(255,255,255,0.05)"
                cursor={item.category_id === -1 ? "default" : "pointer"}
                onClick={() =>
                  item.category_id !== -1 &&
                  navigate(
                    `/transactions?category=${item.category_id}&from=${range.from.toISOString()}&to=${range.to.toISOString()}`,
                  )
                }
              >
                <HStack spacing={2}>
                  <Box
                    w="14px"
                    h="14px"
                    borderRadius="4px"
                    bg={neon}
                    boxShadow={
                      item.name === "Over" ? "none" : `0 0 10px ${neon}`
                    }
                  />
                  <Text fontSize="xs" fontWeight="600" color="white">
                    {item.name === "Over" ? "Niet besteed" : item.name}
                  </Text>
                </HStack>

                <Text fontSize="xs">€{item.value.toFixed(2)}</Text>
              </HStack>
            );
          })}
        </VStack>
      </Box>
    </HStack>
  );
}
