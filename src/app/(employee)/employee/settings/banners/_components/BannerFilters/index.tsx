"use client";

import React from "react";
import {
  Search,
  RotateCcw,
  XCircle,
  Globe,
  Layers,
  Filter,
} from "lucide-react";
import { ButtonField, FormInput, SelectComponent } from "@/components";
import { Button } from "@/components/button";
import { BannerFiltersProps } from "./type";

export const BannerFilters: React.FC<BannerFiltersProps> = ({
  filters,
  setFilters,
  categories,
  categoryLoading,
  onSearch,
  onReset,
  onRefresh,
  isLoading,
}) => {
  const localeOptions = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "English", value: "en" },
  ];

  const categoryOptions = categories.map((cat) => ({
    label: `${cat.name} • ${cat.id}`,
    value: cat.id,
  }));

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 px-1">
        <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">
          <Filter size={16} strokeWidth={2.5} />
        </div>
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Bộ lọc tìm kiếm banner
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Ô Tìm kiếm (Col 5) */}
        <div className="md:col-span-5 relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
          />
          <FormInput
            placeholder="Tìm kiếm theo tiêu đề, mô tả..."
            value={filters.searchText}
            onChange={(e) =>
              setFilters((p) => ({ ...p, searchText: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="w-full h-12 pl-11 pr-4 transition-all"
            containerClassName="space-y-0"
          />
        </div>

        {/* Chọn ngôn ngữ (Col 2) */}
        <div className="md:col-span-2">
          <SelectComponent
            placeholder="Ngôn ngữ"
            options={localeOptions}
            value={filters.locale}
            onChange={(val) =>
              setFilters((p) => ({ ...p, locale: val as string }))
            }
            className="h-12"
          />
        </div>

        {/* Chọn Danh mục (Col 3) - Multi Select */}
        <div className="md:col-span-3">
          <SelectComponent
            isMulti
            placeholder="Chọn danh mục"
            options={categoryOptions}
            value={filters.categoryIds}
            onChange={(val) =>
              setFilters((p) => ({ ...p, categoryIds: val as string[] }))
            }
            disabled={categoryLoading}
            className="h-12"
          />
        </div>

        {/* Nút Refresh nhanh (Col 2) */}
        <div className="md:col-span-2 flex items-center justify-end">
          <Button
            variant="edit"
            className="w-full h-12 rounded-2xl font-bold uppercase text-[10px] text-gray-500 hover:bg-gray-50 transition-all border-gray-100"
            onClick={onRefresh}
          >
            <span className="flex gap-2 items-center justify-center">
              <RotateCcw
                size={14}
                className={isLoading ? "animate-spin" : ""}
              />
              Làm mới
            </span>
          </Button>
        </div>
      </div>

      {/* Hàng 2: Nút hành động chính */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-orange-500">
            <Globe size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-60">
              Global Settings
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-500">
            <Layers size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-60">
              Categories Filter
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="edit"
            className="h-12 px-6 rounded-2xl font-bold uppercase text-[10px] text-gray-400 hover:text-rose-500 transition-all active:scale-95 border-0"
            onClick={onReset}
          >
            <span className="flex gap-2 items-center">
              <XCircle size={14} />
              Xóa bộ lọc
            </span>
          </Button>

          <ButtonField
            type="login"
            onClick={onSearch}
            loading={isLoading}
            className="w-40 h-12 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-orange-500/20 transition-all active:scale-95"
          >
            ÁP DỤNG LỌC
          </ButtonField>
        </div>
      </div>
    </div>
  );
};
