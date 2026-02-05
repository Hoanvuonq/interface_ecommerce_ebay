"use client";

import { SmartKPICard } from "@/app/(shop)/shop/_components";
import { SelectComponent } from "@/components";
import {
    BarChart3,
    CalendarDays,
    CalendarSearch,
    Globe,
    UserCheck
} from "lucide-react";
import { useMemo } from "react";

export const BehaviorAnalyticsSidebar = ({
  year,
  month,
  setYear,
  setMonth,
  loginMonths,
  stats,
  loading = false, 
}: any) => {
  const monthOptions = useMemo(() => {
    return loginMonths.map((o: any) => ({
      label: o.label,
      value: `${o.year}-${o.month}`,
    }));
  }, [loginMonths]);

  const kpiData = [
    {
      title: "Hôm nay",
      value: stats?.loggedInToday ?? 0,
      icon: <UserCheck size={20} />,
      colorTheme: "blue",
      suffix: "Lượt",
    },
    {
      title: "Tuần này",
      value: stats?.thisWeekLoggedIn ?? 0,
      icon: <CalendarDays size={20} />,
      colorTheme: "green",
      suffix: "Lượt",
    },
    {
      title: "Tháng này",
      value: stats?.thisMonthLoggedIn ?? 0,
      icon: <BarChart3 size={20} />,
      colorTheme: "orange",
      suffix: "Lượt",
    },
    {
      title: "Năm nay",
      value: stats?.thisYearLoggedIn ?? 0,
      icon: <Globe size={20} />,
      colorTheme: "purple",
      suffix: "Lượt",
    },
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-custom border border-gray-50 mb-8 relative overflow-hidden group/sidebar">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50/40 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <CalendarSearch
              size={14}
              className="text-orange-500"
              strokeWidth={2.5}
            />
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">
              Lọc thời gian
            </label>
          </div>
          <SelectComponent
            options={monthOptions}
            value={`${year}-${month}`}
            onChange={(val: string) => {
              const [y, m] = val.split("-").map(Number);
              setYear(y);
              setMonth(m);
            }}
            className="w-full"
          />
          <div className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100/50 hidden lg:block">
            <p className="text-[9px] font-bold text-gray-400 uppercase italic leading-relaxed">
              * Dữ liệu được tính toán dựa trên phiên đăng nhập thực tế.
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiData.map((kpi, i) => (
            <SmartKPICard
              key={i}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              colorTheme={kpi.colorTheme as any}
              suffix={kpi.suffix}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
