import {
  Home,
  Users,
  IdCard,
  Building2,
  ShieldCheck,
  Lock,
  Key,
  UserCog,
  Store,
  Tags,
  Package,
  ShoppingCart,
  Ticket,
  Zap,
  Star,
  MessageSquare,
  User,
  Settings,
  Globe,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { MenuItemSidebar } from "../_types/sidebar";

export const LinkItem = ({ href, children, className }: { href: string; children: React.ReactNode, className?: string }) => (
  <Link href={href} className={className}>{children}</Link>
);

export const SIDEBAR_ITEMS: MenuItemSidebar[] = [
  {
    key: "home",
    icon: <Home size={20} />,
    label: "Dashboard",
    href: "/employee/dashboard",
  },
  { type: "divider", key: "div-1", label: "" },
  // {
  //   key: "home-main",
  //   icon: <Globe size={20} className="text-blue-500" />,
  //   label: "Về trang chủ",
  //   href: "/",
  //   className: "bg-blue-50/50 text-blue-600 hover:bg-blue-100 font-semibold",
  // },
  {
    key: "users",
    icon: <Users size={20} />,
    label: "Quản lý tài khoản",
    children: [
      { key: "users-data", label: "Thống kê dữ liệu", href: "/employee/users/data", icon: <BarChart3 size={16}/> },
      { key: "users-all", label: "Tất cả tài khoản", href: "/employee/users", icon: <Users size={16}/> },
    ],
  },
  {
    key: "employees",
    icon: <IdCard size={20} />,
    label: "Quản lý nhân viên",
    children: [
      { key: "employees-data", label: "Thống kê dữ liệu", href: "/employee/personnel/data", icon: <BarChart3 size={16}/> },
      { key: "employees-all", label: "Tất cả nhân viên", href: "/employee/personnel", icon: <IdCard size={16}/> },
    ],
  },
  {
    key: "departments",
    icon: <Building2 size={20} />,
    label: "Phòng ban",
    children: [
      { key: "departments-data", label: "Thống kê dữ liệu", href: "/employee/departments/data", icon: <BarChart3 size={16}/> },
      { key: "departments-all", label: "Danh sách phòng ban", href: "/employee/departments", icon: <Building2 size={16}/> },
    ],
  },
  {
    key: "permissions",
    icon: <ShieldCheck size={20} />,
    label: "Phân quyền",
    children: [
      { key: "permissions-permissions", label: "Quyền hạn", href: "/employee/permissions/permissions", icon: <Lock size={16}/> },
      { key: "permissions-roles", label: "Vai trò", href: "/employee/permissions/roles", icon: <Key size={16}/> },
      { key: "permissions-users", label: "Phân quyền User", href: "/employee/permissions/users", icon: <UserCog size={16}/> },
    ],
  },
  {
    key: "shops",
    icon: <Store size={20} />,
    label: "Quản lý Shop",
    href: "/employee/shops",
  },
  {
    key: "categories",
    icon: <Tags size={20} />,
    label: "Danh mục",
    href: "/employee/categories",
  },
  {
    key: "products",
    icon: <Package size={20} />,
    label: "Sản phẩm",
    children: [
      { key: "products-all", label: "Tất cả sản phẩm", href: "/employee/products", icon: <Package size={16}/> },
      { key: "products-data", label: "Thống kê", href: "/employee/products/stats", icon: <BarChart3 size={16}/> }, // Sửa path ví dụ cho khác biệt
    ],
  },
  {
    key: "orders",
    icon: <ShoppingCart size={20} />,
    label: "Đơn hàng",
    children: [
      { key: "orders-all", label: "Tất cả đơn hàng", href: "/employee/orders", icon: <ShoppingCart size={16}/> },
      { key: "orders-data", label: "Thống kê", href: "/employee/orders/data", icon: <BarChart3 size={16}/> },
    ],
  },
  {
    key: "vouchers",
    icon: <Ticket size={20} />,
    label: "Voucher",
    children: [
      { key: "vouchers-all", label: "Tất cả Voucher", href: "/employee/vouchers", icon: <Ticket size={16}/> },
      { key: "vouchers-data", label: "Thống kê", href: "/employee/vouchers/data", icon: <BarChart3 size={16}/> },
      { key: "vouchers-v2", label: "Voucher V2", href: "/employee/voucher-v2", icon: <Zap size={16}/> },
    ],
  },
  {
    key: "reviews",
    icon: <Star size={20} />,
    label: "Đánh giá",
    href: "/employee/reviews",
  },
  {
    key: "cskh",
    icon: <MessageSquare size={20} />,
    label: "CSKH",
    children: [
      { key: "cskh-chat", label: "Quản lý Chat", href: "/employee/cskh", icon: <MessageSquare size={16}/> },
    ],
  },
  {
    key: "my-account",
    icon: <User size={20} />,
    label: "Tài khoản",
    children: [
      { key: "account-info", label: "Thông tin", href: "/employee/account/info", icon: <User size={16}/> },
      { key: "account-password", label: "Đổi mật khẩu", href: "/employee/account/password", icon: <Settings size={16}/> },
    ],
  },
];

export const ROUTE_MAPPINGS = [
  // Dashboard
  { prefix: "/employee/dashboard", key: "home" },

  // Quản lý tài khoản
  { prefix: "/employee/users/data", key: "users-data", parent: "users" },
  { prefix: "/employee/users", key: "users-all", parent: "users" },

  // Quản lý nhân viên (Lưu ý: dùng parent: "employees" để khớp với SIDEBAR_ITEMS)
  { prefix: "/employee/personnel/data", key: "employees-data", parent: "employees" },
  { prefix: "/employee/personnel", key: "employees-all", parent: "employees" },

  // Phòng ban
  { prefix: "/employee/departments/data", key: "departments-data", parent: "departments" },
  { prefix: "/employee/departments", key: "departments-all", parent: "departments" },

  // Phân quyền
  { prefix: "/employee/permissions/permissions", key: "permissions-permissions", parent: "permissions" },
  { prefix: "/employee/permissions/roles", key: "permissions-roles", parent: "permissions" },
  { prefix: "/employee/permissions/users", key: "permissions-users", parent: "permissions" },

  // Các trang đơn (Không có parent)
  { prefix: "/employee/shops", key: "shops" },
  { prefix: "/employee/categories", key: "categories" },
  { prefix: "/employee/reviews", key: "reviews" },

  // Sản phẩm
  { prefix: "/employee/products/stats", key: "products-data", parent: "products" },
  { prefix: "/employee/products", key: "products-all", parent: "products" },

  // Đơn hàng
  { prefix: "/employee/orders/data", key: "orders-data", parent: "orders" },
  { prefix: "/employee/orders", key: "orders-all", parent: "orders" },

  // Voucher
  { prefix: "/employee/vouchers/data", key: "vouchers-data", parent: "vouchers" },
  { prefix: "/employee/vouchers", key: "vouchers-all", parent: "vouchers" },
  { prefix: "/employee/voucher-v2", key: "vouchers-v2", parent: "vouchers" },

  // CSKH
  { prefix: "/employee/cskh", key: "cskh-chat", parent: "cskh" },

  // Tài khoản cá nhân
  { prefix: "/employee/account/info", key: "account-info", parent: "my-account" },
  { prefix: "/employee/account/password", key: "account-password", parent: "my-account" },

  // Fallback
  { prefix: "/employee", key: "home" },
];