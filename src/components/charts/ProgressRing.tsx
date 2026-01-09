import { useColorMode } from "@chakra-ui/react";

function getStressColor(score: number) {
  if (score < 40) return "#68D391"; // green.400
  if (score < 70) return "#F6AD55"; // orange.400
  return "#FC8181"; // red.400
}

export function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 8,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const { colorMode } = useColorMode();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const trackColor = colorMode === "light" ? "#E2E8F0" : "#2D3748";
  const progressColor = getStressColor(percentage);

  return (
    <svg width={size} height={size}>
      <circle
        stroke={trackColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />

      <circle
        stroke={progressColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="16"
        fontWeight="600"
        fill={colorMode === "light" ? "#1A202C" : "#F7FAFC"}
      >
        {percentage.toFixed(0)}%
      </text>
    </svg>
  );
}
