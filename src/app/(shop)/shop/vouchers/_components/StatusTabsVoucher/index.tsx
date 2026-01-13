"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { LayoutGroup } from "framer-motion";
export interface StatusTabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number | null;
}

interface StatusTabsProps {
  tabs: StatusTabItem[];
  current: string;
  onChange: (id: string) => void;
  className?: string;
}

export const StatusTabsVoucher = ({
  tabs,
  current,
  onChange,
  className,
}: StatusTabsProps) => {
  return (
    <LayoutGroup id="voucher-tabs">
      <div className={cn("w-full overflow-x-auto no-scrollbar", className)}>
        <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl border border-gray-100 gap-1">
          {tabs.map((tab) => {
            const isActive = current === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2.5 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 whitespace-nowrap select-none group",
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white shadow-custom shadow-gray-200"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2.5">
                  <div
                    className={cn(
                      "transition-transform duration-300 group-hover:scale-110",
                      isActive
                        ? "text-orange-400"
                        : "text-gray-400 group-hover:text-orange-500"
                    )}
                  >
                    {tab.icon}
                  </div>

                  <span>{tab.label}</span>

                  {tab.count !== undefined && tab.count !== null && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-lg text-[10px] font-bold tabular-nums transition-colors",
                        isActive
                          ? "bg-orange-100 text-(--color-mainColor) shadow-inner"
                          : "bg-gray-200/50 text-gray-800 group-hover:bg-orange-100 group-hover:text-(--color-mainColor)"
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
    </LayoutGroup>
  );
};
