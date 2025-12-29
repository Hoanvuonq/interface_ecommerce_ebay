// src/app/wishlist/_hooks/useWishlistPage.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWishlistStore } from '../_store/useWishlistStore';
import { useWishlist } from './useWishlist';
import { useCart } from '../../products/_hooks/useCart';
import { useToast } from '@/hooks/useToast';

export function useWishlistPage() {
    const { success, error } = useToast();
    const {
        wishlists, setWishlists,
        selectedWishlist, setSelectedWishlist,
        selectedWishlistId, setSelectedWishlistId,
        loading, setLoading,
        loadingDetails, setLoadingDetails,
        removingIds, setRemovingId,
        addingToCartIds, setAddingToCartId,
        createModalVisible, setCreateModalVisible,
        editModalVisible, setEditModalVisible,
        shareModalVisible, setShareModalVisible,
        editItemModalVisible, setEditItemModalVisible,
        editingItem, setEditingItem,
    } = useWishlistStore();

    const { getBuyerWishlists, getWishlistById, removeFromWishlist, getPriceTargetMetItems, regenerateShareToken } = useWishlist();
    const { quickAddToCart } = useCart();

    const [priceTargetMetData, setPriceTargetMetData] = useState<any>(null);

    const loadWishlistDetails = useCallback(async (id: string) => {
        try {
            setLoadingDetails(true);
            const result = await getWishlistById(id);
            if (result.success) setSelectedWishlist(result.data ?? null);
        } finally {
            setLoadingDetails(false);
        }
    }, [getWishlistById, setLoadingDetails, setSelectedWishlist]);

    const loadAllWishlists = useCallback(async (autoSelect = false) => {
        try {
            setLoading(true);
            const result = await getBuyerWishlists({ size: 100 });
            if (result.success && result.data?.content) {
                const sorted = result.data.content.sort((a: any, b: any) => (a.isDefault ? -1 : 1));
                setWishlists(sorted);
                if (autoSelect && sorted.length > 0) {
                    const target = sorted.find((w: any) => w.isDefault) || sorted[0];
                    setSelectedWishlistId(target.id);
                    loadWishlistDetails(target.id);
                }
            }
        } finally {
            setLoading(false);
        }
    }, [getBuyerWishlists, setLoading, setWishlists, setSelectedWishlistId, loadWishlistDetails]);

    useEffect(() => {
        loadAllWishlists(true);
        getPriceTargetMetItems().then(res => res.success && setPriceTargetMetData(res.data));
        // eslint-disable-next-line
    }, []);

    const handleRemoveItem = useCallback(async (variantId: string, itemId: string) => {
        if (!selectedWishlistId) return;
        setRemovingId(itemId, true);
        try {
            const result = await removeFromWishlist(selectedWishlistId, variantId);
            if (result.success) {
                loadWishlistDetails(selectedWishlistId); 
                setWishlists(
                    wishlists.map(w => w.id === selectedWishlistId ? { ...w, itemCount: w.itemCount - 1 } : w)
                );
            } else {
                error(result.error || 'Lỗi khi xóa');
            }
        } catch (err) {
            error('Thao tác thất bại');
        } finally {
            setRemovingId(itemId, false);
        }
    }, [selectedWishlistId, removeFromWishlist, loadWishlistDetails, setRemovingId, setWishlists]);

    const handleAddToCartAction = useCallback(async (variantId: string, productName: string, itemId: string) => {
        setAddingToCartId(itemId, true);
        try {
            const result = await quickAddToCart(variantId, 1);
            if (result.success) success(`Đã thêm ${productName} vào giỏ`);
            else error(result.error || 'Lỗi thêm vào giỏ');
        } finally {
            setAddingToCartId(itemId, false);
        }
    }, [quickAddToCart, setAddingToCartId]);

    const handleSelect = (id: string) => {
        if (id === selectedWishlistId) return;
        setSelectedWishlistId(id);
        loadWishlistDetails(id);
    };

    const priceTargetMap = useMemo(() => {
        const map = new Map();
        priceTargetMetData?.wishlists?.forEach((w: any) => map.set(w.wishlistId, w.itemCount));
        return map;
    }, [priceTargetMetData]);

    return {
        // state
        wishlists, selectedWishlist, selectedWishlistId, loading, loadingDetails,
        removingIds, addingToCartIds,
        createModalVisible, editModalVisible, shareModalVisible, editItemModalVisible, editingItem,
        priceTargetMap,
        // handler
        setCreateModalVisible, setEditModalVisible, setShareModalVisible, setEditItemModalVisible, setEditingItem,
        handleRemoveItem, handleAddToCartAction, handleSelect,
        loadAllWishlists, loadWishlistDetails, setSelectedWishlistId,
        setSelectedWishlist,
        setWishlists,
        setPriceTargetMetData,
        priceTargetMetData,
        regenerateShareToken,
    };
}