import { Badge, Tooltip } from "@chakra-ui/react";

export function StressScoreBadge({ score }: { score: number | undefined }) {
  const safeScore = typeof score === "number" && !isNaN(score) ? score : 0;

  const color =
    safeScore < 0.25
      ? "green"
      : safeScore < 0.45
        ? "yellow"
        : safeScore < 0.7
          ? "orange"
          : "red";

  const label =
    safeScore < 0.25
      ? "Zeer laag"
      : safeScore < 0.45
        ? "Licht"
        : safeScore < 0.7
          ? "Verhoogd"
          : "Hoog";

  return (
    <Tooltip
      label="De stress-score vergelijkt jouw uitgaven met hoeveel tijd er in de maand voorbij is."
      fontSize="sm"
      hasArrow
    >
      <Badge
        colorScheme={color}
        fontSize="0.8rem"
        px={2}
        py={1}
        borderRadius="md"
      >
        Stress: {safeScore.toFixed(0)}% – {label}
      </Badge>
    </Tooltip>
  );
}
