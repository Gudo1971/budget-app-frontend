import { create } from "zustand";

export type Receipt = {
  id: number;
  thumbnailUrl: string;
  date?: string;
};

type ReceiptStore = {
  receipts: Receipt[];
  selectedIds: number[];
  setReceipts: (items: Receipt[]) => void;
  toggleSelect: (id: number) => void;
  clearReceipts: () => void;
  clearSelection: () => void;
};

export const useReceiptStore = create<ReceiptStore>((set) => ({
  receipts: [],
  selectedIds: [],

  setReceipts: (items) => set({ receipts: items }),

  toggleSelect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id],
    })),

  clearReceipts: () => set({ receipts: [], selectedIds: [] }),

  clearSelection: () => set({ selectedIds: [] }),
}));
