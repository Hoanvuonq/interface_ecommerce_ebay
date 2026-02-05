"use client";

import { SmartKPICard } from "@/app/(shop)/shop/_components";
import { cn } from "@/utils/cn";
import {
  CheckCircle2,
  Clock,
  Layers,
  Search,
  ShieldAlert,
  Timer,
  User,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { UserStatusDonutChart } from "../ChartOverviewUser";
import { SectionHeader } from "@/components";

export const UserOverviewTab = ({
  overview,
  loading,
}: {
  overview: any;
  loading: boolean;
}) => {
  if (!loading && !overview)
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in">
        <div className="w-16 h-16 bg-gray-50 rounded-4xl flex items-center justify-center text-gray-300 shadow-inner">
          <Search size={32} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 uppercase tracking-tighter italic">
            Dữ liệu trống
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
            Không tìm thấy thông tin đồng bộ từ máy chủ
          </p>
        </div>
      </div>
    );

  const roles = overview?.roles || {};
  const totalUsers = overview?.totalUsers ?? 0;
  const totalEmployee = overview?.totalEmployee ?? 0;
  const status = overview?.status || {};

  const statusPieData = useMemo(
    () =>
      [
        { name: "Hoạt động", value: status.ACTIVE || 0, color: "#10b981" },
        {
          name: "Chưa kích hoạt",
          value: status.INACTIVE || 0,
          color: "#f59e0b",
        },
        { name: "Bị khóa", value: status.LOCKED || 0, color: "#f43f5e" },
      ].filter((item) => item.value > 0 || loading),
    [status, loading],
  );

  const activeRate = useMemo(
    () =>
      totalUsers > 0
        ? (((status.ACTIVE || 0) / totalUsers) * 100).toFixed(1)
        : "0",
    [status.ACTIVE, totalUsers],
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      <div className="mb-10">
        <h2 className="text-4xl font-bold tracking-tighter text-gray-900 uppercase italic leading-none">
          Thống kê người dùng
        </h2>
        <p className="text-gray-400 mt-3 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
          <Layers
            size={12}
            className={cn("text-orange-500", loading && "animate-pulse")}
          />
          Registry & Verification Protocol
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <SmartKPICard
          title="Tổng người dùng"
          value={totalUsers}
          icon={<User size={20} />}
          colorTheme="blue"
          suffix="User"
          loading={loading}
        />
        <SmartKPICard
          title="Tổng nhân viên"
          value={totalEmployee}
          icon={<Users size={20} />}
          colorTheme="green"
          suffix="Staff"
          loading={loading}
        />

        {loading ? (
          <>
            <SmartKPICard title="Loading..." value={0} loading={true} />
            <SmartKPICard title="Loading..." value={0} loading={true} />
          </>
        ) : (
          Object.entries(roles).map(([role, count], index) => (
            <SmartKPICard
              key={role}
              title={`Vai trò: ${role}`}
              value={Number(count)}
              icon={<ShieldAlert size={20} />}
              colorTheme={index % 2 === 0 ? "purple" : "orange"}
              suffix="Account"
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {loading ? (
            <div className="bg-white p-10 rounded-4xl shadow-custom border border-gray-50 h-120 flex flex-col items-center justify-center gap-6">
              <div className="w-64 h-64 rounded-full border-20 border-gray-50 border-t-orange-100 animate-spin" />
              <div className="h-4 w-48 bg-gray-50 rounded-full animate-pulse" />
            </div>
          ) : (
            <UserStatusDonutChart
              data={statusPieData}
              title="Phân bố trạng thái"
              subtitle="Real-time Status tracking"
            />
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-4xl shadow-custom border border-gray-50">
            <SectionHeader icon={Timer} title="Tóm tắt nhanh"/>
            <div className="space-y-4">
              {(loading
                ? Array(3).fill({})
                : [
                    {
                      label: "Hoạt động",
                      val: status.ACTIVE,
                      color: "text-emerald-500",
                      bg: "bg-emerald-50",
                      icon: CheckCircle2,
                    },
                    {
                      label: "Chờ kích hoạt",
                      val: status.INACTIVE,
                      color: "text-orange-500",
                      bg: "bg-orange-50",
                      icon: Clock,
                    },
                    {
                      label: "Đã khóa",
                      val: status.LOCKED,
                      color: "text-rose-500",
                      bg: "bg-rose-50",
                      icon: ShieldAlert,
                    },
                  ]
              ).map((item: any, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl"
                >
                  {loading ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 bg-gray-100 rounded-xl animate-pulse" />
                      <div className="h-3 w-24 bg-gray-100 rounded-full animate-pulse" />
                      <div className="ml-auto h-4 w-8 bg-gray-100 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn("p-2 rounded-xl", item.bg, item.color)}
                        >
                          <item.icon size={16} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-bold tabular-nums italic",
                          item.color,
                        )}
                      >
                        {item.val || 0}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "p-8 rounded-4xl text-white shadow-xl relative overflow-hidden transition-all duration-700",
              loading
                ? "bg-gray-200"
                : "bg-linear-to-br from-indigo-600 to-blue-700",
            )}
          >
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-2 w-20 bg-white/20 rounded-full" />
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse" />
                <h4 className="font-bold text-indigo-100 uppercase text-[10px] mb-6 tracking-[0.3em] italic">
                  System Insights
                </h4>
                <div className="grid grid-cols-2 gap-8 relative z-10">
                  <div>
                    <p className="text-4xl font-bold tracking-tighter italic tabular-nums">
                      {activeRate}%
                    </p>
                    <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest opacity-80">
                      Active Rate
                    </p>
                  </div>
                  <div className="border-l border-white/10 pl-6">
                    <p className="text-4xl font-bold tracking-tighter italic tabular-nums">
                      {Object.keys(roles).length}
                    </p>
                    <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest opacity-80">
                      Total Roles
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
