"use client";

import React from "react";
import { cn } from "@/utils/cn"; 

export interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface CustomTabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export const CustomTabs: React.FC<CustomTabsProps> = ({
  items,
  activeKey,
  onChange,
  className,
}) => {
  return (
    <div className={cn("border-b border-gray-100", className)}>
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-4">
        {items.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => !item.disabled && onChange(item.key)}
              disabled={item.disabled}
              className={cn(
                "group relative flex items-center gap-2 py-4 text-sm font-semibold transition-all duration-300 outline-none select-none",
                item.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              {item.icon && (
                <span className={cn(
                  "transition-colors duration-300",
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-600"
                )}>
                  {item.icon}
                </span>
              )}
              
              <span className="whitespace-nowrap">{item.label}</span>

              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full animate-in fade-in zoom-in-95 duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};