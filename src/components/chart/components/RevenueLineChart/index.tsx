"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartWrapper } from "../ChartWrapper";

export const RevenueLineChart = ({ data }: { data: any[] }) => {
  return (
    <ChartWrapper 
      title="Biến động doanh thu" 
      sub="Dữ liệu cập nhật theo tháng năm 2025"
    >
      <div className="h-87.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number | string | undefined) => [
                `₫${(Number(value) || 0).toLocaleString()}`, 
                "Doanh thu"
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f97316" 
              strokeWidth={4}
              dot={{ r: 6, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
};