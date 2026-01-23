"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface CustomHasDiscountProps {
  discount: number;
  className?: string;
  size?: "sm" | "lg"; 
}

export const CustomHasDiscount: React.FC<CustomHasDiscountProps> = ({
  discount,
  className,
  size = "sm",
}) => {
  const sizeConfig = {
    sm: {
      height: "h-5",
      padding: "pl-2 pr-1.5",
      fontSize: "text-[9px]",
      hole: "w-2 h-2 -left-1",
      divider: "h-3 ml-1.5",
      dot: "w-1 h-1 ml-1",
    },
    lg: {
      height: "h-7",
      padding: "pl-3 pr-2",
      fontSize: "text-[12px]",
      hole: "w-3 h-3 -left-1.5",
      divider: "h-4 ml-2",
      dot: "w-1.5 h-1.5 ml-1.5",
    },
  };

  const s = sizeConfig[size];

  return (
    <div
      className={cn(
        "relative flex items-center bg-linear-to-r from-rose-500 to-red-600 text-white shadow-md overflow-hidden rounded-sm animate-in fade-in zoom-in duration-300 shrink-0",
        s.height,
        s.padding,
        className,
      )}
    >
      <div className={cn("absolute top-1/2 -translate-y-1/2 bg-white rounded-full z-10", s.hole)} />
      
      <span className={cn("font-bold tracking-tighter uppercase leading-none pl-1", s.fontSize)}>
        -{discount}%
      </span>
      
      <div className={cn("border-l border-dashed border-white/40", s.divider)} />
      
      <div className={cn("bg-white rounded-full opacity-80", s.dot)} />
    </div>
  );
};