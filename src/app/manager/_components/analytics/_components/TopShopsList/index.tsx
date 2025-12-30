"use client";

import React from 'react';
import { Trophy, TrendingUp, Store, Loader2 } from 'lucide-react';
import type { TopShop } from '@/api/_types/analytics.types';
import { formatCurrency } from '@/utils/analytics/formatters';
import { cn } from "@/utils/cn";

export interface TopShopsListProps {
    shops: TopShop[];
    loading?: boolean;
}

export function TopShopsList({ shops, loading = false }: TopShopsListProps) {
    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1: return "bg-amber-50 text-amber-600 border-amber-200";
            case 2: return "bg-slate-50 text-slate-500 border-slate-200";
            case 3: return "bg-orange-50 text-orange-600 border-orange-200";
            default: return "bg-gray-50 text-gray-400 border-gray-100";
        }
    };

    return (
        <div className={cn(
            "h-full bg-white rounded-4xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]",
            loading && "animate-pulse pointer-events-none"
        )}>
            {/* Header: Web3 Style */}
            <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner">
                        <TrendingUp size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-[0.15em] leading-none mb-1">
                            Top 10 <span className="text-emerald-600">Cửa hàng</span>
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-0.5">Xếp hạng doanh thu</p>
                    </div>
                </div>
                {loading && <Loader2 className="animate-spin text-orange-500" size={18} />}
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/30">
                            <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Hạng</th>
                            <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Thông tin Shop</th>
                            <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-right">Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {shops.length > 0 ? (
                            shops.map((shop) => (
                                <tr key={shop.shopId} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-xl border-2 font-semibold text-sm transition-transform group-hover:scale-110",
                                            getRankStyles(shop.rank)
                                        )}>
                                            {shop.rank <= 3 ? (
                                                <Trophy size={16} strokeWidth={3} />
                                            ) : (
                                                `#${shop.rank}`
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-orange-500 transition-colors">
                                                <Store size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-sm text-gray-800 tracking-tight truncate group-hover:text-orange-600 transition-colors">
                                                    {shop.shopName}
                                                </div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    ID: {shop.shopId}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-semibold text-emerald-600 tabular-nums">
                                            {formatCurrency(shop.revenue)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : !loading && (
                            <tr>
                                <td colSpan={3} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    Chưa có dữ liệu xếp hạng
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}