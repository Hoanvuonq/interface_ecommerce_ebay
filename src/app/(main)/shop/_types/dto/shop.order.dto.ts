// ==================== RE-EXPORT từ Manager ====================
// Sử dụng lại DTOs từ manager/order
export type {
  OrderResponse,
  OrderItemResponse,
  OrderListResponse,
}  from "@/types/orders/order.dto";
import type { OrderResponse } from "@/types/orders/order.types";
import { OrderStatus } from "@/types/orders/order.dto";

// ==================== SHOP-SPECIFIC REQUEST DTOs ====================

/**
 * Shop get orders - Filter request
 * GET /api/v1/shop/orders
 */
export interface ShopGetOrdersRequest {
  status?: string;
  fromDate?: string; // ISO 8601
  toDate?: string; // ISO 8601
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Shop update order status
 * PUT /api/v1/shop/orders/{orderId}/status
 */
export interface ShopOrderStatusUpdateRequest {
  status: string; // Backend: OrderStatus enum
  note?: string;
}

/**
 * Shop update shipping info (DEPRECATED)
 * PUT /api/v1/shop/orders/{orderId}/shipping
 */
export interface ShopOrderShippingUpdateRequest {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: string;
}

// ==================== BATCH MANAGEMENT ====================

/**
 * Shipping Batch for bulk order processing
 */
export interface ShippingBatch {
  batchId: string;
  batchNumber: string;
  createdAt: string;
  updatedAt?: string;
  orderCount: number;
  carrier: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  status: BatchStatus;
  orders: OrderResponse[];
  notes?: string;
}

export enum BatchStatus {
  PENDING = "PENDING",
  READY = "READY",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/**
 * Create shipping batch request
 */
export interface CreateBatchRequest {
  orderIds: string[];
  carrier: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  notes?: string;
}

/**
 * Confirm batch handover request
 */
export interface ConfirmHandoverRequest {
  batchId: string;
  driverId?: string;
  driverName: string;
  driverPhone: string;
  notes?: string;
}

// ==================== RETURN & REFUND MANAGEMENT ====================

/**
 * Return/Refund Request
 */
export interface ReturnRequest {
  requestId: string;
  orderId: string;
  orderNumber: string;
  type: ReturnType;
  reason: string;
  requester: "CUSTOMER" | "SHOP";
  requesterId: string;
  requesterName?: string;
  evidencePhotos: string[];
  status: ReturnStatus;
  deadline: string;
  createdAt: string;
  updatedAt?: string;
  shopResponse?: string;
  shopResponseAt?: string;
  // Embedded order info for quick display
  productName?: string;
  productImage?: string;
  orderTotal?: number;
}

export enum ReturnType {
  RETURN_ONLY = "RETURN_ONLY",
  RETURN_REFUND = "RETURN_REFUND",
  REFUND_ONLY = "REFUND_ONLY",
}

export enum ReturnStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/**
 * Approve return request
 */
export interface ApproveReturnRequest {
  requestId: string;
  note?: string;
}

/**
 * Reject return request
 */
export interface RejectReturnRequest {
  requestId: string;
  reason: string;
}

// ==================== SHIPPING CARRIER CONFIGURATION ====================

/**
 * Shipping Carrier Configuration
 */
export interface ShippingCarrier {
  carrierId: string;
  name: string;
  displayName: string;
  category: CarrierCategory;
  enabled: boolean;
  codEnabled: boolean;
  maxWeight: number; // in kg
  maxDimensions: Dimensions;
  feeRange?: { min: number; max: number };
  serviceArea: string[]; // List of provinces/cities
  description?: string;
  logo?: string;
  awbTemplate?: string; // URL to AWB template
}

export enum CarrierCategory {
  EXPRESS = "EXPRESS", // 🔥 Hỏa tốc
  FAST = "FAST", // ⚡ Nhanh
  LOCKER = "LOCKER", // 🏪 Tủ nhận hàng
  BULKY = "BULKY", // 📦 Hàng cồng kềnh
  THIRD_PARTY = "THIRD_PARTY", // ➕ Bên thứ 3
}

export interface Dimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

/**
 * Update carrier configuration request
 */
export interface UpdateCarrierRequest {
  carrierId: string;
  enabled?: boolean;
  codEnabled?: boolean;
  maxWeight?: number;
  maxDimensions?: Dimensions;
  feeRange?: { min: number; max: number };
  serviceArea?: string[];
}

// ==================== PICKUP LOCATIONS ====================

/**
 * Pickup Location for batch shipping
 */
export interface PickupLocation {
  locationId: string;
  name: string;
  address: string;
  phone: string;
  contactPerson: string;
  isDefault: boolean;
  isActive: boolean;
}

// ==================== HELPER TYPES ====================

/**
 * Filter options for batch list
 */
export interface BatchFilterOptions {
  status?: BatchStatus;
  carrier?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

/**
 * Filter options for return requests
 */
export interface ReturnFilterOptions {
  status?: ReturnStatus;
  type?: ReturnType;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}
