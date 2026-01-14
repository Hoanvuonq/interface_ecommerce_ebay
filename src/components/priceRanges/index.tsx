'use client';

import React from 'react';
import { Flame, DollarSign } from 'lucide-react';
import { CustomButton } from '@/components/button'; 
import { ProductFilterValues } from '@/app/(main)/products/_components/productFilters/type';
import { cn } from '@/utils/cn';

interface IPriceRange {
    label: string;
    min?: number;
    max?: number;
}

const PRICE_RANGES: IPriceRange[] = [
    { label: "Tất cả mức giá" }, // Thêm option để reset
    { label: "Dưới 500K", max: 500000 },
    { label: "500K - 1 Triệu", min: 500000, max: 1000000 },
    { label: "1 - 5 Triệu", min: 1000000, max: 5000000 },
    { label: "5 - 10 Triệu", min: 5000000, max: 10000000 },
    { label: "Trên 10 Triệu", min: 10000000 },
];

interface PriceRangeProps {
    filters: ProductFilterValues;
    setFilters: React.Dispatch<React.SetStateAction<ProductFilterValues>>;
}

export const PriceRange: React.FC<PriceRangeProps> = ({ filters, setFilters }) => {
    
    const handleRangeClick = (min: number | undefined, max: number | undefined) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            minPrice: min,
            maxPrice: max,
        }));
    };

    return (
        <div className="bg-white rounded-3xl shadow-custom shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-300">
            <div className="p-5 border-b border-gray-50 flex items-center gap-3 bg-linear-to-r from-orange-50 to-amber-50">
                <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
                    <DollarSign className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-widest leading-none">Khoảng giá</h3>
                    <p className="text-[10px] text-orange-600 font-bold mt-1 uppercase tracking-tighter">Chọn mức ngân sách</p>
                </div>
            </div>
            
            <div className="p-4 space-y-1.5"> 
                {PRICE_RANGES.map((range, idx) => {
                    const isActive = filters.minPrice === range.min && filters.maxPrice === range.max;

                    return (
                        <button
                            key={idx}
                            onClick={() => handleRangeClick(range.min, range.max)}
                            className={cn(
                                "w-full flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm font-bold transition-all duration-200 rounded-xl group",
                                isActive 
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-200" 
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                            )}
                        >
                            <span className="truncate">{range.label}</span>
                            
                            {range.min && range.min >= 1000000 && (
                                <Flame className={cn(
                                    "w-3.5 h-3.5 transition-colors",
                                    isActive ? "text-orange-200" : "text-orange-400 opacity-0 group-hover:opacity-100"
                                )} />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                <p className="text-[10px] text-gray-600 font-medium text-center italic">
                    * Giá đã bao gồm thuế VAT
                </p>
            </div>
        </div>
    );
};