import { Collapse } from "@chakra-ui/react";
import { TransactionList } from "./TransactionList";
import { CategoryCard } from "./CategoryCard";

interface CategoryItemProps {
  sb: any;
  bg: string;
  border: string;
  neon: { color: string };
  hoverCategory: number | null;
  lockHoverFromList: (id: number) => void;
  clearHover: () => void;
  openMap: Record<number, boolean>;
  toggle: (id: number) => void;
  openTxMap: Record<number, boolean>;
  toggleTx: (id: number) => void;
  itemRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  onMoveTransaction: (t: any) => void;
}

export function CategoryItem({
  sb,
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
  onMoveTransaction,
}: CategoryItemProps) {
  if (!sb || !sb.category_id) {
    console.warn("❗ CategoryItem kreeg een invalid sb:", sb);
    return null;
  }

  const categoryId = sb.category_id;
  const isOpen = openMap[categoryId] ?? false;
  const isHovered = hoverCategory === categoryId;

  return (
    <div
      ref={(el) => {
        itemRefs.current[categoryId] = el;
      }}
    >
      <CategoryCard
        sb={sb}
        isOpen={isOpen}
        isHovered={isHovered}
        bg={bg}
        border={border}
        neon={neon}
        onToggle={() => toggle(categoryId)}
        onMouseEnter={() => lockHoverFromList(sb.category_id)}
        onMouseLeave={clearHover}
      >
        <Collapse in={isOpen} animateOpacity>
          <TransactionList
            sb={sb}
            openTxMap={openTxMap}
            toggleTx={toggleTx}
            onMoveTransaction={onMoveTransaction}
          />
        </Collapse>
      </CategoryCard>
    </div>
  );
}
