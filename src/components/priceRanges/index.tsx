'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { CustomButton } from '@/components/button'; 
import { ProductFilterValues } from '@/app/products/_components/productFilters/type';

interface IPriceRange {
    label: string;
    min?: number;
    max?: number;
}

const PRICE_RANGES: IPriceRange[] = [
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
        setFilters((prevFilters )  => ({
            ...prevFilters,
            minPrice: min,
            maxPrice: max,
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <div className="border-b border-gray-100 pb-3 mb-3  font-bold text-gray-800">
                <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <span className='text-base'>Khoảng giá phổ biến</span>
                </div>
            </div>
            
            <div className="space-y-2 w-full"> 
                {PRICE_RANGES.map((range, idx) => (
                    <CustomButton
                        key={idx}
                        type="default"
                        block
                        onClick={() => handleRangeClick(range.min, range.max)}
                        className="!justify-start pl-2 cursor-pointer text-center hover:bg-blue-50 w-full !text-sm !h-10"
                    >
                        {range.label}
                    </CustomButton>
                ))}
            </div>
        </div>
    );
};
