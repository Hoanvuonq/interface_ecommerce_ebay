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
  // Đảm bảo rating luôn là số và trong khoảng 0-5
  const safeRating = Math.min(5, Math.max(0, Number(averageRating ?? 0)));

  // Hàm fallback nếu không có hàm format truyền từ ngoài vào
  const displaySold = formatCompactNumber 
    ? formatCompactNumber(soldCount) 
    : String(soldCount);

  return (
    <div className={cn("flex items-center flex-wrap gap-y-2 text-sm tabular-nums", className)}>
      {/* 1. Điểm đánh giá */}
      <div className="flex items-center gap-1.5 border-r border-gray-300 pr-4">
        <span className="font-bold text-orange-600 text-lg border-b border-orange-600 leading-tight">
          {safeRating.toFixed(1)}
        </span>
        <div className="flex items-center mb-0.5">
          <CustomRate value={safeRating} size={14} disabled />
        </div>
      </div>

      {/* 2. Tổng số đánh giá */}
      <div className="flex items-center px-4 border-r border-gray-300 group cursor-pointer hover:opacity-80 transition-opacity">
        <span className="font-bold text-gray-900 text-lg border-b border-gray-900 leading-tight">
          {totalReviews}
        </span>
        <span className="ml-1.5 text-gray-500 font-medium">Đánh giá</span>
      </div>

      {/* 3. Số lượng đã bán */}
      <div className="flex items-center pl-4">
        <span className="font-bold text-gray-900 text-lg leading-tight">
          {displaySold}
        </span>
        <span className="ml-1.5 text-gray-500 font-medium">Đã bán</span>
      </div>
    </div>
  );
};