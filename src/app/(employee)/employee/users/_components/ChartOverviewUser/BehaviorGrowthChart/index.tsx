"use client";

import React from "react";
import { LogIn, Loader2, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const BehaviorGrowthChart = ({ data, isLoading }: any) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-custom border border-gray-50 relative overflow-hidden group/chart">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl shadow-sm group-hover/chart:rotate-12 transition-transform duration-500">
            <LogIn size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-gray-800 tracking-tighter uppercase italic text-sm">
              Tăng trưởng đăng nhập
            </h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
              <Info size={10} /> Dữ liệu biến động hàng tháng
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-100 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-orange-100 rounded-full animate-spin border-t-orange-500" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">
            Processing Behavior Data...
          </span>
        </div>
      ) : (
        <div className="h-100">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="month"
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
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  fontWeight: "bold",
                  padding: "12px 16px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f97316"
                strokeWidth={5}
                dot={{ r: 6, fill: "#f97316", strokeWidth: 4, stroke: "#fff" }}
                activeDot={{ r: 10, fill: "#f97316", strokeWidth: 4, stroke: "#fff" }}
                animationDuration={2500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
