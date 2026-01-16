"use client";

import { StatCardComponents } from "@/components";
import { cn } from "@/utils/cn";
import { Activity, Briefcase, RotateCw, Users } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useEmployeeStatistics } from "../../_hooks/useEmployeeStatistics";
import { ChartWrapper } from "@/components/chart";
import { CustomTooltip } from "@/components";
export default function EmployeeStatistics() {
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedMonth] = useState(new Date().getMonth() + 1);

  const { generalStats, chartData, isLoading } = useEmployeeStatistics(
    selectedYear,
    selectedMonth
  );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <RotateCw className="animate-spin text-orange-500" size={40} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-300 italic">
          Đang khởi tạo báo cáo...
        </span>
      </div>
    );

  if (!generalStats) return null;

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
            Cấu trúc{" "}
            <span className="text-orange-500 underline decoration-4 underline-offset-8 italic">
              Tổ chức
            </span>
          </h2>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-2">
            Dữ liệu nhân sự tổng hợp toàn hệ thống
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Quy mô nhân sự"
          value={generalStats.totalEmployees}
          icon={<Users />}
          color="text-gray-900"
          size="lg"
        />
        <StatCardComponents
          label="Đang hoạt động"
          value={generalStats.status?.ACTIVE || 0}
          icon={<Activity />}
          color="text-emerald-500"
          size="lg"
        />
        <StatCardComponents
          label="Nhân sự thử việc"
          value={generalStats.workType?.PROBATION || 0}
          icon={<Briefcase />}
          color="text-orange-500"
          size="lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartWrapper
          title="Trạng thái việc làm"
          sub="Phân tách theo tình trạng nhân sự"
        >
          <div className="h-90">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData?.status}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={10}
                  stroke="none"
                >
                  {chartData?.status.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
        <ChartWrapper
          title="Loại hình hợp đồng"
          sub="Số lượng theo cơ chế làm việc"
        >
          <div className="h-90">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData?.workType} margin={{ top: 20 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
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
                  tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 500, fill: "#94a3b8" }}
                />
                <RechartsTooltip
                  cursor={{ fill: "#f8fafc" }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={45}>
                  {chartData?.workType.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
        <ChartWrapper
          className="lg:col-span-2"
          title="Quy mô phòng ban"
          sub="Top các đơn vị có quy mô nhân sự lớn nhất"
        >
          <div className="h-100 mt-4 flex justify-center">
            <ResponsiveContainer width="80%" height="100%">
              <BarChart data={chartData?.department.slice(0, 10)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                />
                <RechartsTooltip
                  content={<CustomTooltip label="Nhân viên" />}
                />
                <Bar
                  dataKey="value"
                  fill="#f97316"
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
}