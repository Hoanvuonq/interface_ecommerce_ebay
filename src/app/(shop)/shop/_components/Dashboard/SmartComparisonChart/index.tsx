"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  formatCurrency,
  formatCurrencyShort,
} from "@/utils/analytics/formatters";
import { CustomTooltip } from "@/components";

export interface SmartComparisonChartProps {
  todayData: number[];
  yesterdayData?: number[];
  todayLabel?: string;
  yesterdayLabel?: string;
  loading?: boolean;
  title?: string;
  subTitle?: string;
}

export function SmartComparisonChart({
  todayData,
  yesterdayData,
  todayLabel = "Hôm nay",
  yesterdayLabel = "Hôm qua",
  loading = false,
  title = "Biểu đồ doanh số",
  subTitle = "So sánh dữ liệu thời gian thực",
}: SmartComparisonChartProps) {
  const chartData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map((hour) => ({
      hour: `${hour}h`,
      today: todayData[hour] || 0,
      yesterday: yesterdayData ? yesterdayData[hour] || 0 : 0,
    }));
  }, [todayData, yesterdayData]);

  if (loading) {
    return (
      <div className="w-full h-[450px] bg-gray-50 animate-pulse rounded-[3rem]" />
    );
  }

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 relative overflow-hidden transition-all shadow-custom">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold text-gray-800 uppercase tracking-tighter italic flex items-center gap-3">
            <div className="w-2 h-8 bg-orange-500 rounded-full" />
            {title}
          </h3>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] ml-5">
            {subTitle}
          </p>
        </div>

        {/* Legend tùy chỉnh */}
        <div className="flex items-center gap-6 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {todayLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {yesterdayLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Vùng biểu đồ */}
      <div className="w-full h-87.5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorYesterday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />

            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: 600 }}
              dy={15}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: 600 }}
              tickFormatter={(value) => formatCurrencyShort(value)}
            />

            <Tooltip
              content={<CustomTooltip content="VNĐ" />}
              cursor={{
                stroke: "#f97316",
                strokeWidth: 2,
                strokeDasharray: "6 6",
              }}
            />

            <Area
              type="monotone"
              dataKey="yesterday"
              stroke="#D1D5DB"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorYesterday)"
            />

            <Area
              type="monotone"
              dataKey="today"
              stroke="#f97316"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorToday)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute right-0 bottom-0 w-32 h-1 bg-orange-500/20" />
    </div>
  );
}
