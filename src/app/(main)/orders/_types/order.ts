import { OrderResponse } from "@/types/orders/order.types";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";

export const PRIMARY_COLOR = "#f97316";

export const STATUS_OPTIONS = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ thanh toán", value: "AWAITING_PAYMENT" },
  { label: "Chờ xác nhận", value: "CREATED" },
  { label: "Đang xử lý", value: "FULFILLING" },
  { label: "Đang giao", value: "SHIPPED" },
  { label: "Thành công", value: "COMPLETED" },
  { label: "Trả hàng", value: "RETURNED" }, 
  { label: "Đã hủy", value: "CANCELLED" },
];

export const MAP_COUNT_KEY: Record<string, keyof OrderCountResponse> = {
  ALL: "total", 

  /// check 
  AWAITING_PAYMENT: "awaitingPayment",
  CREATED: "total",
  FULFILLING: "processing",
  SHIPPED: "shipping",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  RETURNED: "returning",
  CANCELLED: "cancelled",
};

export interface OrderCountResponse {
  awaitingPayment: number;
  processing: number;
  shipping: number;
  delivered: number;
  completed: number;
  returning: number;
  cancelled: number;
  total: number;
}

export interface OrderFiltersProps {
  searchText: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export interface OrderDetailViewProps {
  order: OrderResponse;
}

export interface OrderCardProps {
  order: OrderResponse;
  onViewDetail: (orderId: string) => void;
  onOrderCancelled?: () => void;
}

export const resolveOrderItemImageUrl = (
  basePath: string | null | undefined,
  extension: string | null | undefined,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_thumb"
): string => {
  if (basePath && extension) {
    const variant = {
      imageBasePath: basePath,
      imageExtension: extension.startsWith(".") ? extension : `.${extension}`,
    };
    return resolveVariantImageUrl(variant, size);
  }
  return "";
};
