// src/features/budget/components/CategoryItem.tsx
import { Box, Flex, Text, HStack, Collapse, Icon } from "@chakra-ui/react";
import { FiTrendingUp } from "react-icons/fi";
import { TransactionList } from "./TransactionList";

interface CategoryItemProps {
  sb: any;
  openMap: Record<number, boolean>;
  toggle: (id: number) => void;
  openTxMap: Record<number, boolean>;
  toggleTx: (id: number) => void;
  itemRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  onMoveTransaction: (t: any) => void;
  goToCategorySlide: (categoryId: number) => void; // ⭐ nieuw
}

export function CategoryItem({
  sb,
  openMap,
  toggle,
  openTxMap,
  toggleTx,
  itemRefs,
  onMoveTransaction,
  goToCategorySlide,
}: CategoryItemProps) {
  const isOpen = openMap[sb.category_id] ?? false;

  return (
    <Box
      ref={(el) => (itemRefs.current[sb.category_id] = el)}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      pb={3}
      pt={3}
    >
      {/* ⭐ HEADER: Naam + grafiek-icoon */}
      <Flex
        justify="space-between"
        align="center"
        px={2}
        cursor="pointer"
        onClick={() => toggle(sb.category_id)}
      >
        <Text fontWeight="bold" color="gray.200">
          {sb.category_name}
        </Text>

        <Icon
          as={FiTrendingUp}
          boxSize={4}
          color="purple.300"
          cursor="pointer"
          onClick={(e) => {
            e.stopPropagation();
            goToCategorySlide(sb.category_id); // ⭐ spring naar grafiek
          }}
        />
      </Flex>

      {/* ⭐ Budget / Spent / Over */}
      <HStack
        justify="space-between"
        fontSize="sm"
        color="gray.400"
        px={2}
        mt={1}
        mb={2}
      >
        <Text>Budget: €{sb.amount.toFixed(2)}</Text>
        <Text>Spent: €{sb.spent.toFixed(2)}</Text>
        <Text>Over: €{sb.remaining.toFixed(2)}</Text>
      </HStack>

      {/* ⭐ COLLAPSE MET TRANSACTIES */}
      <Collapse in={isOpen} animateOpacity>
        <Box mt={2}>
          <TransactionList
            sb={sb}
            openTxMap={openTxMap}
            toggleTx={toggleTx}
            onMoveTransaction={onMoveTransaction}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
