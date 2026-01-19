"use client";
import React, { useState } from "react";
import { cn } from "@/utils/cn";

interface TooltipProps {
  children?: React.ReactNode;
  content?: string;
  position?: "top" | "bottom" | "left" | "right";
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({
  children,
  content,
  position = "top",
  active,
  payload,
  label,
}: TooltipProps) => {
  const [isHovered, setIsHovered] = useState(false);
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-gray-700 shadow-2xl z-50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
          {label || payload[0].name}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: payload[0].color || payload[0].payload.fill,
            }}
          />
          <span className="text-xs font-semibold">
            {content || payload[0].name}:{" "}
            <span className="text-orange-400">{payload[0].value}</span>
          </span>
        </div>
      </div>
    );
  }

  if (!children) return null;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && content && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-[11px] font-medium text-white bg-gray-800 rounded shadow-lg whitespace-nowrap animate-in fade-in zoom-in duration-200",
            position === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2"
            // ... thêm các position khác nếu cần
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
