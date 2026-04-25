import { useState } from "react";
import {
  HStack,
  Text,
  Box,
  IconButton,
  VStack,
  Collapse,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { SubBudget } from "../types/SubBudget";

type Props = {
  item: SubBudget;
  onEdit: (item: SubBudget) => void;
  onDelete: (id: number) => void;
};

export function SubBudgetItem({ item, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      bg="gray.800"
      p={2}
      borderRadius="md"
      border="1px solid"
      borderColor="gray.700"
    >
      {/* HEADER */}
      <HStack
        justify="space-between"
        onClick={() => setOpen(!open)}
        cursor="pointer"
      >
        <HStack spacing={3}>
          <Box w="10px" h="10px" borderRadius="full" bg={item.category_color} />

          <VStack align="start" spacing={0}>
            <Text fontSize="sm" color="gray.200">
              {item.category_name}
            </Text>

            <Text fontSize="xs" color="gray.400">
              €{item.spent?.toFixed(2)} uitgegeven • €{item.amount} budget
            </Text>
          </VStack>
        </HStack>

        <HStack spacing={1}>
          <IconButton
            size="xs"
            icon={<EditIcon />}
            aria-label="edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          />

          <IconButton
            size="xs"
            icon={<DeleteIcon />}
            aria-label="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          />

          <IconButton
            size="xs"
            aria-label="toggle"
            icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          />
        </HStack>
      </HStack>

      {/* COLLAPSIBLE TRANSACTIONS */}
      <Collapse in={open} animateOpacity>
        <VStack align="stretch" spacing={2} mt={3}>
          {item.transactions?.length === 0 && (
            <Text fontSize="xs" color="gray.500">
              Geen transacties in deze categorie.
            </Text>
          )}

          {item.transactions?.map((tx) => (
            <HStack
              key={tx.id}
              justify="space-between"
              p={2}
              borderRadius="md"
              bg="gray.700"
            >
              <Text fontSize="xs" color="gray.300">
                {tx.description}
              </Text>

              <Text fontSize="xs" color="gray.400">
                €{tx.amount.toFixed(2)}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
}
