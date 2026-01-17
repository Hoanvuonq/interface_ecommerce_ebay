"use client";

import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { SidebarItemProps } from "./type";

export const SidebarItem = ({
  item,
  collapsed,
  activeKey,
  openKeys,
  onToggle,
  isParentOfActive,
}: SidebarItemProps) => {
  const isActive = activeKey === item.key;
  const isOpen = openKeys.includes(item.key);
  const hasChildren = item.children && item.children.length > 0;
  const highlightParent = isParentOfActive && !collapsed;
  const iconRef = useRef<HTMLSpanElement>(null);

  if (item.type === "divider") {
    return <div className="h-px bg-gray-100 my-3 mx-4" />;
  }

  const iconWithTooltip = (
    <span
      ref={iconRef}
      className={cn(
        "shrink-0 transition-transform duration-300 group-hover:scale-110 relative flex items-center justify-center",
        isActive || highlightParent
          ? "text-(--color-mainColor)"
          : "text-gray-600 group-hover:text-(--color-mainColor)"
      )}
    >
      {item.icon}

      {collapsed && (
        <div
          className={cn(
            "absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3",
            "py-2 rounded-lg bg-red-700 text-white text-[11px] font-bold opacity-0",
            "group-hover:opacity-100 group-hover:translate-x-1 pointer-events-none",
            "whitespace-nowrap z-100 transition-all duration-300 shadow-xl shadow-black/20"
          )}
        >
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-red-700" />

          {item.label}
        </div>
      )}
    </span>
  );

  const content = (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl transition-all duration-200 cursor-pointer group select-none relative",
        isActive
          ? "bg-orange-50 text-(--color-mainColor) font-semibold shadow-[inset_4px_0_0_0_#f97316]"
          : highlightParent
          ? "text-(--color-mainColor) bg-orange-50/30"
          : "hover:text-(--color-mainColor) hover:bg-gray-50 text-gray-700",
        item.className
      )}
      onClick={() => hasChildren && onToggle(item.key)}
    >
      {iconWithTooltip}

      {!collapsed && (
        <span className="flex-1 text-[13px] font-bold tracking-wide relative z-10 truncate">
          {item.label}
        </span>
      )}

      {!collapsed && hasChildren && (
        <span
          className={cn(
            "transition-transform duration-300 relative z-10",
            isOpen ? "rotate-180" : ""
          )}
        >
          <ChevronDown
            size={14}
            className={isActive ? "text-white" : "text-gray-600"}
          />
        </span>
      )}
    </div>
  );

  return (
    <div className="mb-1.5 px-1">
      {item.href && !hasChildren ? (
        <Link href={item.href}>{content}</Link>
      ) : (
        content
      )}

      {!collapsed && hasChildren && isOpen && (
        <div className="mt-1 ml-6 pl-4 border-l-2 border-gray-100 space-y-1 animate-in slide-in-from-top-2 duration-300">
          {item.children?.map((child) => {
            const isChildActive = activeKey === child.key;
            return (
              <Link
                key={child.key}
                href={child.href || "#"}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200",
                  isChildActive
                    ? "text-(--color-mainColor) bg-orange-100/50"
                    : "text-gray-500 hover:text-(--color-mainColor) hover:bg-orange-50/50"
                )}
              >
                {child.icon && (
                  <span
                    className={
                      isChildActive
                        ? "text-(--color-mainColor)"
                        : "text-gray-600"
                    }
                  >
                    {child.icon}
                  </span>
                )}
                <span className="truncate">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
