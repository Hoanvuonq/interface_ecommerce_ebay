"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion"; // Cài đặt: npm install framer-motion

export interface StatusTabItem<T extends string> {
  key: T;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface StatusTabsProps<T extends string> {
  tabs: StatusTabItem<T>[];
  current: T;
  onChange: (key: T) => void;
  className?: string;
}

export const StatusTabs = <T extends string>({
  tabs,
  current,
  onChange,
  className,
}: StatusTabsProps<T>) => {
  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar pb-2", className)}>
      <div className="relative inline-flex bg-white p-1.5 rounded-2xl border border-gray-200 gap-1">
        {tabs.map((tab) => {
          const isActive = current === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 whitespace-nowrap select-none outline-none",
                isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm ring-1 ring-gray-200"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2">
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-orange-500" : "text-gray-400"
                  )}
                />
                <span>{tab.label}</span>

                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "ml-1 px-2 py-0.5 rounded-md text-[10px] tabular-nums font-bold transition-colors duration-300",
                      isActive
                        ? "bg-orange-50 text-orange-600"
                        : "bg-gray-200/50 text-gray-500"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};