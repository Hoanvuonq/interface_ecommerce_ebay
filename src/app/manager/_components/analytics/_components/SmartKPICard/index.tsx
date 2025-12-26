"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/analytics/formatters';
import { cn } from "@/utils/cn";

export interface SmartKPICardProps {
    title: string;
    value: number;
    growth?: number;
    format?: 'currency' | 'number';
    icon?: React.ReactNode;
    suffix?: string;
    loading?: boolean;
    colorTheme?: 'blue' | 'green' | 'purple' | 'orange';
    className?: string;
}

export function SmartKPICard({
    title,
    value,
    growth,
    format = 'number',
    icon,
    suffix,
    loading = false,
    colorTheme = 'blue',
    className
}: SmartKPICardProps) {
    const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value);

    // Cấu hình theme chuẩn Web3 Light
    const themes = {
        blue: { 
            bg: 'bg-blue-50/50', 
            text: 'text-blue-600', 
            iconBg: 'bg-blue-100/80', 
            glow: 'shadow-blue-100/50',
            indicator: 'bg-blue-500' 
        },
        green: { 
            bg: 'bg-emerald-50/50', 
            text: 'text-emerald-600', 
            iconBg: 'bg-emerald-100/80', 
            glow: 'shadow-emerald-100/50',
            indicator: 'bg-emerald-500' 
        },
        purple: { 
            bg: 'bg-purple-50/50', 
            text: 'text-purple-600', 
            iconBg: 'bg-purple-100/80', 
            glow: 'shadow-purple-100/50',
            indicator: 'bg-purple-500' 
        },
        orange: { 
            bg: 'bg-orange-50/50', 
            text: 'text-orange-600', 
            iconBg: 'bg-orange-100/80', 
            glow: 'shadow-orange-100/50',
            indicator: 'bg-orange-500' 
        },
    };

    const theme = themes[colorTheme];
    const isPositive = growth !== undefined && growth >= 0;

    return (
        <div className={cn(
            "relative bg-white rounded-4xl border border-gray-100 p-6 transition-all duration-500 group overflow-hidden",
            "hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1.5",
            loading && "animate-pulse pointer-events-none",
            className
        )}>
            <div className={cn("absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all duration-500 group-hover:h-1/2", theme.indicator)} />

            <div className={cn(
                "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 transition-all duration-700 blur-3xl group-hover:opacity-100",
                theme.bg
            )} />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                        theme.iconBg, theme.text
                    )}>
                        {icon && React.isValidElement(icon)
                            ? React.cloneElement(icon as React.ReactElement<any>, { size: 20, strokeWidth: 2.5 })
                            : icon}
                    </div>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        {title}
                    </span>
                </div>

                <div className="flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                        {loading ? (
                            <div className="h-8 w-24 bg-gray-100 rounded-lg" />
                        ) : (
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-gray-900 tracking-tighter">
                                    {formattedValue}
                                </span>
                                {suffix && (
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        {suffix}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {!loading && growth !== undefined && (
                        <div className={cn(
                            "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border transition-colors",
                            isPositive 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm" 
                                : "bg-rose-50 text-rose-600 border-rose-100 shadow-sm"
                        )}>
                            {isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                            {Math.abs(growth).toFixed(1)}%
                        </div>
                    )}
                </div>
            </div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-20">
                    <Loader2 className="animate-spin text-orange-500" size={24} />
                </div>
            )}
        </div>
    );
}