"use client";

import { RoleEnum } from "@/auth/_types/auth";
import { AppPopover } from "@/components/appPopover";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { getUserInfo, hasRole } from "@/utils/jwt";
import { logout } from "@/utils/local.storage";
import {
  ChevronDown,
  CircleDollarSign,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  Store,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuItem } from "../../_types/header";

export const AccountDropdown = () => {
  const isActuallyAuthenticated = useAuth();
  const [userData, setUserData] = useState({ name: "", email: "", image: "" });
  const [currentRole, setCurrentRole] = useState<RoleEnum | "GUEST">("GUEST");
  const pathname = usePathname();

  useEffect(() => {
    if (isActuallyAuthenticated) {
      const info = getUserInfo();
      setUserData({
        name: info?.username || info?.email || "Người dùng",
        email: info?.email || "",
        image: info?.image || "",
      });

      if (hasRole(RoleEnum.ADMIN)) setCurrentRole(RoleEnum.ADMIN);
      else if (hasRole(RoleEnum.EMPLOYEE)) setCurrentRole(RoleEnum.EMPLOYEE);
      else if (hasRole(RoleEnum.SHOP)) setCurrentRole(RoleEnum.SHOP);
      else setCurrentRole(RoleEnum.BUYER);
    } else {
      setCurrentRole("GUEST");
    }
  }, [isActuallyAuthenticated]);

  const handleLogoutAction = () => {
    const context = pathname?.startsWith("/employee")
      ? "employee"
      : pathname?.startsWith("/shop")
      ? "shop"
      : "default";
    logout(context as any);
  };

  const guestMenuItems: MenuItem[] = [
    {
      key: "login",
      label: "Đăng nhập",
      href: "/login",
      icon: <LogIn size={18} />,
    },
    {
      key: "register",
      label: "Đăng ký",
      href: "/register",
      icon: <UserPlus size={18} />,
    },
  ];

  const buyerMenuItems: MenuItem[] = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      href: "/profile",
      icon: <User size={18} />,
    },
    {
      key: "orders",
      label: "Đơn hàng của tôi",
      href: "/orders",
      icon: <Package size={18} />,
    },
    {
      key: "wishlist",
      label: "Yêu thích",
      href: "/wishlist",
      icon: <Heart size={18} />,
    },
  ];

  const shopMenuItems: MenuItem[] = [
    {
      key: "dashboard",
      label: "Quản trị Shop",
      href: "/shop/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      key: "profile",
      label: "Hồ sơ Shop",
      href: "/shop/profile",
      icon: <Store size={18} />,
    },
    {
      key: "settings",
      label: "Cài đặt Shop",
      href: "/shop/settings",
      icon: <Settings size={18} />,
    },
  ];

  const employeeMenuItems: MenuItem[] = [
    {
      key: "dashboard",
      label: "Workspace",
      href: "/employee/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      key: "profile",
      label: "Hồ sơ nhân viên",
      href: "/employee/profile",
      icon: <User size={18} />,
    },
  ];

  const adminMenuItems: MenuItem[] = [
    {
      key: "admin_dash",
      label: "Hệ thống quản trị",
      href: "/admin/dashboard",
      icon: <ShieldCheck size={18} />,
    },
    ...(pathname?.startsWith("/admin")
      ? [
          {
            key: "home",
            label: "Về trang chủ",
            href: "/",
            icon: <Home size={18} />,
          },
        ]
      : []),
  ];

  let currentMenuItems: MenuItem[] = [];

  if (!isActuallyAuthenticated) {
    currentMenuItems = guestMenuItems;
  } else {
    if (pathname?.startsWith("/shop")) currentMenuItems = shopMenuItems;
    else if (pathname?.startsWith("/employee"))
      currentMenuItems = employeeMenuItems;
    else if (pathname?.startsWith("/admin")) currentMenuItems = adminMenuItems;
    else {
      currentMenuItems = [...buyerMenuItems];
      if (hasRole(RoleEnum.SHOP))
        currentMenuItems.push({
          key: "go_shop",
          label: "Kênh người bán",
          href: "/shop/dashboard",
          icon: <Store size={18} />,
        });
      if (hasRole(RoleEnum.EMPLOYEE))
        currentMenuItems.push({
          key: "go_work",
          label: "Kênh nhân viên",
          href: "/employee/dashboard",
          icon: <LayoutDashboard size={18} />,
        });
      if (hasRole(RoleEnum.ADMIN))
        currentMenuItems.push({
          key: "go_admin",
          label: "Trang quản trị",
          href: "/admin/dashboard",
          icon: <ShieldCheck size={18} />,
        });
    }
    currentMenuItems.push({
      key: "logout",
      label: "Đăng xuất",
      icon: <LogOut size={18} />,
      action: handleLogoutAction,
      isLogout: true,
    });
  }

  const getRoleBadge = () => {
    const baseClass =
      "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter border shadow-none";
    switch (currentRole) {
      case RoleEnum.ADMIN:
        return (
          <span
            className={cn(
              baseClass,
              "bg-rose-100 text-rose-600 border-rose-200"
            )}
          >
            Quản trị viên
          </span>
        );
      case RoleEnum.EMPLOYEE:
        return (
          <span
            className={cn(baseClass, "bg-sky-100 text-sky-600 border-sky-200")}
          >
            Nhân viên
          </span>
        );
      case RoleEnum.SHOP:
        return (
          <span
            className={cn(
              baseClass,
              "bg-amber-100 text-amber-700 border-amber-200"
            )}
          >
            Người bán
          </span>
        );
      default:
        return (
          <span
            className={cn(
              baseClass,
              "bg-slate-100 text-slate-500 border-slate-200"
            )}
          >
            Thành viên
          </span>
        );
    }
  };

  const Trigger = (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-full transition-all duration-300 cursor-pointer select-none group border border-transparent",
        "hover:bg-white/10",
        isActuallyAuthenticated
          ? "bg-white/5 backdrop-blur-md border-white/10 shadow-sm"
          : ""
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shrink-0 border transition-all duration-300",
          isActuallyAuthenticated
            ? "bg-slate-200 border-white/20"
            : "bg-slate-100 border-slate-200 text-slate-400 group-hover:text-blue-600"
        )}
      >
        {isActuallyAuthenticated && userData.image ? (
          <img
            src={userData.image}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={16} strokeWidth={2} />
        )}
      </div>
      <div className="flex flex-col gap-0.5 items-start min-w-0">
        <span className="hidden sm:inline font-bold text-slate-100 group-hover:text-white transition-colors text-[13px] truncate max-w-24 leading-none">
          {isActuallyAuthenticated ? userData.name : "Tài khoản"}
        </span>
        <span className="flex gap-1 items-center">
          <CircleDollarSign size={16} className="text-yellow-500" />
          <span className="font-semibold text-yellow-500 text-[10px]">1.000 Xu</span>
        </span>
      </div>
      <ChevronDown
        size={14}
        className="text-slate-300 group-hover:text-white transition-all ml-0.5"
      />
    </div>
  );

  return (
    <AppPopover trigger={Trigger} className="w-72 p-1.5" align="right">
      {isActuallyAuthenticated && (
        <div className="p-3 mb-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            {userData.image ? (
              <img
                src={userData.image}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                <User size={24} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-800 text-sm truncate leading-tight">
              {userData.name}
            </div>
            <div className="text-[11px] text-slate-500 truncate mb-1">
              {userData.email}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0.5">
        {currentMenuItems.map((item) => {
          const isLogout = item.isLogout;
          const content = (
            <div className="flex items-center gap-3 w-full">
              <div
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isLogout
                    ? "bg-rose-50 text-orange-500 group-hover:bg-orange-100"
                    : "bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-orange-500"
                )}
              >
                {item.icon}
              </div>
              <span
                className={cn(
                  "flex-1 text-left text-[13px] font-medium transition-colors",
                  isLogout
                    ? "text-orange-600"
                    : "text-slate-600 group-hover:text-orange-500"
                )}
              >
                {item.label}
              </span>
            </div>
          );

          const commonClass = cn(
            "group flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200 w-full cursor-pointer select-none",
            isLogout
              ? "mt-1 hover:bg-orange-50/50 border border-transparent"
              : "hover:bg-slate-50 border border-transparent"
          );

          if (item.action) {
            return (
              <button
                key={item.key}
                onClick={item.action}
                className={commonClass}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href || "#"}
              className={commonClass}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </AppPopover>
  );
};
