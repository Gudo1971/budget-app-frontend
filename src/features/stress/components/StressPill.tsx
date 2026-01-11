import { Box } from "@chakra-ui/react";

type Props = {
  level: "low" | "medium" | "high";
  color: "green" | "orange" | "red";
};

export function StressPill({ level, color }: Props) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="md"
      bg={`${color}.100`}
      color={`${color}.700`}
      fontSize="xs"
      fontWeight="semibold"
      textTransform="capitalize"
    >
      {level} stress
    </Box>
  );
}
