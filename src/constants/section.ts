import {
    Car,
    Globe,
    Smartphone,
    Star,
    Tag,
    User,
    ShoppingBag,
    LogOut,
    Users,
    Home,
    Trophy,
    Zap,
    LucideIcon,
    CircleDollarSign,
    CircleDollarSignIcon as finance,
} from "lucide-react";


interface QuickLinkItemData {
    key: string;
    label: string;
    href: string;
    icon: LucideIcon;
    color: string;
    bgColor?: string;
}

export const QuickLinks: QuickLinkItemData[] = [
    {
        key: "flash",
        label: "Flash Sale",
        href: "/sale",
        icon: Zap,
        color: "#FF5F17", // Cam rực rỡ
        bgColor: "bg-orange-50",
    },
    {
        key: "voucher",
        label: "Mã giảm giá",
        href: "/coupons",
        icon: Tag,
        color: "#F44336", // Đỏ 
        bgColor: "bg-red-50",
    },
  
     {
        key: "freeship",
        label: "Freeship",
        href: "/freeship",
        icon: Car,
        color: "#00B894",
        bgColor: "bg-emerald-50",
    },
    {
        key: "best",
        label: "Bán chạy",
        href: "/products?sort=best-seller",
        icon: Trophy,
        color: "#FBC02D", // Vàng đậm 3D
        bgColor: "bg-yellow-50",
    },
      {
        key: "new",
        label: "Hàng mới",
        href: "/new",
        icon: Star,
        color: "#1E88E5", // Xanh dương
        bgColor: "bg-blue-50",
    },
    {
        key: "topup",
        label: "Nạp thẻ",
        href: "/topup",
        icon: Smartphone,
        color: "#673AB7", // Tím
        bgColor: "bg-purple-50",
    },
    {
        key: "coin",
        label: "Hoàn xu",
        href: "/coin",
        icon: CircleDollarSign,
        color: "#FF9800", // Cam vàng
        bgColor: "bg-amber-50",
    },
    {
        key: "global",
        label: "Quốc tế",
        href: "/international",
        icon: Globe,
        color: "#8E24AA", // Tím hồng
        bgColor: "bg-indigo-50",
    },
];

export const GRADIENT_PRESETS = [
    {
        gradient: "from-blue-300 via-cyan-200 to-teal-300",
        bgColor: "bg-blue-600",
        textColor: "text-blue-900",
        textColorSecondary: "text-blue-800",
        borderColor: "border-blue-400/30",
        badgeColor: "bg-blue-600",
        shadowColor: "bg-blue-400/20",
        shadowColor2: "bg-blue-500/15",
    },
    {
        gradient: "from-orange-400 via-pink-400 to-red-500",
        bgColor: "bg-orange-600",
        textColor: "text-orange-900",
        textColorSecondary: "text-orange-800",
        borderColor: "border-orange-400/30",
        badgeColor: "bg-orange-600",
        shadowColor: "bg-orange-400/20",
        shadowColor2: "bg-orange-500/15",
    },
    {
        gradient: "from-purple-400 via-indigo-400 to-blue-500",
        bgColor: "bg-purple-600",
        textColor: "text-purple-900",
        textColorSecondary: "text-purple-800",
        borderColor: "border-purple-400/30",
        badgeColor: "bg-purple-600",
        shadowColor: "bg-purple-400/20",
        shadowColor2: "bg-purple-500/15",
    },
    {
        gradient: "from-green-400 via-emerald-300 to-teal-400",
        bgColor: "bg-green-600",
        textColor: "text-green-900",
        textColorSecondary: "text-green-800",
        borderColor: "border-green-400/30",
        badgeColor: "bg-green-600",
        shadowColor: "bg-green-400/20",
        shadowColor2: "bg-green-500/15",
    },
    {
        gradient: "from-pink-400 via-rose-300 to-red-400",
        bgColor: "bg-pink-600",
        textColor: "text-pink-900",
        textColorSecondary: "text-pink-800",
        borderColor: "border-pink-400/30",
        badgeColor: "bg-pink-600",
        shadowColor: "bg-pink-400/20",
        shadowColor2: "bg-pink-500/15",
    },
];

// Cập nhật interface IAccountMenuItem để sử dụng LucideIcon
interface IAccountMenuItem {
    key: string;
    icon?: LucideIcon;
    iconClassName?: string;
    label: string;
    className?: string;
    roles: string[];
    hideOn?: string;
    danger?: boolean;
}

export const ACCOUNT_MENU_CONFIG: IAccountMenuItem[] = [
    {
        key: "profile",
        icon: User,
        iconClassName: "text-blue-500",
        label: "Hồ sơ cá nhân",
        roles: ["BUYER", "ADMIN"],
    },
    {
        key: "orders",
        icon: ShoppingBag,
        iconClassName: "text-purple-500",
        label: "Đơn hàng đã mua",
        roles: ["BUYER"],
    },
    {
        key: "employee",
        icon: Home,
        iconClassName: "text-blue-500",
        label: "Quản lý nhân viên",
        roles: ["ADMIN"],
        hideOn: "/employee",
    },
    {
        key: "admin",
        icon: Users,
        iconClassName: "text-orange-500",
        label: "Quản lý admin",
        roles: ["ADMIN"],
        hideOn: "/manager",
    },
    {
        key: "logout",
        icon: LogOut,
        iconClassName: "text-red-500",
        label: "Đăng xuất",
        roles: ["BUYER", "ADMIN"],
        danger: true,
    },
];