import { VStack } from "@chakra-ui/react";
import { SplitItemRow } from "./SplitItemRow";

type Props = {
  items: Array<{
    id: number;
    item_name: string;
    amount: number;
    category_name?: string | null;
    stress_score: number;
    stress_level: "low" | "medium" | "high";
    stress_color: "green" | "orange" | "red";
  }>;
};

export function SplitItemList({ items }: Props) {
  return (
    <VStack spacing={3} w="100%">
      {items.map((item) => (
        <SplitItemRow key={item.id} item={item} />
      ))}
    </VStack>
  );
}
