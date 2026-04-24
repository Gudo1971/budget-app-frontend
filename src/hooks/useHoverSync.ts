// src/hooks/useHoverSync.ts
import { useRef, useState, useEffect } from "react";

export function useHoverSync() {
  const [hoverCategory, setHoverCategory] = useState<number | null>(null);
  const [isHoverLocked, setIsHoverLocked] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const setHoverWithDelay = (categoryId: number | null) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    if (categoryId === null) {
      setIsHoverLocked(false);
      setHoverCategory(null);
      return;
    }

    setIsHoverLocked(true);
    hoverTimeout.current = setTimeout(() => {
      setHoverCategory(categoryId);
    }, 80);
  };

  const lockHoverFromList = (categoryId: number) => {
    setIsHoverLocked(true);
    setHoverCategory(categoryId);
  };

  const clearHover = () => {
    setIsHoverLocked(false);
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
