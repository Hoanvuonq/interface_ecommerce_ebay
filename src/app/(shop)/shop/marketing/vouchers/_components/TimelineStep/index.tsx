"use client";
import { cn } from "@/utils/cn";
import { CheckCircle2, XCircle } from "lucide-react";

export const TimelineStep = ({
  active,
  title,
  time,
  desc,
  success,
  error,
  pending,
}: any) => (
  <div className="relative pl-10">
    <div
      className={cn(
        "absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm transition-colors flex items-center justify-center",
        active
          ? success
            ? "bg-emerald-500"
            : error
              ? "bg-rose-500"
              : pending
                ? "bg-amber-400"
                : "bg-blue-500"
          : "bg-gray-200",
      )}
    >
      {success && <CheckCircle2 size={10} className="text-white" />}
      {error && <XCircle size={10} className="text-white" />}
    </div>
    <div className="space-y-0.5">
      <p
        className={cn(
          "text-[11px] font-bold uppercase tracking-tight",
          active ? "text-gray-900" : "text-gray-500",
        )}
      >
        {title}
      </p>
      {time && (
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter leading-none mb-1">
          {time}
        </p>
      )}
      <p className="text-xs font-medium text-gray-500 leading-tight">{desc}</p>
    </div>
  </div>
);
