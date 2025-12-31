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
    
  },
  {
    id: "trending",
    label: "Xu Hướng",
    icon: <Zap className="h-6 w-6" />,
    badge: "Hot",
    link: `/category/${categorySlug || ""}?sort=sold,desc`,
     
  },
  {
    id: "international",
    label: "Toàn Cầu",
    icon: <Globe className="h-6 w-6" />,
    badge: "Global",
    link: `/category/${categorySlug || ""}?filter=international`,
     
  },
  {
    id: "mall",
    label: "Calatha Mall",
    icon: <ShieldCheck className="h-6 w-6" />,
    badge: "Mall",
    link: `/category/${categorySlug || ""}?filter=mall`,
     
  },
  {
    id: "factory",
    label: "Hàng Xưởng",
    icon: <Factory className="h-6 w-6" />,
    badge: "Giá Gốc",
    link: `/category/${categorySlug || ""}?filter=factory`,
     
  },
];
