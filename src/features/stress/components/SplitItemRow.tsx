import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import { StressPill } from "../../stress/components/StressPill";
import { StressBar } from "../../stress/components/StressBar";
import { CATEGORY_MAP } from "@shared/constants/categories_old";

type Props = {
  item: {
    id: number;
    item_name: string;
    amount: number;
    category_id: number; // ⭐ enige juiste
    stress_score: number;
    stress_level: "low" | "medium" | "high";
    stress_color: "green" | "orange" | "red";
  };
};

export function SplitItemRow({ item }: Props) {
  return (
    <Box
      p={3}
      borderRadius="md"
      bg="white"
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
    >
      <HStack justify="space-between" align="flex-start">
        <VStack align="flex-start" spacing={1}>
          <Text fontWeight="medium">{item.item_name}</Text>

          <Text fontSize="sm" color="gray.500">
            {CATEGORY_MAP[item.category_id] ?? "Overig"}
          </Text>

          <StressBar score={item.stress_score} color={item.stress_color} />
        </VStack>

        <VStack align="flex-end" spacing={1}>
          <Text fontWeight="bold">€{item.amount.toFixed(2)}</Text>
          <StressPill level={item.stress_level} color={item.stress_color} />
        </VStack>
      </HStack>
    </Box>
  );
}
