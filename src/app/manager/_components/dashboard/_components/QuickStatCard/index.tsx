"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/hooks/format';
import { cn } from "@/utils/cn";
import { QuickStatCardProps } from '../../../../_types/quickStatCard';

export function QuickStatCard({
    title,
    value,
    growth,
    format = 'number',
    icon,
    loading = false,
    className
}: QuickStatCardProps) {
    const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value);
    const isPositive = growth !== undefined && growth >= 0;

    return (
        <div className={cn(
            "relative bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm",
            "transition-all duration-300 hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1 group",
            loading && "animate-pulse",
            className
        )}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-inner">
                            {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 18, strokeWidth: 2.5 })}
                        </div>
                    )}
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                        {title}
                    </span>
                </div>

                {!loading && growth !== undefined && (
                    <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        isPositive 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                    )}>
                        {isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                        {Math.abs(growth).toFixed(1)}%
                    </div>
                )}
            </div>

            <div className="relative">
                {loading ? (
                    <div className="flex items-center gap-2 py-1">
                        <Loader2 className="animate-spin text-orange-400" size={20} />
                        <div className="h-7 w-32 bg-gray-100 rounded-lg" />
                    </div>
                ) : (
                    <h3 className="text-2xl font-black text-gray-800 tracking-tighter leading-none group-hover:text-orange-600 transition-colors">
                        {formattedValue}
                    </h3>
                )}
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 80 })}
            </div>
        </div>
    );
}