"use client";

import React from "react";
import {
  BarChart3,
  Star,
  MessageCircle,
  ArrowDownRight,
  ArrowUpRight,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  History,
} from "lucide-react";
import { ReviewStatisticsResponse } from "../../_types/review.types";
import { cn } from "@/utils/cn";

interface ReviewStatisticsProps {
  statistics?: ReviewStatisticsResponse | null;
  loading?: boolean;
}

export default function ReviewStatistics({
  statistics,
  loading = false,
}: ReviewStatisticsProps) {
  if (!statistics && !loading) {
    return null;
  }

  const totalReviews = statistics?.totalReviews || 0;
  const goodReviewRate = statistics?.ratingPercentage?.[5] || 0;

  // Stat Card Component nội bộ để tái sử dụng
  const StatCard = ({
    title,
    value,
    trend,
    icon: Icon,
    colorClass,
  }: {
    title: string;
    value: string | number;
    trend: number;
    icon: any;
    colorClass: string;
  }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl", colorClass)}>
          <Icon size={20} />
        </div>
        <button className="text-slate-300 hover:text-slate-500 transition-colors">
          <HelpCircle size={16} />
        </button>
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </h3>
        <div className="flex items-center gap-1.5 mt-2">
          {trend >= 0 ? (
            <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">
              <ArrowUpRight size={12} className="mr-0.5" /> {trend}%
            </span>
          ) : (
            <span className="flex items-center text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg">
              <ArrowDownRight size={12} className="mr-0.5" /> {Math.abs(trend)}%
            </span>
          )}
          <span className="text-[10px] text-slate-400 font-medium italic">
            so với 30 ngày trước
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 mb-8 animate-in fade-in duration-500">
      {/* Top Row: General Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng lượt đánh giá"
          value={totalReviews.toLocaleString()}
          trend={0}
          icon={BarChart3}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Tỷ lệ đánh giá đơn"
          value="0%"
          trend={0}
          icon={TrendingUp}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Tỷ lệ đánh giá tốt"
          value={`${goodReviewRate.toFixed(0)}%`}
          trend={0}
          icon={Star}
          colorClass="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Bottom Row: Attention Needed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-rose-200 transition-all cursor-pointer">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform">
              <AlertCircle size={28} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Cần phản hồi tiêu cực
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Đánh giá 1 & 2 sao chưa được trả lời
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl font-black text-rose-600">0</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md italic">
                  Xem chi tiết
                </span>
              </div>
            </div>
          </div>
          <ArrowUpRight
            className="text-slate-200 group-hover:text-rose-400 transition-colors"
            size={24}
          />
        </div>

        <div className="group flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all cursor-pointer">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
              <History size={28} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Đánh giá mới
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Cập nhật trong 7 ngày gần đây
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl font-black text-blue-600">0</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md italic">
                  Xem ngay
                </span>
              </div>
            </div>
          </div>
          <ArrowUpRight
            className="text-slate-200 group-hover:text-blue-400 transition-colors"
            size={24}
          />
        </div>
      </div>
    </div>
  );
}
