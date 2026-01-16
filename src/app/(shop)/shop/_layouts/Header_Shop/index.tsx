"use client";

import { LanguageSwitcher, ThemeSwitcher } from "@/components";
import { AccountDropdown } from "@/layouts/header/_components";
import { Bell, Menu, Search } from "lucide-react";
import { cn } from "@/utils/cn";

interface ShopHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function ShopHeader({ collapsed, onToggle }: ShopHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full h-16 md:h-20 px-4 md:px-8",
        "flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all"
      )}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-gray-400 hover:text-(--color-mainColor) hover:bg-orange-50 transition-all active:scale-90"
          aria-label="Toggle Sidebar"
        >
          <Menu
            className={cn(
              "w-5 h-5 md:w-6 md:h-6 transition-transform",
              collapsed ? "rotate-180" : ""
            )}
          />
        </button>

        <h1 className="text-lg md:text-2xl font-bold italic uppercase text-gray-900 tracking-tighter leading-none shrink-0">
          <span className="hidden xs:inline">Bảng Điều Khiển</span>
          <span className="xs:hidden inline">Bảng Điều Khiển</span>
          <span className="text-(--color-mainColor)"> Shop</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="flex items-center gap-1 md:gap-3">
          <button className="relative p-2 md:p-2.5 rounded-xl md:rounded-2xl text-gray-400 hover:text-(--color-mainColor) hover:bg-orange-50 transition-all group">
            <Bell
              size={20}
              className="group-hover:animate-swing w-5 h-5 md:w-5 md:h-5"
            />
            <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="hidden xs:block h-6 w-px bg-gray-100 mx-1 md:mx-2" />

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <div className="pl-1 md:pl-0">
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
}
