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
import { useNavigate } from "react-router-dom";

import type {
  GroupedCategory,
  Transaction,
} from "@/features/budget/hooks/useBudgetGrouping";

import { TransactionItem } from "./TransactionItem";
import { FiTrendingUp } from "react-icons/fi";

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
  onMoveTransaction: (t: any) => void; // ⭐ toegevoegd
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
  onMoveTransaction, // ⭐ toegevoegd
  itemRefs,
}: CategoryListProps) {
  const navigate = useNavigate();
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
              {/* LINKERKANT: naam + budget/spent/over */}
              <Box>
                {/* Naam + grafiek-icoon */}
                <HStack justify="space-between" align="center" w="full">
                  <Text fontWeight="bold" fontSize="lg" color={neon}>
                    {item.category?.emoji} {item.category?.name}
                  </Text>

                  {/* 📈 GRAFIEK-ICOON */}
                  <IconButton
                    aria-label="show category graph"
                    icon={<FiTrendingUp size={8} />} // ⭐ icoon zelf kleiner
                    variant="ghost"
                    color="cyan.300"
                    border="1px solid"
                    borderColor="cyan.300"
                    borderRadius="md"
                    boxSize="10px" // ⭐ totale knop kleiner
                    minW="15px"
                    minH="15px"
                    p="0" // ⭐ geen extra padding
                    _hover={{
                      color: "cyan.400",
                      borderColor: "cyan.400",
                      boxShadow: "0 0 6px rgba(0, 255, 255, 0.4)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/category/${id}/insights`);
                    }}
                  />
                </HStack>

                {/* Budget / Spent / Over */}
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

              {/* COLLAPSE TOGGLE */}
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
                    onMove={onMoveTransaction} // ⭐ verplaats-logica
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
