"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  SHOP_ROUTE_MAPPINGS,
  SHOP_SIDEBAR_ITEMS,
} from "../../_constants/sidebar";
import { SidebarItem } from "@/app/(employee)/employee/_layouts/_components/SidebarItem";

// 💡 Thêm Interface cho Props
interface ShopSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function ShopSidebar({
  collapsed,
  setCollapsed,
}: ShopSidebarProps) {
  const pathname = usePathname();
  // const [collapsed, setCollapsed] = useState(false); // ❌ Xóa dòng này
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const { selectedKey, parentKey } = useMemo(() => {
    const match = SHOP_ROUTE_MAPPINGS.find((r) =>
      pathname.startsWith(r.prefix)
    );
    return {
      selectedKey: match?.key || "home",
      parentKey: match?.parent || null,
    };
  }, [pathname]);

  const handleToggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-white h-screen sticky top-0 transition-all duration-500 z-50 border-r border-blue-50 shadow-sm",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center px-4 mb-4">
        <Link
          href="/shop/dashboard"
          className="flex items-center gap-3 w-full group"
        >
          <div className="w-10 h-10 shrink-0 bg-(--color-mainColor) rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-all">
            <span className="text-xl font-bold italic">S</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
              <span className="text-lg font-bold tracking-tighter text-gray-800 leading-none">
                SHOP CENTER
              </span>
              <span className="text-[10px] font-bold text-(--color-mainColor) uppercase tracking-widest mt-1">
                Management Hub
              </span>
            </div>
          )}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
        <nav className="space-y-1">
          {SHOP_SIDEBAR_ITEMS.map((item) => (
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
    </aside>
  );
}
