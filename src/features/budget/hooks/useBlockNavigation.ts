import { useEffect } from "react";

export function useBlockNavigation(shouldBlock: boolean, onBlock: () => void) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (shouldBlock) {
        e.preventDefault();
        e.returnValue = "";
        onBlock();
        return "";
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [shouldBlock, onBlock]);
}
