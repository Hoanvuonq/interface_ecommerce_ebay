import { RoleEnum } from "@/auth/_types/auth";
import { MenuItem } from "../_types/header";
import {
  LogIn, UserPlus, User, Package, Heart,
  LayoutDashboard, Store, Settings, ShieldCheck, Home
} from "lucide-react";

export const GUEST_MENU_ITEMS: MenuItem[] = [
  { key: "login", label: "Đăng nhập", href: "/login", icon: <LogIn size={16} /> },
  { key: "register", label: "Đăng ký", href: "/register", icon: <UserPlus size={16} /> },
];

export const BUYER_MENU_ITEMS: MenuItem[] = [
  { key: "profile", label: "Hồ sơ cá nhân", href: "/profile", icon: <User size={16} /> },
  { key: "orders", label: "Đơn hàng của tôi", href: "/orders", icon: <Package size={16} /> },
  { key: "wishlist", label: "Yêu thích", href: "/wishlist", icon: <Heart size={16} /> },
];

export const SHOP_MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", label: "Quản trị Shop", href: "/shop/dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "profile", label: "Hồ sơ Shop", href: "/shop/profile", icon: <Store size={16} /> },
  { key: "settings", label: "Cài đặt Shop", href: "/shop/settings", icon: <Settings size={16} /> },
];

export const EMPLOYEE_MENU_ITEMS: MenuItem[] = [
  { key: "dashboard", label: "Workspace", href: "/employee/dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "profile", label: "Hồ sơ nhân viên", href: "/employee/profile", icon: <User size={16} /> },
];

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { key: "admin_dash", label: "Hệ thống quản trị", href: "/admin/dashboard", icon: <ShieldCheck size={16} /> },
];