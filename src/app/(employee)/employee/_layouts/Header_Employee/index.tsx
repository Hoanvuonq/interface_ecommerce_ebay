"use client";

import { LanguageSwitcher, ThemeSwitcher } from "@/components";
import { AccountDropdown } from "@/layouts/header/_components";
import { cn } from "@/utils/cn";
import { Bell, Menu, Search } from "lucide-react";

interface EmployeeHeaderProps {
  onToggleSidebar: () => void;
  collapsed: boolean;
  isMobile?: boolean;
}

export default function EmployeeHeader({
  onToggleSidebar,
  collapsed,
  isMobile = false,
}: EmployeeHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full h-16 md:h-20 px-4 md:px-8",
        "flex items-center justify-between",
        "bg-white/90 backdrop-blur-xl border-b border-gray-100",
        "shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-(--color-mainColor) hover:bg-orange-50 active:scale-90 transition-all duration-200"
          aria-label="Toggle Sidebar"
        >
          <Menu
            className={cn(
              "w-5 h-5 md:w-6 md:h-6 transition-transform",
              collapsed ? "rotate-180" : ""
            )}
          />
        </button>

        <h1 className="text-lg md:text-2xl font-bold italic uppercase tracking-tighter text-gray-900 truncate leading-none">
          <span className="hidden sm:inline">Employee</span>
          <span className="text-(--color-mainColor)">
            {" "}
            {isMobile ? "Hub" : "Workspace"}
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
       
        <div className="flex items-center gap-1 md:gap-3">
          <button className="relative p-2 md:p-2.5 rounded-xl md:rounded-2xl text-gray-500 hover:text-(--color-mainColor) hover:bg-orange-50 transition-all duration-200 group">
            <Bell className="w-5 h-5 group-hover:animate-swing" />
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          </button>

          <div className="hidden sm:block h-6 w-px bg-gray-100 mx-1" />

          <div className="hidden md:flex items-center gap-2">
            <div className="hover:bg-gray-50 rounded-xl p-1 transition-colors">
              <LanguageSwitcher />
            </div>
            <div className="hover:bg-gray-50 rounded-xl p-1 transition-colors">
              <ThemeSwitcher />
            </div>
          </div>
        </div>

        <div className="pl-1 md:pl-2">
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
}
