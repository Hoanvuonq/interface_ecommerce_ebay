import useSWR from 'swr';
import { analyticsApi } from '@/api/analytics/analyticsApi';
import type { ShopDashboardResponse } from '@/api/_types/analytics.types';

export function useShopDashboard(date?: string) {
    const { data, error, isLoading, isValidating, mutate } = useSWR<ShopDashboardResponse>(
        ['shop-dashboard', date],
        () => analyticsApi.getShopDashboard(date),
        {
            refreshInterval: 60000,
            revalidateOnFocus: true,
            dedupingInterval: 30000,
            keepPreviousData: true,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            revalidateIfStale: false,
            suspense: false,
        }
    );

    return {
        data,
        error,
        isLoading,
        isRefreshing: isValidating,
        refresh: mutate,
    };
}
