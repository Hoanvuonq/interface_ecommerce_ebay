'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, Store } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Shop, FeaturedShopsGridProps, getShopsForCategory, brandColors } from '@/app/category/_types/category';


const ShopCard: React.FC<{ shop: Shop; color: string; isMobile?: boolean }> = ({ shop, color, isMobile }) => {
    const sizeClasses = isMobile ? 'h-14 w-14 text-2xl rounded-lg' : 'h-16 w-16 text-3xl rounded-xl';
    const paddingClasses = isMobile ? 'p-3' : 'p-4';
    const nameClasses = isMobile ? 'text-[10px] font-bold' : 'text-xs font-bold';

    return (
        <div
            className={cn(
                "group relative overflow-hidden border border-gray-100 bg-white shadow-md transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl",
                "rounded-xl"
            )}
        >
            {shop.verified && (
                <div className="absolute right-1 top-1 z-10 p-0.5 rounded-full bg-white shadow-lg">
                    <CheckCircle className={cn(isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-blue-500 fill-blue-500')} />
                </div>
            )}
            <div className={paddingClasses}>
                <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                        `flex items-center justify-center font-black text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`,
                        `bg-linear-to-br ${color}`,
                        sizeClasses
                    )}>
                        {shop.name.charAt(0)}
                    </div>
                    <span className={cn(
                        "line-clamp-2 text-center text-gray-700 transition-colors group-hover:text-orange-600",
                        nameClasses
                    )}>
                        {shop.name}
                    </span>
                </div>
            </div>
        </div>
    );
};


export default function FeaturedShopsGrid({ categorySlug, maxItems = 8, className = '' }: FeaturedShopsGridProps) {
    const shops = getShopsForCategory(categorySlug, maxItems);

    if (!shops || shops.length === 0) return null;

    return (
        <div 
            className={cn(
                "mb-4 overflow-hidden rounded-2xl bg-linear-to-br from-white to-orange-50/30 p-6 shadow-lg transition-opacity duration-500", // Thêm transition CSS
                className
            )}
        >
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-red-600 shadow-lg">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            <span className="bg-linear-to-rrom-orange-600 to-red-600 bg-clip-text text-transparent">
                                SHOPEE
                            </span>{' '}
                            <span className="text-slate-700">MALL</span>
                        </h3>
                        <p className="text-xs text-gray-500">Siêu thương hiệu · Uy tín · 100% Chính hãng</p>
                    </div>
                </div>
                
                <Link
                    href={`/shops?category=${categorySlug}`}
                    className="group flex items-center gap-1 text-sm font-semibold text-orange-600 transition-all duration-300 hover:gap-2 hover:text-orange-700"
                >
                    <span>Xem tất cả</span>
                    <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
            </div>

            <div className="hidden grid-cols-4 gap-4 md:grid lg:grid-cols-8">
                {shops.map((shop, index) => (
                    <div key={shop.id}>
                        <Link href={`/shop/${shop.slug}`}>
                            <ShopCard shop={shop} color={brandColors[index % brandColors.length]} />
                        </Link>
                    </div>
                ))}
            </div>

            <div
                className="flex gap-3 overflow-x-auto pb-2 md:hidden" 
                style={{ scrollbarWidth: 'none' }}
            >
                <style jsx>{`
                    .overflow-x-auto::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {shops.map((shop, index) => (
                    <div 
                        key={shop.id}
                        className="min-w-22.5"
                    >
                        <Link href={`/shop/${shop.slug}`}>
                            <ShopCard shop={shop} color={brandColors[index % brandColors.length]} isMobile />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}