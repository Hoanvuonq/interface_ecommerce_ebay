"use client";

import React from "react";
import {
  CheckCircle,
  Clock,
  RefreshCw,
  XCircle,
  FileText,
  Users,
  Phone,
  Mail,
  Calendar,
  Trophy,
  Flame,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { myTasks, stats, supportTickets } from "../_constants/dashboard";
import AnimatedBadge from "@/features/AnimatedBadge";
import { CardComponents } from "@/components/card";
import { CustomProgressBar } from "@/components/CustomProgressBar";
import { cn } from "@/utils/cn";
import { StatCard } from "./_components/StatCard";
import { ContactItem } from "./_components/ContactItem";
import { orangeStats, PriorityBadge, TaskStatusBadge, TicketStatusBadge } from "../_common/StatusBadges";

export default function EmployeeDashboardScreen() {
 
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 p-6 md:p-10 font-sans">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest border border-orange-200">
              Employee Hub
            </span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2 leading-tight">
            Xin chào,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Hoàng Vương
            </span>{" "}
            👋
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            Hôm nay bạn có{" "}
            <span className="text-orange-600 font-bold underline decoration-orange-300 underline-offset-2">
              {myTasks.filter((t) => t.status !== "completed").length} nhiệm vụ
            </span>{" "}
            cần xử lý.
          </p>
        </div>

        <button className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0">
          <FileText size={16} /> Báo cáo nhanh
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {orangeStats.map((item, i) => (
          <StatCard key={i} item={item} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tasks & Tickets */}
        <div className="lg:col-span-8 space-y-8">
          {/* My Tasks */}
          <CardComponents
            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                    <Sparkles size={18} strokeWidth={2.5} />
                  </div>
                  <span className="font-black text-slate-800 tracking-tight">
                    NHIỆM VỤ CỦA TÔI
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                    {myTasks.filter((t) => t.status !== "completed").length}
                  </span>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-orange-600 flex items-center gap-1 transition-colors">
                  Xem tất cả <ArrowUpRight size={14} />
                </button>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <tr>
                    {[
                      "Mã NV",
                      "Nội dung",
                      "Độ ưu tiên",
                      "Trạng thái",
                      "Deadline",
                      "Phòng ban",
                    ].map((h, i) => (
                      <th key={i} className="px-6 py-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {myTasks.map((task) => (
                    <tr
                      key={task.key}
                      className="hover:bg-orange-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-slate-700 text-xs">
                        {task.id}
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-semibold text-sm group-hover:text-orange-700 transition-colors">
                        {task.title}
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <TaskStatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span
                            className={
                              task.dueDate.includes("Hôm nay")
                                ? "text-rose-500"
                                : ""
                            }
                          >
                            {task.dueDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {task.department}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardComponents>

          {/* Support Tickets */}
          <CardComponents
            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Users size={18} strokeWidth={2.5} />
                  </div>
                  <span className="font-black text-slate-800 tracking-tight">
                    HỖ TRỢ KHÁCH HÀNG
                  </span>
                </div>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <tr>
                    {[
                      "Ticket ID",
                      "Khách hàng",
                      "Vấn đề",
                      "Trạng thái",
                      "Thời gian",
                      "",
                    ].map((h, i) => (
                      <th key={i} className="px-6 py-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {supportTickets.map((ticket) => (
                    <tr
                      key={ticket.key}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                        {ticket.ticketId}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700 text-sm">
                        {ticket.customer}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm max-w-[200px] truncate">
                        {ticket.issue}
                      </td>
                      <td className="px-6 py-4">
                        <TicketStatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {ticket.createdAt}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-black uppercase text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                          Xử lý
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardComponents>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <CardComponents
            className="border-none bg-slate-900 text-white shadow-2xl shadow-slate-900/20"
            title={
              <div className="flex items-center gap-3 text-white border-b border-white/10 pb-4">
                <TrendingUp className="text-orange-400" size={20} />
                <span className="tracking-tight">HIỆU SUẤT TUẦN</span>
              </div>
            }
          >
            <div className="p-6 space-y-8">
              {[
                {
                  label: "Hoàn thành NV",
                  val: "23/30",
                  pct: 76,
                  color: "bg-emerald-500",
                },
                {
                  label: "Giải quyết Ticket",
                  val: "45/50",
                  pct: 90,
                  color: "bg-blue-500",
                },
                {
                  label: "Hài lòng KH",
                  val: "96%",
                  pct: 96,
                  color: "bg-amber-500",
                },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2 text-xs font-bold tracking-wide text-slate-400">
                    <span>{metric.label}</span>
                    <span className="text-white">{metric.val}</span>
                  </div>
                  <CustomProgressBar
                    percent={metric.pct}
                    color={metric.color}
                    className="h-2 bg-slate-800" // Override background for dark mode card
                  />
                </div>
              ))}
            </div>
          </CardComponents>

          <CardComponents
            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            title={
              <div className="flex items-center gap-3">
                <Phone className="text-slate-400" size={18} />
                <span className="font-black text-slate-800 tracking-tight">
                  LIÊN HỆ NHANH
                </span>
              </div>
            }
          >
            <div className="p-6 space-y-4">
              <ContactItem
                title="Quản lý trực tiếp"
                value={{ phone: "0123-456-789", email: "manager@company.com" }}
                colorClass="bg-blue-50/50 border-blue-100 hover:bg-blue-50"
                icon={Users}
              />
              <ContactItem
                title="IT Support"
                value={{ phone: "0987-654-321", email: "it@company.com" }}
                colorClass="bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50"
                icon={RefreshCw}
              />
            </div>
          </CardComponents>
        </div>
      </div>
    </div>
  );
}
