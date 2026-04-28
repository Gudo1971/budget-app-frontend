// src/features/budget/components/TransactionItem.tsx
import {
  Box,
  Flex,
  Text,
  IconButton,
  Collapse,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { TransactionDetails } from "./CategoryList/TransactionDetails";

interface TransactionItemProps {
  t: any;
  sb: any;
  openTxMap: Record<number, boolean>;
  toggleTx: (id: number) => void;
  onMove: (t: any) => void;
}

export function TransactionItem({
  t,
  sb,
  openTxMap,
  toggleTx,
  onMove,
}: TransactionItemProps) {
  const isOpen = openTxMap[t.id] ?? false;

  return (
    <Box borderBottom="1px solid" borderColor="whiteAlpha.100">
      {/* Klikbare transactie header */}
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2}
        cursor="pointer"
        onClick={() => toggleTx(t.id)}
      >
        <Flex direction="column">
          <Text fontSize="sm" color="gray.300">
            {t.description ?? "Transactie"}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {t.date}
          </Text>
        </Flex>

        <Flex align="center" gap={3}>
          <Text
            fontWeight="bold"
            color={t.amount < 0 ? "red.300" : "green.300"}
          >
            €{t.amount?.toFixed(2)}
          </Text>

          <IconButton
            aria-label="toggle transaction details"
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              toggleTx(t.id);
            }}
          />
        </Flex>
      </Flex>

      {/* DETAILS COLLAPSE */}
      <Collapse in={isOpen} animateOpacity>
        <Box px={4} pb={3}>
          <TransactionDetails t={t} />

          {/* ⭐ SubBudget-stijl Verplaats-knop */}
          <Button
            size="xs"
            variant="outline"
            colorScheme="purple"
            w="100%"
            mt={3}
            onClick={(e) => {
              e.stopPropagation();
              onMove(t);
            }}
          >
            Verplaats
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}
