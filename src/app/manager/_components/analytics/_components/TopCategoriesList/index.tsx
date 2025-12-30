"use client";

import React from 'react';
import { LayoutGrid, ShoppingBag, TrendingUp, Loader2 } from 'lucide-react';
import type { TopCategory } from '@/api/_types/analytics.types';
import { formatCurrency, formatNumber } from '@/utils/analytics/formatters';
import { cn } from "@/utils/cn";

export interface TopCategoriesListProps {
    categories: TopCategory[];
    loading?: boolean;
}

export function TopCategoriesList({ categories, loading = false }: TopCategoriesListProps) {
    return (
        <div className={cn(
            "h-full bg-white rounded-4xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]",
            loading && "animate-pulse pointer-events-none"
        )}>
            <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
                        <LayoutGrid size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-[0.15em] leading-none mb-1">
                            Top <span className="text-blue-600">Ngành hàng</span>
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-0.5">Phân tích thị hiếu</p>
                    </div>
                </div>
                {loading && <Loader2 className="animate-spin text-orange-500" size={18} />}
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/30">
                            <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Danh mục</th>
                            <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-right">Đơn hàng</th>
                            <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-right">Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.length > 0 ? (
                            categories.map((cat, index) => (
                                <tr key={cat.categoryId} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                                                    <ShoppingBag size={18} />
                                                </div>
                                                <div className="absolute -top-1 -left-1 w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[8px] font-semibold text-gray-500 border border-white">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="font-semibold text-sm text-gray-800 tracking-tight group-hover:text-blue-700 transition-colors">
                                                {cat.categoryName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-semibold border border-blue-100 uppercase tracking-tighter shadow-sm">
                                            {formatNumber(cat.orders)} đơn
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <TrendingUp size={12} className="text-emerald-500" />
                                            <span className="text-sm font-semibold text-emerald-600 tabular-nums tracking-tight">
                                                {formatCurrency(cat.revenue)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : !loading && (
                            <tr>
                                <td colSpan={3} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    Chưa có dữ liệu danh mục
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                <button className="text-[10px] font-semibold text-blue-600 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                    Xem báo cáo ngành →
                </button>
            </div>
        </div>
    );
}