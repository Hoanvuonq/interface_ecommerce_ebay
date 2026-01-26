"use client";

import { SectionLoading, StatCardComponents } from "@/components";
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
    selectedMonth,
  );

  if (isLoading) return <SectionLoading message=" Đang khởi tạo báo cáo..." />;

  if (!generalStats) return null;

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
            Cấu trúc
            <span className="text-orange-500 underline decoration-4 underline-offset-8 italic">
              Tổ chức
            </span>
          </h2>
          <p className="text-[10px] font-semibold text-gray-600 uppercase mt-4">
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
          size="md"
        />
        <StatCardComponents
          label="Đang hoạt động"
          value={generalStats.status?.ACTIVE || 0}
          icon={<Activity />}
          color="text-emerald-500"
          size="md"
        />
        <StatCardComponents
          label="Nhân sự thử việc"
          value={generalStats.workType?.PROBATION || 0}
          icon={<Briefcase />}
          color="text-orange-500"
          size="md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <ChartWrapper title="Trạng thái" sub="Tình trạng nhân sự hiện tại">
          <div className="h-65 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData?.status}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="40%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
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
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        <ChartWrapper title="Hợp đồng" sub="Cơ chế làm việc">
          <div className="h-65 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData?.workType}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f8fafc"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }}
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
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30}>
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
          sub="Top các đơn vị đông nhân sự nhất"
        >
          <div className="h-75 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData?.department.slice(0, 10)}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
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
                  interval={0}
                  tick={{ fontSize: 9, fontWeight: 800, fill: "#64748b" }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                />
                <RechartsTooltip
                  content={<CustomTooltip label="Nhân viên" />}
                />
                <Bar
                  dataKey="value"
                  fill="#f97316"
                  radius={[8, 8, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
}
