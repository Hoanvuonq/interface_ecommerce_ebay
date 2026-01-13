/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import {
  ShopGetOrdersRequest,
  ShopOrderStatusUpdateRequest,
  ShopOrderShippingUpdateRequest,
  ShopOrderResponse,
  ShopOrderListResponse,
  ShopOrderStatisticsResponse,
} from "../_types/dto/shop.order.dto";
import type {
  BulkOrderRequest,
  BulkOrderResponse,
  PendingShipmentRequest,
  PendingShipmentResponse,
} from "../_types/dto/shop.order.dto";


const API_ENDPOINT = "/v1/shop/orders";

// ==================== SHOP ORDER APIs ====================

/**
 * Get shop orders
 * GET /api/v1/shop/orders
 * Returns ShopOrderResponse (without shopInfo, paymentUrl, etc.)
 */
export async function getShopOrders(
  params: ShopGetOrdersRequest
): Promise<ApiResponse<ShopOrderListResponse>> {
  return request<ApiResponse<ShopOrderListResponse>>({
    url: API_ENDPOINT,
    method: "GET",
    params: {
      status: params.status,
      fromDate: params.fromDate,
      toDate: params.toDate,
      page: params.page,
      size: params.size,
      sort: params.sort || "createdDate,desc",
    },
  });
}

/**
 * Get shop order by ID
 * GET /api/v1/shop/orders/{orderId}
 * Returns ShopOrderResponse (without shopInfo, paymentUrl, etc.)
 */
export async function getShopOrderById(
  orderId: string
): Promise<ApiResponse<ShopOrderResponse>> {
  return request<ApiResponse<ShopOrderResponse>>({
    url: `${API_ENDPOINT}/${orderId}`,
    method: "GET",
  });
}

/**
 * Get shop order by order number
 * GET /api/v1/shop/orders/by-number/{orderNumber}
 * Use this when URL contains orderNumber (e.g., ORD-MJB8EYWS-CB56)
 */
export async function getShopOrderByNumber(
  orderNumber: string
): Promise<ApiResponse<ShopOrderResponse>> {
  return request<ApiResponse<ShopOrderResponse>>({
    url: `${API_ENDPOINT}/by-number/${orderNumber}`,
    method: "GET",
  });
}

/**
 * Get shop order statistics
 * GET /api/v1/shop/orders/statistics
 */
export async function getShopOrderStatistics(
  period: string = "week"
): Promise<ApiResponse<ShopOrderStatisticsResponse>> {
  return request<ApiResponse<ShopOrderStatisticsResponse>>({
    url: `${API_ENDPOINT}/statistics`,
    method: "GET",
    params: { period },
  });
}

/**
 * Update order status (Shop)
 * PUT /api/v1/shop/orders/{orderId}/status
 */
export async function updateShopOrderStatus(
  orderId: string,
  payload: ShopOrderStatusUpdateRequest
): Promise<ApiResponse<void>> {
  return request<ApiResponse<void>>({
    url: `${API_ENDPOINT}/${orderId}/status`,
    method: "PUT",
    data: payload,
  });
}

/**
 * Update shipping info (Shop) - DEPRECATED
 * PUT /api/v1/shop/orders/{orderId}/shipping
 * @deprecated Backend đã đánh dấu deprecated
 */
export async function updateShopOrderShipping(
  orderId: string,
  payload: ShopOrderShippingUpdateRequest
): Promise<ApiResponse<void>> {
  return request<ApiResponse<void>>({
    url: `${API_ENDPOINT}/${orderId}/shipping`,
    method: "PUT",
    data: payload,
  });
}

/**
 * Cancel order (Shop)
 * PUT /api/v1/shop/orders/{orderId}/cancel
 */
export async function cancelShopOrder(
  orderId: string,
  payload: { reason: string }
): Promise<ApiResponse<void>> {
  return request<ApiResponse<void>>({
    url: `${API_ENDPOINT}/${orderId}/cancel`,
    method: "PUT",
    data: payload,
  });
}

/**
 * Reject order (Shop) - triggers refund flow
 * PUT /api/v1/shop/orders/{orderId}/reject
 */
export async function rejectShopOrder(
  orderId: string,
  payload: { reason: string }
): Promise<ApiResponse<void>> {
  return request<ApiResponse<void>>({
    url: `${API_ENDPOINT}/${orderId}/reject`,
    method: "PUT",
    data: payload,
  });
}

// Export as service object
export const shopOrderService = {
  getShopOrders,
  getShopOrderById,
  getShopOrderByNumber,
  getShopOrderStatistics,
  updateShopOrderStatus,
  updateShopOrderShipping,
  cancelShopOrder,
  rejectShopOrder,
};

// ==================== BULK SHIPPING APIs ====================


/**
 * Bulk confirm orders (→ FULFILLING)
 * POST /api/v1/shop/orders/bulk-confirm
 */
export async function bulkConfirmOrders(
  payload: BulkOrderRequest
): Promise<ApiResponse<BulkOrderResponse>> {
  return request<ApiResponse<BulkOrderResponse>>({
    url: `${API_ENDPOINT}/bulk-confirm`,
    method: "POST",
    data: payload,
  });
}

/**
 * Bulk mark orders ready for pickup (→ READY_FOR_PICKUP)
 * POST /api/v1/shop/orders/bulk-ready-pickup
 */
export async function bulkReadyForPickup(
  payload: BulkOrderRequest
): Promise<ApiResponse<BulkOrderResponse>> {
  return request<ApiResponse<BulkOrderResponse>>({
    url: `${API_ENDPOINT}/bulk-ready-pickup`,
    method: "POST",
    data: payload,
  });
}

/**
 * Get pending shipment orders with filters
 * GET /api/v1/shop/orders/pending-shipment
 */
export async function getPendingShipmentOrders(
  params: PendingShipmentRequest
): Promise<ApiResponse<PendingShipmentResponse>> {
  return request<ApiResponse<PendingShipmentResponse>>({
    url: `${API_ENDPOINT}/pending-shipment`,
    method: "GET",
    params,
  });
}

