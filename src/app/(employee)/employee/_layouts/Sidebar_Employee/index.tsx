// src/layouts/employee/sidebar/index.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { SIDEBAR_ITEMS ,ROUTE_MAPPINGS} from "../../_constants/sidebar";
import { SidebarItem } from "../_components/SidebarItem";
import { EmployeeSidebarProps } from "../../_types/sidebar";

export default function EmployeeSidebar({
  collapsed,
  onMobileMenuClick,
  className,
}: EmployeeSidebarProps) {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const { selectedKey, parentKey } = useMemo(() => {
    const sorted = [...ROUTE_MAPPINGS].sort((a, b) => b.prefix.length - a.prefix.length);
    const match = sorted.find((r) => pathname.startsWith(r.prefix));
    
    return {
      selectedKey: match?.key || "home",
      parentKey: match?.parent,
    };
  }, [pathname]);

  useEffect(() => {
    if (parentKey && !collapsed) {
      setOpenKeys((prev) => Array.from(new Set([...prev, parentKey])));
    }
  }, [parentKey, collapsed]);

  const handleToggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r border-slate-100 h-screen sticky top-0 transition-all duration-300 z-50",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="h-20 flex items-center justify-center border-b border-slate-50 mb-4">
        <Link href="/" className="relative flex items-center justify-center w-full h-full">
           <div className={cn("transition-all duration-300 flex items-center gap-2", collapsed ? "scale-0 w-0" : "scale-100")}>
              <span className="text-xl font-black text-slate-800 tracking-tighter">
                <span className="text-orange-500">Employee</span>Hub
              </span>
           </div>
           <div className={cn("absolute transition-all duration-300", collapsed ? "scale-100 opacity-100" : "scale-0 opacity-0")}>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-200">
                E
              </div>
           </div>
        </Link>
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              activeKey={selectedKey}
              openKeys={openKeys}
              onToggle={handleToggle}
            />
          ))}
        </nav>
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-slate-50">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
             <span className="text-xs font-medium text-slate-500">System Online</span>
          </div>
        </div>
      )}
    </aside>
  );
}