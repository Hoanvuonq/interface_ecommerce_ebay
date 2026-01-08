"use client";

import CountdownTimer from "@/features/CountdownTimer";
import { Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

export const CountdownFlashSale = () => {
  const [flashSaleEnd] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    return date;
  });

  return (
    <div className="w-full px-4 flex justify-center">
      <div
        className={cn(
          "relative w-full max-w-2xl group overflow-hidden rounded-xl",
          "bg-white border border-orange-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
          "hover:shadow-[0_8px_30px_rgb(251,146,60,0.15)] transition-all duration-300"
        )}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center justify-between p-4 sm:p-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-orange-500 rounded-xl blur opacity-20 animate-pulse" />
              <div className="relative w-10 h-10 flex items-center justify-center bg-linear-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/30">
                <Zap className="w-4 h-4 text-white fill-current" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold italic text-gray-800 uppercase leading-none">
                  Flash <span className="text-orange-600">Sale</span>
                </h2>
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-bounce">
                  HOT
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs font-medium text-gray-500">
                  Kết thúc trong
                </p>
                <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-orange-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <CountdownTimer endTime={flashSaleEnd} size="medium" />
          </div>
        </div>
      </div>
    </div>
  );
};
