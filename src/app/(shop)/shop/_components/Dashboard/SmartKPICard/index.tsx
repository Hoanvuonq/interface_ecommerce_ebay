"use client";

import { formatCurrency, formatNumber } from "@/utils/analytics/formatters";
import { cn } from "@/utils/cn";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React, { memo } from "react"; // Sử dụng memo
import Skeleton from "react-loading-skeleton";
import { SmartKPICardProps } from "./type";

// Khai báo component chính
function SmartKPICardComponent({
  title,
  value,
  growth,
  format = "number",
  icon,
  suffix,
  loading = false,
  colorTheme = "blue",
}: SmartKPICardProps) {
  const formattedValue =
    format === "currency" ? formatCurrency(value) : formatNumber(value);

  const themes = {
    blue: {
      bg: "bg-blue-50/50",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
      decoration: "bg-blue-50",
    },
    green: {
      bg: "bg-green-50/50",
      text: "text-green-600",
      iconBg: "bg-green-100",
      decoration: "bg-green-50",
    },
    purple: {
      bg: "bg-purple-50/50",
      text: "text-purple-600",
      iconBg: "bg-purple-100",
      decoration: "bg-purple-50",
    },
    orange: {
      bg: "bg-orange-50/50",
      text: "text-orange-600",
      iconBg: "bg-orange-100",
      decoration: "bg-orange-50",
    },
  };

  const theme = themes[colorTheme] || themes.blue;
  const isPositive = growth !== undefined && growth >= 0;

  if (loading) {
    return (
      <div className="bg-gray-100 p-6 rounded-[2.2rem] border border-gray-100 shadow-custom h-35 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center gap-3">
          <Skeleton circle width={32} height={32} />
          <Skeleton width={100} height={14} />
        </div>
        <div className="flex justify-between items-end">
          <Skeleton width={120} height={32} />
          <Skeleton width={50} height={20} borderRadius={12} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative p-6 rounded-[2.2rem] border border-gray-100 bg-white shadow-sm",
        "hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 group overflow-hidden"
      )}
    >
      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-24 rounded-full -mr-10 -mt-10 opacity-40 transition-transform group-hover:scale-150 duration-700",
          theme.decoration
        )}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
              theme.iconBg,
              theme.text
            )}
          >
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-600 transition-colors">
            {title}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-gray-900 tracking-tighter italic leading-none tabular-nums">
              {formattedValue}
            </span>
            {suffix && (
              <span className="text-xs font-bold text-gray-400 uppercase italic">
                {suffix}
              </span>
            )}
          </div>

          {growth !== undefined && (
            <div
              className={cn(
                "flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all duration-500 tabular-nums",
                isPositive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white"
                  : "bg-red-50 text-red-600 border-red-100 group-hover:bg-red-500 group-hover:text-white"
              )}
            >
              {isPositive ? (
                <ArrowUpRight size={12} className="mr-1 stroke-3" />
              ) : (
                <ArrowDownRight size={12} className="mr-1 stroke-3" />
              )}
              {Math.abs(growth).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "absolute left-0 bottom-0 w-0 h-1 transition-all duration-500 group-hover:w-full opacity-60",
          isPositive ? "bg-emerald-500" : "bg-red-500"
        )}
      />
    </div>
  );
}

export const SmartKPICard = memo(SmartKPICardComponent);