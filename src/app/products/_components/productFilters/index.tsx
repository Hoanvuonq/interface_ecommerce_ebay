'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Search, RotateCw, Filter, Star, ChevronDown, ChevronUp, DollarSign, X,
    ShoppingBag, Tag as TagsIcon 
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
import { CustomButton } from '@/components';


const CustomInput: React.FC<any> = ({ placeholder, value, onChange, className, icon: Icon, ...rest }) => (
    <div className="relative w-full group">
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={cn(
                "w-full px-4 py-2.5 text-sm border text-gray-800 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-white hover:border-orange-300 shadow-sm",
                className
            )}
            {...rest}
        />
        {Icon && <Icon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 transition-colors" />}
    </div>
);

const CustomSelect: React.FC<any> = ({ options, value, onChange, placeholder, isMulti, className, ...rest }) => (
    <div className="relative group">
        <select
            value={value || (isMulti ? [] : "")}
            onChange={(e) => {
                const val = isMulti 
                    ? Array.from(e.target.selectedOptions, option => option.value) 
                    : e.target.value;
                onChange(val === "" ? undefined : val);
            }}
            className={cn(
                "w-full px-4 py-2 text-sm border text-gray-800 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all h-11 bg-white appearance-none pr-10 shadow-sm hover:border-orange-300 cursor-pointer",
                className
            )}
            multiple={isMulti}
            {...rest}
        >
            {isMulti ? null : <option value="">{placeholder}</option>}
            {options.map((option: any) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-orange-500 transition-colors" />
    </div>
);

const CustomTag: React.FC<any> = ({ children, closable, onClose, colorClass, className }) => (
    <span className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all shadow-sm border",
        colorClass || "bg-orange-50 text-orange-700 border-orange-200",
        className
    )}>
        {children}
        {closable && (
            <X onClick={onClose} className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" />
        )}
    </span>
);

export default function ProductFilters({
    value,
    onChange,
    onSearch,
    autoSearch = true,
    showAdvanced = true,
}: {
    value: ProductFilterValues;
    onChange: (v: ProductFilterValues) => void;
    onSearch: () => void;
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
                setCategories([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const categoryOptions = useMemo(() => categories.map((c) => ({ label: c.name, value: c.id })), [categories]);

    const handleFilterChange = (updates: Partial<ProductFilterValues>) => {
        onChange({ ...value, ...updates });
    };

    const clearAllFilters = () => {
        onChange({
            keyword: "", categoryId: undefined, minPrice: undefined, maxPrice: undefined,
            sort: undefined, brands: undefined, minRating: undefined, inStock: undefined, onSale: undefined,
        });
        setLocalPriceRange([0, 100_000_000]);
    };

    const hasActiveFilters = useMemo(() => {
        return !!(value.keyword || value.categoryId || value.brands?.length || value.minRating || 
               value.inStock || value.onSale || (value.minPrice ?? 0) > 0 || (value.maxPrice ?? 100_000_000) < 100_000_000);
    }, [value]);

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-500">
            {/* Header - Glassmorphism style */}
            <div 
                className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 border-b border-orange-100/50 cursor-pointer flex items-center justify-between group"
                onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-200 transition-transform group-hover:scale-110">
                        <Filter size={18} />
                    </div>
                    <span className="text-sm font-black text-gray-800 tracking-widest uppercase">Bộ lọc sản phẩm</span>
                    {hasActiveFilters && (
                        <span className="bg-orange-600 text-white px-2.5 py-0.5 rounded-full font-bold text-[10px] animate-pulse">
                            Active
                        </span>
                    )}
                </div>
                <CustomButton 
                    variant="outline" 
                    className="p-2! h-10! w-10! rounded-full border-orange-200 text-orange-600 bg-white/50"
                    icon={isFilterVisible ? <ChevronUp size={18} className='ml-1' /> : <ChevronDown size={18} className='ml-1' />}
                />
            </div>

            {/* Content Area */}
            <div className={cn(
                "transition-all duration-500 ease-in-out overflow-hidden",
                isFilterVisible ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Search size={14} className="text-orange-500" /> Từ khóa tìm kiếm
                            </label>
                            <CustomInput
                                placeholder="Nhập tên sản products..."
                                value={value.keyword || ""}
                                onChange={(e: any) => handleFilterChange({ keyword: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <TagsIcon size={14} className="text-orange-500" /> Nhóm danh mục
                            </label>
                            <CustomSelect
                                options={[{ label: "Tất cả danh mục", value: "" }, ...categoryOptions]}
                                value={value.categoryId || ""}
                                onChange={(val: any) => handleFilterChange({ categoryId: val || undefined })}
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <RotateCw size={14} className="text-orange-500" /> Thứ tự ưu tiên
                            </label>
                            <CustomSelect
                                options={SORT_OPTIONS}
                                value={value.sort || ""}
                                onChange={(val: any) => handleFilterChange({ sort: val || undefined })}
                            />
                        </div>
                    </div>

                    {/* Price Slider Section */}
                    <div className="bg-orange-50/30 rounded-2xl p-6 border border-orange-100">
                        <label className="text-[11px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <DollarSign size={14} /> Khoảng giá mong muốn
                        </label>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {PRICE_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleFilterChange({ minPrice: preset.min, maxPrice: preset.max })}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                        localPriceRange[0] === preset.min && localPriceRange[1] === preset.max
                                        ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                                    )}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Tối thiểu</p>
                                    <span className="text-sm font-black text-orange-600">{formatVND(localPriceRange[0])}</span>
                                </div>
                                <div className="h-px flex-1 bg-orange-200 mx-4 mb-2 opacity-30"></div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Tối đa</p>
                                    <span className="text-sm font-black text-orange-600">{formatVND(localPriceRange[1])}</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100_000_000}
                                step={500000}
                                value={localPriceRange[1]}
                                onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
                                className="w-full h-1.5 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                            />
                        </div>
                    </div>

                    {/* Advanced & Badges */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4">
                        <div className="flex flex-wrap gap-2">
                            {hasActiveFilters ? (
                                <>
                                    <span className="text-[10px] font-black text-gray-400 uppercase w-full mb-1">Đang lọc theo:</span>
                                    {value.keyword && <CustomTag closable onClose={() => handleFilterChange({ keyword: "" })}>"{value.keyword}"</CustomTag>}
                                    {value.categoryId && <CustomTag closable onClose={() => handleFilterChange({ categoryId: undefined })}>Danh mục</CustomTag>}
                                    {(value.minPrice ?? 0) > 0 && <CustomTag closable onClose={() => handleFilterChange({ minPrice: 0 })}>Giá từ {formatVND(value.minPrice!)}</CustomTag>}
                                </>
                            ) : (
                                <p className="text-xs text-gray-400 italic">Chưa áp dụng bộ lọc nào</p>
                            )}
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <CustomButton
                                variant="outline"
                                icon={<RotateCw size={16} />}
                                onClick={clearAllFilters}
                                className="flex-1 md:flex-initial rounded-xl! py-1 px-2 border-gray-200 text-gray-500 hover:bg-gray-50"
                            >
                                Làm mới
                            </CustomButton>
                            {showAdvanced && (
                                <CustomButton
                                    variant="dark"
                                    icon={<Filter size={16} />}
                                    onClick={() => setShowMoreFilters(!showMoreFilters)}
                                    className="flex-1 md:flex-initial shadow-lg shadow-orange-100"
                                >
                                    {showMoreFilters ? "Thu gọn" : "Lọc nâng cao"}
                                </CustomButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}