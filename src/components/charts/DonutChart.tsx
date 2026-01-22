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
import { getCategoryName, CATEGORY_MAP } from "@shared/constants/categories";

type DonutChartProps = {
  total: number;
  categories: Record<string, number>;
  transactions: { category_id: number | null }[];
  onReady?: () => void;
};

export function DonutChart({
  total,
  categories,
  transactions,
  onReady,
}: DonutChartProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  const theme = useTheme();
  const colorMode = useColorModeValue("light", "dark");
  const navigate = useNavigate();

  const segmentColors = theme.colors.categories[colorMode];
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(1);
      onReady?.();
    }, 50);
    return () => clearTimeout(timeout);
  }, [onReady]);

  const entries = Object.entries(categories);
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  if (!sorted.length || total === 0) {
    return (
      <VStack gap={2} w="full" align="center">
        <Text fontSize="sm" color="gray.500">
          Geen uitgaven om te tonen.
        </Text>
      </VStack>
    );
  }

  const top = sorted[0];
  const pct = (top[1] / total) * 100;

  // Map category names back to IDs for filtering transactions
  const getCategoryIdByName = (categoryName: string): number | null => {
    for (const [id, name] of Object.entries(CATEGORY_MAP)) {
      if (name === categoryName) {
        return parseInt(id);
      }
    }
    return null;
  };

  const getTxCount = (categoryName: string) => {
    const categoryId = getCategoryIdByName(categoryName);
    return transactions.filter((tx) => tx.category_id === categoryId).length;
  };

  let offset = 0;

  return (
    <HStack
      align="flex-start"
      spacing={4}
      w="full"
      justify="space-between"
      flexWrap="wrap"
    >
      <Box position="relative" w="140px" h="140px" flexShrink={0}>
        <svg width="140" height="140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={trackColor}
            strokeWidth="12"
            fill="none"
          />
          {sorted.map(([name, value]) => {
            const segmentPct = (value / total) * 100;
            const fullDash = (segmentPct / 100) * circumference;
            const dash = fullDash * progress;
            const dashOffset = circumference - offset - dash;
            offset += fullDash;
            const strokeColor = segmentColors[name] || segmentColors["Overig"];

            return (
              <g
                key={name}
                onMouseEnter={() => setHovered(name)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/transactions?category=${encodeURIComponent(name)}`)
                }
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke={strokeColor}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </g>
            );
          })}
        </svg>

        {hovered && (
          <Box
            position="absolute"
            top="0"
            left="50%"
            transform="translateX(-50%)"
            bg="gray.800"
            color="white"
            px={3}
            py={1}
            borderRadius="md"
            fontSize="xs"
            pointerEvents="none"
            whiteSpace="nowrap"
          >
            {hovered}: €{categories[hovered].toFixed(2)} (
            {((categories[hovered] / total) * 100).toFixed(0)}%)
          </Box>
        )}

        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <Text fontSize="lg" fontWeight="bold" color={centerValueColor}>
            {pct.toFixed(0)}%
          </Text>
          <Text fontSize="xs" color={centerLabelColor}>
            {top[0]}
          </Text>
        </Box>
      </Box>
      <Box
        w="160px"
        maxH="180px"
        overflowY="auto"
        pr={1}
        borderRadius="md"
        pb={2}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.600",
            borderRadius: "3px",
          },
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 90%, transparent 100%)",
        }}
      >
        <VStack align="stretch" spacing={1}>
          {sorted.map(([name, value]) => {
            const txCount = getTxCount(name);
            const color = segmentColors[name] || segmentColors["Overig"];

            return (
              <HStack
                key={name}
                justify="space-between"
                px={2}
                py={1}
                borderRadius="md"
                bg={`${color}20`}
                _hover={{ bg: `${color}35` }}
                cursor="pointer"
                onClick={() =>
                  navigate(`/transactions?category=${encodeURIComponent(name)}`)
                }
              >
                <HStack spacing={2}>
                  <Box w="10px" h="10px" borderRadius="3px" bg={color} />
                  <Text fontSize="xs" noOfLines={1}>
                    {name}
                  </Text>
                </HStack>

                <VStack spacing={0} align="end">
                  <Text fontSize="xs">€{value.toFixed(2)}</Text>
                  <Text fontSize="xx-small">{txCount} tx</Text>
                </VStack>
              </HStack>
            );
          })}
        </VStack>
      </Box>
    </HStack>
  );
}
