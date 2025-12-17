'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, Store } from 'lucide-react'; // ✅ Thay thế Antd Icons
import { cn } from '@/utils/cn'; // Import cn

interface Shop {
    id: number;
    name: string;
    logoUrl: string;
    slug: string;
    verified?: boolean;
}

interface FeaturedShopsGridProps {
    categorySlug: string;
    maxItems?: number;
    className?: string; // Thêm className vào props chính
}

// Mock data and brandColors giữ nguyên
const getShopsForCategory = (slug: string, max: number = 8): Shop[] => {
    const allShops: Shop[] = [
        { id: 1, name: 'COOLMATE', logoUrl: '/shops/coolmate.png', slug: 'coolmate', verified: true },
        { id: 2, name: 'BUZARO', logoUrl: '/shops/buzaro.png', slug: 'buzaro', verified: true },
        { id: 3, name: 'JBAGY', logoUrl: '/shops/jbagy.png', slug: 'jbagy', verified: true },
        { id: 4, name: 'ROWAY', logoUrl: '/shops/roway.png', slug: 'roway', verified: true },
        { id: 5, name: 'THE BAD GOD', logoUrl: '/shops/thebadgod.png', slug: 'thebadgod', verified: true },
        { id: 6, name: 'ON+OFF', logoUrl: '/shops/onoff.png', slug: 'onoff', verified: true },
        { id: 7, name: 'TORANO', logoUrl: '/shops/torano.png', slug: 'torano', verified: true },
        { id: 8, name: 'LADOS', logoUrl: '/shops/lados.png', slug: 'lados', verified: true },
    ];
    return allShops.slice(0, max);
};

const brandColors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-violet-500 to-purple-600',
];

// ✅ ShopCard Component đã được sửa để không cần thuộc tính 'children'
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
                // Verified Badge (Thay thế Antd Badge/CheckCircleFilled)
                <div className="absolute right-1 top-1 z-10 p-0.5 rounded-full bg-white shadow-lg">
                    <CheckCircle className={cn(isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-blue-500 fill-blue-500')} />
                </div>
            )}
            <div className={paddingClasses}>
                <div className="flex flex-col items-center gap-2">
                    {/* Logo with gradient */}
                    <div className={cn(
                        `flex items-center justify-center font-black text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`,
                        `bg-gradient-to-br ${color}`, // Áp dụng màu gradient
                        sizeClasses
                    )}>
                        {shop.name.charAt(0)}
                    </div>
                    {/* Shop name */}
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
        // ❌ Loại bỏ motion.div
        <div 
            className={cn(
                "mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-orange-50/30 p-6 shadow-lg transition-opacity duration-500", // Thêm transition CSS
                className
            )}
        >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Icon Header */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                        <Store className="w-5 h-5 text-white" /> {/* ✅ Thay thế ShopOutlined */}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                SHOPEE
                            </span>{' '}
                            <span className="text-slate-700">MALL</span>
                        </h3>
                        <p className="text-xs text-gray-500">Siêu thương hiệu · Uy tín · 100% Chính hãng</p>
                    </div>
                </div>
                
                {/* View All Link */}
                <Link
                    href={`/shops?category=${categorySlug}`}
                    className="group flex items-center gap-1 text-sm font-semibold text-orange-600 transition-all duration-300 hover:gap-2 hover:text-orange-700"
                >
                    <span>Xem tất cả</span>
                    <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" /> {/* ✅ Thay thế RightOutlined */}
                </Link>
            </div>

            {/* Shop Grid - Desktop */}
            <div className="hidden grid-cols-4 gap-4 md:grid lg:grid-cols-8">
                {shops.map((shop, index) => (
                    // ❌ Thay thế motion.div bằng div
                    <div key={shop.id}>
                        <Link href={`/shop/${shop.slug}`}>
                            {/* ✅ Sử dụng ShopCard đã sửa */}
                            <ShopCard shop={shop} color={brandColors[index % brandColors.length]} />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Shop Grid - Mobile (Horizontal Scroll) */}
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
                    // ❌ Thay thế motion.div bằng div
                    <div 
                        key={shop.id}
                        className="min-w-[90px]"
                    >
                        <Link href={`/shop/${shop.slug}`}>
                            {/* ✅ Sử dụng ShopCard đã sửa */}
                            <ShopCard shop={shop} color={brandColors[index % brandColors.length]} isMobile />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}