import { create } from "zustand";

export interface BuyNowItem {
  variantId: string;
  quantity: number;
}

interface BuyNowStore {
  buyNowItem: BuyNowItem | null;
  setBuyNowItem: (item: BuyNowItem) => void;
  clearBuyNowItem: () => void;
}

export const useBuyNowStore = create<BuyNowStore>((set) => ({
  buyNowItem: null,
  setBuyNowItem: (item) => set({ buyNowItem: item }),
  clearBuyNowItem: () => set({ buyNowItem: null }),
}));
