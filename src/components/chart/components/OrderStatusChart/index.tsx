"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartBox } from "../ChartBox";
import { ShoppingCart } from "lucide-react";

const PIE_COLORS = ["#10b981", "#3b82f6", "#ef4444"];

export const OrderStatusChart = ({ data }: { data: any[] }) => {
  return (
    <ChartBox
      title="Phân loại đơn hàng"
      subTitle="Tỷ lệ trạng thái đơn hàng"
      icon={<ShoppingCart size={20} />}
      className="h-full"
    >
      <div className="h-75 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [value || 0, "Đơn hàng"]}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartBox>
  );
};
