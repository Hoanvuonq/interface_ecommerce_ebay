"use client";

import { cn } from "@/utils/cn";
import { Search, Flame, Home, Layout } from "lucide-react";
import { StatusTabs, StatusTabItem } from "@/app/(shop)/shop/_components";
import { SearchComponent } from "@/components";
import { FormInput } from "@/components";

interface ShopNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

type TabKey = "all" | "new" | "sale";

export default function ShopNavigation({
  activeTab,
  setActiveTab,
  searchKeyword,
  setSearchKeyword,
}: ShopNavigationProps) {
  const navTabs: StatusTabItem<TabKey>[] = [
    { key: "all", label: "Trang Chủ", icon: Home },
    { key: "new", label: "Sản Phẩm", icon: Layout },
    { key: "sale", label: "Khuyến mãi", icon: Flame },
  ];

  return (
    <div className="sticky max-w-7xl mx-auto z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-custom mb-8 rounded-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-2 justify-between gap-8">
          <div className="flex-1 flex items-center">
            <StatusTabs
              tabs={navTabs}
              current={activeTab as TabKey}
              onChange={(key) => setActiveTab(key)}
              layoutId="shop-nav-active-pill"
            />
          </div>

          <div className="relative group w-full max-w-[320px] hidden sm:block">
            <SearchComponent
              value={searchKeyword}
              onChange={setSearchKeyword}
              placeholder="Tìm trong cửa hàng..."
              size="md"
              className="md:col-span-5"
            />
            <div className="absolute inset-y-0 right-3 hidden lg:flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-slate-200 rounded-md shadow-sm">
                /
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
