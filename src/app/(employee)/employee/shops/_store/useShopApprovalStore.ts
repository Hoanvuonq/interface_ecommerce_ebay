import { create } from 'zustand';

interface ShopApprovalState {
  // Filters
  searchText: string;
  activeTab: string;
  pagination: { current: number; pageSize: number };
  
  // Modals
  rejectModal: { open: boolean; shop: any | null };
  detailModal: { open: boolean; shop: any | null };
  rejectReason: string;

  // Actions
  setSearchText: (text: string) => void;
  setActiveTab: (tab: string) => void;
  setPagination: (page: number, size: number) => void;
  setRejectModal: (open: boolean, shop?: any) => void;
  setDetailModal: (open: boolean, shop?: any) => void;
  setRejectReason: (reason: string) => void;
  resetFilters: () => void;
}

export const useShopApprovalStore = create<ShopApprovalState>((set) => ({
  searchText: "",
  activeTab: "ALL",
  pagination: { current: 1, pageSize: 10 },
  rejectModal: { open: false, shop: null },
  detailModal: { open: false, shop: null },
  rejectReason: "",

  setSearchText: (searchText) => set((state) => ({ searchText, pagination: { ...state.pagination, current: 1 } })),
  setActiveTab: (activeTab) => set((state) => ({ activeTab, pagination: { ...state.pagination, current: 1 } })),
  setPagination: (current, pageSize) => set({ pagination: { current, pageSize } }),
  setRejectModal: (open, shop = null) => set({ rejectModal: { open, shop }, rejectReason: "" }),
  setDetailModal: (open, shop = null) => set({ detailModal: { open, shop } }),
  setRejectReason: (rejectReason) => set({ rejectReason }),
  resetFilters: () => set({ searchText: "", activeTab: "ALL", pagination: { current: 1, pageSize: 10 } }),
}));