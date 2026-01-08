"use client";

import { ButtonField } from "@/components/buttonField";
import { CardComponents } from "@/components/card";
import { getUserInfo } from "@/utils/jwt";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  orangeStats,
  PriorityBadge,
  TaskStatusBadge
} from "../_common/StatusBadges";
import { QuickContact } from "../_components/QuickContact";
import { StatCard } from "../_components/StatCard";
import { SupportTicketTable } from "../_components/SupportTicketTable";
import { WeeklyPerformance } from "../_components/WeeklyPerformance";
import { myTasks, supportTickets } from "../_constants/dashboard";

export default function EmployeeDashboardScreen() {
  const [displayName, setDisplayName] = useState("Người dùng");

  useEffect(() => {
    const info = getUserInfo();
    const nameToDisplay = info?.username ?? info?.email ?? "Người dùng";
    setDisplayName(nameToDisplay);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#f5f5f5] rounded-2xl shadow-lg shadow-gray-200  text-gray-800 p-6 font-sans">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-semibold uppercase tracking-widest border border-orange-200">
              Employee Hub
            </span>
            <span className="text-gray-300 text-xs">•</span>
            <span className="text-gray-600 text-xs font-bold uppercase tracking-wide">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <h2 className="text-4xl flex gap-2 items-center font-semibold tracking-tighter text-gray-900 mb-2 leading-tight">
            Xin chào,
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500">
              {displayName}
            </span>
            👋
          </h2>
          <p className="text-gray-500 font-medium text-sm flex gap-2 items-center">
            Hôm nay bạn có
            <span className="text-orange-600 font-bold underline decoration-orange-300 underline-offset-2">
              {myTasks.filter((t) => t.status !== "completed").length} nhiệm vụ
            </span>
            cần xử lý.
          </p>
        </div>

        <ButtonField
          htmlType="submit"
          type="login"
          className="w-50 text-base rounded-full"
        >
          <span className="flex items-center gap-2">
            <FileText size={16} /> Báo cáo nhanh
          </span>
        </ButtonField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {orangeStats.map((item, i) => (
          <StatCard key={i} item={item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <CardComponents
            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                    <Sparkles size={18} strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-gray-800 tracking-tight">
                    NHIỆM VỤ CỦA TÔI
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md">
                    {myTasks.filter((t) => t.status !== "completed").length}
                  </span>
                </div>
                <button className="text-xs font-bold text-gray-600 hover:text-orange-600 flex items-center gap-1 transition-colors">
                  Xem tất cả <ArrowUpRight size={14} />
                </button>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-semibold uppercase text-gray-600 tracking-wider">
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
                <tbody className="divide-y divide-gray-50">
                  {myTasks.map((task) => (
                    <tr
                      key={task.key}
                      className="hover:bg-orange-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-gray-700 text-xs">
                        {task.id}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-semibold text-sm group-hover:text-orange-700 transition-colors">
                        {task.title}
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <TaskStatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
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
                      <td className="px-6 py-4 text-xs font-medium text-gray-500">
                        {task.department}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardComponents>
          <SupportTicketTable tickets={supportTickets} />
        </div>
        <div className="lg:col-span-4 space-y-8">
          <WeeklyPerformance />
          <QuickContact />
        </div>
      </div>
    </div>
  );
}
