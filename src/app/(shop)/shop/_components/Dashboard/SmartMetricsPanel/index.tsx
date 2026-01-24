"use client";

import { SmartMetricRow } from "@/app/manager/_components/analytics/_components/SmartMetricRow";
import { formatNumber } from "@/hooks/format";
import { Activity, Eye, ShoppingBag, Users, Zap } from "lucide-react";
import Skeleton from "react-loading-skeleton";

export interface SmartMetricsPanelProps {
  visitors: number;
  productViews: number;
  orders: number;
  buyers: number;
  conversionRate: number;
  loading?: boolean;
}

export function SmartMetricsPanel({
  visitors,
  productViews,
  orders,
  buyers,
  conversionRate,
  loading = false,
}: SmartMetricsPanelProps) {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm h-full">
        <Skeleton width={120} height={24} className="mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={50} borderRadius={16} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-custom transition-all h-full relative overflow-hidden">
      <div className="mb-8 flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-gray-800 uppercase tracking-tighter italic flex items-center gap-3">
          <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
          Tổng Quan Chỉ Số
        </h3>
        <p className="text-[9px] font-bold text-gray-500 uppercase  ml-4">
          Phân tích hiệu suất cửa hàng
        </p>
      </div>

      <div className="space-y-2 relative z-10">
        <SmartMetricRow
          icon={<Eye size={20} />}
          label="Lượt truy cập"
          value={formatNumber(visitors)}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />

        <SmartMetricRow
          icon={<Activity size={20} />}
          label="Xem sản phẩm"
          value={formatNumber(productViews)}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />

        <SmartMetricRow
          icon={<ShoppingBag size={20} />}
          label="Đơn hàng"
          value={formatNumber(orders)}
          colorClass="text-orange-500"
          bgClass="bg-orange-50"
        />

        <SmartMetricRow
          icon={<Users size={20} />}
          label="Người mua"
          value={formatNumber(buyers)}
          colorClass="text-teal-600"
          bgClass="bg-teal-50"
        />

        <SmartMetricRow
          icon={<Zap size={20} />}
          label="Tỷ lệ chuyển đổi"
          value={conversionRate.toFixed(2)}
          suffix="%"
          colorClass="text-rose-500"
          bgClass="bg-rose-50"
        />
      </div>

      {/* Trang trí góc đặc trưng của Dashboard */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full opacity-50" />
    </div>
  );
}
