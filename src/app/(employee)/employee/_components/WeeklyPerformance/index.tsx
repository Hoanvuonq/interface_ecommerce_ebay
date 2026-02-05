"use client";

import { TrendingUp, ArrowUpRight, Target, Zap, BarChart3 } from "lucide-react";
import { cn } from "@/utils/cn";
import { DATA_METRICS } from "../../_constants/dashboard";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components";

// Helper để map icon cho sinh động (nếu constants không có icon)
const getIcon = (label: string) => {
  if (label.toLowerCase().includes("doanh thu")) return <Zap size={14} />;
  if (label.toLowerCase().includes("mục tiêu")) return <Target size={14} />;
  return <BarChart3 size={14} />;
};

export const WeeklyPerformance = () => {
  return (
    <div className="bg-white rounded-4xl p-8 shadow-custom border border-gray-50 relative overflow-hidden group/card">
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl group-hover/card:bg-orange-100/50 transition-colors duration-700" />

      <div className="flex items-center justify-between mb-10 relative z-10">
        <SectionHeader
          icon={TrendingUp}
          title="Tăng trưởng so với tuần trước"
          description=" Hiệu suất tuần"
        />
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
          <ArrowUpRight size={14} className="text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-700">+12.5%</span>
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-8 relative z-10">
        {DATA_METRICS.map((metric, idx) => (
          <motion.div
            key={idx}
            className="group/row"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    "bg-gray-50 text-gray-400 group-hover/row:bg-white group-hover/row:shadow-sm",
                  )}
                >
                  {getIcon(metric.label)}
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover/row:text-gray-900 transition-colors uppercase tracking-tight">
                  {metric.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 tabular-nums">
                  {metric.val}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {metric.pct}%
                </span>
              </div>
            </div>

            <div className="h-2.5 w-full bg-gray-100/80 rounded-full overflow-hidden p-0.5 border border-gray-50 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${metric.pct}%` }}
                transition={{
                  duration: 1.5,
                  delay: 0.2 + idx * 0.1,
                  type: "spring",
                  stiffness: 50,
                  damping: 15,
                }}
                className={cn(
                  "h-full rounded-full relative bg-linear-to-r shadow-[0_1px_3px_rgba(0,0,0,0.1)]",
                  metric.color,
                )}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent w-full h-full skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
