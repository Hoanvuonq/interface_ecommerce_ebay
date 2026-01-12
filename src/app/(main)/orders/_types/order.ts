import { OrderResponse } from "@/types/orders/order.dto";

// ==========================================
// 1. ENUMS (Chuyển Enum về đây để dùng chung)
// ==========================================

// Enum cho các NHÓM TRẠNG THÁI (Dùng cho Tabs Filter)
export enum OrderGroupStatus {
  ALL = 'ALL',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  RETURN_REFUND = 'RETURN_REFUND',
  CANCELLED = 'CANCELLED',
}

// Enum cho TRẠNG THÁI CHI TIẾT (Dùng cho từng đơn hàng)
export enum OrderStatus {
  // PENDING GROUP
  CREATED = 'CREATED',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  PAID = 'PAID',

  // PROCESSING GROUP
  FULFILLING = 'FULFILLING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',

  // SHIPPING GROUP
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',

  // COMPLETED GROUP
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',

  // CANCELLED GROUP
  CANCELLED = 'CANCELLED',
  
  // RETURN/REFUND GROUP
  REJECTED = 'REJECTED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURN_APPROVED = 'RETURN_APPROVED',
  RETURNING = 'RETURNING',
  RETURNED = 'RETURNED',
  RETURN_DISPUTED = 'RETURN_DISPUTED',
  RETURN_REJECTED = 'RETURN_REJECTED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  RETURNING_TO_SENDER = 'RETURNING_TO_SENDER',
  RETURNED_TO_SENDER = 'RETURNED_TO_SENDER',
}

// ==========================================
// 2. INTERFACES
// ==========================================

export interface OrderCountResponse {
  pending: number;
  processing: number;
  shipping: number;
  completed: number;
  returnRefund: number;
  cancelled: number;
  total: number;
}

export interface OrderFiltersProps {
  searchText: string;
  statusFilter: OrderGroupStatus; // Dùng Enum chuẩn
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderGroupStatus) => void; // Dùng Enum chuẩn
}

export interface OrderDetailViewProps {
  order: OrderResponse;
}

export interface OrderCardProps {
  order: OrderResponse;
  onViewDetail: (orderId: string) => void;
  onOrderCancelled?: () => void;
}