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

interface ShopSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function ShopSidebar({
  collapsed,
  setCollapsed,
}: ShopSidebarProps) {
  const pathname = usePathname();
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
        collapsed ? "w-20 overflow-visible" : "w-64"
      )}
    >
      <div className="h-20 flex items-center px-4 mb-4">
        <Link
          href="/shop/dashboard"
          className="flex items-center gap-3 w-full group overflow-hidden"
        >
          <div className="w-10 h-10 shrink-0 bg-(--color-mainColor) rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-all">
            <span className="text-xl font-bold italic">C</span>
          </div>

          <div
            className={cn(
              "flex flex-col transition-all duration-300 ease-in-out origin-left",
              collapsed
                ? "opacity-0 translate-x-5 pointer-events-none w-0"
                : "opacity-100 translate-x-0 w-auto"
            )}
          >
            <span className="text-lg font-bold tracking-tighter text-gray-800 leading-none whitespace-nowrap">
              CANO X
            </span>
            <span className="text-[10px] font-bold text-(--color-mainColor) uppercase tracking-widest mt-1 whitespace-nowrap">
              Management Hub
            </span>
          </div>
        </Link>
      </div>
      <div
        className={cn(
          "flex-1 px-3 custom-scrollbar",
          collapsed ? "overflow-visible" : "overflow-y-auto"
        )}
      >
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
