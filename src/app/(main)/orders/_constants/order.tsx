import { 
  Package, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Clock, 
  RefreshCw, 
  PackageCheck, 
  DollarSign
} from "lucide-react";
import React from "react";

export const ORDER_STATUS_UI: Record<string, { 
  label: string; 
  icon: React.ReactNode; 
  bg: string; 
  text: string; 
  border: string; 
  strip: string; 
}> = {
  CREATED: {
    label: "Đã tạo đơn",
    icon: <Clock size={14} />,
    bg: "bg-orange-50/50",
    text: "text-orange-500",
    border: "border-orange-100",
    strip: "#FFEDD5", 
  },
  PENDING_PAYMENT: {
    label: "Chờ thanh toán",
    icon: <CreditCard size={14} />,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    strip: "#F59E0B",
  },
  PAID: {
    label: "Đã thanh toán",
    icon: <CheckCircle2 size={14} />,
    bg: "bg-orange-100/50",
    text: "text-orange-700",
    border: "border-orange-200",
    strip: "#F97316",
  },
  FULFILLING: {
    label: "Đang chuẩn bị",
    icon: <RefreshCw size={14} className="animate-spin" />,
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
    strip: "#FB923C",
  },
  SHIPPED: {
    label: "Đang giao hàng",
    icon: <Truck size={14} />,
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
    strip: "#EA580C",
  },
  DELIVERED: {
    label: "Giao thành công",
    icon: <PackageCheck size={14} />,
    bg: "bg-orange-600", 
    text: "text-white",
    border: "border-orange-600",
    strip: "#C2410C",
  },
  CANCELLED: {
    label: "Đã hủy đơn",
    icon: <XCircle size={14} />,
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    strip: "#CBD5E1",
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

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  CREATED: {
    label: "Đã tạo",
    icon: <Clock size={14} />,
  },
  PENDING_PAYMENT: {
    label: "Chờ thanh toán",
    icon: <DollarSign size={14} />,
  },
  PAID: {
    label: "Đã thanh toán",
    icon: <CheckCircle2 size={14} />,
  },
  FULFILLING: {
    label: "Đang chuẩn bị",
    icon: <RefreshCw size={14} className="animate-spin-slow" />,
  },
  SHIPPED: {
    label: "Đang giao hàng",
    icon: <Truck size={14} />,
  },
  OUT_FOR_DELIVERY: {
    label: "Đang giao",
    icon: <Truck size={14} className="animate-pulse" />,
  },
  DELIVERED: {
    label: "Đã giao",
    icon: <CheckCircle2 size={14} />,
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: <XCircle size={14} />,
  },
  REFUNDING: {
    label: "Đang hoàn tiền",
    icon: <RefreshCw size={14} className="animate-spin-slow" />,
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    icon: <CheckCircle2 size={14} />,
  },
};


export const STATUS_STYLE: Record<
  string,
  { strip: string; tagBg: string; tagText: string; border: string }
> = {
  PENDING_PAYMENT: {
    strip: "#F97316",
    tagBg: "#FFEDD5",
    tagText: "#C2410C",
    border: "border-orange-200",
  }, // Orange
  CREATED: {
    strip: "#3B82F6",
    tagBg: "#DBEAFE",
    tagText: "#1D4ED8",
    border: "border-blue-200",
  }, // Blue
  FULFILLING: {
    strip: "#3B82F6",
    tagBg: "#DBEAFE",
    tagText: "#1D4ED8",
    border: "border-blue-200",
  },
  SHIPPED: {
    strip: "#22C55E",
    tagBg: "#DCFCE7",
    tagText: "#15803D",
    border: "border-green-200",
  }, // Green
  OUT_FOR_DELIVERY: {
    strip: "#22C55E",
    tagBg: "#DCFCE7",
    tagText: "#15803D",
    border: "border-green-200",
  },
  DELIVERED: {
    strip: "#14B8A6",
    tagBg: "#CCFBF1",
    tagText: "#0F766E",
    border: "border-teal-200",
  }, // Teal
  PAID: {
    strip: "#14B8A6",
    tagBg: "#CCFBF1",
    tagText: "#0F766E",
    border: "border-teal-200",
  },
  CANCELLED: {
    strip: "#EF4444",
    tagBg: "#FEE2E2",
    tagText: "#B91C1C",
    border: "border-red-200",
  }, // Red
  REFUNDING: {
    strip: "#F97316",
    tagBg: "#FFEDD5",
    tagText: "#C2410C",
    border: "border-orange-200",
  },
  REFUNDED: {
    strip: "#6B7280",
    tagBg: "#F3F4F6",
    tagText: "#374151",
    border: "border-gray-200",
  }, // Gray
  DEFAULT: {
    strip: "#6B7280",
    tagBg: "#F3F4F6",
    tagText: "#374151",
    border: "border-gray-200",
  },
};