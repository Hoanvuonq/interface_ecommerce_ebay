"use client";

import AnimatedBadge from "@/features/AnimatedBadge";
import {
  CheckCircle,
  Clock,
  Flame,
  RefreshCw,
  Trophy,
  XCircle,
} from "lucide-react";
import React from "react";
import { stats } from "../_constants/dashboard";

interface PriorityBadgeProps {
  priority: string;
}
interface TicketStatusBadgeProps {
  status: string;
}
interface TaskStatusBadgeProps {
  status: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case "high":
      return (
        <AnimatedBadge
          type="hot"
          text="CAO"
          size="small"
          className="bg-rose-500 shadow-rose-500/30"
        />
      );
    case "medium":
      return (
        <AnimatedBadge
          type="featured"
          text="TRUNG BÌNH"
          size="small"
          className="bg-amber-500 shadow-amber-500/30"
        />
      );
    case "low":
      return (
        <AnimatedBadge
          type="sale"
          text="THẤP"
          size="small"
          className="bg-gray-400 shadow-gray-400/30"
        />
      );
    default:
      return <span className="text-gray-600 text-xs">-</span>;
  }
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const baseClass =
    "inline-flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-lg border";

  switch (status) {
    case "completed":
      return (
        <span
          className={`${baseClass} text-emerald-600 bg-emerald-50 border-emerald-100`}
        >
          <CheckCircle size={12} /> Xong
        </span>
      );
    case "in_progress":
      return (
        <span
          className={`${baseClass} text-blue-600 bg-blue-50 border-blue-100`}
        >
          <RefreshCw size={12} className="animate-spin" /> Đang làm
        </span>
      );
    case "pending":
      return (
        <span
          className={`${baseClass} text-amber-600 bg-amber-50 border-amber-100`}
        >
          <Clock size={12} /> Chờ
        </span>
      );
    default:
      return <span className="text-gray-600 text-xs">{status}</span>;
  }
};

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({
  status,
}) => {
  const baseClass =
    "inline-flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-lg border";

  switch (status) {
    case "open":
      return (
        <span
          className={`${baseClass} text-rose-600 bg-rose-50 border-rose-100`}
        >
          <Flame size={12} /> Mới
        </span>
      );
    case "in_progress":
      return (
        <span
          className={`${baseClass} text-blue-600 bg-blue-50 border-blue-100`}
        >
          <RefreshCw size={12} className="animate-spin" /> Xử lý
        </span>
      );
    case "resolved":
      return (
        <span
          className={`${baseClass} text-emerald-600 bg-emerald-50 border-emerald-100`}
        >
          <CheckCircle size={12} /> Đã xong
        </span>
      );
    case "closed":
      return (
        <span
          className={`${baseClass} text-gray-500 bg-gray-100 border-gray-200`}
        >
          <XCircle size={12} /> Đóng
        </span>
      );
    default:
      return <span className="text-gray-600 text-xs">{status}</span>;
  }
};

export const orangeStats = stats.map((s, i) => ({
  ...s,
  gradient:
    i === 0
      ? "from-orange-400 to-amber-500"
      : i === 1
      ? "from-blue-400 to-indigo-500"
      : i === 2
      ? "from-rose-400 to-pink-500"
      : "from-emerald-400 to-teal-500",
  icon:
    i === 0 ? (
      <CheckCircle size={20} strokeWidth={2.5} />
    ) : i === 1 ? (
      <RefreshCw size={20} strokeWidth={2.5} />
    ) : i === 2 ? (
      <Clock size={20} strokeWidth={2.5} />
    ) : (
      <Trophy size={20} strokeWidth={2.5} />
    ),
}));
