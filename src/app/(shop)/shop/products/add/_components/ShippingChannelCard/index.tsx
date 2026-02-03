/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface MiniSettingCardProps {
  title: string;
  desc?: string;
  price?: number; 
  isActive: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  isPartner?: boolean;
}

export const MiniSettingCard = ({
  title,
  desc,
  price,
  isActive,
  onToggle,
  icon,
  isPartner,
}: MiniSettingCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border transition-all duration-300",
        isActive ? "border-orange-200 shadow-sm" : "border-gray-100 opacity-60",
      )}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <div
              className={cn(
                "p-2 rounded-xl",
                isActive
                  ? "bg-orange-50 text-orange-500"
                  : "bg-gray-50 text-gray-400",
              )}
            >
              {icon}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h4
                className={cn(
                  "text-[13px] font-bold truncate",
                  isActive ? "text-gray-800" : "text-gray-500",
                )}
              >
                {title}
              </h4>
              {isPartner && (
                <span className="px-1.5 py-0.5 rounded-sm border border-red-100 text-red-400 text-[8px] font-black uppercase bg-red-50/30">
                  Đối tác
                </span>
              )}
            </div>
            {desc && (
              <p className="text-[10px] text-gray-400 font-medium truncate italic">
                {desc}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {price !== undefined && (
            <span
              className={cn(
                "text-[13px] font-black tracking-tight",
                isActive ? "text-gray-700" : "text-gray-400",
              )}
            >
              {new Intl.NumberFormat("vi-VN").format(price)} ₫
            </span>
          )}
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "w-9 h-5 rounded-full p-0.5 transition-all flex items-center relative",
              isActive ? "bg-green-500" : "bg-gray-200",
            )}
          >
            <motion.div
              layout
              className="w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: isActive ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
