import { create } from 'zustand';
import {  WishlistResponse, WishlistSummaryResponse } from '@/types/wishlist/wishlist.types';

interface WishlistStoreState {
  wishlists: WishlistSummaryResponse[];
  selectedWishlist: WishlistResponse | null;
  selectedWishlistId: string | null;
  loading: boolean;
  loadingDetails: boolean;
  removingIds: Set<string>;
  addingToCartIds: Set<string>;
  priceTargetMap: Map<string, number>;
  // Modal states
  createModalVisible: boolean;
  editModalVisible: boolean;
  shareModalVisible: boolean;
  editItemModalVisible: boolean;
  editingItem: any | null;

  // Actions
  setWishlists: (data: WishlistSummaryResponse[]) => void;
  setSelectedWishlist: (data: WishlistResponse | null) => void;
  setSelectedWishlistId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingDetails: (loading: boolean) => void;
  setRemovingId: (id: string, isRemoving: boolean) => void;
  setAddingToCartId: (id: string, isAdding: boolean) => void;
  setPriceTargetMap: (map: Map<string, number>) => void;
  // Modal actions
  setCreateModalVisible: (v: boolean) => void;
  setEditModalVisible: (v: boolean) => void;
  setShareModalVisible: (v: boolean) => void;
  setEditItemModalVisible: (v: boolean) => void;
  setEditingItem: (item: any | null) => void;
}

export const useWishlistStore = create<WishlistStoreState>((set) => ({
  wishlists: [],
  selectedWishlist: null,
  selectedWishlistId: null,
  loading: false,
  loadingDetails: false,
  removingIds: new Set(),
  addingToCartIds: new Set(),
  priceTargetMap: new Map(),
  createModalVisible: false,
  editModalVisible: false,
  shareModalVisible: false,
  editItemModalVisible: false,
  editingItem: null,

  setWishlists: (data) => set({ wishlists: data }),
  setSelectedWishlist: (data) => set({ selectedWishlist: data }),
  setSelectedWishlistId: (id) => set({ selectedWishlistId: id }),
  setLoading: (loading) => set({ loading }),
  setLoadingDetails: (loading) => set({ loadingDetails: loading }),
  setPriceTargetMap: (map) => set({ priceTargetMap: map }),
  setRemovingId: (id, isRemoving) => set((state) => {
    const newSet = new Set(state.removingIds);
    isRemoving ? newSet.add(id) : newSet.delete(id);
    return { removingIds: newSet };
  }),
  setAddingToCartId: (id, isAdding) => set((state) => {
    const newSet = new Set(state.addingToCartIds);
    isAdding ? newSet.add(id) : newSet.delete(id);
    return { addingToCartIds: newSet };
  }),
  setCreateModalVisible: (v) => set({ createModalVisible: v }),
  setEditModalVisible: (v) => set({ editModalVisible: v }),
  setShareModalVisible: (v) => set({ shareModalVisible: v }),
  setEditItemModalVisible: (v) => set({ editItemModalVisible: v }),
  setEditingItem: (item) => set({ editingItem: item }),
}));