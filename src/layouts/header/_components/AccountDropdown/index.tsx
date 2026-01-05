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
  LogOut,
  ShieldCheck,
  Store,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as MenuConstants from "../../_constants/menu";
import { MenuItem } from "../../_types/header";
import Image from "next/image";

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
    const context = pathname?.startsWith("/employee") ? "employee" : pathname?.startsWith("/shop") ? "shop" : "default";
    logout(context as any);
  };

 const currentMenuItems: MenuItem[] = (() => {
    if (!isActuallyAuthenticated) return MenuConstants.GUEST_MENU_ITEMS;

    let items: MenuItem[] = [];
    if (pathname?.startsWith("/shop")) items = [...MenuConstants.SHOP_MENU_ITEMS];
    else if (pathname?.startsWith("/employee")) items = [...MenuConstants.EMPLOYEE_MENU_ITEMS];
    else if (pathname?.startsWith("/admin")) items = [...MenuConstants.ADMIN_MENU_ITEMS];
    else {
      items = [...MenuConstants.BUYER_MENU_ITEMS];
      if (hasRole(RoleEnum.SHOP)) items.push({ key: "go_shop", label: "Kênh người bán", href: "/shop/dashboard", icon: <Store size={16} /> });
      if (hasRole(RoleEnum.ADMIN)) items.push({ key: "go_admin", label: "Trang quản trị", href: "/admin/dashboard", icon: <ShieldCheck size={16} /> });
    }

    items.push({
      key: "logout",
      label: "Đăng xuất",
      icon: <LogOut size={16} />,
      action: handleLogoutAction,
      isLogout: true,
    });
    return items;
  })();

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
          "w-9 h-9 rounded-full flex items-center justify-center overflow-hidden shrink-0 border transition-all duration-300",
          isActuallyAuthenticated
            ? "bg-slate-200 border-white/20"
            : "bg-slate-100 border-slate-200 text-slate-400 group-hover:text-blue-600"
        )}
      >
        {isActuallyAuthenticated && userData.image ? (
          <Image
            src={userData.image}
            alt="avatar"
            width={22}
            height={22}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={16} strokeWidth={2} />
        )}
      </div>
      <div className="flex flex-col gap-0.5 items-start min-w-0">
        <span className="hidden sm:inline font-bold text-slate-100 group-hover:text-white transition-colors text-[12px] truncate max-w-30 leading-normal">
          {isActuallyAuthenticated ? userData.name : "Tài khoản"}
        </span>
        <span className="flex gap-1 items-center">
          <CircleDollarSign size={14} className="text-yellow-500" />
          <span className="font-semibold text-yellow-500 text-[10px]"> 999 Xu</span>
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
             <Image
                src={userData.image}
                alt="avatar"
                width={48}
                height={48}
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
