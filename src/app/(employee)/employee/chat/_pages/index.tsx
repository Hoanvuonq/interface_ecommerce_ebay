"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  BarChart3,
  RotateCw,
  Settings,
  ShieldCheck,
  CheckCircle2,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import { ChatStatistics, ConversationList, ReportTable } from "../_components";
import { useReports } from "@/app/(chat)/_hooks";
import { StatCardComponents } from "@/components";
import { StatusTabs } from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { cn } from "@/utils/cn";

interface ChatManagementPageProps {
  defaultActiveTab?: string;
}

export const ChatManagementScreen: React.FC<ChatManagementPageProps> = ({
  defaultActiveTab = "reports",
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>();

  // ==================== HOOKS ====================
  const {
    reports,
    loading: reportsLoading,
    refresh: refreshReports,
  } = useReports();

  // ==================== STATISTICS ====================
  const pendingReportsCount = reports.filter(
    (report) => report.status === "PENDING",
  ).length;

  const resolvedRate = Math.round(
    (reports.filter((r) => r.status === "RESOLVED").length /
      Math.max(reports.length, 1)) *
      100,
  );

  // ==================== HANDLERS ====================
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleRefreshAll = () => {
    refreshReports();
  };

  // ==================== TAB CONFIG ====================
  const tabConfig = [
    {
      key: "reports",
      label: "Quản lý báo cáo",
      icon: AlertTriangle,
      count: pendingReportsCount,
    },
    {
      key: "conversations",
      label: "Cuộc trò chuyện",
      icon: MessageSquare,
    },
    // {
    //   key: "statistics",
    //   label: "Thống kê hệ thống",
    //   icon: BarChart3,
    // },
  ];

  return (
    <div className="min-h-screen space-y-4 animate-in fade-in duration-700">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-orange-500 text-white rounded-3xl shadow-xl shadow-orange-200">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tighter italic leading-none">
              Chat <span className="text-orange-500">&</span> CSKH
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-2">
              Management Protocol v2.4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90"
            title="Làm mới toàn bộ"
          >
            <RotateCw
              size={20}
              className={reportsLoading ? "animate-spin" : ""}
            />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-gray-200 hover:bg-orange-600 transition-all active:scale-95">
            <Settings size={16} /> Cấu hình hệ thống
          </button>
        </div>
      </div>

      {/* 2. Top Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Báo cáo chờ xử lý"
          value={pendingReportsCount}
          icon={<Clock className="text-orange-500" />}
          color="text-orange-600"
          trend={pendingReportsCount > 5 ? 12 : 0}
        />
        <StatCardComponents
          label="Tổng báo cáo nhận"
          value={reports.length}
          icon={<AlertTriangle className="text-rose-500" />}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Tỷ lệ giải quyết"
          value={resolvedRate}
          icon={<CheckCircle2 className="text-emerald-500" />}
          color="text-emerald-600"
          trend={resolvedRate > 80 ? 100 : 0}
        />
      </div>

      <div className="space-y-6">
        <StatusTabs
          tabs={tabConfig}
          current={activeTab}
          onChange={handleTabChange}
          className="px-2"
        />

        {activeTab === "reports" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ReportTable
              onViewReport={(report) => console.log("View:", report)}
            />
          </div>
        )}

        {activeTab === "conversations" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ConversationList
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              height={650}
            />
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-4">
            <ChatStatistics  />
          </div>
        )}
      </div>
    </div>
  );
};
