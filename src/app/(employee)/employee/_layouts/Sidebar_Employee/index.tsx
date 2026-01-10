"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ROUTE_MAPPINGS, SIDEBAR_ITEMS } from "../../_constants/sidebar";
import { EmployeeSidebarProps } from "../../_types/sidebar";
import { SidebarItem } from "../_components/SidebarItem";
import { SystemOnline } from "../_components/SystemOnline";
export default function EmployeeSidebar({
  collapsed,
  onMobileMenuClick,
  className,
}: EmployeeSidebarProps) {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const { selectedKey, parentKey } = useMemo(() => {
    const sortedMappings = [...ROUTE_MAPPINGS].sort(
      (a, b) => b.prefix.length - a.prefix.length
    );
    const match = sortedMappings.find((r) => pathname.startsWith(r.prefix));
    return {
      selectedKey: match?.key || "dashboard",
      parentKey: match?.parent || null,
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
        "flex flex-col bg-white h-screen sticky top-0 transition-all duration-500 ease-in-out z-50",
        "border-r border-orange-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="h-20 flex items-center px-4 mb-4 relative overflow-hidden">
        <Link href="/" className="flex items-center gap-3 w-full group">
          <div className="w-10 h-10 shrink-0 bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:rotate-6 transition-transform duration-300">
            <span className="text-xl font-semibold italic">C</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
              <span className="text-lg font-semibold tracking-tighter text-gray-800 leading-none">
                CALATHA
              </span>
              <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-[0.2em] mt-1">
                Employee Hub
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              activeKey={selectedKey} 
              openKeys={openKeys}
              onToggle={handleToggle}
              isParentOfActive={parentKey === item.key}
            />
          ))}
        </nav>
      </div>

      <SystemOnline collapsed={collapsed} />
    </aside>
  );
}
