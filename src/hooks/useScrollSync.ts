// src/hooks/useScrollSync.ts
import { useEffect } from "react";

export function useScrollSync(
  hoverCategory: number | null,
  isHoverLocked: boolean,
  itemRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>,
) {
  useEffect(() => {
    if (!hoverCategory) return;
    if (!isHoverLocked) return;

    const el = itemRefs.current[hoverCategory];
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    const fullyVisible =
      rect.top >= parentRect.top && rect.bottom <= parentRect.bottom;

    if (fullyVisible) return;

    const timeout = setTimeout(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [hoverCategory, isHoverLocked, itemRefs]);
}
