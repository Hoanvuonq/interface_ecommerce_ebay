"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/utils/cn";
import { SectionHeader } from "@/components";
import { ChartArea } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface UserStatusDonutChartProps {
  data: ChartData[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const UserStatusDonutChart = ({
  data,
  title = "Phân bố trạng thái",
  subtitle = "Dữ liệu thời gian thực",
  className,
}: UserStatusDonutChartProps) => {
  const totalValue = useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data],
  );

  return (
    <div
      className={cn(
        "bg-white p-8 rounded-4xl shadow-custom border border-gray-50 relative overflow-hidden group/chart",
        className,
      )}
    >
      <div className="flex justify-between items-start mb-8">
        <SectionHeader icon={ChartArea} title={title} description={subtitle} />
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] font-bold uppercase italic">Live</span>
        </div>
      </div>

      <div className="h-80 w-full relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-3xl font-bold text-gray-800 tracking-tighter italic tabular-nums leading-none">
            {totalValue.toLocaleString()}
          </span>
          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mt-1">
            Tổng cộng
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={85}
              outerRadius={120}
              paddingAngle={10}
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.color}
                  className="outline-none hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                fontWeight: "bold",
                padding: "12px 16px",
              }}
              itemStyle={{ fontSize: "12px", textTransform: "uppercase" }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
