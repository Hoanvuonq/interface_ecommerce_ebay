"use client";

import {
  CustomTooltip,
  SectionLoading,
  SelectComponent,
  StatCardComponents,
} from "@/components";
import { ChartBox, GrowthCard } from "@/components/chart";
import {
  CalendarDays,
  TrendingUp,
  Trophy,
  UserPlus
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useEmployeeStatistics } from "../../_hooks/useEmployeeStatistics";

export default function EmployeeTimeStatistics() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );

  const { timeStats, chartData, filterOptions, isLoading, isRefetching } =
    useEmployeeStatistics(selectedYear, selectedMonth);

  if (isLoading)
    return <SectionLoading message=" Đang tải số liệu thống kê nhân sự..." />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60">
              Analytics Engine
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight uppercase italic leading-none">
            Tăng trưởng <span className="text-orange-600">Nhân sự</span>
          </h1>
        </div>

        <div className="flex gap-2 rounded-2xlw-full lg:w-auto">
          <SelectComponent
            options={filterOptions.years}
            value={String(selectedYear)}
            onChange={(v) => setSelectedYear(Number(v))}
            className="w-full lg:w-40 h-10 border-0 shadow-none bg-transparent"
          />
          <SelectComponent
            options={filterOptions.months}
            value={String(selectedMonth)}
            onChange={(v) => setSelectedMonth(Number(v))}
            className="w-full lg:w-40 h-10 border-0 shadow-none bg-transparent"
          />
        </div>
      </div>

      {timeStats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCardComponents
              label="Hôm nay"
              value={timeStats.todayNewEmployees}
              icon={<UserPlus />}
              color="text-orange-600"
              size="sm"
              trend={timeStats.todayGrowthRate || 0}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartBox
              title={`Biến động ${selectedYear}`}
              subTitle="Lưu lượng nhân sự theo tháng"
              icon={<TrendingUp className="text-orange-500" />}
            >
              <div className="h-62.5 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData?.monthlyGrowth}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
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
                          stopOpacity={0.2}
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
                      tick={{ fontSize: 9, fontWeight: 800, fill: "#94a3b8" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#cbd5e1" }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartBox>

            <ChartBox
              title="Mật độ hàng tuần"
              subTitle="Phân bổ tuyển dụng theo thứ"
              icon={<CalendarDays className="text-blue-500" />}
            >
              <div className="h-62.5 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData?.weeklyDist}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fontWeight: 800, fill: "#94a3b8" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#cbd5e1" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#fff7ed" }}
                      content={<CustomTooltip />}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartBox>

            <ChartBox
              className="lg:col-span-2"
              title="Kỷ lục tuyển dụng"
              subTitle="Top 5 ngày có lượng nhân sự mới cao nhất"
              icon={<Trophy className="text-amber-500" />}
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                {chartData?.top5Days.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="group bg-white p-4 rounded-3xl border border-gray-100 relative overflow-hidden transition-all hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5"
                  >
                    <div className="absolute -right-1 -top-1 w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 group-hover:bg-orange-500 transition-colors duration-500">
                      <span className="text-[10px] font-bold text-orange-600 group-hover:text-white">
                        #{idx + 1}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold uppercase text-gray-400 mb-1 tracking-tighter">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("vi-VN")
                        : `Ngày ${item.day}`}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-bold text-gray-800 italic leading-none group-hover:text-orange-600 transition-colors">
                        {item.count}
                      </p>
                      <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">
                        Staffs
                      </span>
                    </div>
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
