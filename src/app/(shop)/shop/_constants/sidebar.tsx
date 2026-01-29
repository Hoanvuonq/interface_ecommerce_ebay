import {
  BarChart3,
  Database,
  Globe,
  Headset,
  Home,
  Megaphone,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  UserCircle,
  Wallet,
} from "lucide-react";
import Link from "next/link";

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
        key: "orders-returns",
        label: "Trả hàng / Hoàn tiền / Hủy đơn",
        href: "/shop/orders/returns",
      },
      // {
      //   key: "orders-address",
      //   label: "Cài đặt vận chuyển",
      //   href: "/shop/orders/address",
      // },
    ],
  },
  // {
  //   key: "vouchers",
  //   label: "Quản lý Voucher",
  //   icon: <Ticket size={20} />,
  //   href: "/shop/vouchers",
  // },
  {
    key: "marketing",
    label: "Kênh marketing",
    icon: <Megaphone size={20} />,
    children: [
      // {
      //   key: "marketing-promotion",
      //   label: "Khuyến mãi của shop",
      //   href: "/shop/marketing/promotion",
      // },
      {
        key: "marketing-vouchers",
        label: "Quản lý Voucher",
        href: "/shop/marketing/vouchers",
      },
      // {
      //   key: "marketing-coupon",
      //   label: "Mã giảm giá của shop",
      //   href: "/shop/marketing/coupon",
      // },
      {
        key: "marketing-campaigns",
        label: "Chiến dịch Marketing ",
        href: "/shop/marketing/campaigns",
      },
      {
        key: "marketing-loyalty",
        label: "Điểm thưởng",
        href: "/shop/marketing/loyalty",
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
        key: "cskh-conversations",
        label: "Danh sách cuộc trò chuyện",
        href: "/shop/cskh/conversations",
      },
      {
        key: "cskh-settings",
        label: "Thiết lập chat",
        href: "/shop/cskh/settings",
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
        href: "/shop/finance/wallet",
      },
      {
        key: "finance-fees",
        label: "Báo cáo phí",
        href: "/shop/finance/fees",
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
  // {
  //   key: "data",
  //   label: "Dữ liệu",
  //   icon: <Database size={20} />,
  //   href: "/shop/data",
  // },
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
      // {
      //   key: "shop-decorate",
      //   label: "Trang trí shop",
      //   href: "/shop/decorate",
      // },
      {
        key: "shop-settings",
        label: "Thiết lập shop",
        href: "/shop/settings",
      },
      {
        key: "shop-complaint",
        label: "Khiếu nại",
        href: "/shop/complaint",
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
  { prefix: "/shop/orders/returns", key: "orders-returns", parent: "orders" },
  { prefix: "/shop/orders/address", key: "orders-address", parent: "orders" },
  { prefix: "/shop/finance/wallet", key: "finance-wallet", parent: "finance" },
  { prefix: "/shop/orders", key: "orders-all", parent: "orders" },

  {
    prefix: "/shop/marketing/promotion",
    key: "marketing-promotion",
    parent: "marketing",
  },
  {
    prefix: "/shop/marketing/coupon",
    key: "marketing-coupon",
    parent: "marketing",
  },
  {
    prefix: "/shop/marketing/campaigns",
    key: "marketing-campaigns",
    parent: "marketing",
  },
  {
    prefix: "/shop/marketing/loyalty",
    selectedKey: "marketing-loyalty",
    openKey: "marketing",
  },
  {
    prefix: "/shop/marketing/vouchers",
    selectedKey: "marketing-vouchers",
    openKey: "marketing",
  },

  { prefix: "/shop/cskh/chat", key: "cskh-chat", parent: "cskh" },
  { prefix: "/shop/reviews", key: "cskh-review", parent: "cskh" },
  { prefix: "/shop/conversations", key: "cskh-conversations", parent: "cskh" },
  { prefix: "/shop/settings", key: "cskh-settings", parent: "cskh" },
  {
    prefix: "/shop/finance/revenue",
    key: "finance-revenue",
    parent: "finance",
  },
  { prefix: "/shop/finance/bank", key: "finance-bank", parent: "finance" },
  { prefix: "/shop/finance/fees", key: "finance-fees", parent: "finance" },
  { prefix: "/shop/profile", key: "shop-profile", parent: "shop-management" },
  { prefix: "/shop/decorate", key: "shop-decorate", parent: "shop-management" },
  { prefix: "/shop/settings", key: "shop-settings", parent: "shop-management" },
  {
    prefix: "/shop/complaint",
    key: "shop-complaint",
    parent: "shop-management",
  },
  { prefix: "/shop/data", key: "data" },
];
