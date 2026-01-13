import { request } from '@/utils/axios.customize';
import type {
  ShopFeeSummaryResponse,
  PlatformRevenueResponse,
  OrderFeeBreakdownResponse,
}  from '../_types/fee-report.types';
interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

const API_ENDPOINT = 'v1/fee-reports';

// Helper to detect if string is UUID format
const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const feeReportApi = {
  /**
   * GET /api/v1/fee-reports/shops/{shopId}/summary?from=yyyy-MM-dd&to=yyyy-MM-dd
   * Returns how much fees the shop paid vs net revenue (shop nhận về).
   */
  async getShopSummary(
    shopId: string,
    from: string,
    to: string,
  ): Promise<ShopFeeSummaryResponse> {
    const response = await request<ApiResponse<ShopFeeSummaryResponse>>({
      method: 'GET',
      url: `/${API_ENDPOINT}/shops/${encodeURIComponent(shopId)}/summary`,
      params: { from, to },
    });
    return response.data;
  },

  /**
   * GET /api/v1/fee-reports/platform/summary?from=yyyy-MM-dd&to=yyyy-MM-dd
   * Returns total platform revenue from all fees and GMV in a period.
   */
  async getPlatformSummary(from: string, to: string): Promise<PlatformRevenueResponse> {
    const response = await request<ApiResponse<PlatformRevenueResponse>>({
      method: 'GET',
      url: `/${API_ENDPOINT}/platform/summary`,
      params: { from, to },
    });
    return response.data;
  },

  /**
   * GET /api/v1/fee-reports/orders/{orderId}/breakdown
   * Detailed view for a single order – platformRevenue vs shopNetRevenue.
   * Smart detection: auto-detects if input is UUID (orderId) or orderNumber
   */
  async getOrderBreakdown(orderIdOrNumber: string): Promise<OrderFeeBreakdownResponse> {
    // Smart detection: UUID = orderId, else = orderNumber
    const endpoint = isUUID(orderIdOrNumber)
      ? `/${API_ENDPOINT}/orders/${encodeURIComponent(orderIdOrNumber)}/breakdown`
      : `/${API_ENDPOINT}/orders/by-number/${encodeURIComponent(orderIdOrNumber)}/breakdown`;

    const response = await request<ApiResponse<OrderFeeBreakdownResponse>>({
      method: 'GET',
      url: endpoint,
    });
    return response.data;
  },
};