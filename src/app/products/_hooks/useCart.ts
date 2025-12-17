

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems, } from '@/store/theme/cartSlice';
import type { AddToCartRequest } from '@/types/cart/cart.types';

export const useCart = () => {
    const dispatch = useAppDispatch();
    const { cart, loading, error, etag } = useAppSelector((state) => state.cart);

    // Get cart
    const getCart = useCallback(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    // Add to cart with success handling
    const addItem = useCallback(
        async (request: AddToCartRequest) => {
            try {
                await dispatch(addToCart(request)).unwrap();
                return { success: true };
            } catch (error: any) {
                // Return error message from backend
                const errorMessage = typeof error === 'string' ? error : error?.message || 'Không thể thêm vào giỏ hàng';
                return { success: false, error: errorMessage };
            }
        },
        [dispatch]
    );

    // Quick add to cart (common use case)
    const quickAddToCart = useCallback(
        async (variantId: string, quantity: number = 1) => {
            return addItem({ variantId, quantity });
        },
        [addItem]
    );

    // Update item quantity
    const updateItem = useCallback(
        async (itemId: string, quantity: number) => {
            if (!cart?.version) return { success: false, error: 'Giỏ hàng không tồn tại' };

            try {
                await dispatch(
                    updateCartItem({
                        itemId,
                        request: { quantity },
                        etag: cart.version.toString(),
                    })
                ).unwrap();
                return { success: true };
            } catch (error: any) {
                const errorMessage = typeof error === 'string' ? error : error?.message || 'Không thể cập nhật giỏ hàng';
                return { success: false, error: errorMessage };
            }
        },
        [dispatch, cart]
    );

    // Remove item
    const removeItem = useCallback(
        async (itemId: string) => {
            if (!cart?.version) return { success: false, error: 'Giỏ hàng không tồn tại' };

            try {
                await dispatch(
                    removeCartItem({
                        itemId,
                        etag: cart.version.toString(),
                    })
                ).unwrap();
                return { success: true };
            } catch (error: any) {
                const errorMessage = typeof error === 'string' ? error : error?.message || 'Không thể xóa sản phẩm';
                return { success: false, error: errorMessage };
            }
        },
        [dispatch, cart]
    );

    // Clear all items
    const clearAllItems = useCallback(async () => {
        if (!cart?.version) return { success: false, error: 'Giỏ hàng không tồn tại' };

        try {
            await dispatch(clearCart(cart.version.toString())).unwrap();
            return { success: true };
        } catch (error: any) {
            const errorMessage = typeof error === 'string' ? error : error?.message || 'Không thể xóa giỏ hàng';
            return { success: false, error: errorMessage };
        }
    }, [dispatch, cart]);

    // Toggle item selection
    const toggleSelection = useCallback(
        async (itemId: string) => {
            try {
                await dispatch(toggleItemSelection(itemId)).unwrap();
                return true;
            } catch (error) {
                return false;
            }
        },
        [dispatch]
    );

    // Select all items
    const selectAll = useCallback(async () => {
        try {
            await dispatch(selectAllItems()).unwrap();
            return true;
        } catch (error) {
            return false;
        }
    }, [dispatch]);

    // Deselect all items
    const deselectAll = useCallback(async () => {
        try {
            await dispatch(deselectAllItems()).unwrap();
            return true;
        } catch (error) {
            return false;
        }
    }, [dispatch]);

    // Calculate selected items info
    const selectedItemsInfo = useCallback(() => {
        if (!cart) return { count: 0, total: 0 };

        let count = 0;
        let total = 0;

        cart.shops.forEach((shop) => {
            shop.items.forEach((item) => {
                if (item.selectedForCheckout) {
                    count++;
                    total += item.totalPrice;
                }
            });
        });

        return { count, total };
    }, [cart]);

    // Check if cart has items
    const hasItems = cart && cart.itemCount > 0;

    // Check if any items are selected
    const hasSelectedItems = cart?.shops.some((shop) => shop.hasSelectedItems) || false;

    return {
        // State
        cart,
        loading,
        error,
        etag,
        hasItems,
        hasSelectedItems,

        // Actions
        getCart,
        addItem,
        quickAddToCart,
        updateItem,
        removeItem,
        clearAllItems,
        toggleSelection,
        selectAll,
        deselectAll,

        // Helpers
        selectedItemsInfo,
    };
};

