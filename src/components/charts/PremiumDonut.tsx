// src/components/PremiumDonut.tsx
import { Box, Text, VStack } from "@chakra-ui/react";
import { useRef, useEffect, useLayoutEffect } from "react";
import { useDonutSegments } from "@/hooks/useDonutSegments";
interface PremiumDonutProps {
  transactions: {
    amount: number;
    category_id: number | null;
    category_name?: string;
    emoji?: string;
    name?: string;
    percentage?: number;
  }[];
  totalBudget?: number;
  size?: number;
  strokeWidth?: number;
  glow?: string;
  hoverCategory: number | null;
  setHoverWithDelay: (id: number | null) => void;

  isHoverLocked: boolean;
}

type DonutTransaction = {
  amount: number;
  category_id: number | null;
  category_name?: string;
};

export function PremiumDonut({
  transactions,
  totalBudget,
  size = 280,
  strokeWidth = 32,
  glow = "rgba(255,255,255,0.25)",
  hoverCategory,
  setHoverWithDelay,

  isHoverLocked,
}: PremiumDonutProps) {
  const { segments, total, radius, circumference } = useDonutSegments(
    transactions,
    size,
    strokeWidth,
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  // ⭐ Maak een unieke key voor de SVG op basis van alle segment data
  const svgKey = segments
    .map((s) => `${s.category_id}:${s.amount}:${s.length.toFixed(2)}`)
    .join("|");

  // ⭐ FORCEER SVG UPDATE via direct DOM manipulation + HIGHLIGHTING
  useLayoutEffect(() => {
    const g = gRef.current;
    if (!g) return;

    // Verwijder alle oude circles
    while (g.firstChild) {
      g.removeChild(g.firstChild);
    }

    // Maak nieuwe circles
    segments.forEach((s) => {
      const isHighlighted = hoverCategory === s.category_id;

      if (isHighlighted) {
        console.log(
          "✨ Highlighting segment:",
          s.category_id,
          s.name,
          "hoverCategory:",
          hoverCategory,
        );
      }

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", String(size / 2));
      circle.setAttribute("cy", String(size / 2));
      circle.setAttribute("r", String(radius));
      circle.setAttribute("fill", "transparent");
      circle.setAttribute("stroke", s.color);
      circle.setAttribute(
        "stroke-width",
        String(isHighlighted ? strokeWidth + 4 : strokeWidth),
      );
      circle.setAttribute("stroke-dasharray", `${s.length} ${circumference}`);
      circle.setAttribute("stroke-dashoffset", String(-s.offset));
      circle.setAttribute("stroke-linecap", "round");
      circle.style.pointerEvents = "none";
      circle.style.transition = "stroke-width 0.2s ease, filter 0.2s ease";

      if (isHighlighted) {
        circle.style.filter = `drop-shadow(0 0 8px ${s.color}) drop-shadow(0 0 16px ${s.color})`;
      }

      g.appendChild(circle);
    });

    console.log("✨ DOM: Created", segments.length, "circles");
  }, [segments, size, radius, strokeWidth, circumference, hoverCategory]);

  // ⭐ Debug: Log wanneer segments veranderen
  useEffect(() => {
    console.log("🍩 PremiumDonut - Segments updated:", segments.length);
    console.log(
      "Segment details:",
      segments.map((s) => `${s.name}: €${s.amount} (${s.percentage}%)`),
    );
    console.log("SVG Key:", svgKey.substring(0, 50) + "...");
  }, [segments, svgKey]);

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

    setHoverWithDelay(categoryId);
  };

  const handleMouseLeave = () => {
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
        <g ref={gRef} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
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
              €{(totalBudget ?? 0).toFixed(2)}
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
