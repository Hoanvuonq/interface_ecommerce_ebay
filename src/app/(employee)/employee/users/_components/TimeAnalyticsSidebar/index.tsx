"use client";

import { SelectComponent } from "@/components"; 
import { useMemo } from "react";

export const TimeAnalyticsSidebar = ({
  year,
  month,
  setYear,
  setMonth,
  userMonths,
  timeStats,
}: any) => {
  const monthOptions = useMemo(() => {
    return userMonths.map((o: any) => ({
      label: o.label,
      value: `${o.year}-${o.month}`,
    }));
  }, [userMonths]);

  return (
    <div className="lg:col-span-3 space-y-6">
      <div className="bg-white p-8 rounded-4xl shadow-custom border border-gray-50 space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] ml-1">
            Thời gian báo cáo
          </label>
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
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
              Trong năm
            </p>
            <p className="text-2xl font-bold text-blue-600 tracking-tighter italic tabular-nums">
              {timeStats?.thisYear ?? 0}
            </p>
          </div>

          <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
              Tăng trưởng
            </p>
            <p className="text-2xl font-bold text-emerald-600 tracking-tighter italic tabular-nums">
              {timeStats?.yearGrowthRate ?? 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
