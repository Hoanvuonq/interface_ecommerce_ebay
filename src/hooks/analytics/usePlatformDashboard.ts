import useSWR from 'swr';
import { analyticsApi } from '@/api/analytics/analyticsApi';
import type { PlatformDashboardResponse } from '@/api/_types/analytics.types';

export function usePlatformDashboard(date?: string) {
    const { data, error, isLoading, isValidating, mutate } = useSWR<PlatformDashboardResponse>(
        ['platform-dashboard', date],
        () => analyticsApi.getPlatformDashboard(date),
        {
            refreshInterval: 60000, 
            revalidateOnFocus: true,
            dedupingInterval: 30000,
            keepPreviousData: true,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            revalidateIfStale: false,
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
