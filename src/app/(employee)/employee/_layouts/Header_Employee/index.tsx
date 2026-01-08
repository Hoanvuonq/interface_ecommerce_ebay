"use client";

import { LanguageSwitcher, ThemeSwitcher } from "@/components";
import { AccountDropdown } from "@/layouts/header/_components";
import { cn } from "@/utils/cn";
import { Bell, Menu } from "lucide-react";

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
        "bg-white/80 backdrop-blur-xl border-b border-orange-100/50",
        "shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02),0_10px_20px_-2px_rgba(0,0,0,0.01)]",
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 active:scale-95 transition-all duration-200"
          aria-label="Toggle Sidebar"
        >
          <Menu className={cn("w-6 h-6", collapsed ? "rotate-180" : "")} />
        </button>

        <h1 className="text-lg md:text-xl font-semibold tracking-tight text-gray-800 truncate">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500">
            {isMobile ? "Dashboard" : "Employee Workspace"}
          </span>
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-3 lg:gap-5">
        <button className="relative p-2.5 rounded-xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 group">
          <Bell className="w-5 h-5 group-hover:animate-swing" />
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </button>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="hover:bg-gray-50 rounded-xl p-1 transition-colors">
            <LanguageSwitcher />
          </div>
          <div className="hover:bg-gray-50 rounded-xl p-1 transition-colors">
            <ThemeSwitcher />
          </div>
        </div>

        <div className="pl-2">
          <AccountDropdown />
        </div>
      </div>

      <div className="flex md:hidden items-center gap-3">
        <button className="relative p-2 rounded-lg text-gray-600 active:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <AccountDropdown />
      </div>
    </header>
  );
}
