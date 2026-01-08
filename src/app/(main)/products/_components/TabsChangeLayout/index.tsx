"use client";

import { cn } from "@/utils/cn";
import { LayoutGrid, List, ShoppingCart } from "lucide-react";
import React from "react";
import { SelectComponent } from "@/components/SelectComponent";

interface TabsChangeLayoutProps {
  total: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortValue?: string;
  onSortChange: (val: string) => void;
}

export const TabsChangeLayout: React.FC<TabsChangeLayoutProps> = ({
  total,
  viewMode,
  setViewMode,
  sortValue,
  onSortChange,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md sticky top-4 z-30 p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-orange-600 p-2.5 rounded-xl text-white shadow-lg shadow-orange-200 flex items-center justify-center">
          <ShoppingCart size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 leading-none tracking-tight">
            Cửa hàng
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            <span className="text-orange-600 font-bold text-sm mr-1">
              {total}
            </span>
            sản phẩm sẵn có
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Sắp xếp
          </span>
          <div className="w-45">
            <SelectComponent
              value={sortValue ?? ""}
              onChange={onSortChange}
              options={[
                { label: "Mới nhất", value: "newest" },
                { label: "Giá thấp - cao", value: "priceAsc" },
                { label: "Giá cao - thấp", value: "priceDesc" },
              ]}
              placeholder="Mặc định"
            />
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/50">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center",
              viewMode === "grid"
                ? "bg-white shadow-sm text-orange-600 scale-100"
                : "text-gray-600 hover:text-gray-600 hover:bg-gray-200/50 scale-95 hover:scale-100"
            )}
            title="Dạng lưới"
            aria-label="Chuyển sang dạng lưới"
          >
            <LayoutGrid size={18} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center",
              viewMode === "list"
                ? "bg-white shadow-sm text-orange-600 scale-100"
                : "text-gray-600 hover:text-gray-600 hover:bg-gray-200/50 scale-95 hover:scale-100"
            )}
            title="Dạng danh sách"
            aria-label="Chuyển sang dạng danh sách"
          >
            <List size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};