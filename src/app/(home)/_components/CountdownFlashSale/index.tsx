"use client";

import CountdownTimer from "@/features/CountdownTimer";
import { Flame } from "lucide-react";
import React, { useState } from "react";

export const CountdownFlashSale = () => {
  const [flashSaleEnd] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date;
  });

  return (
    <div className="max-w-7xl mx-auto w-full bg-[#fffaf5] border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-3 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-xl blur-lg opacity-20 animate-pulse" />
          <div className="relative bg-orange-500 p-2.5 rounded-xl shadow-md">
            <Flame className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-orange-500 text-sm">⚡</span>
            <h2 className="text-lg sm:text-xl font-black italic tracking-tight text-gray-900 leading-none uppercase">
              Flash Sale
            </h2>
          </div>
          <p className="text-[12px] sm:text-xs text-gray-400 font-medium mt-1">
            Số lượng có hạn • <span className="text-[#ff7a00]">Ưu đãi đến 50%</span>
          </p>
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-2xl border border-orange-50/50">
        <div className="flex flex-col items-center md:items-center">
          <p className="text-[9px] font-black text-[#ff7a00] uppercase tracking-widest mb-1">
            Kết thúc sau
          </p>
          <div className="w-8 h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-[#ff7a00]" />
          </div>
        </div>

        <CountdownTimer 
            endTime={flashSaleEnd} 
            size="medium" 
        />
      </div>

    </div>
  );
};