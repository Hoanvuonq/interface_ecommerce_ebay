"use client";

import { Loader2, TrendingUp } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface DailyRegistrationChartProps {
  data: any[];
  isLoading: boolean;
}

export const DailyRegistrationChart = ({
  data,
  isLoading,
}: DailyRegistrationChartProps) => {
  return (
    <div className="lg:col-span-9 bg-white p-8 rounded-4xl shadow-custom border border-gray-50 relative overflow-hidden group/chart">
      <div className="flex justify-between items-center mb-10">
        <div className="flex flex-col">
          <h4 className="font-bold text-gray-800 tracking-tighter uppercase italic text-sm">
            Đăng ký theo ngày
          </h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Biểu đồ xu hướng định kỳ
          </p>
        </div>
        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl shadow-sm group-hover/chart:scale-110 transition-transform">
          <TrendingUp size={20} strokeWidth={2.5} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-100 gap-3">
          <Loader2 className="animate-spin text-orange-500" size={32} />
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            Đang đồng bộ dữ liệu...
          </span>
        </div>
      ) : (
        <div className="h-100">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  fontWeight: "bold",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={4}
                fill="url(#colorValue)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
