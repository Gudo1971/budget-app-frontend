// src/features/budget/components/CategoryList.tsx
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import type {
  GroupedCategory,
  Transaction,
} from "@/features/budget/hooks/useBudgetGrouping";

import { TransactionItem } from "./TransactionItem";

interface CategoryListProps {
  grouped: GroupedCategory[];
  loading: boolean;
  transactionsLoading: boolean;
  bg: string;
  border: string;
  neon: string;
  hoverCategory: number | null;
  lockHoverFromList: (id: number) => void;
  clearHover: () => void;
  openMap: Record<number, boolean>;
  toggle: (id: number) => void;
  openTxMap: Record<number, boolean>;
  toggleTx: (id: number) => void;
  itemRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

export function CategoryList({
  grouped,
  loading,
  transactionsLoading,
  bg,
  border,
  neon,
  hoverCategory,
  lockHoverFromList,
  clearHover,
  openMap,
  toggle,
  openTxMap,
  toggleTx,
  itemRefs,
}: CategoryListProps) {
  if (loading || transactionsLoading) {
    return <Text color="gray.400">Laden…</Text>;
  }

  return (
    <VStack align="stretch" spacing={4}>
      {grouped.map((item: GroupedCategory) => {
        const id = item.category?.id ?? -1;
        const isOpen = openMap[id];
        const spentColor = item.remaining >= 0 ? "green.300" : "red.300";

        return (
          <Box
            key={id}
            ref={(el) => (itemRefs.current[id] = el)}
            bg={bg}
            border="1px solid"
            borderColor={border}
            borderRadius="lg"
            p={4}
            onMouseEnter={() => lockHoverFromList(id)}
            onMouseLeave={clearHover}
          >
            {/* CATEGORY HEADER */}
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold" fontSize="lg" color={neon}>
                  {item.category?.emoji} {item.category?.name}
                </Text>

                <HStack spacing={6} mt={1}>
                  <Text fontSize="sm" color="gray.400">
                    Budget: € {item.amount.toFixed(2)}
                  </Text>

                  <Text fontSize="sm" color="gray.400">
                    Spent: € {item.spent.toFixed(2)}
                  </Text>

                  <Text fontSize="sm" color={spentColor}>
                    Over: € {item.remaining.toFixed(2)}
                  </Text>
                </HStack>
              </Box>

              <IconButton
                aria-label="toggle category"
                icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                size="sm"
                variant="ghost"
                onClick={() => toggle(id)}
              />
            </HStack>

            {/* TRANSACTIONS COLLAPSE */}
            <Collapse in={isOpen} animateOpacity>
              <VStack align="stretch" spacing={2} mt={3}>
                {item.transactions.map((tx: Transaction) => (
                  <TransactionItem
                    key={tx.id}
                    t={tx}
                    sb={item}
                    openTxMap={openTxMap}
                    toggleTx={toggleTx}
                  />
                ))}
              </VStack>
            </Collapse>
          </Box>
        );
      })}
    </VStack>
  );
}
