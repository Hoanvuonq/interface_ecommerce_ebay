'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
    Search, RotateCw, Filter, Star, ChevronDown, ChevronUp, DollarSign, Tag, X,
    // Icons dùng cho Advanced filter
    ShoppingBag, Package, Heart, Tag as TagsIcon 
} from 'lucide-react'; 
import { CategoryService } from '@/services/categories/category.service';
import type { CategoryResponse } from '@/types/categories/category.detail';
import { debounce } from '@/utils/debounce';
import {
    ProductFilterValues,
    SORT_OPTIONS,
    PRICE_PRESETS,
    BRAND_OPTIONS,
} from './type';
import { formatVND } from '@/utils/product.utils';
import { cn } from '@/utils/cn';
import { CustomButton } from '@/components'; // Giả định CustomButton đã được import


// ====================================================================
// CUSTOM COMPONENTS (Refined UI)
// ====================================================================

const CustomInput: React.FC<any> = ({ placeholder, value, onChange, className, icon: Icon, ...rest }) => (
    <div className="relative w-full">
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            // ✅ Shadow lớn hơn, border focus rõ ràng
            className={cn("w-full px-4 py-2.5 text-sm border text-gray-800 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 shadow-md", className)}
            {...rest}
        />
        {Icon && <Icon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />}
    </div>
);

