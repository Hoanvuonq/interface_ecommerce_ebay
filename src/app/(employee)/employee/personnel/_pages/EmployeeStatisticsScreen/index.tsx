"use client";

import { cn } from "@/utils/cn";
import { BarChart3, CalendarDays, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import EmployeeStatistics from "../../_components/EmployeeStatistics";
import EmployeeTimeStatistics from "../../_components/EmployeeTimeStatistics";

type TabKey = "overview" | "time";

export default function EmployeeStatisticsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const tabs = [
    {
      key: "overview",
      label: "Thống kê tổng quan",
      icon: <BarChart3 size={18} />,
    },
    {
      key: "time",
      label: "Biến động thời gian",
      icon: <CalendarDays size={18} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="p-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
              Báo cáo <span className="text-orange-500">Nhân sự</span>
            </h1>
            <p className="text-gray-600 text-sm font-bold uppercase tracking-widest mt-2">
              Trung tâm dữ liệu vận hành Calatha
            </p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl transition-all duration-300",
                  activeTab === tab.key
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "text-gray-600 hover:text-gray-600 hover:bg-gray-50"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden min-h-150">
          <div className="px-10 py-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
             <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                {activeTab === "overview" ? <LayoutDashboard size={20}/> : <CalendarDays size={20}/>}
             </div>
             <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Đang hiển thị: {activeTab === "overview" ? "Cấu trúc tổ chức" : "Dòng thời gian tăng trưởng"}
             </span>
          </div>

          <div className="p-2">
             {activeTab === "overview" ? (
               <EmployeeStatistics />
             ) : (
               <EmployeeTimeStatistics />
             )}
          </div>
        </div>
      </div>
    </div>
  );
}