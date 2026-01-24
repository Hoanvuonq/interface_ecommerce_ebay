"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { getAdminProductStatistics } from "../../_services/product.service";
import { ProductStatisticsResponse } from "../../_types/dto/product.dto";
import { cn } from "@/utils/cn";

export const ProductStatisticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] =
    useState<ProductStatisticsResponse | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await getAdminProductStatistics();
      setStatistics(response);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = statistics?.totalProducts || 0;
  const pending = statistics?.pendingProducts || 0;
  const approved = statistics?.approvedProducts || 0;
  const rejected = statistics?.rejectedProducts || 0;

  // Tính toán phần trăm chính xác
  const getPercent = (value: number) => (total > 0 ? (value / total) * 100 : 0);
  const approvedPercent = getPercent(approved).toFixed(1);
  const rejectedPercent = getPercent(rejected).toFixed(1);
  const pendingPercent = getPercent(pending).toFixed(1);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className=" text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
            Thống kê Sản phẩm
          </h1>
          <p className=" text-gray-500 dark: text-gray-400 font-medium">
            Phân tích dữ liệu sản phẩm trên toàn hệ thống
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold  text-gray-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
          <Calendar size={18} className="text-[#f25536]" />
          <span>7 ngày qua</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Tổng sản phẩm"
          value={total}
          icon={<Package />}
          color="blue"
        />
        <StatCard
          label="Đang chờ duyệt"
          value={pending}
          icon={<Clock />}
          color="amber"
        />
        <StatCard
          label="Đã phê duyệt"
          value={approved}
          icon={<CheckCircle />}
          color="emerald"
        />
        <StatCard
          label="Đã từ chối"
          value={rejected}
          icon={<XCircle />}
          color="rose"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
          <h3 className=" text-gray-800 dark:text-white text-lg font-bold mb-8">
            Tỉ lệ trạng thái
          </h3>
          <div className="relative flex-1 flex flex-col items-center justify-center">
            <svg className="w-56 h-56 -rotate-90" viewBox="0 0 36 36">
              {/* Circle Background */}
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="transparent"
                strokeWidth="3"
                className="stroke-slate-100 dark:stroke-slate-800"
              />

              {/* Approved (Green) */}
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="transparent"
                strokeWidth="3"
                strokeDasharray={`${approvedPercent} 100`}
                strokeDashoffset="0"
                className="stroke-emerald-500 transition-all duration-1000"
                strokeLinecap="round"
              />

              {/* Pending (Amber) */}
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="transparent"
                strokeWidth="3"
                strokeDasharray={`${pendingPercent} 100`}
                strokeDashoffset={`-${approvedPercent}`}
                className="stroke-amber-500 transition-all duration-1000"
                strokeLinecap="round"
              />

              {/* Rejected (Rose) */}
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="transparent"
                strokeWidth="3"
                strokeDasharray={`${rejectedPercent} 100`}
                strokeDashoffset={`-${parseFloat(approvedPercent) + parseFloat(pendingPercent)}`}
                className="stroke-rose-500 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold  text-gray-800">
                {total}
              </span>
              <span className="text-xs font-bold  text-gray-400 uppercase tracking-widest">
                Sản phẩm
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <LegendItem
              color="bg-emerald-500"
              label="Đã duyệt"
              percent={approvedPercent}
            />
            <LegendItem
              color="bg-amber-500"
              label="Chờ duyệt"
              percent={pendingPercent}
            />
            <LegendItem
              color="bg-rose-500"
              label="Từ chối"
              percent={rejectedPercent}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className=" text-gray-800 dark:text-white text-lg font-bold">
                Tăng trưởng sản phẩm
              </h3>
              <p className="text-sm  text-gray-400 font-medium text-emerald-500 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> +15.8% so với tuần trước
              </p>
            </div>
          </div>

          <div className="h-[300px] flex items-end justify-between gap-2 sm:gap-4 px-2">
            {[60, 45, 75, 55, 90, 65, 80].map((h, i) => (
              <div
                key={i}
                className="group relative flex-1 flex flex-col items-center gap-4"
              >
                <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden relative flex items-end h-full">
                  <div
                    className="w-full bg-linear-to-t from-[#f25536] to-[#ff8c75] rounded-2xl transition-all duration-500 group-hover:brightness-110 cursor-pointer"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-xs font-bold  text-gray-400 group-hover:text-[#f25536] transition-colors uppercase">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ label, value, icon, color }: any) => {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-2xl transition-transform group-hover:scale-110",
            colors[color],
          )}
        >
          {React.cloneElement(icon, { size: 24 })}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold  text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-bold  text-gray-800 dark:text-white tracking-tight">
          {value.toLocaleString("vi-VN")}
        </p>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, percent }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={cn("size-2.5 rounded-full", color)} />
      <span className="text-sm font-bold  text-gray-500">{label}</span>
    </div>
    <span className="text-sm font-bold  text-gray-700">{percent}%</span>
  </div>
);

const LoadingSkeleton = () => (
  <div className="w-full space-y-8 animate-pulse">
    <div className="h-12 w-1/3 bg-slate-200 rounded-xl" />
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-slate-200 rounded-[1.5rem]" />
      ))}
    </div>
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-2 h-96 bg-slate-200 rounded-[2rem]" />
      <div className="col-span-3 h-96 bg-slate-200 rounded-[2rem]" />
    </div>
  </div>
);
