import { 
  Package, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Clock, 
  RefreshCw, 
  PackageCheck 
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