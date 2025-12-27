import {
    Factory,
    Globe,
    ShieldCheck,
    Truck,
    Zap
} from "lucide-react";

export const QUICK_ACCESS_ITEMS = (categorySlug?: string) => [
  {
    id: "freeship",
    label: "Freeship Xtra",
    icon: <Truck className="h-6 w-6" />,
    badge: "Free",
    link: `/category/${categorySlug || ""}?filter=freeship`,
    bgClass: "bg-orange-50 text-orange-600 ring-orange-100 shadow-orange-100",
  },
  {
    id: "trending",
    label: "Xu Hướng",
    icon: <Zap className="h-6 w-6" />,
    badge: "Hot",
    link: `/category/${categorySlug || ""}?sort=sold,desc`,
    bgClass: "bg-rose-50 text-rose-600 ring-rose-100 shadow-rose-100",
  },
  {
    id: "international",
    label: "Toàn Cầu",
    icon: <Globe className="h-6 w-6" />,
    badge: "Global",
    link: `/category/${categorySlug || ""}?filter=international`,
    bgClass: "bg-blue-50 text-blue-600 ring-blue-100 shadow-blue-100",
  },
  {
    id: "mall",
    label: "Calatha Mall",
    icon: <ShieldCheck className="h-6 w-6" />,
    badge: "Mall",
    link: `/category/${categorySlug || ""}?filter=mall`,
    bgClass: "bg-red-50 text-red-600 ring-red-100 shadow-red-100",
  },
  {
    id: "factory",
    label: "Hàng Xưởng",
    icon: <Factory className="h-6 w-6" />,
    badge: "Giá Gốc",
    link: `/category/${categorySlug || ""}?filter=factory`,
    bgClass:
      "bg-emerald-50 text-emerald-600 ring-emerald-100 shadow-emerald-100",
  },
];
