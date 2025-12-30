"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { MenuItemSidebar } from "../../../_types/sidebar";

interface SidebarItemProps {
  item: MenuItemSidebar;
  collapsed: boolean;
  activeKey: string;
  openKeys: string[];
  onToggle: (key: string) => void;
  isParentOfActive?: boolean; 
}

export const SidebarItem = ({ 
  item, 
  collapsed, 
  activeKey, 
  openKeys, 
  onToggle,
  isParentOfActive 
}: SidebarItemProps) => {
  const isActive = activeKey === item.key;
  const isOpen = openKeys.includes(item.key);
  const hasChildren = item.children && item.children.length > 0;
  
  const highlightParent = isParentOfActive && !collapsed;

  if (item.type === "divider") {
    return <div className="h-px bg-slate-100 my-3 mx-4" />;
  }

  const content = (
    <div
      className={cn(
        "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer group select-none relative overflow-hidden",
        isActive 
          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 scale-[1.02]" 
          : highlightParent
          ? "bg-orange-50/50 text-orange-600"
          : "text-slate-500 hover:bg-orange-50 hover:text-orange-600",
        item.className
      )}
      onClick={() => hasChildren && onToggle(item.key)}
    >
      <span className={cn(
        "shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10",
        isActive ? "text-white" : highlightParent ? "text-orange-500" : "text-slate-400 group-hover:text-orange-500"
      )}>
        {item.icon}
      </span>

      {!collapsed && (
        <span className="flex-1 text-[13px] font-bold tracking-wide relative z-10 truncate">
          {item.label}
        </span>
      )}

      {!collapsed && hasChildren && (
        <span className={cn("transition-transform duration-300 relative z-10", isOpen ? "rotate-180" : "")}>
          <ChevronDown size={14} className={isActive ? "text-white" : "text-slate-400"} />
        </span>
      )}
    </div>
  );

  return (
    <div className="mb-1.5 px-2">
      {item.href && !hasChildren ? (
        <Link href={item.href}>{content}</Link>
      ) : (
        content
      )}

      {/* Hiển thị con nếu đang mở */}
      {!collapsed && hasChildren && isOpen && (
        <div className="mt-1 ml-6 pl-4 border-l-2 border-orange-100 space-y-1 animate-in slide-in-from-top-2 duration-300">
          {item.children?.map((child) => {
            const isChildActive = activeKey === child.key;
            return (
              <Link
                key={child.key}
                href={child.href || "#"}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200",
                  isChildActive
                    ? "text-orange-600 bg-orange-100/50" // Làm đậm màu hơn khi active con
                    : "text-slate-500 hover:text-orange-600 hover:bg-orange-50/50"
                )}
              >
                {child.icon && <span className={isChildActive ? "text-orange-500" : "text-slate-400"}>{child.icon}</span>}
                <span className="truncate">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};