"use client";

import { EmptyProductState } from "@/app/(main)/products/_components/EmptyProductState";
import { SmartKPICard } from "@/app/(shop)/shop/_components";
import { CheckCircle2, Clock, Eye, TrendingUp } from "lucide-react";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { QuickStatRow } from "../QuickStatRow";
import { GET_OVERVIEW_CONFIG } from "./tabsConfig";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

export const OverviewCards = ({
  overview,
  loading,
}: {
  overview: any;
  loading: boolean;
}) => {
  if (!loading && !overview) {
    return (
      <EmptyProductState
        isShop={true}
        message="Không có dữ liệu thống kê voucher"
      />
    );
  }

  const statusPieData = overview?.usageByStatus
    ? Object.entries(overview.usageByStatus).map(([name, value], index) => ({
        name,
        value: value as number,
        color: COLORS[index % COLORS.length],
      }))
    : [];

  const cards = GET_OVERVIEW_CONFIG(overview);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <SmartKPICard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            colorTheme={card.colorTheme}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-4xl p-8 border border-gray-100 shadow-xl shadow-custom relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-800 uppercase italic tracking-tight">
                Phân bố trạng thái
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase">
                Tỷ lệ hiệu quả vận hành
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase">
                Realtime Sync
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={8}
                    stroke="none"
                  >
                    {statusPieData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.color}
                        className="outline-none focus:outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 font-bold uppercase text-xs italic">
                Đang nạp dữ liệu phân tích...
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-custom">
          <h3 className="text-lg font-bold text-gray-800 uppercase italic tracking-tight mb-8">
            Chỉ số nhanh
          </h3>

          <div className="space-y-6">
            <QuickStatRow
              icon={<CheckCircle2 size={18} className="text-emerald-500" />}
              label="Đang vận hành"
              value={overview?.activeVouchers}
              colorClass="bg-emerald-50 text-emerald-600"
            />
            <QuickStatRow
              icon={<Clock size={18} className="text-orange-500" />}
              label="Hết hạn/Dừng"
              value={overview?.expiredVouchers}
              colorClass="bg-orange-50 text-orange-600"
            />
            <QuickStatRow
              icon={<Eye size={18} className="text-blue-500" />}
              label="Lượt sử dụng"
              value={overview?.totalUsage}
              colorClass="bg-blue-50 text-blue-600"
            />
          </div>

          <div className="mt-10 p-5 rounded-3xl bg-gray-50 border border-gray-100 italic">
            <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">
              * Dữ liệu được tính toán dựa trên các chiến dịch Protocol đã phát
              hành thành công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

