"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, TrendingUp, Clock, Hash } from "lucide-react";
import { SelectComponent } from "@/components";
import { cn } from "@/utils/cn";
import { MiniStatCard } from "../MiniStatCard";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

export const TimeStatistics = ({
  timeStats,
  loading,
  year,
  month,
  setYear,
  setMonth,
  voucherMonths,
}: any) => {
  const dailyBarData = useMemo(
    () =>
      timeStats?.dailyGrowth?.map((d: any) => ({
        name: d.date,
        value: d.count,
      })) || [],
    [timeStats],
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-4xl p-6 border border-slate-100 shadow-custom flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-64 space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 tracking-widest">
            Giai đoạn phân tích
          </label>
          <SelectComponent
            options={voucherMonths}
            value={`${year}-${month}`}
            onChange={(val) => {
              const [y, m] = String(val).split("-").map(Number);
              setYear(y);
              setMonth(m);
            }}
          />
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <MiniStatCard
            label="Hôm nay"
            value={timeStats?.todayNewVouchers}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <MiniStatCard
            label="Hôm qua"
            value={timeStats?.yesterdayNewVouchers}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <MiniStatCard
            label="Tháng này"
            value={timeStats?.thisMonth}
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <MiniStatCard
            label="Tháng trước"
            value={timeStats?.lastMonth}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-custom">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 uppercase italic tracking-tighter">
                Xu hướng tạo mới
              </h3>
            </div>
          </div>
          <div className="h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyBarData}>
                <defs>
                  <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={4}
                  fill="url(#colorOrange)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Days List */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-custom">
          <h3 className="text-lg font-bold text-slate-800 uppercase italic mb-6">
            Cao điểm tạo Voucher
          </h3>
          <div className="space-y-4">
            {timeStats?.top5Days?.map((d: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-orange-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-600 tracking-tight">
                    {d.date}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase text-orange-600">
                  {d.count} Units
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
