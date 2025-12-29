// src/layouts/employee/sidebar/_components/SidebarItem.tsx
"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn"; // Hàm utility classnames (bạn tự tạo hoặc dùng clsx)
import { MenuItemSidebar } from "../../../_types/sidebar";

interface SidebarItemProps {
  item: MenuItemSidebar;
  collapsed: boolean;
  activeKey: string;
  openKeys: string[];
  onToggle: (key: string) => void;
}

export const SidebarItem = ({ item, collapsed, activeKey, openKeys, onToggle }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = activeKey === item.key;
  const isOpen = openKeys.includes(item.key);
  const hasChildren = item.children && item.children.length > 0;

  // Nếu item là divider
  if (item.type === "divider") {
    return <div className="h-px bg-gray-100 my-4 mx-4" />;
  }

  const content = (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group select-none",
        isActive 
          ? "bg-orange-50 text-orange-600 shadow-sm" // Active State (Web3 Orange Theme)
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900", // Default State
        item.className
      )}
      onClick={(e) => {
        if (hasChildren) {
          e.preventDefault();
          onToggle(item.key);
        }
      }}
    >
      {/* Icon */}
      <span className={cn("shrink-0 transition-colors", isActive ? "text-orange-500" : "text-slate-400 group-hover:text-slate-600")}>
        {item.icon}
      </span>

      {/* Label (Hide when collapsed) */}
      {!collapsed && (
        <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
      )}

      {/* Arrow for submenu */}
      {!collapsed && hasChildren && (
        <span className="text-slate-400">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      )}
    </div>
  );

  return (
    <div className="mb-1">
      {/* Main Item */}
      {item.href && !hasChildren ? (
        <Link href={item.href} title={collapsed ? (item.label as string) : ""}>
          {content}
        </Link>
      ) : (
        <div title={collapsed ? (item.label as string) : ""}>{content}</div>
      )}

      {/* Submenu */}
      {!collapsed && hasChildren && isOpen && (
        <div className="mt-1 ml-4 pl-3 border-l border-slate-100 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {item.children?.map((child) => (
            <Link
              key={child.key}
              href={child.href || "#"}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activeKey === child.key
                  ? "bg-orange-50/50 text-orange-600 font-medium"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {child.icon && <span className="opacity-70">{child.icon}</span>}
              <span className="truncate">{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};