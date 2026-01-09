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
} from "lucide-react";
import React from "react";

export const PRIMARY_COLOR = "#f97316";

export const ORDER_STATUS_UI: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    bg: string;
    text: string;
    border: string;
    strip: string;
  }
> = {
  CREATED: {
    label: "Chờ xác nhận",
    icon: <Clock size={14} />,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    strip: "#3B82F6",
  },
  PENDING_PAYMENT: {
    // Đồng bộ key với STATUS_OPTIONS và MAP_COUNT_KEY
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
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    strip: "#10B981",
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
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
    strip: "#6366F1",
  },
  DELIVERED: {
    label: "Đã giao hàng",
    icon: <PackageCheck size={14} />,
    bg: "bg-orange-600",
    text: "text-white",
    border: "border-orange-600",
    strip: "#EA580C",
  },
  COMPLETED: {
    label: "Giao thành công",
    icon: <ShieldCheck size={14} />,
    bg: "bg-emerald-600",
    text: "text-white",
    border: "border-emerald-600",
    strip: "#059669",
  },
  CANCELLED: {
    label: "Đã hủy đơn",
    icon: <XCircle size={14} />,
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
    strip: "#94A3B8",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    icon: <RotateCcw size={14} />,
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
    strip: "#F43F5E",
  },
  DEFAULT: {
    label: "Đang cập nhật",
    icon: <Clock size={14} />,
    bg: "bg-gray-50",
    text: "text-gray-400",
    border: "border-gray-100",
    strip: "#E5E7EB",
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
