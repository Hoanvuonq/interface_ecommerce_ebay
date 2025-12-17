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
} from "lucide-react"; // Đảm bảo import đúng từ @lucide/react hoặc lucide-react

// Định nghĩa lại interface cho QuickLinks để sử dụng LucideIcon
interface QuickLinkItem {
    key: string;
    label: string;
    href: string;
    icon: LucideIcon; // Sử dụng LucideIcon
    color: string;
}

export const QuickLinks: QuickLinkItem[] = [
    {
        key: "flash",
        label: "Flash Sale",
        href: "/sale",
        icon: Zap, // Thay thế ThunderboltOutlined
        color: "#FF5F17",
    },
    {
        key: "voucher",
        label: "Mã giảm giá",
        href: "/coupons",
        icon: Tag, // Thay thế TagOutlined
        color: "#F44336",
    },
    {
        key: "new",
        label: "Hàng mới",
        href: "/new",
        icon: Star, // Thay thế StarOutlined
        color: "#1E88E5",
    },
    {
        key: "best",
        label: "Bán chạy",
        href: "/products?sort=best-seller",
        icon: Trophy, // Thay thế TrophyOutlined
        color: "#FFC107",
    },
    {
        key: "freeship",
        label: "Freeship",
        href: "/freeship",
        icon: Car, // Thay thế CarOutlined
        color: "#00B894",
    },
    {
        key: "topup",
        label: "Nạp thẻ",
        href: "/topup",
        icon: Smartphone, // Thay thế MobileOutlined
        color: "#673AB7",
    },
    {
        key: "coin",
        label: "Hoàn xu",
        href: "/coin",
        icon: Smartphone, 
        color: "#FF9800",
    },
    {
        key: "global",
        label: "Quốc tế",
        href: "/international",
        icon: Globe, // Thay thế GlobalOutlined
        color: "#8E24AA",
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
    icon?: LucideIcon; // Sử dụng LucideIcon
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
        icon: User, // Thay thế UserOutlined
        iconClassName: "text-blue-500",
        label: "Hồ sơ cá nhân",
        roles: ["BUYER", "ADMIN"],
    },
    {
        key: "orders",
        icon: ShoppingBag, // Thay thế ShoppingOutlined
        iconClassName: "text-purple-500",
        label: "Đơn hàng đã mua",
        roles: ["BUYER"],
    },
    {
        key: "employee",
        icon: Home, // Thay thế HomeOutlined
        iconClassName: "text-blue-500",
        label: "Quản lý nhân viên",
        roles: ["ADMIN"],
        hideOn: "/employee",
    },
    {
        key: "admin",
        icon: Users, // Thay thế TeamOutlined
        iconClassName: "text-orange-500",
        label: "Quản lý admin",
        roles: ["ADMIN"],
        hideOn: "/manager",
    },
    {
        key: "logout",
        icon: LogOut, // Thay thế LogoutOutlined
        iconClassName: "text-red-500",
        label: "Đăng xuất",
        roles: ["BUYER", "ADMIN"],
        danger: true,
    },
];