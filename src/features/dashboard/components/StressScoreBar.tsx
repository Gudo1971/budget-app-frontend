import { Box, useColorMode } from "@chakra-ui/react";

function getStressColorHex(score: number) {
  if (score < 40) return "#68D391"; // green.400
  if (score < 70) return "#F6AD55"; // orange.400
  return "#FC8181"; // red.400
}

export function StressScoreBar({ score }: { score: number }) {
  const { colorMode } = useColorMode();

  const percentage = Math.min(100, Math.max(0, score));
  const barColor = getStressColorHex(percentage);

  return (
    <Box w="full">
      <Box
        w="full"
        h="10px"
        bg={colorMode === "light" ? "gray.200" : "gray.700"}
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          h="full"
          w={`${percentage}%`}
          bg={barColor}
          transition="width 0.4s ease"
        />
      </Box>
    </Box>
  );
}
