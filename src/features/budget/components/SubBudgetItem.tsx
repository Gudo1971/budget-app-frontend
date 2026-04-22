import { HStack, Text, Box, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { SubBudget } from "../types/SubBudget";

type Props = {
  item: SubBudget;
  onEdit: (item: SubBudget) => void;
  onDelete: (id: number) => void;
};

export function SubBudgetItem({ item, onEdit, onDelete }: Props) {
  return (
    <HStack justify="space-between" bg="gray.800" p={2} borderRadius="md">
      <HStack spacing={3}>
        {/* Dot in category color */}
        <Box w="10px" h="10px" borderRadius="full" bg={item.category_color} />

        {/* Category name */}
        <Text fontSize="sm" color="gray.200">
          {item.category_name}
        </Text>
      </HStack>

      <HStack spacing={1}>
        <Text fontSize="sm" color="gray.300">
          €{item.amount}
        </Text>

        <IconButton
          size="xs"
          icon={<EditIcon />}
          aria-label="edit"
          onClick={() => onEdit(item)}
        />

        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          aria-label="delete"
          onClick={() => onDelete(item.id)}
        />
      </HStack>
    </HStack>
  );
}
