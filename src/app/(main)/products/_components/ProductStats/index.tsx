"use client";

import React from "react";
import { CustomRate } from "@/components/rating";
import { cn } from "@/utils/cn";
import { IStartProps } from "./type";

export const ProductStats: React.FC<IStartProps> = ({
  averageRating = 0,
  totalReviews = 0,
  soldCount = 0,
  formatCompactNumber,
  className,
}) => {
  const safeRating = Math.min(5, Math.max(0, Number(averageRating ?? 0)));

  const displaySold = formatCompactNumber 
    ? formatCompactNumber(soldCount) 
    : String(soldCount);

  return (
    <div className={cn("flex items-center gap-x-4 gap-y-2 select-none", className)}>
      <div className="flex items-center gap-1.5 border-r border-gray-200 pr-4">
        <span className="text-[22px] font-bold text-gray-800">
          {safeRating.toFixed(1)}
        </span>
        <div className="flex items-center">
          <CustomRate 
            value={safeRating} 
            size={11}
            disabled 
            className="text-(--color-mainColor)"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-200 pr-4 group cursor-pointer transition-all">
        <span className="text-[15px] font-bold text-gray-800 tracking-tight decoration-gray-300 underline-offset-4 group-hover:text-(--color-mainColor) group-hover:underline">
          {totalReviews}
        </span>
        <span className="text-[11px] font-medium text-gray-400 ">
          Đánh giá
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[15px] font-bold text-gray-800 tracking-tight">
          {displaySold}
        </span>
        <span className="text-[11px] font-medium text-gray-400 ">
          Đã bán
        </span>
      </div>
    </div>
  );
};