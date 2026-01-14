"use client";

import React from "react";
import { Search, RefreshCcw } from "lucide-react";
import {  ButtonField } from "@/components";
import { Button } from "@/components/button/button";

export interface FilterState {
  keyword: string;
  minPrice: number | null;
  maxPrice: number | null;
  categoryId?: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  onSearch,
  onReset,
  isLoading,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-in fade-in duration-500">
      <div className="md:col-span-5 relative group">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
        />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
          value={filters.keyword}
          onChange={(e) =>
            setFilters((p) => ({ ...p, keyword: e.target.value }))
          }
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-gray-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400"
        />
      </div>

      <div className="md:col-span-3 flex gap-2">
        <div className="relative w-1/2">
          <input
            type="number"
            placeholder="Giá từ"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                minPrice: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:border-gray-500 transition-all placeholder:font-normal"
          />
        </div>
        <div className="relative w-1/2">
          <input
            type="number"
            placeholder="Đến"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                maxPrice: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:border-gray-500 transition-all placeholder:font-normal"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:col-span-4 justify-end">
        <Button
          variant="edit"
          className="h-12 px-6 rounded-2xl font-bold uppercase text-[10px]  text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
          onClick={onReset}
        >
          <span className="flex gap-2 items-center">
            <RefreshCcw
              size={14}
              className={isLoading ? "animate-spin" : ""}
            />
            Đặt lại
          </span>
        </Button>
        
        <ButtonField
          type="login"
          onClick={onSearch}
          loading={isLoading}
          className="w-30 h-12 rounded-2xl text-[10px] font-bold uppercase  shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          TÌM KIẾM
        </ButtonField>
      </div>
    </div>
  );
};