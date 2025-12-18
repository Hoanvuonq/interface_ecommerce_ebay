"use client";

import { cn } from "@/utils/cn";
import { LayoutGrid, List, ShoppingCart } from "lucide-react";
import React from "react";

interface TabsChangeLayoutProps {
  total: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortValue?: string;
  onSortChange: (val: string) => void;
}

const CustomSelect: React.FC<{
  options: { label: string; value: string }[];
  value?: string;
  onChange: (val: string) => void;
  className?: string;
}> = ({ options, value, onChange, className }) => (
  <div className="relative group">
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "px-4 py-2 text-sm border border-gray-200 text-gray-700 cursor-pointer rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-white appearance-none pr-10 shadow-sm hover:border-orange-300",
        className
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-orange-500">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 4.5L6 8L9.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

export const TabsChangeLayout: React.FC<TabsChangeLayoutProps> = ({
  total,
  viewMode,
  setViewMode,
  sortValue,
  onSortChange,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md sticky top-4 z-30 p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
          <ShoppingCart size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-800 leading-none">Cửa hàng</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            <span className="text-orange-600 font-bold">{total}</span> sản phẩm sẵn có
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sắp xếp</span>
          <CustomSelect
            value={sortValue}
            onChange={onSortChange}
            options={[
              { label: "Mới nhất", value: "newest" },
              { label: "Giá thấp - cao", value: "priceAsc" },
              { label: "Giá cao - thấp", value: "priceDesc" },
            ]}
          />
        </div>

        <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden md:block"></div>

        {/* Chuyển đổi Layout */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/50">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center",
              viewMode === "grid"
                ? "bg-white shadow-sm text-orange-600"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
            )}
            title="Dạng lưới"
          >
            <LayoutGrid size={18} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center",
              viewMode === "list"
                ? "bg-white shadow-sm text-orange-600"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
            )}
            title="Dạng danh sách"
          >
            <List size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};