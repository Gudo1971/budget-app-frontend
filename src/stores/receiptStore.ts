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
};

export const useReceiptStore = create<ReceiptStore>((set) => ({
  receipts: [],
  selectedIds: [],

  setReceipts: (items) => set({ receipts: items }),

  toggleSelect: (id) =>
    set((state) => {
      const exists = state.selectedIds.includes(id);
      return {
        selectedIds: exists
          ? state.selectedIds.filter((x) => x !== id)
          : [...state.selectedIds, id],
      };
    }),
}));
