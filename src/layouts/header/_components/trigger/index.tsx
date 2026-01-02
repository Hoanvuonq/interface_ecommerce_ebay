"use client";

import { cn } from "@/utils/cn";
import { TriggerProps } from "../cartBadge/type";

export const Trigger = ({
  mounted,
  unreadCount,
  icon,
  onClick,
  className,
}: TriggerProps) => (
  <div
    onClick={onClick}
    className={cn(
      "p-2 relative rounded-full text-white hover:bg-white/10 transition-all duration-300 cursor-pointer group",
      className
    )}
  >
    <div className="group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
      {icon}
    </div>

    {mounted && unreadCount > 0 && (
      <span className="absolute top-0.5 right-0.5 flex h-4.5 w-4.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>

        <span className="relative inline-flex items-center justify-center h-4.5 w-4.5 rounded-full bg-[#ee4d2d] text-[10px] text-white font-bold ring-2 ring-orange-600 shadow-sm">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      </span>
    )}
  </div>
);
