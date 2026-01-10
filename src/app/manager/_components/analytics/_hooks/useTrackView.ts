import { useEffect, useRef, useCallback } from 'react';
import { analyticsApi } from '@/api/analytics/analyticsApi';
import type { TrackViewRequest } from '@/api/_types/analytics.types';

export function useTrackShopView(shopId: string | undefined) {
    const tracked = useRef(false);

    useEffect(() => {
        if (shopId && !tracked.current) {
            analyticsApi.trackShopView(shopId);
            tracked.current = true;
        }
    }, [shopId]);
}


export function useTrackProductView(
    productId: string | undefined,
    shopId?: string | undefined
) {
    const tracked = useRef(false);

    useEffect(() => {
        if (productId && !tracked.current) {
            const request: TrackViewRequest = {
                productId,
                shopId,
            };
            analyticsApi.trackProductView(request);
            tracked.current = true;
        }
    }, [productId, shopId]);
}

export function useManualTracking() {
    const trackShopView = useCallback((shopId: string) => {
        analyticsApi.trackShopView(shopId);
    }, []);

    const trackProductView = useCallback((request: TrackViewRequest) => {
        analyticsApi.trackProductView(request);
    }, []);

    return {
        trackShopView,
        trackProductView,
    };
}
