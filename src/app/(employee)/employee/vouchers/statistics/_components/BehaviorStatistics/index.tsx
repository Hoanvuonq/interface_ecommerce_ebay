"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  MousePointer2,
  CalendarDays,
} from "lucide-react";
import { SelectComponent } from "@/components";
import { MiniStatCard } from "../MiniStatCard";

export const BehaviorStatistics = ({
  behaviorStats,
  loading,
  year,
  month,
  setYear,
  setMonth,
  usageMonths,
}: any) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-4xl p-6 shadow-custom flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-64 space-y-2">
          <label className="text-[10px] font-bold uppercase text-gray-400 ml-1 tracking-widest">
            Thời gian sử dụng
          </label>
          <SelectComponent
            options={usageMonths}
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
            label="Dùng hôm nay"
            value={behaviorStats?.loggedInToday}
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <MiniStatCard
            label="Tuần này"
            value={behaviorStats?.thisWeekLoggedIn}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <MiniStatCard
            label="Tháng này"
            value={behaviorStats?.loggedInThisMonth}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <MiniStatCard
            label="Cả năm"
            value={behaviorStats?.loggedInThisYear}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Growth Line Chart */}
        <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-custom">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500">
              <MousePointer2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 uppercase italic tracking-tighter">
              Tăng trưởng sử dụng (Monthly)
            </h3>
          </div>
          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={behaviorStats?.monthlyStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    fill: "#10b981",
                    strokeWidth: 3,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-custom">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
              <CalendarDays size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 uppercase italic tracking-tighter">
              Phân bố trong tuần
            </h3>
          </div>
          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviorStats?.weeklyDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sử dụng chung MiniStatCard bên trên
