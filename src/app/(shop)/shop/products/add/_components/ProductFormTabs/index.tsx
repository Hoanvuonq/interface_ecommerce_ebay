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

// Định nghĩa các loại Tab để dùng chung cho toàn bộ app
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
    {
      key: "basic",
      label: "Cơ bản",
      icon: LayoutGrid,
    },
    {
      key: "details",
      label: "Chi tiết",
      icon: Tags,
      disabled: true,
    },
    {
      key: "description",
      label: "Mô tả",
      icon: Info,
    },
    {
      key: "sales",
      label: "Bán hàng",
      icon: ShoppingBag,
    },
    {
      key: "shipping",
      label: "Vận chuyển",
      icon: Truck,
      disabled: true,
    },
  ];

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {/* --- PHẦN THANH ĐIỀU HƯỚNG (TABS NAV) --- */}
      <div className="w-full overflow-x-auto no-scrollbar pb-4">
        <div className="inline-flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200 gap-1">
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
                  "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap select-none relative",
                  isActive && !isDisabled
                    ? "bg-white text-blue-600 shadow-sm scale-105"
                    : isDisabled
                    ? "text-gray-400 cursor-not-allowed opacity-60"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition-transform",
                    isActive && "scale-110"
                  )}
                />
                <span>{tab.label}</span>

                {/* Chấm tròn chỉ thị cho Tab bị Disabled */}
                {isDisabled && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                )}
                
                {/* Line dưới cho Tab đang Active */}
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- PHẦN NỘI DUNG (TAB CONTENT) --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[400px] overflow-hidden">
        {/* Chúng ta có thể thêm hiệu ứng transition ở đây nếu muốn */}
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};