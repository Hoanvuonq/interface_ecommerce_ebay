'use client';

import React, { useEffect, useState } from 'react';
import { 
  RefreshCw, 
  Clock, 
  Calendar as CalendarIcon, 
  TrendingUp 
} from 'lucide-react';
import { formatCurrency, getTodayISO } from '@/utils/analytics/formatters';
import { cn } from "@/utils/cn";
import { formatDateTime } from '@/hooks/format';
export interface SmartHeroHeaderProps {
    revenue: number;
    selectedDate?: string;
    onDateChange?: (date: string) => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function SmartHeroHeader({
    revenue,
    selectedDate,
    onDateChange,
    onRefresh,
    isRefreshing = false,
}: SmartHeroHeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Đồng hồ thời gian thực
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onDateChange) {
            onDateChange(e.target.value || getTodayISO());
        }
    };

    const revenueValue = formatCurrency(revenue).replace(' ₫', '').replace('₫', '');

    return (
        <div className="relative overflow-hidden rounded-4xl shadow-2xl border border-orange-400/20 group">
            <div className="absolute inset-0 bg-linear-to-br from-[#EE4D2D] via-[#f53d2d] to-[#ff6433]" />

            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-700" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-orange-300 opacity-20 blur-2xl animate-pulse" />

            <div className="relative p-8 md:p-10 text-white z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/30 shadow-inner">
                            <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Doanh Số Hiện Tại</h2>
                            <p className="text-sm font-bold font-mono opacity-90">
                                {formatDateTime(currentTime)}
                            </p>
                        </div>
                    </div>
                    {/* Bộ lọc Web3 Style - Bỏ Antd DatePicker */}
                    <div className="flex items-center gap-2 bg-black/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
                        <div className="relative flex items-center group/input">
                            <CalendarIcon className="absolute left-3 w-4 h-4 text-white/60 group-focus-within/input:text-white transition-colors" />
                            <input 
                                type="date"
                                value={selectedDate || getTodayISO()}
                                onChange={handleInputChange}
                                max={getTodayISO()}
                                className={cn(
                                    "bg-transparent pl-9 pr-3 py-2 text-sm font-bold outline-none cursor-pointer text-white",
                                    "[appearance:none] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                                )}
                            />
                        </div>

                        <div className="w-px h-6 bg-white/20" />

                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-90 group/btn disabled:opacity-50"
                        >
                            <RefreshCw 
                                className={cn(
                                    "w-5 h-5 text-white transition-transform duration-500",
                                    isRefreshing ? "animate-spin" : "group-hover/btn:rotate-180"
                                )} 
                            />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/70 mb-1">
                        <TrendingUp size={16} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Real-time GMV</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl md:text-4xl font-black opacity-50 select-none">₫</span>
                        <span className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            {revenueValue}
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-8 opacity-[0.05] pointer-events-none transform rotate-12">
                <TrendingUp size={180} strokeWidth={1} />
            </div>
        </div>
    );
}