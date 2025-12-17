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
  const safeRating = Number(averageRating ?? 0);

  return (
    <div className={cn("flex items-center flex-wrap gap-y-2 text-sm tabular-nums", className)}>
      <div className="flex items-center gap-1.5 border-r border-gray-300 pr-4">
        <span className="font-semibold text-black text-lg decoration-1 underline-offset-4">
          {safeRating.toFixed(1)}
        </span>
        <div className="flex items-center mb-0.5">
           <CustomRate value={safeRating} size={14} />
        </div>
      </div>

      <div className="flex items-center px-4 border-r border-gray-300 group cursor-pointer">
       <span className="font-semibold text-black text-lg decoration-1 underline-offset-4">
          {totalReviews ?? 0}
        </span>
        <span className="ml-1.5 text-gray-500">đánh giá</span>
      </div>

        <div className="flex items-center pl-4">
           <span className="font-semibold text-black text-lg decoration-1 underline-offset-4">
          {formatCompactNumber(soldCount) || soldCount}
        </span>
        <span className="ml-1.5 text-gray-500">Đã bán</span>
      </div>
    </div>
  );
};