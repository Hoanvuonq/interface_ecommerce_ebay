import { create } from "zustand";
import { FilterState } from "./type";
import { VoucherTemplate } from "../_types/voucher-v2.type";

interface VoucherState {
  // Filters & UI State
  filters: FilterState;
  pagination: { page: number; size: number; sort: string };
  filtersExpanded: boolean;

  // Modals & Selected Data
  createModal: { open: boolean; mode: "paid" | "direct" };
  detailModal: { open: boolean; selectedId: string | null };
  validateModalOpen: boolean;
  checkUsageModalOpen: boolean;

  // Actions
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setPagination: (p: Partial<VoucherState["pagination"]>) => void;
  setFiltersExpanded: (val: boolean) => void;
  setCreateModal: (open: boolean, mode?: "paid" | "direct") => void;
  setDetailModal: (open: boolean, id?: string | null) => void;
  setValidateModal: (open: boolean) => void;
  setCheckUsageModal: (open: boolean) => void;
}

export const useVoucherStore = create<VoucherState>((set) => ({
  filters: {
    scope: "all",
    q: "",
    active: null,
    purchasable: null,
    creatorType: null,
    voucherScope: null,
    discountType: null,
    dateRange: null,
    minPrice: null,
    maxPrice: null,
  },
  pagination: { page: 0, size: 20, sort: "createdDate,desc" },
  filtersExpanded: false,
  createModal: { open: false, mode: "paid" },
  detailModal: { open: false, selectedId: null },
  validateModalOpen: false,
  checkUsageModalOpen: false,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 0 },
    })),
  clearFilters: () =>
    set({
      filters: {
        scope: "all",
        q: "",
        active: null,
        purchasable: null,
        creatorType: null,
        voucherScope: null,
        discountType: null,
        dateRange: null,
        minPrice: null,
        maxPrice: null,
      },
      pagination: { page: 0, size: 20, sort: "createdDate,desc" },
    }),
  setPagination: (p) =>
    set((state) => ({ pagination: { ...state.pagination, ...p } })),
  setFiltersExpanded: (val) => set({ filtersExpanded: val }),
  setCreateModal: (open, mode = "paid") => set({ createModal: { open, mode } }),
  setDetailModal: (open, id = null) =>
    set({ detailModal: { open, selectedId: id } }),
  setValidateModal: (open) => set({ validateModalOpen: open }),
  setCheckUsageModal: (open) => set({ checkUsageModalOpen: open }),
}));
