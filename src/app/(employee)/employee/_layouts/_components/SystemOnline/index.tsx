"use clent";
import { cn } from "@/utils/cn";
import { EmployeeSidebarProps } from "../../../_types/sidebar";

export const SystemOnline = ({ collapsed }: EmployeeSidebarProps) => {
  return (
    <div className="p-4">
      <div
        className={cn(
          "rounded-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden",
          collapsed
            ? "justify-center p-2"
            : "bg-slate-50 p-3.5 border border-slate-100"
        )}
      >
        <div className="relative flex shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
              System Online
            </span>
            <span className="text-[9px] font-bold text-slate-400">
              v2.1.0-stable
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
