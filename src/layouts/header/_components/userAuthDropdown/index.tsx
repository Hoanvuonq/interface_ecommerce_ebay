"use client";

import { useState, useRef, useEffect, useCallback, ReactElement } from "react";
import {
  User,
  ChevronDown,
  LogIn,
  UserPlus,
  Heart,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ************************
// 1. ĐỊNH NGHĨA INTERFACE RÕ RÀNG
// ************************

interface MenuItemBase {
  key: string;
}

interface MenuItemLink extends MenuItemBase {
  type?: "link";
  label: string;
  href: string;
  icon: ReactElement;
  action?: () => void;
}

interface MenuItemSpecial extends MenuItemBase {
  type: "divider" | "info";
  label: ReactElement;
  href?: string;
  icon?: ReactElement;
  action?: () => void;
}

type MenuItem = MenuItemLink | MenuItemSpecial;

const userName = "ebayexpressvn";
const handleLogout = () => {
  console.log("Thực hiện hành động Đăng xuất");
};

interface UserAuthDropdownProps {
  isAuthenticated: boolean;
}

const userMenuItems: MenuItem[] = [
  {
    key: "info",
    type: "info",
    label: (
      <div className="px-2 py-1 bg-blue-50/70 rounded-lg">
        <div className="text-xs text-gray-500">Xin chào</div>
        <div className="font-semibold text-gray-900">
          {userName || "Tài khoản"}
        </div>
      </div>
    ),
  },

  {
    key: "profile",
    label: "Thông tin cá nhân",
    href: "/profile",
    icon: <User size={16} />,
    action: () => console.log("Go to profile"),
  },
  {
    key: "orders",
    label: "Đơn hàng của tôi",
    href: "/orders",
    icon: <Truck size={16} />,
    action: () => console.log("Go to orders"),
  },
  {
    key: "wishlist",
    label: "Yêu thích",
    href: "/wishlist",
    icon: <Heart size={16} />,
    action: () => console.log("Go to wishlist"),
  },
  {
    key: "shop",
    label: "Quản lý shop",
    href: "/shop/dashboard",
    icon: <ShoppingBag size={16} />,
    action: () => console.log("Go to shop dashboard"),
  },
  {
    key: "logout",
    label: "Đăng xuất",
    href: "#",
    icon: <LogIn size={16} className="rotate-180" />,
    action: handleLogout,
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

export const UserAuthDropdown = ({
  isAuthenticated,
}: UserAuthDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = isAuthenticated ? userMenuItems : authMenuItems;
  const buttonLabel = isAuthenticated ? userName || "Tài khoản" : "Đăng nhập";

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  const handleItemClick = (itemKey: string) => {
    setIsOpen(false);
    const item = menuItems.find((m) => m.key === itemKey);
    if (item && "action" in item && item.action) {
      item.action();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative text-base" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors focus:outline-none cursor-pointer",
          "text-white hover:bg-white/10"
        )}
        aria-expanded={isOpen}
        aria-label={buttonLabel}
      >
        <User size={20} className="flex-shrink-0" />

        <span className="hidden sm:inline font-medium">{buttonLabel}</span>

        <ChevronDown
          size={14}
          className={`hidden sm:inline transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-20",
            "before:content-[''] before:absolute before:top-[-8px] before:right-3 before:w-0 before:h-0 before:border-x-8 before:border-x-transparent before:border-b-8 before:border-b-white"
          )}
        >
          {menuItems.map((item) => {
            // Xử lý Divider
            if (item.type === "divider") {
              return (
                <div key={item.key} className="my-1 border-t border-gray-100" />
              );
            }
            if (item.type === "info" && isAuthenticated) {
              return (
                <div key={item.key} className="p-2">
                  {item.label}
                </div>
              );
            }

            //
            const ariaLabel =
              typeof item.label === "string"
                ? item.label
                : typeof (item as MenuItemLink).label === "string"
                ? (item as MenuItemLink).label
                : undefined;

            return (
              <Link
                key={item.key}
                href={item.href || "#"}
                onClick={(e) => {
                  if (item.key === "logout") {
                    e.preventDefault();
                  }
                  handleItemClick(item.key);
                }}
                className={cn(
                  "w-full flex items-center gap-2 text-left px-4 py-2 text-sm font-medium transition-colors",
                  item.key === "logout"
                    ? "text-red-500 hover:bg-red-50"
                    : "hover:bg-gray-100"
                )}
                aria-label={ariaLabel}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
