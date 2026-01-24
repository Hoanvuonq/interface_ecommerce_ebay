"use client";

import { cn } from "@/utils/cn";
import { Search, Flame, LayoutGrid, Home } from "lucide-react";

interface ShopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

export default function ShopNavigation({
  activeTab,
  setActiveTab,
  searchKeyword,
  setSearchKeyword,
}: ShopNavigationProps) {
  const tabs = [
    { id: "all", label: "Trang Chủ", icon: Home },
    { id: "new", label: "Sản Phẩm", icon: LayoutGrid },
    { id: "sale", label: "Khuyến mãi", icon: Flame },
  ];

  return (
    <div className="sticky max-w-7xl mx-auto top-2 mt-5 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm mb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Tabs Section */}
          <div className="flex gap-2 h-full items-center overflow-x-auto no-scrollbar py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap",
                    isActive 
                      ? "text-(--color-mainColor) bg-(--color-mainColor)/5" 
                      : " text-gray-500 hover:text-gray-900 hover:bg-slate-50"
                  )}
                >
                  <Icon size={16} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                  <span className="tracking-tight">{tab.label}</span>

                  {/* Active Indicator (Underline mượt hơn) */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-(--color-mainColor) animate-in fade-in zoom-in duration-300" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Bar Section */}
          <div className="relative group w-full max-w-[320px] hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search
                size={16}
                className=" text-gray-400 transition-colors group-focus-within:text-(--color-mainColor)"
              />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm trong cửa hàng..."
              className={cn(
                "w-full pl-10 pr-4 py-2 text-sm rounded-2xl transition-all duration-300",
                "bg-slate-100/50 border border-slate-100",
                "placeholder: text-gray-400 placeholder:font-medium",
                "focus:bg-white focus:border-(--color-mainColor)/40 focus:ring-4 focus:ring-(--color-mainColor)/5 focus:outline-none",
                "hover:bg-slate-100/80"
              )}
            />
            {/* Ký tự phím tắt trang trí cho chuyên nghiệp */}
            <div className="absolute inset-y-0 right-3 hidden lg:flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-bold  text-gray-400 bg-white border border-slate-200 rounded-md shadow-sm">
                /
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}