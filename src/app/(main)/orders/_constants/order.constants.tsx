import React from "react";
import {
  Clock,
  CreditCard,
  CheckCircle2,
  Truck,
  XCircle,
  RefreshCw,
  PackageCheck,
  ShieldCheck,
  RotateCcw,
  AlertOctagon,
  PackageX,
  Banknote,
  HelpCircle,
  Ban,
  ArrowLeftRight,
} from "lucide-react";

import {
  OrderGroupStatus,
  OrderStatus,
  OrderCountResponse,
} from "../_types/order";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";

export const PRIMARY_COLOR = "#f97316";

export const ORDER_STATUS_TABS = [
  { label: "Tất cả", value: OrderGroupStatus.ALL, color: "text-gray-600" },
  {
    label: "Chờ xác nhận",
    value: OrderGroupStatus.PENDING,
    color: "text-blue-600",
  },
  {
    label: "Đang xử lý",
    value: OrderGroupStatus.PROCESSING,
    color: "text-orange-600",
  },
  {
    label: "Đang giao",
    value: OrderGroupStatus.SHIPPING,
    color: "text-indigo-600",
  },
  {
    label: "Hoàn thành",
    value: OrderGroupStatus.COMPLETED,
    color: "text-emerald-600",
  },
  {
    label: "Trả hàng/Hoàn tiền",
    value: OrderGroupStatus.RETURN_REFUND,
    color: "text-rose-600",
  },
  {
    label: "Đã hủy",
    value: OrderGroupStatus.CANCELLED,
    color: "text-gray-500",
  },
];

interface StatusUIConfig {
  label: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  strip: string;
}

// Fallback config
export const DEFAULT_STATUS_CONFIG: StatusUIConfig = {
  label: "Trạng thái khác",
  icon: <HelpCircle size={14} />,
  bg: "bg-gray-50",
  text: "text-gray-400",
  border: "border-gray-100",
  strip: "#E5E7EB",
};

export const ORDER_STATUS_UI: Record<OrderStatus, StatusUIConfig> = {
  // PENDING GROUP
  [OrderStatus.CREATED]: {
    label: "Đơn mới",
    icon: <Clock size={14} />,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    strip: "#3B82F6",
  },
  [OrderStatus.AWAITING_PAYMENT]: {
    label: "Chờ thanh toán",
    icon: <CreditCard size={14} />,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    strip: "#F59E0B",
  },
  [OrderStatus.PAID]: {
    label: "Đã thanh toán",
    icon: <CheckCircle2 size={14} />,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    strip: "#10B981",
  },

  // PROCESSING GROUP
  [OrderStatus.FULFILLING]: {
    label: "Đang chuẩn bị",
    icon: <PackageCheck size={14} />,
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
    strip: "#FB923C",
  },
  [OrderStatus.READY_FOR_PICKUP]: {
    label: "Chờ lấy hàng",
    icon: <PackageCheck size={14} />,
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    strip: "#EA580C",
  },

  // SHIPPING GROUP
  [OrderStatus.SHIPPED]: {
    label: "Đã giao ĐVVC",
    icon: <Truck size={14} />,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
    strip: "#6366F1",
  },
  [OrderStatus.OUT_FOR_DELIVERY]: {
    label: "Đang giao",
    icon: <Truck size={14} />,
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
    strip: "#4F46E5",
  },

  // COMPLETED GROUP
  [OrderStatus.DELIVERED]: {
    label: "Đã giao hàng",
    icon: <CheckCircle2 size={14} />,
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
    strip: "#059669",
  },
  [OrderStatus.COMPLETED]: {
    label: "Hoàn thành",
    icon: <ShieldCheck size={14} />,
    bg: "bg-emerald-600",
    text: "text-white",
    border: "border-emerald-600",
    strip: "#047857",
  },

  // CANCELLED GROUP
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    icon: <XCircle size={14} />,
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
    strip: "#94A3B8",
  },

  // RETURN/REFUND GROUP
  [OrderStatus.REJECTED]: {
    label: "Đã từ chối",
    icon: <Ban size={14} />,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    strip: "#EF4444",
  },
  [OrderStatus.RETURN_REQUESTED]: {
    label: "Yêu cầu trả hàng",
    icon: <RotateCcw size={14} />,
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
    strip: "#F43F5E",
  },
  [OrderStatus.RETURN_APPROVED]: {
    label: "Đồng ý trả hàng",
    icon: <CheckCircle2 size={14} />,
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    strip: "#E11D48",
  },
  [OrderStatus.RETURNING]: {
    label: "Đang hoàn về",
    icon: <RefreshCw size={14} />,
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
    strip: "#9333EA",
  },
  [OrderStatus.RETURNED]: {
    label: "Đã nhận hàng hoàn",
    icon: <PackageX size={14} />,
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    strip: "#7E22CE",
  },
  [OrderStatus.RETURN_DISPUTED]: {
    label: "Khiếu nại trả hàng",
    icon: <AlertOctagon size={14} />,
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-100",
    strip: "#CA8A04",
  },
  [OrderStatus.RETURN_REJECTED]: {
    label: "Từ chối trả hàng",
    icon: <Ban size={14} />,
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    strip: "#DC2626",
  },
  [OrderStatus.REFUND_PENDING]: {
    label: "Chờ hoàn tiền",
    icon: <Clock size={14} />,
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-100",
    strip: "#DB2777",
  },
  [OrderStatus.REFUNDED]: {
    label: "Đã hoàn tiền",
    icon: <Banknote size={14} />,
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
    strip: "#BE185D",
  },
  [OrderStatus.DELIVERY_FAILED]: {
    label: "Giao thất bại",
    icon: <AlertOctagon size={14} />,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    strip: "#EF4444",
  },
  [OrderStatus.RETURNING_TO_SENDER]: {
    label: "Đang trả về shop",
    icon: <ArrowLeftRight size={14} />,
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    strip: "#F97316",
  },
  [OrderStatus.RETURNED_TO_SENDER]: {
    label: "Đã trả về shop",
    icon: <PackageCheck size={14} />,
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-300",
    strip: "#C2410C",
  },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  VNPAY: "Ví VNPay",
  MOMO: "Ví MoMo",
  PAYOS: "Chuyển khoản QR",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
  CREDIT_CARD: "Thẻ tín dụng",
};


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

export const getCountFromApi = (
  groupKey: OrderGroupStatus,
  apiData: OrderCountResponse | undefined | null
): number => {
  if (!apiData) return 0;

  switch (groupKey) {
    case OrderGroupStatus.ALL:
      return apiData.total;
    case OrderGroupStatus.PENDING:
      return apiData.pending;
    case OrderGroupStatus.PROCESSING:
      return apiData.processing;
    case OrderGroupStatus.SHIPPING:
      return apiData.shipping;
    case OrderGroupStatus.COMPLETED:
      return apiData.completed;
    case OrderGroupStatus.RETURN_REFUND:
      return apiData.returnRefund;
    case OrderGroupStatus.CANCELLED:
      return apiData.cancelled;
    default:
      return 0;
  }
};

// Helper để lấy config UI an toàn
export const getOrderStatusConfig = (status: string): StatusUIConfig => {
  return ORDER_STATUS_UI[status as OrderStatus] || DEFAULT_STATUS_CONFIG;
};
