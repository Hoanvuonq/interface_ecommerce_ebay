import { CustomProgressBar } from "@/components/custom/components/customProgressBar";
import AnimatedBadge from "@/features/AnimatedBadge";
import { cn } from "@/utils/cn";
import React from "react";

export const StatCard = ({ item }: { item: any }) => {
  const isHighPerformance = item.percent >= 80;

  return (
    <div
      className={cn(
        "group bg-white rounded-3xl p-6 shadow-custom",
        "border border-gray-100 hover:border-gray-100 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-47.5"
      )}
    >
      <div
        className={cn(
          "absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-700",
          isHighPerformance ? "bg-emerald-200" : "bg-orange-200"
        )}
      />

      <div className="relative z-10 w-full">
        <div className="flex justify-between items-start mb-6">
          <div
            className={cn(
              "p-3.5 rounded-2xl text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 bg-linear-to-br",
              item.gradient,
              item.shadowColor
            )}
          >
            {React.cloneElement(item.icon, { size: 24, strokeWidth: 2.5 })}
          </div>

          {item.percent !== null && (
            <AnimatedBadge
              text={`${item.percent}% ${isHighPerformance ? "↑" : "→"}`}
              type={isHighPerformance ? "new" : "hot"}
              size="large"
              className={cn(
                "font-semibold tracking-tighter border-0 shadow-lg",
                isHighPerformance
                  ? "bg-emerald-500 shadow-emerald-500/20"
                  : "bg-orange-500 shadow-orange-500/20"
              )}
            />
          )}
        </div>

        <div>
          <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider mb-1.5 opacity-80 group-hover:text-gray-600 transition-colors">
            {item.title}
          </p>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-4xl font-semibold text-gray-900 tracking-tighter group-hover:scale-105 origin-left transition-transform">
              {item.value}
            </h3>
            {item.total && (
              <span className="text-gray-500 text-sm font-bold">
                / {item.total}
              </span>
            )}
          </div>

          {item.percent !== null && (
            <div className="space-y-1">
              <CustomProgressBar
                percent={item.percent}
                color={
                  isHighPerformance
                    ? "bg-emerald-500"
                    : "bg-linear-to-r from-orange-500 to-amber-400"
                }
                className="h-1.5 rounded-full bg-gray-100/50"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
