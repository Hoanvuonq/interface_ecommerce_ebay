// ==================== ENUMS ====================

import { ReturnOrderStatus, ReturnOrderType } from "./order.types";
export enum OrderStatus {
  // Core order lifecycle
  CREATED = "CREATED",                      // Đơn hàng mới (COD)
  AWAITING_PAYMENT = "AWAITING_PAYMENT",    // Chờ buyer thanh toán (online)
  PAID = "PAID",                            // Buyer đã thanh toán
  FULFILLING = "FULFILLING",                // Shop đang đóng gói
  READY_FOR_PICKUP = "READY_FOR_PICKUP",    // Shop đã đóng gói, chờ shipper lấy
  SHIPPED = "SHIPPED",                      // Shipper đã lấy hàng, đang giao
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",    // Đang giao cho khách
  DELIVERED = "DELIVERED",                  // Giao thành công
  COMPLETED = "COMPLETED",                  // Hoàn thành (sau khi xác nhận)
  CANCELLED = "CANCELLED",                  // Đã hủy
  
  // Return & Refund lifecycle
  REJECTED = "REJECTED",                    // Đã từ chối
  RETURN_REQUESTED = "RETURN_REQUESTED",    // Yêu cầu trả hàng
  RETURN_APPROVED = "RETURN_APPROVED",      // Đồng ý trả hàng
  RETURNING = "RETURNING",                  // Đang hoàn về
  RETURNED = "RETURNED",                    // Đã nhận hàng hoàn
  RETURN_DISPUTED = "RETURN_DISPUTED",      // Khiếu nại trả hàng
  RETURN_REJECTED = "RETURN_REJECTED",      // Từ chối trả hàng
  REFUND_PENDING = "REFUND_PENDING",        // Chờ hoàn tiền
  REFUNDING = "REFUNDING",                  // Đang hoàn tiền
  REFUNDED = "REFUNDED",                    // Đã hoàn tiền
  
  // Delivery issues
  DELIVERY_FAILED = "DELIVERY_FAILED",      // Giao thất bại
  RETURNING_TO_SENDER = "RETURNING_TO_SENDER", // Đang trả về shop
  RETURNED_TO_SENDER = "RETURNED_TO_SENDER",   // Đã trả về shop
}

// Bản dịch trạng thái đơn hàng cho UI (giữ nguyên giá trị backend)
export const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  // Core order lifecycle
  [OrderStatus.CREATED]: "Đã tạo",
  [OrderStatus.AWAITING_PAYMENT]: "Chờ thanh toán",
  [OrderStatus.PAID]: "Đã thanh toán",
  [OrderStatus.FULFILLING]: "Đang chuẩn bị",
  [OrderStatus.READY_FOR_PICKUP]: "Chờ lấy hàng",
  [OrderStatus.SHIPPED]: "Đang giao",
  [OrderStatus.OUT_FOR_DELIVERY]: "Đang vận chuyển",
  [OrderStatus.DELIVERED]: "Đã giao",
  [OrderStatus.COMPLETED]: "Hoàn thành",
  [OrderStatus.CANCELLED]: "Đã hủy",
  
  // Return & Refund lifecycle
  [OrderStatus.REJECTED]: "Đã từ chối",
  [OrderStatus.RETURN_REQUESTED]: "Yêu cầu trả hàng",
  [OrderStatus.RETURN_APPROVED]: "Đồng ý trả hàng",
  [OrderStatus.RETURNING]: "Đang hoàn về",
  [OrderStatus.RETURNED]: "Đã nhận hàng hoàn",
  [OrderStatus.RETURN_DISPUTED]: "Khiếu nại trả hàng",
  [OrderStatus.RETURN_REJECTED]: "Từ chối trả hàng",
  [OrderStatus.REFUND_PENDING]: "Chờ hoàn tiền",
  [OrderStatus.REFUNDING]: "Đang hoàn tiền",
  [OrderStatus.REFUNDED]: "Đã hoàn tiền",
  
  // Delivery issues
  [OrderStatus.DELIVERY_FAILED]: "Giao thất bại",
  [OrderStatus.RETURNING_TO_SENDER]: "Đang trả về shop",
  [OrderStatus.RETURNED_TO_SENDER]: "Đã trả về shop",
};

// =======

// ==================== REQUEST DTOs ====================

/**
 * Admin get all orders - Filter request
 */
export interface AdminGetAllOrdersRequest {
  status?: OrderStatus | string;
  shopId?: string;
  buyerId?: string;
  fromDate?: string; // ISO 8601
  toDate?: string; // ISO 8601
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Admin update order status
 * PUT /api/v1/admin/orders/{orderId}/status
 */
export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  note?: string;
}

/**
 * Admin cancel order
 * PUT /api/v1/admin/orders/{orderId}/cancel
 */
export interface OrderCancelRequest {
  reason: string;
}

// ==================== RESPONSE DTOs ====================

/**
 * Order Item Response
 */
export interface OrderItemResponse {
  itemId: string;
  productId: string;
  variantId?: string;
  sku?: string;
  productName: string;
  imageBasePath?: string; // MediaAsset.basePath
  imageExtension?: string; // from MediaAsset.getExtension()
  variantAttributes?: string;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  lineTotal: number;
  fulfillmentStatus?: string;
  reviewed?: boolean;
}

export interface ReturnOrderResponse {
    returnId: string;
    orderId: string;
    orderNumber: string;
    type: ReturnOrderType;
    status: ReturnOrderStatus;
    reason: string;
    description: string;
    evidenceImages: string[];
    requestedAmount: number;
    refundedAmount?: number; 
    rejectedReason?: string; 
    createdAt: string;
    updatedAt: string;
}

/**
 * Order Response
 * Backend: OrderResponse.java
 */
export interface OrderResponse {
  orderId: string;
  orderNumber: string;

  // Shop & Buyer info
  shopId: string;
  shopInfo?: {
    shopId: string;
    shopName: string;
    description?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    status: string;
    rejectedReason?: string | null;
    verifyBy?: string | null;
    verifyDate?: string | null;
    createdBy?: string | null;
    createdDate?: string | null;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    deleted: boolean;
    version: number;
    userId: string;
    username: string;
  };
  buyerId: string;

  // Order details
  status: string;
  currency?: string;
  subtotal: number;
  orderDiscount: number;
  totalDiscount: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
  itemCount: number;
  totalQuantity: number;
  customerNote?: string;

  // Dates
  createdAt: string; // ISO 8601
  expiresAt?: string; // ISO 8601

  // Payment
  paymentMethod?: string;
  paymentUrl?: string;
  paymentIntentId?: string;

  // Items
  items: OrderItemResponse[];
}

/**
 * Paginated Order Response
 */
export interface OrderListResponse {
  content: OrderResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * Order Statistics Response (cho tương lai)
 */
export interface OrderStatisticsResponse {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;

  totalRevenue: number;
  averageOrderValue: number;

  // Statistics by period
  ordersByDate?: {
    date: string;
    count: number;
    revenue: number;
  }[];

  // Top products/shops (optional)
  topProducts?: {
    productId: string;
    productName: string;
    orderCount: number;
    revenue: number;
  }[];
}
