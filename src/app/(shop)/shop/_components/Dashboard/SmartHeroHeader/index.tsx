"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RotateCw, Clock, Calendar, TrendingUp } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/hooks/format";
import { getTodayISO } from "@/utils/analytics/formatters";
import { cn } from "@/utils/cn";

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (onDateChange) {
      onDateChange(newDate || getTodayISO());
    }
  };

  const revenueValue = useMemo(() => {
    const safeRevenue = Number(revenue) || 0;
    return new Intl.NumberFormat("vi-VN").format(safeRevenue);
  }, [revenue]);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-custom transition-all duration-500">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-orange-50/50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-50/50 blur-2xl" />

      <div className="relative p-8 md:p-10 text-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-2xl border border-gray-100 shadow-sm">
              <Clock className="w-6 h-6 text-(--color-mainColor)" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold uppercase tracking-tighter italic text-gray-900">
                  Doanh Số Cửa Hàng
                </h2>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1.5">
                {formatDateTime(currentTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 self-start">
            <div className="relative flex items-center bg-white rounded-xl px-3 border border-gray-100 hover:border-gray-200 transition-colors shadow-xs">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="date"
                value={selectedDate || getTodayISO()}
                onChange={handleDateChange}
                max={getTodayISO()}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none py-2 w-32 cursor-pointer"
              />
            </div>

            <div className="w-px h-8 bg-gray-200 mx-1" />

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl hover:bg-orange-50 text-gray-500 hover:text-(--color-mainColor) active:scale-90 transition-all group"
              title="Làm mới dữ liệu"
            >
              <RotateCw
                className={cn(
                  "w-5 h-5 transition-transform duration-500",
                  isRefreshing ? "animate-spin" : "group-hover:rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-[10px] font-bold uppercase -tracking-tight text-gray-500 ml-1">
            Tổng cộng nhận được
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl md:text-8xl font-bold tracking-tighter italic leading-none text-gray-900">
              {revenueValue}
            </span>
            <span className="text-4xl md:text-5xl font-light text-gray-500 italic leading-none">
              đ
            </span>
            <div className="hidden md:flex items-center bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 mb-2 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                Live
              </span>
              <span className="flex h-2 w-2 ml-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 bottom-0 w-full h-1.5 bg-(--color-mainColor)/10" />
    </div>
  );
}
