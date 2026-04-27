import { useState } from "react";
import {
  HStack,
  Text,
  Box,
  IconButton,
  VStack,
  Collapse,
  Button,
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

  onMoveTransaction: (tx: any) => void;
};

export function SubBudgetItem({
  item,
  onEdit,
  onDelete,
  onMoveTransaction,
}: Props) {
  const [open, setOpen] = useState(false);

  // ⭐ Nieuw: open-state per transactie
  const [openTxMap, setOpenTxMap] = useState<Record<number, boolean>>({});

  return (
    <Box
      bg="gray.800"
      p={2}
      borderRadius="md"
      border="1px solid"
      borderColor={(item.spent ?? 0) > item.amount ? "red.500" : "gray.700"}
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
              €{(item.spent ?? 0).toFixed(2)} uitgegeven • €{item.amount} budget
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

          {item.transactions?.map((tx) => {
            const isTxOpen = openTxMap[tx.id] ?? false;

            return (
              <Box key={tx.id}>
                {/* ⭐ Klikbare transactie header */}
                <HStack
                  justify="space-between"
                  p={2}
                  borderRadius="md"
                  bg="gray.700"
                  cursor="pointer"
                  onClick={() =>
                    setOpenTxMap((prev) => ({
                      ...prev,
                      [tx.id]: !prev[tx.id],
                    }))
                  }
                >
                  <Text fontSize="xs" color="gray.300">
                    {tx.description}
                  </Text>

                  <Text fontSize="xs" color="gray.400">
                    €{tx.amount.toFixed(2)}
                  </Text>
                </HStack>

                {/* ⭐ Compacte detailkaart zoals jouw screenshot */}
                {/* ⭐ Compacte detailkaart zonder date/type */}
                <Collapse in={isTxOpen} animateOpacity>
                  <VStack
                    align="stretch"
                    spacing={3}
                    mt={2}
                    p={3}
                    borderRadius="md"
                    bg="rgba(255,255,255,0.06)"
                    border="1px solid rgba(255,255,255,0.12)"
                  >
                    {/* Titel */}
                    <Text fontSize="md" fontWeight="bold" color="gray.200">
                      {tx.description}
                    </Text>

                    {/* Categorie */}
                    <Text fontSize="sm" color="gray.300">
                      {item.category_name}
                    </Text>

                    {/* Bedrag */}
                    <HStack justify="space-between" align="center">
                      <Text fontSize="lg" fontWeight="bold" color="blue.300">
                        €{tx.amount.toFixed(2)}
                      </Text>

                      <HStack spacing={3}></HStack>
                    </HStack>

                    {/* Verplaats-knop */}
                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme="purple"
                      onClick={() => onMoveTransaction(tx)}
                    >
                      Verplaats
                    </Button>
                  </VStack>
                </Collapse>
              </Box>
            );
          })}
        </VStack>
      </Collapse>
    </Box>
  );
}
