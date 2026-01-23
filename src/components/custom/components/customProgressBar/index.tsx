"use client";

import { cn } from "@/utils/cn";
import Image from "next/image";
import React from "react";

export const CustomProgressBar: React.FC<{
  percent: number;
  color?: string;
  className?: string;
  showFire?: boolean;
}> = ({
  percent,
  color = "bg-gradient-to-r from-orange-300 via-orange-500 to-red-700",
  className,
  showFire = true,
}) => {
  return (
    <div
      className={cn(
        "relative w-full h-2.5 bg-slate-100 rounded-full shadow-inner",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-1000 ease-out relative shadow-lg",
          color,
        )}
        style={{ width: `${percent}%` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

        {showFire && percent > 0 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 transition-all duration-1000 ease-out">
            <div className="relative w-7 h-8 -mt-3.5">
              <Image
                src="/gif/icons8-fire.gif"
                alt="fire"
                fill
                unoptimized
                className="object-contain drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 rounded-full ring-1 ring-black/5 pointer-events-none" />
    </div>
  );
};