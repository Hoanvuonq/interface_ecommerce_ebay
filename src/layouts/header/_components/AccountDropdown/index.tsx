"use client";

import { RoleEnum } from "@/auth/_types/auth";
import { AppPopover } from "@/components/appPopover";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { getUserInfo, hasRole } from "@/utils/jwt";
import { logout } from "@/utils/local.storage";
import {
  ChevronDown,
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
    const context = pathname?.startsWith("/employee") ? "employee" : 
                    pathname?.startsWith("/shop") ? "shop" : "default";
    logout(context as any); 
  };

  const guestMenuItems: MenuItem[] = [
    { key: "login", label: "Đăng nhập", href: "/login", icon: <LogIn size={18} /> },
    { key: "register", label: "Đăng ký", href: "/register", icon: <UserPlus size={18} /> },
  ];

  const buyerMenuItems: MenuItem[] = [
    { key: "profile", label: "Hồ sơ cá nhân", href: "/profile", icon: <User size={18} /> },
    { key: "orders", label: "Đơn hàng của tôi", href: "/orders", icon: <Package size={18} /> },
    { key: "wishlist", label: "Yêu thích", href: "/wishlist", icon: <Heart size={18} /> },
  ];

  const shopMenuItems: MenuItem[] = [
    { key: "dashboard", label: "Quản trị Shop", href: "/shop/dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "profile", label: "Hồ sơ Shop", href: "/shop/profile", icon: <Store size={18} /> },
    { key: "settings", label: "Cài đặt Shop", href: "/shop/settings", icon: <Settings size={18} /> },
  ];

  const employeeMenuItems: MenuItem[] = [
    { key: "dashboard", label: "Workspace", href: "/employee/dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "profile", label: "Hồ sơ nhân viên", href: "/employee/profile", icon: <User size={18} /> },
  ];

  const adminMenuItems: MenuItem[] = [
    { key: "admin_dash", label: "Hệ thống quản trị", href: "/admin/dashboard", icon: <ShieldCheck size={18} /> },
    ...(pathname?.startsWith("/admin") ? [
        { key: "home", label: "Về trang chủ", href: "/", icon: <Home size={18} /> }
    ] : []),
  ];

  let currentMenuItems: MenuItem[] = [];

  if (!isActuallyAuthenticated) {
    currentMenuItems = guestMenuItems;
  } else {
    if (pathname?.startsWith("/shop")) currentMenuItems = shopMenuItems;
    else if (pathname?.startsWith("/employee")) currentMenuItems = employeeMenuItems;
    else if (pathname?.startsWith("/admin")) currentMenuItems = adminMenuItems;
    else {
       currentMenuItems = [...buyerMenuItems];
       if (hasRole(RoleEnum.SHOP)) currentMenuItems.push({ key: "go_shop", label: "Kênh người bán", href: "/shop/dashboard", icon: <Store size={18} /> });
       if (hasRole(RoleEnum.EMPLOYEE)) currentMenuItems.push({ key: "go_work", label: "Kênh nhân viên", href: "/employee/dashboard", icon: <LayoutDashboard size={18} /> });
       if (hasRole(RoleEnum.ADMIN)) currentMenuItems.push({ key: "go_admin", label: "Trang quản trị", href: "/admin/dashboard", icon: <ShieldCheck size={18} /> });
    }
    currentMenuItems.push({ key: "logout", label: "Đăng xuất", icon: <LogOut size={18} />, action: handleLogoutAction, isLogout: true });
  }

  const buttonLabel = isActuallyAuthenticated ? userData.name : "Tài khoản";

  const getRoleBadge = () => {
    const baseClass = "px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest border shadow-sm backdrop-blur-md";
    switch (currentRole) {
      case RoleEnum.ADMIN:
        return <span className={cn(baseClass, "bg-rose-50 text-rose-600 border-rose-100")}>Admin</span>;
      case RoleEnum.EMPLOYEE:
        return <span className={cn(baseClass, "bg-blue-50 text-blue-600 border-blue-100")}>Staff</span>;
      case RoleEnum.SHOP:
        return <span className={cn(baseClass, "bg-orange-50 text-orange-600 border-orange-100")}>Seller</span>;
      default:
        return <span className={cn(baseClass, "bg-slate-50 text-slate-500 border-slate-100")}>Member</span>;
    }
  };

  const Trigger = (
    <div className={cn(
      "flex items-center gap-2.5 px-1.5 py-1.5 pr-3 rounded-full transition-all duration-300 cursor-pointer select-none group",
      "hover:bg-orange-50/80 hover:shadow-sm border border-transparent hover:border-orange-100",
      isActuallyAuthenticated ? "bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border-slate-100" : ""
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 border transition-all duration-300",
        isActuallyAuthenticated 
          ? "bg-linear-to-br from-orange-100 to-amber-50 border-white shadow-sm group-hover:scale-105" 
          : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-white group-hover:text-orange-500"
      )}>
        {isActuallyAuthenticated && userData.image ? (
           <img src={userData.image} alt="avatar" className="w-full h-full object-cover" />
        ) : (
           <User size={18} strokeWidth={2.5} />
        )}
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <span className="hidden sm:inline font-bold text-slate-700 group-hover:text-orange-900 transition-colors text-xs truncate max-w-25 leading-tight">
          {buttonLabel}
        </span>
        {isActuallyAuthenticated && (
           <span className="hidden sm:inline text-[9px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-orange-500 transition-colors leading-none">
             {currentRole === 'GUEST' ? 'Khách' : currentRole}
           </span>
        )}
      </div>
      <ChevronDown size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-orange-500 transition-all ml-1 group-hover:translate-y-0.5" />
    </div>
  );

  return (
    <AppPopover trigger={Trigger} className="w-72 p-2" align="right">
      {isActuallyAuthenticated && (
        <div className="p-4 mb-2 bg-linear-to-br from-white to-orange-50/30 border border-orange-100/50 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden group">
          {/* Decorative background blob */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-linear-to-br from-orange-200/40 to-amber-200/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="w-14 h-14 bg-white rounded-full p-1 border border-orange-100 shadow-md shrink-0 relative z-10 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 flex items-center justify-center relative">
                {userData.image ? (
                <img src={userData.image} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                <User size={28} className="text-slate-300" />
                )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 relative z-10">
            <div className="font-semibold text-slate-800 text-sm truncate leading-tight mb-1 group-hover:text-orange-950 transition-colors">
              {userData.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate mb-2.5 font-medium">
              {userData.email}
            </div>
            {getRoleBadge()}
          </div>
        </div>
      )}

      <div className="space-y-1">
        {currentMenuItems.map((item) => {
          const isLogout = item.isLogout;
          
          const content = (
            <div className="flex items-center gap-3 w-full">
              <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  isLogout 
                    ? "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-rose-500/20" 
                    : "bg-slate-50 text-slate-500 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-orange-500/20"
              )}>
                  {item.icon}
              </div>
              <span className="flex-1 text-left font-bold text-xs tracking-wide transition-transform group-hover:translate-x-1 duration-200">
                {item.label}
              </span>
            </div>
          );

          const commonClass = cn(
            "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full cursor-pointer select-none",
            isLogout 
              ? "mt-2 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100" 
              : "text-slate-600 hover:bg-orange-50 hover:text-orange-900 border border-transparent hover:border-orange-100"
          );

          if (item.action) {
            return (
              <button key={item.key} onClick={item.action} className={commonClass}>
                {content}
              </button>
            );
          }

          return (
            <Link key={item.key} href={item.href || "#"} className={commonClass}>
              {content}
            </Link>
          );
        })}
      </div>
    </AppPopover>
  );
};