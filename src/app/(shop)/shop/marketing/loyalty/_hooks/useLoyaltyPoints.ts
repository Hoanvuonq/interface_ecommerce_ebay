'use client';

import { useState, useCallback, useEffect } from 'react';
import { loyaltyService } from '../_services/loyalty.service';
import type { PointBalanceResponse, UserShopPointDto } from '../_types/loyalty.types';

interface UseLoyaltyPointsReturn {
    // State
    points: number;
    balance: PointBalanceResponse | null;
    batches: UserShopPointDto[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchPoints: () => Promise<void>;
    fetchBalance: () => Promise<void>;
    applyPoints: (amount: number, orderId: string) => Promise<number>;
    refreshPoints: () => Promise<void>;
}

/**
 * Hook để quản lý loyalty points cho một shop
 * 
 * @param shopId - Shop ID để query points
 * @param autoFetch - Tự động fetch khi mount (default: true)
 */
export function useLoyaltyPoints(
    shopId: string,
    autoFetch: boolean = true
): UseLoyaltyPointsReturn {
    const [points, setPoints] = useState<number>(0);
    const [balance, setBalance] = useState<PointBalanceResponse | null>(null);
    const [batches, setBatches] = useState<UserShopPointDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch simple points
    const fetchPoints = useCallback(async () => {
        if (!shopId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await loyaltyService.getPoints(shopId);
            setPoints(data.availablePoints);
        } catch (err) {
            console.error('Failed to fetch points:', err);
            setError('Không thể tải điểm tích lũy');
        } finally {
            setLoading(false);
        }
    }, [shopId]);

    // Fetch full balance with batches
    const fetchBalance = useCallback(async () => {
        if (!shopId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await loyaltyService.getPointBalance(shopId);
            setBalance(data);
            setPoints(data.totalAvailable);
            setBatches(data.batches);
        } catch (err) {
            console.error('Failed to fetch balance:', err);
            setError('Không thể tải chi tiết điểm');
        } finally {
            setLoading(false);
        }
    }, [shopId]);

    // Apply points to order
    const applyPoints = useCallback(async (amount: number, orderId: string): Promise<number> => {
        if (!shopId) return 0;

        setLoading(true);
        setError(null);

        try {
            const result = await loyaltyService.consumePoints({
                shopId,
                amount,
                orderId,
            });

            // Refresh points after consuming
            await fetchPoints();

            return result.consumedPoints;
        } catch (err) {
            console.error('Failed to apply points:', err);
            setError('Không thể sử dụng điểm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [shopId, fetchPoints]);

    // Refresh all data
    const refreshPoints = useCallback(async () => {
        await fetchPoints();
    }, [fetchPoints]);

    // Auto fetch on mount
    useEffect(() => {
        if (autoFetch && shopId) {
            fetchPoints();
        }
    }, [autoFetch, shopId, fetchPoints]);

    return {
        points,
        balance,
        batches,
        loading,
        error,
        fetchPoints,
        fetchBalance,
        applyPoints,
        refreshPoints,
    };
}
