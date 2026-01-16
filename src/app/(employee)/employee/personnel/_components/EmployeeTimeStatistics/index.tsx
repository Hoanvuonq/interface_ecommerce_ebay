"use client";

import { StatCardComponents } from "@/components";
import { ChartBox, GrowthCard } from "@/components/chart";
import { SelectComponent } from "@/components";
import { CalendarDays, RotateCw, TrendingUp, Trophy, UserPlus } from "lucide-react";
import { useState } from "react";
import {
  Area, AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  XAxis, YAxis,
} from "recharts";
import { useEmployeeStatistics } from "../../_hooks/useEmployeeStatistics";
import { CustomTooltip } from "@/components";

export default function EmployeeTimeStatistics() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const { timeStats, chartData, filterOptions, isLoading, isRefetching } =
    useEmployeeStatistics(selectedYear, selectedMonth);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <RotateCw className="animate-spin text-orange-500" size={40} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-300 italic">
          Đang đồng bộ dòng thời gian...
        </span>
      </div>
    );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
            Tăng trưởng <span className="text-orange-500">Nhân sự</span>
          </h1>
          {isRefetching && (
            <RotateCw
              size={12}
              className="absolute -right-6 top-0 animate-spin text-orange-400"
            />
          )}
        </div>

        <div className="flex gap-3 bg-white p-2 rounded-3xl border border-gray-100 shadow-sm shadow-orange-500/5">
          <SelectComponent
            options={filterOptions.years}
            value={String(selectedYear)}
            onChange={(v) => setSelectedYear(Number(v))}
            className="w-32"
          />
          <SelectComponent
            options={filterOptions.months}
            value={String(selectedMonth)}
            onChange={(v) => setSelectedMonth(Number(v))}
            className="w-36"
          />
        </div>
      </div>

      {timeStats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardComponents
              label="Hôm nay"
              value={timeStats.todayNewEmployees}
              icon={<UserPlus />}
              color="text-blue-600"
              size="sm"
            />
            <GrowthCard
              label="Tuần này"
              value={timeStats.thisWeekNewEmployees}
              rate={timeStats.weekGrowthRate}
            />
            <GrowthCard
              label={`Tháng ${selectedMonth}`}
              value={timeStats.thisMonth}
              rate={timeStats.monthGrowthRate}
            />
            <GrowthCard
              label={`Năm ${selectedYear}`}
              value={timeStats.thisYear}
              rate={timeStats.yearGrowthRate}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartBox
              title={`Biến động Năm ${selectedYear}`}
              icon={<TrendingUp className="text-orange-500" />}
            >
              <div className="h-75 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData?.monthlyGrowth}>
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
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
                      tick={{
                        fontSize: 10,
                        fontWeight: "bold",
                        fill: "#94a3b8",
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartBox>

            <ChartBox
              title="Mật độ theo thứ"
              icon={<CalendarDays className="text-blue-500" />}
            >
              <div className="h-75 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData?.weeklyDist}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: "bold",
                        fill: "#94a3b8",
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#f8fafc" }}
                      content={<CustomTooltip />}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartBox>

            <ChartBox
              className="lg:col-span-2"
              title="Kỷ lục tuyển dụng"
              subTitle="Top các ngày ghi nhận lượng nhân sự mới đột phá"
              icon={<Trophy className="text-yellow-500" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
                {chartData?.top5Days.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-50/50 p-5 rounded-4xl border border-gray-100 relative overflow-hidden group hover:border-gray-200 transition-all"
                  >
                    <span className="absolute -right-2 -bottom-2 text-5xl opacity-[0.03] font-semibold italic group-hover:opacity-10 transition-opacity">
                      #{idx + 1}
                    </span>
                    <p className="text-[10px] font-semibold uppercase text-gray-600 mb-1">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("vi-VN")
                        : `Ngày ${item.day}`}
                    </p>
                    <p className="text-3xl font-semibold text-gray-800 italic leading-none">
                      {item.count}{" "}
                      <span className="text-[10px] not-italic text-gray-300 uppercase font-bold tracking-tighter">
                        New
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </ChartBox>
          </div>
        </>
      )}
    </div>
  );
}
