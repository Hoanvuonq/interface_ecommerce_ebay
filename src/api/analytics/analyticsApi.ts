import { request } from '@/utils/axios.customize';
import type {
    ShopDashboardResponse,
    PlatformDashboardResponse,
    TrackViewRequest,
    ApiResponse,
} from '../_types/analytics.types';

const API_ENDPOINT_ANALYTICS = 'v1/analytics';

export const analyticsApi = {
    /**
     * Get shop dashboard metrics
     * GET /v1/analytics/shop/dashboard
     * @param date Optional date in ISO format (YYYY-MM-DD), defaults to today
     * @returns Shop dashboard data with metrics, growth, and charts
     */
    async getShopDashboard(date?: string): Promise<ShopDashboardResponse> {
        try {
            const params = date ? { date } : {};
            const response = await request<ApiResponse<ShopDashboardResponse>>({
                method: 'GET',
                url: `/${API_ENDPOINT_ANALYTICS}/shop/dashboard`,
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch shop dashboard:', error);
            throw error;
        }
    },

    /**
     * Get platform dashboard metrics (admin only)
     * GET /v1/analytics/platform/dashboard
     * @param date Optional date in ISO format
     * @returns Platform-wide dashboard data
     */
    async getPlatformDashboard(date?: string): Promise<PlatformDashboardResponse> {
        try {
            const params = date ? { date } : {};
            const response = await request<ApiResponse<PlatformDashboardResponse>>({
                method: 'GET',
                url: `/${API_ENDPOINT_ANALYTICS}/platform/dashboard`,
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch platform dashboard:', error);
            throw error;
        }
    },

    /**
     * Track shop page view
     * POST /v1/analytics/track/shop-view
     * Fire-and-forget - doesn't throw errors to avoid blocking UI
     * @param shopId Shop ID to track
     */
    async trackShopView(shopId: string): Promise<void> {
        try {
            await request({
                method: 'POST',
                url: `/${API_ENDPOINT_ANALYTICS}/track/shop-view`,
                data: { shopId },
                headers: {
                    'X-Skip-Error-Notification': 'true', 
                },
            });
        } catch (error) {
            console.warn('Failed to track shop view:', error);
        }
    },

    /**
     * Track product view
     * POST /v1/analytics/track/product-view
     * Fire-and-forget - doesn't throw errors
     * @param trackRequest Track view request with product/shop IDs
     */
    async trackProductView(trackRequest: TrackViewRequest): Promise<void> {
        try {
            await request({
                method: 'POST',
                url: `/${API_ENDPOINT_ANALYTICS}/track/product-view`,
                data: trackRequest,
                headers: {
                    'X-Skip-Error-Notification': 'true',
                },
            });
        } catch (error) {
            console.warn('Failed to track product view:', error);
        }
    },

    /**
     * Get shop trend data (future enhancement)
     * GET /v1/analytics/shop/trend
     * @param startDate Start date in ISO format
     * @param endDate End date in ISO format
     * @returns Array of daily metrics
     */
    async getShopTrend(startDate: string, endDate: string): Promise<any[]> {
        try {
            const response = await request<ApiResponse<any[]>>({
                method: 'GET',
                url: `/${API_ENDPOINT_ANALYTICS}/shop/trend`,
                params: { startDate, endDate },
            }) as ApiResponse<any[]>;
            return response.data;
        } catch (error) {
            console.error('Failed to fetch shop trend:', error);
            throw error;
        }
    },
};
