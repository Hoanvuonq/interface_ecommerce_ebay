"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

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
  layoutId?: string;
}

export const StatusTabs = <T extends string>({
  tabs,
  current,
  onChange,
  className,
  layoutId = "ultimate-pill",
}: StatusTabsProps<T>) => {
  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar py-2 px-1", className)}>
      <nav className="relative inline-flex bg-gray-50  backdrop-blur-md p-1.5 rounded-2xl gap-1 border border-gray-200/50 shadow-custom">
        {tabs.map((tab) => {
          const isActive = current === tab.key;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap outline-none select-none",
                isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-white rounded-2xl shadow-custom border border-gray-200/40"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}

              <motion.div
                className="absolute inset-0 rounded-2xl bg-gray-200/0 hover:bg-gray-200/50 transition-colors z-0"
              />

              <div className="relative z-10 flex items-center gap-2">
                <motion.div
                  animate={isActive ? { scale: 1.1, rotate: [0, -10, 10, 0] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                      "transition-colors duration-300",
                      isActive ? "text-orange-500" : "text-gray-400"
                    )}
                  />
                </motion.div>

                <span className="tracking-tight uppercase text-[11px] font-extrabold">{tab.label}</span>

                <AnimatePresence mode="popLayout">
                  {tab.count !== undefined && (
                    <motion.span
                      key={tab.count}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "ml-1 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold tabular-nums transition-all duration-300",
                        isActive
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {tab.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};