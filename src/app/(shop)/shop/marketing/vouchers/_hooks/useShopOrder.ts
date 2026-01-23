/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  ShopGetOrdersRequest,
  ShopOrderStatusUpdateRequest,
  ShopOrderShippingUpdateRequest,
  ShopOrderResponse,
  ShopOrderListResponse,
  ShopOrderStatisticsResponse,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import {
  getShopOrders,
  getShopOrderById,
  getShopOrderByNumber,
  updateShopOrderStatus,
  updateShopOrderShipping,
  getShopOrderStatistics,
  cancelShopOrder,
  rejectShopOrder,
} from "@/app/(main)/shop/_service/shop.order.service";
import { ApiResponse } from "@/api/_types/api.types";

// ==================== GET SHOP ORDERS ====================

export function useGetShopOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopOrders = async (
    params: ShopGetOrdersRequest
  ): Promise<ApiResponse<ShopOrderListResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopOrders(params);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lấy danh sách đơn hàng thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopOrders, loading, error };
}

// ==================== GET ORDER BY ID ====================

export function useGetShopOrderById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopOrderById = async (
    orderId: string
  ): Promise<ApiResponse<ShopOrderResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopOrderById(orderId);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lấy thông tin đơn hàng thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopOrderById, loading, error };
}

// ==================== GET ORDER BY ORDER NUMBER ====================

export function useGetShopOrderByNumber() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopOrderByNumber = async (
    orderNumber: string
  ): Promise<ApiResponse<ShopOrderResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopOrderByNumber(orderNumber);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lấy thông tin đơn hàng thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopOrderByNumber, loading, error };
}

// ==================== UPDATE ORDER STATUS ====================

export function useUpdateShopOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateShopOrderStatus = async (
    orderId: string,
    payload: ShopOrderStatusUpdateRequest
  ): Promise<ApiResponse<void> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateShopOrderStatus(orderId, payload);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Cập nhật trạng thái đơn hàng thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateShopOrderStatus, loading, error };
}

// ==================== UPDATE SHIPPING INFO ====================

export function useUpdateShopOrderShipping() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateShopOrderShipping = async (
    orderId: string,
    payload: ShopOrderShippingUpdateRequest
  ): Promise<ApiResponse<void> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateShopOrderShipping(orderId, payload);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Cập nhật thông tin vận chuyển thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateShopOrderShipping, loading, error };
}

// ==================== GET ORDER STATISTICS ====================

export function useGetShopOrderStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopOrderStatistics = async (
    period: string = "week"
  ): Promise<ApiResponse<ShopOrderStatisticsResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopOrderStatistics(period);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Lấy thống kê đơn hàng thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopOrderStatistics, loading, error };
}

// ==================== CANCEL ORDER ====================

export function useCancelShopOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelShopOrder = async (
    orderId: string,
    payload: { reason: string }
  ): Promise<ApiResponse<void> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await cancelShopOrder(orderId, payload);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Hủy đơn hàng thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCancelShopOrder, loading, error };
}

// ==================== REJECT ORDER ====================

export function useRejectShopOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRejectShopOrder = async (
    orderId: string,
    payload: { reason: string }
  ): Promise<ApiResponse<void> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await rejectShopOrder(orderId, payload);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Từ chối đơn hàng thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleRejectShopOrder, loading, error };
}

// ==================== BULK SHIPPING OPERATIONS ====================

import {
  bulkConfirmOrders,
  bulkReadyForPickup,
  getPendingShipmentOrders,
} from "@/app/(main)/shop/_service/shop.order.service";
import type {
  BulkOrderRequest,
  BulkOrderResponse,
  PendingShipmentRequest,
  PendingShipmentResponse,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";

/**
 * Bulk confirm orders (→ FULFILLING)
 */
export function useBulkConfirmOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBulkConfirmOrders = async (
    payload: BulkOrderRequest
  ): Promise<ApiResponse<BulkOrderResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await bulkConfirmOrders(payload);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Xác nhận hàng loạt thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleBulkConfirmOrders, loading, error };
}

/**
 * Bulk mark orders ready for pickup (→ READY_FOR_PICKUP)
 */
export function useBulkReadyForPickup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBulkReadyForPickup = async (
    payload: BulkOrderRequest
  ): Promise<ApiResponse<BulkOrderResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await bulkReadyForPickup(payload);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Chuyển chờ lấy hàng thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleBulkReadyForPickup, loading, error };
}

/**
 * Get pending shipment orders with advanced filters
 */
export function useGetPendingShipmentOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPendingShipmentOrders = async (
    params: PendingShipmentRequest
  ): Promise<ApiResponse<PendingShipmentResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPendingShipmentOrders(params);
      return res;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Lấy danh sách đơn chờ giao thất bại";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetPendingShipmentOrders, loading, error };
}
