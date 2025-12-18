import { Gift, LucideIcon, ShoppingCart, Zap } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
  iconBgClass: string;
  iconFillClass: string;
  hoverClass: string;
}

export const features: FeatureItem[] = [
  {
    icon: Zap,
    title: "Giao hàng nhanh",
    description: "Miễn phí cho đơn từ 500K",
    colorClass: "text-blue-600",
    iconBgClass: "bg-blue-50",
    iconFillClass: "fill-blue-100",
    hoverClass: "hover:bg-blue-50/30",
  },
  {
    icon: Gift,
    title: "Ưu đãi cực khủng",
    description: "Voucher giảm đến 50% mỗi ngày",
    colorClass: "text-orange-600",
    iconBgClass: "bg-orange-50",
    iconFillClass: "fill-orange-100",
    hoverClass: "hover:bg-orange-50/30",
  },
  {
    icon: ShoppingCart,
    title: "Mua sắm an toàn",
    description: "Bảo mật thanh toán 100%",
    colorClass: "text-green-600",
    iconBgClass: "bg-green-50",
    iconFillClass: "fill-green-100",
    hoverClass: "hover:bg-green-50/30",
  },
];