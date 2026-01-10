import {
  Home,
  BarChart3,
  Globe,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Megaphone,
  Headset,
  Wallet,
  Database,
  Settings,
  UserCircle,
  Banknote,
  LayoutDashboard,
  Truck,
  MessageSquare,
  Star,
  ShieldAlert,
  CreditCard,
  KeyRound,
  FileText
} from "lucide-react";

export const SHOP_SIDEBAR_ITEMS = [
  {
    key: "home",
    label: "Trang chủ",
    icon: <Home size={20} />,
    href: "/shop/dashboard",
  },
  {
    key: "analytics",
    label: "Phân tích bán hàng",
    icon: <BarChart3 size={20} />,
    href: "/shop/dashboard/analytics",
  },
  {
    key: "home-main",
    label: "Về trang chủ chính",
    icon: <Globe size={20} />,
    href: "/",
    isSpecial: true,
  },
  {
    key: "products",
    label: "Quản lý sản phẩm",
    icon: <ShoppingBag size={20} />,
    children: [
      {
        key: "add-product",
        label: "Thêm sản phẩm",
        href: "/shop/products/add",
      },
      {
        key: "list-products",
        label: "Danh sách sản phẩm",
        href: "/shop/products",
      },
    ],
  },
  {
    key: "orders",
    label: "Quản lý đơn hàng",
    icon: <ShoppingCart size={20} />,
    children: [
      { key: "orders-all", label: "Tất cả đơn hàng", href: "/shop/orders" },
      {
        key: "orders-handover",
        label: "Bàn giao đơn hàng",
        href: "/shop/orders/handover",
      },
      {
        key: "orders-address",
        label: "Cài đặt vận chuyển",
        href: "/shop/orders/address",
      },
    ],
  },
  {
    key: "vouchers",
    label: "Quản lý Voucher",
    icon: <Ticket size={20} />,
    href: "/shop/vouchers",
  },
  {
    key: "marketing",
    label: "Kênh marketing",
    icon: <Megaphone size={20} />,
    children: [
      {
        key: "marketing-promotion",
        label: "Khuyến mãi của shop",
        href: "/shop/marketing/promotion",
      },
      {
        key: "marketing-coupon",
        label: "Mã giảm giá của shop",
        href: "/shop/marketing/coupon",
      },
    ],
  },
  {
    key: "cskh",
    label: "CSKH",
    icon: <Headset size={20} />,
    children: [
      {
        key: "cskh-chat",
        label: "Quản lý chat",
        href: "/shop/cskh/chat",
      },
      {
        key: "cskh-review",
        label: "Quản lý đánh giá",
        href: "/shop/reviews",
      },
    ],
  },
  {
    key: "finance",
    label: "Tài chính",
    icon: <Wallet size={20} />,
    children: [
      {
        key: "finance-wallet",
        label: "Wallet",
        href: "/shop/wallet",
      },
      {
        key: "finance-revenue",
        label: "Doanh thu",
        href: "/shop/finance/revenue",
      },
      {
        key: "finance-bank",
        label: "Tài khoản ngân hàng",
        href: "/shop/finance/bank",
      },
    ],
  },
  {
    key: "data",
    label: "Dữ liệu",
    icon: <Database size={20} />,
    href: "/shop/data",
  },
  {
    key: "shop-management",
    label: "Quản lý shop",
    icon: <Settings size={20} />,
    children: [
      {
        key: "shop-profile",
        label: "Hồ sơ shop",
        href: "/shop/profile",
      },
      {
        key: "shop-decorate",
        label: "Trang trí shop",
        href: "/shop/decorate",
      },
      {
        key: "shop-setup",
        label: "Thiết lập shop",
        href: "/shop/setup",
      },
      {
        key: "shop-complaint",
        label: "Khiếu nại",
        href: "/shop/complaint",
      },
    ],
  },
  {
    key: "my-account",
    label: "Tài khoản của tôi",
    icon: <UserCircle size={20} />,
    children: [
      {
        key: "account-info",
        label: "Thông tin tài khoản",
        href: "/shop/account/info",
      },
      {
        key: "account-password",
        label: "Đổi mật khẩu",
        href: "/shop/account/password",
      },
    ],
  },
];

export const SHOP_ROUTE_MAPPINGS = [
  { prefix: "/shop/dashboard/analytics", key: "analytics" },
  { prefix: "/shop/dashboard", key: "home" },
  { prefix: "/shop/products/add", key: "add-product", parent: "products" },
  { prefix: "/shop/products", key: "list-products", parent: "products" },
  { prefix: "/shop/orders/handover", key: "orders-handover", parent: "orders" },
  { prefix: "/shop/orders/address", key: "orders-address", parent: "orders" },
  { prefix: "/shop/wallet", key: "finance-wallet", parent: "finance" },
  { prefix: "/shop/orders", key: "orders-all", parent: "orders" },
  { prefix: "/shop/marketing/promotion", key: "marketing-promotion", parent: "marketing" },
  { prefix: "/shop/marketing/coupon", key: "marketing-coupon", parent: "marketing" },
  { prefix: "/shop/vouchers", key: "vouchers" },
  { prefix: "/shop/cskh/chat", key: "cskh-chat", parent: "cskh" },
  { prefix: "/shop/reviews", key: "cskh-review", parent: "cskh" },
  { prefix: "/shop/finance/revenue", key: "finance-revenue", parent: "finance" },
  { prefix: "/shop/finance/bank", key: "finance-bank", parent: "finance" },
  { prefix: "/shop/profile", key: "shop-profile", parent: "shop-management" },
  { prefix: "/shop/decorate", key: "shop-decorate", parent: "shop-management" },
  { prefix: "/shop/setup", key: "shop-setup", parent: "shop-management" },
  { prefix: "/shop/complaint", key: "shop-complaint", parent: "shop-management" },
  { prefix: "/shop/data", key: "data" },
  { prefix: "/shop/account/info", key: "account-info", parent: "my-account" },
  { prefix: "/shop/account/password", key: "account-password", parent: "my-account" },
];
