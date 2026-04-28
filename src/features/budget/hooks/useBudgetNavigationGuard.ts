import { useState, useCallback } from "react";
import { useBlockNavigation } from "../hooks/useBlockNavigation";

export function useBudgetNavigationGuard(isSaved: boolean) {
  const [showModal, setShowModal] = useState(false);

  // Blokkeer navigatie als budget niet is opgeslagen
  useBlockNavigation(!isSaved, () => setShowModal(true));

  // Focus op het budget inputveld
  const focusBudget = useCallback(() => {
    setShowModal(false);
    document.getElementById("budget-input")?.focus();
  }, []);

  // Handmatige trigger (bijv. gear‑icon)
  const requireSave = useCallback(() => {
    if (!isSaved) {
      setShowModal(true);
      return true; // betekent: navigatie blokkeren
    }
    return false; // navigatie toegestaan
  }, [isSaved]);

  return {
    showModal,
    setShowModal,
    focusBudget,
    requireSave,
  };
}
