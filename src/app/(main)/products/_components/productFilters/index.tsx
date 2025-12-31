"use client";

import { CategoryService } from "@/services/categories/category.service";
import type { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { formatVND } from "@/utils/product.utils";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Filter,
  RotateCw,
  Search,
  Tag as TagsIcon,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { PRICE_PRESETS, ProductFilterValues, SORT_OPTIONS } from "./type";
import { SelectComponent } from "@/components/SelectComponent";
import { Button } from "@/components/button/button";
import { CustomButton } from "@/components";

// Input được làm mỏng và sắc nét hơn
const CustomInput: React.FC<any> = ({
  placeholder,
  value,
  onChange,
  className,
  icon: Icon,
  ...rest
}) => (
  <div className="relative w-full group">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={cn(
        "w-full px-4 py-3 text-xs border-2 border-slate-100 rounded-xl text-slate-800 placeholder:text-slate-500 focus:border-orange-500 outline-none transition-all bg-white",
        className
      )}
      {...rest}
    />
    {Icon && (
      <Icon className="w-3.5 h-3.5 text-black absolute right-3 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 transition-colors" />
    )}
  </div>
);

// Tag trạng thái nhỏ gọn
const CustomTag: React.FC<any> = ({
  children,
  closable,
  onClose,
  className,
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase  bg-slate-50 text-slate-600 border border-slate-200 shadow-sm",
      className
    )}
  >
    {children}
    {closable && (
      <X
        onClick={onClose}
        className="w-3 h-3 cursor-pointer hover:text-red-500 transition-all"
      />
    )}
  </span>
);

export default function ProductFilters({
  value,
  onChange,
  onSearch,
  showAdvanced = true,
}: {
  value: ProductFilterValues;
  onChange: (v: ProductFilterValues) => void;
  onSearch: () => void;
  autoSearch?: boolean;
  showAdvanced?: boolean;
}) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    value.minPrice ?? 0,
    value.maxPrice ?? 100_000_000,
  ]);

  useEffect(() => {
    setLocalPriceRange([value.minPrice ?? 0, value.maxPrice ?? 100_000_000]);
  }, [value.minPrice, value.maxPrice]);

  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryService.getAllParents();
        const cats = Array.isArray(res) ? res : (res as any)?.data || [];
        setCategories(cats);
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
    setLocalPriceRange([0, 100_000_000]);
  };

  const hasActiveFilters = useMemo(() => {
    return !!(
      value.keyword ||
      value.categoryId ||
      (value.minPrice ?? 0) > 0 ||
      (value.maxPrice ?? 100_000_000) < 100_000_000
    );
  }, [value]);

  return (
    <div className="bg-slate-50 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div
        className="px-5 py-4 border-b border-slate-50 cursor-pointer flex items-center justify-between bg-slate-50/50 group"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-orange-500 p-1.5 rounded-lg text-white shadow-md transition-transform group-hover:scale-105">
            <Filter size={14} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-bold text-slate-800 tracking-[0.15em] uppercase">
            Bộ lọc thông minh
          </span>
          {hasActiveFilters && (
            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
          )}
        </div>
        {isFilterVisible ? (
          <ChevronUp size={16} className="text-black" />
        ) : (
          <ChevronDown size={16} className="text-black" />
        )}
      </div>

      <div
        className={cn(
          "transition-all duration-500",
          isFilterVisible ? "max-h-250 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Search size={12} className="text-orange-500" /> Từ khóa
              </label>
              <CustomInput
                placeholder="Tìm tên sản phẩm..."
                value={value.keyword || ""}
                onChange={(e: any) =>
                  handleFilterChange({ keyword: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <TagsIcon size={12} className="text-orange-500" /> Danh mục
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
                className="h-9! text-[11px]!"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-black uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <RotateCw size={12} className="text-orange-500" /> Sắp xếp
              </label>
              <SelectComponent
                options={SORT_OPTIONS}
                value={value.sort || ""}
                onChange={(val: any) =>
                  handleFilterChange({ sort: val || undefined })
                }
                className="h-9! text-[11px]!"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5 mb-4">
              <DollarSign size={12} className="text-orange-600" /> Khoảng giá
            </label>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {PRICE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    handleFilterChange({
                      minPrice: preset.min,
                      maxPrice: preset.max,
                    })
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all border",
                    localPriceRange[0] === preset.min &&
                      localPriceRange[1] === preset.max
                      ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                      : "bg-white text-black border-slate-200 hover:border-orange-300 hover:text-orange-600"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[11px] font-bold text-slate-800">
                  {formatVND(localPriceRange[0])}
                </span>
                <div className="h-px flex-1 bg-slate-200 mx-4 opacity-50" />
                <span className="text-[11px] font-bold text-slate-800">
                  {formatVND(localPriceRange[1])}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100_000_000}
                step={500000}
                value={localPriceRange[1]}
                onChange={(e) =>
                  handleFilterChange({ maxPrice: Number(e.target.value) })
                }
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {hasActiveFilters ? (
                <>
                  {value.keyword && (
                    <CustomTag
                      closable
                      onClose={() => handleFilterChange({ keyword: "" })}
                    >
                      {value.keyword}
                    </CustomTag>
                  )}
                  {value.categoryId && (
                    <CustomTag
                      closable
                      onClose={() =>
                        handleFilterChange({ categoryId: undefined })
                      }
                    >
                      Danh mục
                    </CustomTag>
                  )}
                  {(value.minPrice ?? 0) > 0 && (
                    <CustomTag
                      closable
                      onClose={() => handleFilterChange({ minPrice: 0 })}
                    >
                      Giá từ {formatVND(value.minPrice!)}
                    </CustomTag>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-black font-medium italic">
                  Chưa áp dụng bộ lọc nào
                </span>
              )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="edit"
                onClick={clearAllFilters}
                className="h-10! px-4! rounded-xl border-slate-200 text-slate-900 text-[10px] uppercase "
                icon={<RotateCw size={14} />}
              >
                Làm mới
              </Button>

              <CustomButton
                variant="dark"
                onClick={onSearch}
                className="h-10! px-6! rounded-xl bg-orange-600 text-[10px] uppercase  flex-1 sm:flex-none shadow-sm text-white"
                icon={<Search size={14} />}
              >
                Tìm kiếm
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
