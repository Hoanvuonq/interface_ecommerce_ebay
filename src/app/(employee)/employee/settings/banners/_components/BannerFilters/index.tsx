/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCategoryManager } from "@/app/(employee)/employee/categories/_hooks/useCategoryManager";
import { Button, FormInput, SelectComponent } from "@/components";
import _ from "lodash";
import { Filter, RotateCcw, Search, XCircle } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { BannerFiltersProps } from "./type";

export const BannerFilters: React.FC<BannerFiltersProps> = ({
  filters,
  setFilters,
  onSearch,
  onReset,
  onRefresh,
  isLoading,
}) => {
  const {
    categories,
    fetchCategories,
    loading: categoryLoading,
  } = useCategoryManager();

  const localeOptions = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "English", value: "en" },
  ];

  useEffect(() => {
    fetchCategories(0, 100);
  }, []);

  const categoryOptions = useMemo(() => {
    const list = Array.isArray(categories)
      ? categories
      : (categories as any)?.content || [];
    return _.map(list, (cat: any) => ({
      label: cat.name || "Danh mục không tên",
      value: cat.id,
    }));
  }, [categories]);

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-500 shadow-orange-500/5">
      <div className="flex items-center gap-2 px-1">
        <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500 shadow-sm">
          <Filter size={16} strokeWidth={2.5} />
        </div>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          Hệ thống lọc Banner
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 z-10 transition-colors"
          />
          <FormInput
            placeholder="Tìm kiếm tiêu đề banner..."
            value={filters.searchText}
            onChange={(e) =>
              setFilters((p) => ({ ...p, searchText: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="w-full h-12 pl-11 pr-4 rounded-2xl border-gray-100 focus:border-orange-500 shadow-inner"
          />
        </div>

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

        <div className="md:col-span-3">
          <SelectComponent
            isMulti
            placeholder={categoryLoading ? "Đang tải..." : "Chọn danh mục"}
            options={categoryOptions}
            value={filters.categoryIds}
            onChange={(val) =>
              setFilters((p) => ({ ...p, categoryIds: val as string[] }))
            }
            disabled={categoryLoading}
            className="h-12"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <Button
            variant="edit"
            onClick={onRefresh}
            className="flex-1 h-12 flex items-center justify-center rounded-2xl"
          >
            <RotateCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </Button>
          <Button
            variant="edit"
            onClick={onReset}
            className="flex-1 h-12 flex items-center justify-center rounded-2xl"
          >
            <XCircle size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
