// src/components/PremiumDonut.tsx
import { Box, Text, VStack } from "@chakra-ui/react";
import { useRef } from "react";
import { useDonutSegments } from "@/hooks/useDonutSegments";

type DonutTransaction = {
  amount: number;
  category_id: number | null;
  category_name?: string;
};

type PremiumDonutProps = {
  transactions: DonutTransaction[];
  size?: number;
  strokeWidth?: number;
  glow?: string;
  hoverCategory: number | null;
  setHoverWithDelay: (id: number | null) => void;
  setIsHoverLocked: (v: boolean) => void;
};

export function PremiumDonut({
  transactions,
  size = 280,
  strokeWidth = 32,
  glow = "rgba(255,255,255,0.25)",
  hoverCategory,
  setHoverWithDelay,
  setIsHoverLocked,
}: PremiumDonutProps) {
  const { segments, total, radius, circumference } = useDonutSegments(
    transactions,
    size,
    strokeWidth,
  );

  const svgRef = useRef<SVGSVGElement | null>(null);

  if (total === 0 || segments.length === 0) {
    return (
      <Box
        w={size}
        h={size}
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        opacity={0.3}
      >
        <Text color="gray.500">Geen uitgaven</Text>
      </Box>
    );
  }

  const getSegmentAtAngle = (mouseX: number, mouseY: number) => {
    const centerX = size / 2;
    const centerY = size / 2;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;

    const position = (angle / 360) * circumference;

    for (const seg of segments) {
      const segmentEnd = seg.offset + seg.length;
      if (position >= seg.offset && position < segmentEnd) {
        return seg.category_id;
      }
    }

    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const categoryId = getSegmentAtAngle(mouseX, mouseY);
    setIsHoverLocked(true);
    setHoverWithDelay(categoryId);
  };

  const handleMouseLeave = () => {
    setIsHoverLocked(false);
    setHoverWithDelay(null);
  };

  const activeSegment = hoverCategory
    ? segments.find((s) => s.category_id === hoverCategory)
    : null;

  return (
    <Box
      w={size}
      h={size}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      boxShadow={`0 0 45px ${glow}`}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        style={{ cursor: "pointer" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((s) => {
            const active = hoverCategory === s.category_id;

            return (
              <circle
                key={s.category_id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={s.color}
                strokeWidth={active ? strokeWidth * 1.1 : strokeWidth}
                strokeDasharray={`${s.length} ${circumference}`}
                strokeDashoffset={-s.offset}
                strokeLinecap="round"
                style={{ pointerEvents: "none" }}
              />
            );
          })}
        </g>
      </svg>

      {/* CENTER LABEL */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
        pointerEvents="none"
      >
        {!activeSegment && (
          <VStack spacing={0}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              €{total.toFixed(2)}
            </Text>
            <Text fontSize="sm" color="gray.400">
              Totaal budget
            </Text>
          </VStack>
        )}

        {activeSegment && (
          <VStack spacing={0}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              {activeSegment.emoji} {activeSegment.name}
            </Text>
            <Text fontSize="md" color="gray.300">
              €{activeSegment.amount.toFixed(2)} ({activeSegment.percentage}%)
            </Text>
          </VStack>
        )}
      </Box>
    </Box>
  );
}
