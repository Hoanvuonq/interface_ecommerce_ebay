"use client";

import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";
import React from "react";

interface SectionHeaderProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  colorClass?: string;
  bgClass?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeader = ({
  icon: Icon,
  title,
  description,
  colorClass = "text-orange-500",
  bgClass = "bg-orange-100",
  className,
  children,
}: SectionHeaderProps) => {
  if (!Icon && !title && !children) return null;

  return (
    <div className={cn("flex items-center gap-4 px-1 group/header", className)}>
      {Icon && (
        <div
          className={cn(
            "p-2.5 rounded-2xl transition-all duration-300 shadow-csutom ",
            "group-hover/header:scale-110 group-hover/header:shadow-md",
            bgClass,
            colorClass,
          )}
        >
          <Icon size={18} strokeWidth={2.5} />
        </div>
      )}

      {(title || description) && (
        <div className="flex flex-col min-w-0">
          {title && (
            <h3 className="font-extrabold text-gray-800 uppercase text-[13px] tracking-wide leading-none italic">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[11px] font-bold text-gray-600 uppercase mt-1.5 tracking-wide opacity-70">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="flex-1 h-px bg-linear-to-r from-gray-100 via-gray-50 to-transparent" />

      {children && (
        <div className="flex items-center animate-in fade-in zoom-in duration-300">
          {children}
        </div>
      )}
    </div>
  );
};
