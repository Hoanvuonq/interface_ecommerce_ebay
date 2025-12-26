"use client";
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export const QuickLinkItem = ({ item, isLoading }: { item?: any; isLoading?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2.5 animate-pulse">
        <div className="w-14 h-14 rounded-[1.25rem] bg-gray-200" />
        <div className="w-12 h-3 bg-gray-200 rounded-full" />
      </div>
    );
  }

  const Icon = item.icon;
  const color = item.color;

  return (
    <Link
      href={item.href}
      className="flex flex-col items-center gap-2.5 group transition-transform duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative w-14 h-14 flex items-center justify-center transition-all duration-500 ease-[box-shadow,transform]",
          "rounded-2xl border-2",
          isHovered ? "-translate-y-2 scale-110" : "translate-y-0"
        )}
        style={{
          borderColor: isHovered ? `${color}44` : `${color}15`,
          background: isHovered 
            ? `linear-gradient(145deg, #ffffff 0%, ${color}25 50%, ${color}40 100%)` 
            : `linear-gradient(145deg, #ffffff 0%, ${color}10 100%)`,

          boxShadow: isHovered 
            ? `
                0 20px 25px -5px ${color}44, 
                0 10px 10px -5px ${color}33,
                inset 0 -6px 12px ${color}44,
                inset 0 4px 8px rgba(255,255,255,1),
                0 0 0 2px ${color}15
              ` 
            : `
                0 10px 15px -3px rgba(0,0,0,0.05),
                inset 0 -3px 6px ${color}22,
                inset 0 2px 4px rgba(255,255,255,0.7)
              `,
        }}
      >
        <div className={cn(
          "absolute inset-0 rounded-[1.3rem] opacity-60 pointer-events-none transition-opacity duration-300",
          "bg-linear-to-br from-white via-transparent to-transparent"
        )} />

        <Icon
          className="text-[28px] z-10 transition-all duration-300"
          style={{ 
            color: color,
            filter: isHovered 
                ? `drop-shadow(0 4px 8px ${color}88) brightness(1.1)` 
                : `drop-shadow(0 2px 4px ${color}33)` 
          }}
        />

        <div 
          className={cn(
            "absolute inset-0 rounded-full blur-2xl opacity-0 transition-opacity duration-500",
            isHovered && "opacity-30"
          )}
          style={{ backgroundColor: color }}
        />
      </div>
      
      <span 
        className="text-[12px]  sm:text-[13px] font-light transition-all duration-300 text-center leading-tight coiny-regular tracking-tight"
        style={{ 
          color: isHovered ? color : "#444",
          textShadow: isHovered ? `0 0 10px ${color}22` : "none"
        }}
      >
        {item.label}
      </span>
    </Link>
  );
};