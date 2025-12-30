"use client";
import { TrendingUp } from "lucide-react";
import { cn } from "@/utils/cn";
import { DATA_METRICS } from "../../_constants/dashboard";
export const WeeklyPerformance = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-orange-50 rounded-2xl">
          <TrendingUp className="text-orange-500" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-[0.2em] leading-none mb-1">
            Analytics
          </span>
          <span className="font-semibold text-slate-800 tracking-tight text-sm">
            HIỆU SUẤT TUẦN
          </span>
        </div>
      </div>

      <div className="space-y-7">
        {DATA_METRICS.map((metric, idx) => (
          <div key={idx} className="group">
            <div className="flex justify-between items-end mb-2.5">
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                {metric.label}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {metric.val}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full bg-linear-to-r transition-all duration-1000",
                  metric.color
                )}
                style={{ width: `${metric.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
