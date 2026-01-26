"use client";

import { cn } from "@/utils/cn";
import { BarChart3, CalendarDays, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import EmployeeStatistics from "../../_components/EmployeeStatistics";
import EmployeeTimeStatistics from "../../_components/EmployeeTimeStatistics";
import {
  StatusTabs,
  StatusTabItem,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";

// Định nghĩa TabKey để đảm bảo type-safe
type TabKey = "overview" | "time";

export default function EmployeeStatisticsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Định nghĩa mảng tabs tuân thủ interface StatusTabItem
  const StatisticsTabs: StatusTabItem<TabKey>[] = [
    {
      key: "overview",
      label: "Thống kê tổng quan",
      icon: BarChart3,
    },
    {
      key: "time",
      label: "Biến động thời gian",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tighter uppercase italic leading-none">
            Báo cáo <span className="text-orange-500">Nhân sự</span>
          </h1>
          <p className="text-gray-600 text-md font-semibold  mt-2">
            Trung tâm dữ liệu vận hành Cano X
          </p>
        </div>

        <div className="w-full md:w-auto overflow-hidden">
          <StatusTabs
            tabs={StatisticsTabs}
            current={activeTab}
            onChange={(key) => setActiveTab(key)}
          />
        </div>
      </div>

      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-custom">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl text-orange-600 shadow-sm">
              {activeTab === "overview" ? (
                <LayoutDashboard size={22} />
              ) : (
                <CalendarDays size={22} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold uppercase text-orange-500 tracking-wider">
                Chế độ hiển thị
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {activeTab === "overview"
                  ? "Cấu trúc & Phân bổ tổ chức"
                  : "Dòng thời gian tăng trưởng nhân sự"}
              </span>
            </div>
          </div>

          <div className="p-6">
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
