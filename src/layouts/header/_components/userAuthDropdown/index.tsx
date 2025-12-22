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
    LogIn,
    LogOut,
    Package,
    Store,
    User,
    UserPlus
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuItem, UserAuthDropdownProps } from "../../_types/header";


export const UserAuthDropdown = ({
    isAuthenticated: propsAuth,
}: UserAuthDropdownProps) => {
    const isActuallyAuthenticated = useAuth();
    const [userData, setUserData] = useState({ name: "", email: "", image: "" });
    const [isShopOwner, setIsShopOwner] = useState(false);

    useEffect(() => {
        if (isActuallyAuthenticated) {
            const info = getUserInfo();
            setUserData({
                name: info?.username || info?.email || "Người dùng",
                email: info?.email || "",
                image: info?.image || ""
            });
            setIsShopOwner(hasRole(RoleEnum.SHOP));
        }
    }, [isActuallyAuthenticated]);

    const handleLogoutAction = () => {
        logout();
        window.location.href = "/login"; 
    };

    const userMenuItems: MenuItem[] = [
        {
            key: "profile",
            label: "Thông tin cá nhân",
            href: "/profile",
            icon: <User size={16} />,
        },
        {
            key: "orders",
            label: "Đơn hàng của tôi",
            href: "/orders",
            icon: <Package size={16} />,
        },
        {
            key: "wishlist",
            label: "Yêu thích",
            href: "/wishlist",
            icon: <Heart size={16} />,
        },
        ...(isShopOwner ? [{
            key: "shop",
            label: "Quản lý shop",
            href: "/shop",
            icon: <Store size={16} />,
        }] : []),
        {
            key: "logout",
            label: "Đăng xuất",
            icon: <LogOut size={16} />,
            action: handleLogoutAction,
            isLogout: true,
        },
    ];

    const authMenuItems: MenuItem[] = [
        {
            key: "login",
            label: "Đăng nhập",
            href: "/login",
            icon: <LogIn size={16} />,
        },
        {
            key: "register",
            label: "Đăng ký",
            href: "/register",
            icon: <UserPlus size={16} />,
        },
    ];

    const menuItems = isActuallyAuthenticated ? userMenuItems : authMenuItems;
    const buttonLabel = isActuallyAuthenticated ? userData.name : "Đăng nhập";

    const Trigger = (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer">
            <User size={20} />
            <span className="hidden sm:inline font-medium max-w-30 truncate">
                {buttonLabel}
            </span>
            <ChevronDown size={14} />
        </div>
    );

    return (
        <AppPopover trigger={Trigger} className="w-64" align="right">
            {isActuallyAuthenticated && (
                <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center overflow-hidden border border-blue-200">
                        {userData.image ? (
                            <img src={userData.image} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={24} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 leading-tight truncate">
                            {userData.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {userData.email}
                        </div>
                    </div>
                </div>
            )}

            <div className="py-1">
                {menuItems.map((item) => {
                    const content = (
                        <div className="flex items-center gap-3 w-full">
                            {item.icon}
                            <span className="flex-1 text-left">{item.label}</span>
                        </div>
                    );

                    const commonClass = cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full cursor-pointer",
                        item.isLogout ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"
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