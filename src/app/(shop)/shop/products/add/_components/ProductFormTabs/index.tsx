"use client";

import React from "react";
import { 
  LayoutGrid, 
  Tags, 
  Info, 
  ShoppingBag, 
  Truck,
  LucideIcon 
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion"; 

export type TabType = "basic" | "details" | "description" | "sales" | "shipping";

interface TabConfig {
  key: TabType;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

interface ProductFormTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  children: React.ReactNode;
  className?: string;
}

export const ProductFormTabs: React.FC<ProductFormTabsProps> = ({
  activeTab,
  setActiveTab,
  children,
  className,
}) => {
  const tabs: TabConfig[] = [
    { key: "basic", label: "Cơ bản", icon: LayoutGrid },
    { key: "details", label: "Chi tiết", icon: Tags, disabled: true },
    { key: "description", label: "Mô tả", icon: Info },
    { key: "sales", label: "Bán hàng", icon: ShoppingBag },
    { key: "shipping", label: "Vận chuyển", icon: Truck, disabled: true },
  ];

  return (
    <div className={cn("flex flex-col  w-full", className)}>
      <div className="w-full overflow-x-auto no-scrollbar pb-4">
        <div className="inline-flex bg-white p-1.5 rounded-2xl border border-gray-100 gap-1 relative">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const isDisabled = tab.disabled;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => !isDisabled && setActiveTab(tab.key)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200 whitespace-nowrap select-none relative z-10",
                  isActive && !isDisabled ? "text-orange-600" : "text-gray-500",
                  isDisabled ? "opacity-40 cursor-not-allowed" : "hover:text-orange-500"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon
                  size={18}
                  className={cn(
                    "relative z-20 transition-transform duration-300",
                    isActive && "scale-110"
                  )}
                />
                <span className="relative z-20">{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-orange-500 rounded-full z-20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-2"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};