const CustomSelect: React.FC<any> = ({ options, value, onChange, placeholder, isMulti, className, ...rest }) => (
    <select
        value={value || (isMulti ? [] : "")}
        onChange={(e) => {
            const val = isMulti 
                ? Array.from(e.target.selectedOptions, option => option.value) 
                : e.target.value;
            onChange(val === "" ? undefined : val);
        }}
        className={cn(
            // ✅ Border focus rõ ràng, padding nhất quán
            "w-full px-4 py-2 text-sm border text-gray-800 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 h-11 bg-white appearance-none pr-10 shadow-md",
            className
        )}
        multiple={isMulti}
        {...rest}
    >
        {isMulti ? null : <option value="">{placeholder}</option>}
        {options.map((option: any) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

const CustomTag: React.FC<any> = ({ children, closable, onClose, colorClass, className }) => (
    <span
        className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-default shadow-sm",
            colorClass,
            className
        )}
    >
        {children}
        {closable && (
            <X onClick={onClose} className="w-3 h-3 cursor-pointer hover:text-white/80 transition-colors" />
        )}
    </span>
);

const CustomRate: React.FC<any> = ({ value, onChange, max = 5, color, ...rest }) => {
    return (
        <div className="flex gap-0.5" {...rest}>
            {Array.from({ length: max }).map((_, i) => {
                const rating = i + 1;
                const filled = rating <= (value || 0);
                return (
                    <Star
                        key={i}
                        className={cn("w-5 h-5 cursor-pointer transition-colors", color)}
                        fill={filled ? color.replace('text-', 'fill-') : 'transparent'}
                        onClick={() => onChange(value === rating ? 0 : rating)}
                    />
                );
            })}
        </div>
    );
};


export default function ProductFilters({
    value,
    onChange,
    onSearch,
    sticky = true,
    autoSearch = true,
    showAdvanced = true,
}: {
    value: ProductFilterValues;
    onChange: (v: ProductFilterValues) => void;
    onSearch: () => void;
    sticky?: boolean;
    autoSearch?: boolean;
    showAdvanced?: boolean;
}) {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
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
                setLoading(true);
                const res = await CategoryService.getAllParents();
                const cats = Array.isArray(res) ? res : (res as any)?.data || [];
                setCategories(cats);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const categoryOptions = useMemo(
        () => categories.map((c) => ({ label: c.name, value: c.id })),
        [categories]
    );

    const debouncedSearch = useMemo(
        () =>
            debounce(() => {
                if (autoSearch) {
                    onSearch();
                }
            }, 500),
        [autoSearch, onSearch]
    );

    useEffect(() => {
        if (autoSearch) {
            debouncedSearch();
        }
    }, [value, autoSearch, debouncedSearch]);


    const handleFilterChange = (updates: Partial<ProductFilterValues>) => {
        onChange({ ...value, ...updates });
    };

    const handleKeywordChange = (keyword: string) => {
        handleFilterChange({ keyword });
    };

    const handleCategoryChange = (categoryId: string | undefined) => {
        handleFilterChange({ categoryId: categoryId || undefined });
    };

    const handlePriceAfterChange = (priceRange: number[]) => { 
        if (priceRange.length === 2) {
            handleFilterChange({
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
            });
        }
    };

    const handlePricePresetClick = (min: number, max: number) => {
        setLocalPriceRange([min, max]);
        handleFilterChange({
            minPrice: min,
            maxPrice: max,
        });
    };

    const handleSortChange = (sort: string | undefined) => {
        handleFilterChange({ sort: sort || undefined });
    };

    const handleBrandChange = (brands: string[] | undefined) => {
        handleFilterChange({ brands: brands });
    };

    const handleRatingChange = (rating: number) => {
        handleFilterChange({ minRating: rating === value.minRating ? undefined : rating });
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFilterChange({ inStock: e.target.checked ? true : undefined });
    };

    const handleSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFilterChange({ onSale: e.target.checked ? true : undefined });
    };

    const clearAllFilters = () => {
        onChange({
            keyword: "",
            categoryId: undefined,
            categories: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            sort: undefined,
            brands: undefined,
            minRating: undefined,
            inStock: undefined,
            onSale: undefined,
        });
        setLocalPriceRange([0, 100_000_000]);
    };

    const hasActiveFilters = useMemo(() => {
        return !!(
            value.keyword ||
            value.categoryId ||
            value.categories?.length ||
            value.brands?.length ||
            value.minRating ||
            value.inStock ||
            value.onSale ||
            (value.minPrice !== undefined && value.minPrice > 0) ||
            (value.maxPrice !== undefined && value.maxPrice < 100_000_000) ||
            value.sort
        );
    }, [value]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (value.keyword) count++;
        if (value.categoryId) count++;
        if (value.sort) count++;
        if (value.brands?.length) count++;
        if (value.minRating) count++;
        if (value.inStock) count++;
        if (value.onSale) count++;
        if (
            (value.minPrice !== undefined && value.minPrice > 0) ||
            (value.maxPrice !== undefined && value.maxPrice < 100_000_000)
        )
            count++;
        return count;
    }, [value]);

    // --- Render ---

    return (
        <div
            className={cn(
                "bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300",
            )}
        >
            <div
                className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 sm:px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-opacity-80 transition-opacity"
                onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 flex-1">
                        <Filter className="text-blue-700 w-5 h-5" /> 
                        <span className="text-base font-bold text-gray-800 tracking-tight">
                            BỘ LỌC TÌM KIẾM
                        </span>
                        {hasActiveFilters && (
                            <span className="bg-blue-600 text-white px-2 pb-1 pt-0.5 rounded-full font-bold text-xs shadow-md">
                                {activeFilterCount} Đang áp dụng
                            </span>
                        )}
                    </div>
                    <div className="flex items-center cursor-pointer gap-2">
                        {showAdvanced && (
                            <CustomButton
                                type="default"
                                icon={<Filter className="w-4 h-4" />}
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setShowMoreFilters(!showMoreFilters);
                                }}
                                className="text-blue-600 hover:text-blue-700 hidden sm:inline-flex cursor-pointer !h-9 !text-sm px-3"
                            >
                                {showMoreFilters ? "Ẩn nâng cao" : "Nâng cao"}
                            </CustomButton>
                        )}
                        <CustomButton
                            type="default"
                            icon={isFilterVisible ? <ChevronUp className="w-4 h-4 mr-0!" /> : <ChevronDown className="w-4 h-4 mr-0!" />}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-white/70"
                        />
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isFilterVisible
                        ? "max-h-[2000px] opacity-100 translate-y-0 pointer-events-auto"
                        : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                )}
                style={{ willChange: 'max-height, opacity, transform' }}
            >
                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Search className="text-blue-500 w-4 h-4" /> Từ khóa
                            </label>
                            <CustomInput
                                placeholder="Tìm tên sản phẩm..."
                                value={value.keyword || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleKeywordChange(e.target.value)}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onSearch()}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <TagsIcon className="text-green-600 w-4 h-4" /> Danh mục
                            </label>
                            <CustomSelect
                                options={[{ label: "Tất cả", value: "" }, ...categoryOptions]}
                                value={value.categoryId || ""}
                                onChange={handleCategoryChange}
                                placeholder="Chọn danh mục"
                                disabled={loading}
                                className="h-11"
                            />
                        </div>

                        {/* 3. Sắp xếp */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <DollarSign className="text-purple-600 w-4 h-4" /> Sắp xếp
                            </label>
                            <CustomSelect
                                options={SORT_OPTIONS}
                                value={value.sort || ""}
                                onChange={handleSortChange}
                                placeholder="Chọn kiểu sắp xếp"
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-200 my-6" />

                    {/* Price Filter */}
                    <div>
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                            <DollarSign className="text-orange-600 w-4 h-4" /> Khoảng giá
                        </label>

                        {/* Price Preset Buttons - Responsive layout */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {PRICE_PRESETS.map((preset, index) => {
                                const isActive =
                                    localPriceRange[0] === preset.min &&
                                    localPriceRange[1] === preset.max;
                                return (
                                    <CustomButton
                                        key={index}
                                        type={isActive ? "primary" : "default"}
                                        onClick={() => handlePricePresetClick(preset.min, preset.max)}
                                        className={cn(
                                            "rounded-full text-xs sm:text-sm !py-1.5 cursor-pointer px-4 shadow-md",
                                            isActive
                                                ? "bg-orange-500 border-orange-500 hover:bg-orange-600 text-white"
                                                : "hover:border-orange-400 hover:text-orange-600"
                                        )}
                                    >
                                        {preset.label}
                                    </CustomButton>
                                );
                            })}
                            <CustomButton
                                type={
                                    localPriceRange[0] === 0 && localPriceRange[1] === 100_000_000
                                        ? "primary"
                                        : "default"
                                }
                                onClick={() => handlePricePresetClick(0, 100_000_000)}
                                className={cn(
                                    "rounded-full text-xs sm:text-sm !py-1.5 cursor-pointer px-4 shadow-md",
                                    localPriceRange[0] === 0 && localPriceRange[1] === 100_000_000
                                        ? "bg-orange-500 border-orange-500 text-white"
                                        : "hover:border-gray-400"
                                )}
                            >
                                Tất cả
                            </CustomButton>
                        </div>

                        {/* Price Slider UI */}
                        <div className="px-4 py-4 bg-orange-50/50 rounded-xl border border-orange-200 shadow-inner">
                            <div className="flex justify-between text-sm font-medium text-orange-800 mb-3">
                                <span className='font-bold'>{formatVND(localPriceRange[0])}</span>
                                <span className='font-bold'>{formatVND(localPriceRange[1])}</span>
                            </div>
                            
                            {/* Input Range: Tùy chỉnh để trông đồng bộ */}
                            <input
                                type="range"
                                min={0}
                                max={100_000_000}
                                step={100000} // Bước nhảy 100k
                                value={localPriceRange[1]}
                                onChange={(e) => {
                                    const maxVal = Number(e.target.value);
                                    if (maxVal >= localPriceRange[0]) {
                                        setLocalPriceRange([localPriceRange[0], maxVal]);
                                    }
                                }}
                                onMouseUp={() => handlePriceAfterChange(localPriceRange)}
                                onTouchEnd={() => handlePriceAfterChange(localPriceRange)}
                                className={cn(
                                    "w-full h-2 rounded-lg cursor-pointer appearance-none transition-colors duration-300",
                                    // Customizing slider track and thumb for better UI
                                    "bg-orange-300",
                                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:shadow-lg"
                                )}
                            />
                        </div>
                    </div>

                    {showAdvanced && showMoreFilters && (
                        <>
                            <div className="w-full h-px bg-gray-200 my-6" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* Thương hiệu */}
                                <div className="space-y-2">
                                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <ShoppingBag className="text-red-600 w-4 h-4" /> Thương hiệu
                                    </label>
                                    <CustomSelect
                                        isMulti
                                        options={BRAND_OPTIONS}
                                        value={value.brands}
                                        onChange={handleBrandChange}
                                        placeholder="Chọn thương hiệu"
                                        className="h-auto min-h-11"
                                    />
                                </div>

                                <div className="space-y-2 col-span-1">
                                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" /> Đánh giá tối thiểu
                                    </label>
                                    <div className="pt-2">
                                        <CustomRate
                                            value={value.minRating}
                                            onChange={handleRatingChange}
                                            color="text-yellow-500"
                                        />
                                    </div>
                                </div>

                                {/* Tình trạng */}
                                <div className="space-y-2 col-span-1 flex flex-col justify-end">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={value.inStock}
                                                onChange={handleStockChange}
                                                // ✅ Tùy chỉnh checkbox
                                                className="w-5 h-5 text-green-600 rounded-md border-gray-300 focus:ring-green-500 checked:bg-green-600 checked:border-green-600 transition-colors"
                                            />
                                            <span className="text-green-600 font-bold">
                                                Còn hàng
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={value.onSale}
                                                onChange={handleSaleChange}
                                                // ✅ Tùy chỉnh checkbox
                                                className="w-5 h-5 text-red-600 rounded-md border-gray-300 focus:ring-red-500 checked:bg-red-600 checked:border-red-600 transition-colors"
                                            />
                                            <span className="text-red-600 font-bold">
                                                Đang khuyến mãi
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mt-6 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {hasActiveFilters && (
                                <span className="text-xs sm:text-sm font-semibold text-gray-600 mr-2 w-full sm:w-auto mb-1 sm:mb-0">
                                    Bộ lọc đang áp dụng:
                                </span>
                            )}
                            {value.keyword && (
                                <CustomTag
                                    closable
                                    onClose={() => handleFilterChange({ keyword: "" })}
                                    colorClass="bg-blue-500 text-white"
                                >
                                    Từ khóa: {value.keyword}
                                </CustomTag>
                            )}
                            {value.categoryId && (
                                <CustomTag
                                    closable
                                    onClose={() => handleFilterChange({ categoryId: undefined })}
                                    colorClass="bg-green-600 text-white"
                                >
                                    Danh mục
                                </CustomTag>
                            )}
                            {(value.minPrice !== undefined && value.minPrice > 0) ||
                            (value.maxPrice !== undefined && value.maxPrice < 100_000_000) ? (
                                <CustomTag
                                    closable
                                    onClose={() =>
                                        handleFilterChange({
                                            minPrice: undefined,
                                            maxPrice: undefined,
                                        })
                                    }
                                    colorClass="bg-orange-500 text-white"
                                >
                                    Giá
                                </CustomTag>
                            ) : null}
                            {value.sort && (
                                <CustomTag
                                    closable
                                    onClose={() => handleFilterChange({ sort: undefined })}
                                    colorClass="bg-purple-600 text-white"
                                >
                                    Sắp xếp
                                </CustomTag>
                            )}
                            {value.brands?.length ? (
                                <CustomTag
                                    closable
                                    onClose={() => handleFilterChange({ brands: undefined })}
                                    colorClass="bg-red-600 text-white"
                                >
                                    Thương hiệu
                                </CustomTag>
                            ) : null}
                            {value.minRating ? (
                                <CustomTag
                                    closable
                                    onClose={() => handleFilterChange({ minRating: undefined })}
                                    colorClass="bg-yellow-500 text-white"
                                >
                                    Đánh giá
                                </CustomTag>
                            ) : null}
                            {value.inStock ? (
                                <CustomTag
                                    closable
                                    onClose={() => handleFilterChange({ inStock: undefined })}
                                    colorClass="bg-green-600 text-white" 
                                >
                                    Còn hàng
                                </CustomTag>
                            ) : null}
                            {value.onSale ? (
                                <CustomTag
                                    closable
                                    onClose={() => handleFilterChange({ onSale: undefined })}
                                    colorClass="bg-red-600 text-white" 
                                >
                                    Khuyến mãi
                                </CustomTag>
                            ) : null}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 w-full sm:w-auto">
                            {hasActiveFilters && (
                                <CustomButton
                                    icon={<RotateCw className="w-4 h-4" />}
                                    onClick={clearAllFilters}
                                    className="rounded-xl flex-1 sm:flex-initial text-gray-600 hover:border-gray-400 !py-2.5 px-4 !text-sm shadow-md"
                                >
                                    Xóa tất cả
                                </CustomButton>
                            )}
                            {!autoSearch && (
                                <CustomButton
                                    type="primary"
                                    icon={<Search className="w-4 h-4" />}
                                    onClick={onSearch}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 border-0 flex-1 sm:flex-initial !py-2.5 px-4 !text-sm shadow-md"
                                >
                                    Tìm kiếm
                                </CustomButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}