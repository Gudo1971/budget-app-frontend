import { VStack, HStack, Text, Box, Button } from "@chakra-ui/react";
import { SubBudget } from "../types/SubBudget";
import { useCategories } from "../../categories/hooks/useCategories";
import { SubBudgetItem } from "./SubBudgetItem";

type Props = {
  data: SubBudget[];
  onAdd: () => void;
  onEdit: (item: SubBudget) => void;
  onDelete: (id: number) => void;
};

export function SubBudgetList({ data, onAdd, onEdit, onDelete }: Props) {
  const { categories } = useCategories();

  return (
    <VStack align="stretch" spacing={3} mt={4}>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="bold" color="gray.200">
          Sub‑budgetten
        </Text>

        <Button size="xs" colorScheme="purple" onClick={onAdd}>
          + Toevoegen
        </Button>
      </HStack>

      {data.length === 0 && (
        <Text fontSize="xs" color="gray.500">
          Nog geen sub‑budgetten ingesteld.
        </Text>
      )}

      {data.map((item: SubBudget) => (
        <SubBudgetItem
          key={item.id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </VStack>
  );
}
