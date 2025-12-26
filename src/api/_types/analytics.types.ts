// Analytics TypeScript Types
// Matches backend API responses exactly

/**
 * Base metrics response - used for both today and yesterday data
 */
export interface AnalyticsMetrics {
    revenue: number;
    orders: number;
    itemsSold: number;
    uniqueVisitors: number;
    productViews: number;
    cartAdds: number;
    averageOrderValue: number;
    conversionRate: number;
    date: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Growth percentages comparing today vs yesterday
 */
export interface GrowthPercentages {
    revenue: number;
    orders: number;
    uniqueVisitors: number;
}

/**
 * Shop dashboard response from backend
 * GET /api/v1/analytics/shop/dashboard
 */
export interface ShopDashboardResponse {
    todayMetrics: AnalyticsMetrics;
    yesterdayMetrics: AnalyticsMetrics;
    growthPercentages: GrowthPercentages;
    hourlyRevenue: number[]; // 24 values (0-23)
    hourlyOrders: number[]; // 24 values (0-23)
}

/**
 * Platform metrics for admin dashboard
 */
export interface PlatformMetrics {
    gmv: number; // Gross Merchandise Value
    revenue: number;
    commission: number;
    orders: number;
    uniqueBuyers: number;
    uniqueVisitors: number; // Added to match UI needs
    date: string; // ISO date string
}

/**
 * Top shop in platform dashboard
 */
export interface TopShop {
    shopId: string;
    shopName: string;
    revenue: number;
    rank: number;
}

/**
 * Top category in platform dashboard
 */
export interface TopCategory {
    categoryId: number;
    categoryName: string;
    revenue: number;
    orders: number;
}

/**
 * Platform dashboard response (admin only)
 * GET /api/v1/analytics/platform/dashboard
 */
export interface PlatformDashboardResponse {
    todayMetrics: PlatformMetrics;
    yesterdayMetrics: PlatformMetrics;
    topShops: TopShop[];
    topCategories: TopCategory[];
}

/**
 * Request for tracking views
 * POST /api/v1/analytics/track/shop-view
 * POST /api/v1/analytics/track/product-view
 */
export interface TrackViewRequest {
    shopId?: string;
    productId?: string;
    variantId?: string;
}

/**
 * API Response wrapper (matches backend ApiResponse<T>)
 */
export interface ApiResponse<T> {
    code: number;
    success: boolean;
    message: string;
    data: T;
}

/**
 * Chart data point for Recharts
 */
export interface ChartDataPoint {
    hour: string; // "0h", "1h", ..., "23h"
    value: number;
    label?: string;
}

/**
 * Date range for trend queries (future enhancement)
 */
export interface DateRange {
    startDate: string; // ISO date
    endDate: string; // ISO date
}
