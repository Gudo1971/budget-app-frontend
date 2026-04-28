// src/hooks/useHoverSync.ts
import { useRef, useState, useEffect } from "react";

export function useHoverSync() {
  const [hoverCategory, setHoverCategory] = useState<number | null>(null);
  const [isHoverLocked] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const setHoverWithDelay = (categoryId: number | null) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    if (categoryId === null) {
      setHoverCategory(null);
      return;
    }

    hoverTimeout.current = setTimeout(() => {
      setHoverCategory(categoryId);
    }, 80);
  };

  const lockHoverFromList = (categoryId: number) => {
    console.log("🔒 lockHoverFromList called with:", categoryId);
    setHoverCategory(categoryId);
  };

  const clearHover = () => {
    setHoverCategory(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  return {
    hoverCategory,
    isHoverLocked,
    setHoverWithDelay,
    lockHoverFromList,
    clearHover,
  };
}
