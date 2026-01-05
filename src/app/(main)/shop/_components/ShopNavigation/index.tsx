"use client";

import { cn } from "@/utils/cn";
import { Search } from "lucide-react";

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
    { id: "all", label: "Trang Chủ" },
    { id: "new", label: "Sản Phẩm" },
    { id: "sale", label: "Khuyến mãi" },
  ];

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] mb-8 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-none h-full items-center no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative h-full px-5 text-sm font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-center whitespace-nowrap
                    ${
                      isActive
                        ? "text-(--color-mainColor)"
                        : "text-slate-500 hover:text-(--color-mainColor)/80 hover:bg-gray-50"
                    }
                  `}
                >
                  {tab.label}

                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-(--color-mainColor) transform transition-all duration-300 ease-out",
                      ` ${ isActive? "scale-x-100 opacity-100": "scale-x-0 opacity-0"}`
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="hidden md:block relative group w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-slate-400 transition-colors group-focus-within:text-(--color-mainColor)"
              />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className={cn(
                "block w-full pl-10 pr-4 py-2.5 placeholder:text-slate-400",
                "bg-gray-100/50 border border-transparent",
                "rounded-xl text-sm text-slate-700 transition-all duration-300",
                "focus:bg-white",
                "focus:border-(--color-mainColor)/30",
                "focus:ring-4 focus:ring-(--color-mainColor)/10",
                "focus:outline-none",
                "hover:bg-white hover:shadow-sm hover:border-gray-200"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
