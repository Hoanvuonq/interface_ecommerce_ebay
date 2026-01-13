"use client";

import { ButtonField } from "@/components";
import { SelectComponent } from "@/components";
import { CategoryService } from "@/services/categories/category.service";
import type { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { formatVND } from "@/utils/product.utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { PRICE_PRESETS, ProductFilterValues, SORT_OPTIONS } from "./type";

export default function ProductFilters({
  value,
  onChange,
  onSearch,
}: {
  value: ProductFilterValues;
  onChange: (v: ProductFilterValues) => void;
  onSearch: () => void;
  autoSearch?: boolean;
  showAdvanced?: boolean;
}) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryService.getAllParents();
        setCategories(Array.isArray(res) ? res : (res as any)?.data || []);
      } catch (error) {
        setCategories([]);
      }
    })();
  }, []);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.id })),
    [categories]
  );

  const handleFilterChange = (updates: Partial<ProductFilterValues>) =>
    onChange({ ...value, ...updates });

  const clearAllFilters = () => {
    onChange({
      keyword: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: undefined,
    });
  };

  const hasActiveFilters = useMemo(() => {
    return !!(
      value.keyword ||
      value.categoryId ||
      (value.minPrice ?? 0) > 0 ||
      (value.maxPrice ?? 100_000_000) < 100_000_000
    );
  }, [value]);

  const sliderPercentage = useMemo(() => {
    const maxVal = 100_000_000;
    const currentVal = value.maxPrice || maxVal;
    return (currentVal / maxVal) * 100;
  }, [value.maxPrice]);

  return (
    <div className="bg-white rounded-b-4xl border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden transition-all duration-500">
      <div
        className="px-6 py-3 cursor-pointer flex items-center justify-between bg-white group select-none"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-orange-100">
            <SlidersHorizontal size={20} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest leading-none">
              Bộ lọc tìm kiếm
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    hasActiveFilters ? "bg-orange-400" : "hidden"
                  )}
                ></span>
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    hasActiveFilters ? "bg-orange-500" : "bg-gray-300"
                  )}
                ></span>
              </span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {hasActiveFilters ? "Đang áp dụng bộ lọc" : "Tùy chỉnh kết quả"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-orange-200 group-hover:bg-orange-50 transition-all">
          <motion.div
            animate={{ rotate: isFilterVisible ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown
              size={16}
              className="text-gray-400 group-hover:text-orange-500"
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isFilterVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-2 space-y-4 border-t border-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Từ khóa
                  </label>
                  <div className="relative group">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                      size={16}
                    />
                    <input
                      className="w-full pl-11 pr-4 h-12 text-sm font-medium bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-gray-400 text-gray-700"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={value.keyword || ""}
                      onChange={(e) =>
                        handleFilterChange({ keyword: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Danh mục
                  </label>
                  <SelectComponent
                    options={[
                      { label: "Tất cả danh mục", value: "" },
                      ...categoryOptions,
                    ]}
                    value={value.categoryId || ""}
                    onChange={(val: any) =>
                      handleFilterChange({ categoryId: val || undefined })
                    }
                    className="h-12! rounded-2xl! bg-gray-50! border-transparent! focus:bg-white! focus:border-orange-200! font-medium! text-sm!"
                  />
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Sắp xếp
                  </label>
                  <SelectComponent
                    options={SORT_OPTIONS}
                    value={value.sort || ""}
                    onChange={(val: any) =>
                      handleFilterChange({ sort: val || undefined })
                    }
                    className="h-12! rounded-2xl! bg-gray-50! border-transparent! focus:bg-white! focus:border-orange-200! font-medium! text-sm!"
                  />
                </div>
              </div>

              {/* --- PRICE RANGE --- */}
              <div className="space-y-6 bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Khoảng giá
                  </label>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-800 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                    <span>{formatVND(value.minPrice || 0)}</span>
                    <ArrowRight size={12} className="text-gray-400" />
                    <span>{formatVND(value.maxPrice || 100_000_000)}</span>
                  </div>
                </div>

                <div className="px-1 relative h-6 flex items-center group">
                  <div className="absolute w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all duration-75 ease-out"
                      style={{ width: `${sliderPercentage}%` }}
                    />
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100_000_000}
                    step={500000}
                    value={value.maxPrice || 100_000_000}
                    onChange={(e) =>
                      handleFilterChange({ maxPrice: Number(e.target.value) })
                    }
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  <div
                    className="absolute h-5 w-5 bg-white border-[3px] border-orange-500 rounded-full shadow-md pointer-events-none transition-all duration-75 ease-out z-20 group-hover:scale-110 group-active:scale-95"
                    style={{
                      left: `calc(${sliderPercentage}% - 10px)`,
                    }}
                  />
                </div>

                <div className="relative">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x relative z-10">
                    {PRICE_PRESETS.map((preset, idx) => {
                      const isActive =
                        value.minPrice === preset.min &&
                        value.maxPrice === preset.max;

                      return (
                        <button
                          key={idx}
                          onClick={() =>
                            handleFilterChange({
                              minPrice: preset.min,
                              maxPrice: preset.max,
                            })
                          }
                          className={cn(
                            "relative px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-colors whitespace-nowrap shrink-0 z-20 snap-start",
                            isActive
                              ? "text-white"
                              : "text-gray-500 hover:text-orange-600 bg-white border border-gray-100 hover:border-orange-200"
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="price-active-bg"
                              className="absolute inset-0 bg-linear-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/30 z-[-1]"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                          )}
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 ">
                <ButtonField
                  type="secondary"
                  size="large"
                  onClick={clearAllFilters}
                  className="rounded-xl! w-auto px-6! h-10! text-[11px] font-bold uppercase  bg-white! border-gray-200! text-gray-600! hover:bg-gray-50! hover:text-gray-900!"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw size={14} className="mr-2" />
                    Đặt lại
                  </span>
                </ButtonField>

                <ButtonField
                  type="login"
                  size="large"
                  onClick={onSearch}
                  className="rounded-xl! w-auto px-6! h-10! text-[11px] font-bold uppercase  shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Search size={16} className="mr-2" strokeWidth={2.5} />
                    Xem kết quả
                  </span>
                </ButtonField>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}