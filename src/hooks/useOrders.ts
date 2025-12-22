/**
 * Custom hook for managing orders
 */

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/orders/order.service';
import type { OrderResponse } from '@/types/orders/order.types';
import { toast } from 'sonner';
export const useOrders = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderService.getBuyerOrders();
            setOrders(data);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể tải danh sách đơn hàng';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        loading,
        error,
        refetch: fetchOrders,
    };
};

export const useOrderDetail = (orderId: string) => {
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = useCallback(async () => {
        if (!orderId) {
            console.log('❌ No orderId provided');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Fetching order with ID:', orderId);
            const data = await orderService.getOrderById(orderId);
            console.log('✅ Order data received:', data);
            setOrder(data);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Không thể tải thông tin đơn hàng';
            setError(errorMessage);
            console.error('❌ Failed to load order:', {
                orderId,
                error: err,
                response: err?.response,
                message: errorMessage
            });
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    return {
        order,
        loading,
        error,
        refetch: fetchOrder,
    };
};


