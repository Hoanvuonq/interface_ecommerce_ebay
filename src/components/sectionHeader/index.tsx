"use client";

import { cn } from "@/utils/cn";

export const SectionHeader = ({
  icon: Icon,
  title,
  colorClass = "text-orange-500",
  bgClass = "bg-orange-100",
}: any) => (
  <div className="flex items-center gap-3 mb-5 px-2">
    <div className={cn("p-2 rounded-xl", bgClass, colorClass)}>
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest">
      {title}
    </h3>
    <div className="flex-1 h-px bg-linear-to-r from-gray-100 to-transparent" />
  </div>
);
