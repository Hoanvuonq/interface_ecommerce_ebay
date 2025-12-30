"use client";

import { cn } from "@/utils/cn";
import React from "react";

export const SectionHeader = ({
  icon, 
  title,
  isLight = false,
}: {
  icon: React.ReactNode;
  title: string;
  isLight?: boolean;
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">
      {icon} 
    </div>
    <span className={cn(
      "text-xs font-semibold uppercase tracking-[0.2em]", 
      isLight ? "text-white/80" : "text-slate-800"
    )}>
      {title}
    </span>
  </div>
);