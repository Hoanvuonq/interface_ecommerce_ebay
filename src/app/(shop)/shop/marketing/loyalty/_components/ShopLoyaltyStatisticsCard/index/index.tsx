
import React, { useState, useEffect } from "react";
import {
  Trophy,
  Gift,
  User,
  Clock,
  CheckCircle2,
  DollarSign,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { loyaltyService } from "../../../_services/loyalty.service";
import type { ShopLoyaltyStatisticsResponse } from "../../../_types/loyalty.types";
import { SectionLoading } from "@/components";

export const ShopLoyaltyStatisticsCard = () => {
  const [stats, setStats] = useState<ShopLoyaltyStatisticsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await loyaltyService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SectionLoading message="  Đang tải dữ liệu..." />;
  }

  if (!stats) return null;

  const statItems = [
    {
      title: "Tổng điểm đã cấp",
      value: stats.totalPointsAwarded,
      icon: <Gift className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Điểm đã sử dụng",
      value: stats.totalPointsUsed,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      title: "Điểm khả dụng",
      value: stats.totalPointsAvailable,
      icon: <DollarSign className="w-5 h-5 text-amber-600" />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      title: "Điểm hết hạn",
      value: stats.totalPointsExpired,
      icon: <Clock className="w-5 h-5 text-rose-600" />,
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
    },
    {
      title: "Khách có điểm",
      value: stats.totalCustomersWithPoints,
      icon: <User className="w-5 h-5 text-violet-600" />,
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
    },
    {
      title: "Batch hoạt động",
      value: stats.activeBatchCount,
      icon: <TrendingUp className="w-5 h-5 text-cyan-600" />,
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h2 className="font-bold text-slate-800 tracking-tight">
          Thống kê điểm thưởng
        </h2>
      </div>

      {/* Grid Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {statItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-3 group">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${item.bgColor} transition-transform group-hover:scale-110 duration-200`}
                >
                  {item.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    {item.title}
                  </span>
                  <span
                    className={`text-xl font-bold ${item.textColor} tabular-nums`}
                  >
                    {(item.value || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
