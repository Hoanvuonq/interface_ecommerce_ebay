/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export type StatusType = "PENDING" | "VERIFIED" | "REJECTED";

export const statusTagMap: Record<StatusType, React.ReactNode> = {
  VERIFIED: (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-emerald-500/5 transition-all hover:scale-105">
      <CheckCircle2 size={12} strokeWidth={3} />
      Phê duyệt thành công
    </span>
  ),
  PENDING: (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-blue-500/5 transition-all hover:scale-105">
      <Clock size={12} strokeWidth={3} />
      Đang chờ duyệt
    </span>
  ),
  REJECTED: (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-red-500/5 transition-all hover:scale-105">
      <AlertCircle size={12} strokeWidth={3} />
      Bị từ chối
    </span>
  ),
};