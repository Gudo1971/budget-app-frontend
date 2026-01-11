import { Box } from "@chakra-ui/react";

type Props = {
  score: number; // 0–1
  color: "green" | "orange" | "red";
};

export function StressBar({ score, color }: Props) {
  return (
    <Box w="100%" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
      <Box
        h="100%"
        w={`${score * 100}%`}
        bg={`${color}.400`}
        transition="width 0.3s ease"
      />
    </Box>
  );
}
