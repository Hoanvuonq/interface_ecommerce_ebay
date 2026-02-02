"use client";

import { SmartKPICard, StatusTabs } from "@/app/(shop)/shop/_components";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Bell, History, Send, Users, Zap } from "lucide-react";
import { useState } from "react";
import {
    BroadcastNotificationForm,
    NotificationHistoryTable,
} from "../_components";

type TabKey = "send" | "history";

const TABS = [
  {
    key: "send" as TabKey,
    label: "Gửi thông báo mới",
    icon: Send,
  },
  {
    key: "history" as TabKey,
    label: "Lịch sử thông báo",
    icon: History,
    count: 12,
  },
];

export const NotificationsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("send");

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="relative bg-linear-to-br from-orange-600 via-orange-500 to-amber-500 pt-12 pb-24 px-6 overflow-hidden">
        {/* Abstract Shapes - Decor cho hiện đại */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-5%] w-72 h-72 bg-orange-400/20 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Bell className="text-white w-8 h-8" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                  </span>
                </div>
              </div>

              <div>
                <nav className="flex items-center gap-2 text-orange-100 text-sm mb-2 opacity-80">
                  <span>Hệ thống</span>
                  <span>/</span>
                  <span className="text-white font-medium">Thông báo</span>
                </nav>
                <h1 className="text-4xl font-bold text-white tracking-tight leading-none">
                  Quản lý Thông báo
                </h1>
                <p className="text-orange-50/80 mt-2 max-w-lg leading-relaxed">
                  Tương tác trực tiếp với khách hàng thông qua hệ thống
                  Broadcast thông minh. Tối ưu hóa tỉ lệ chuyển đổi ngay hôm
                  nay.
                </p>
              </div>
            </div>

            {/* Quick Stats Badge - Điểm nhấn nhỏ */}
            <div className="hidden lg:flex items-center gap-3 bg-black/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
              <Zap size={16} className="text-amber-300 fill-amber-300" />
              <span className="text-white text-sm font-medium">
                Hệ thống đang hoạt động ổn định
              </span>
            </div>
          </div>

          {/* KPI Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <SmartKPICard
              title="Tổng Broadcast"
              value={1284}
              growth={12.5}
              icon={<Send size={20} />}
              colorTheme="orange"
            />
            <SmartKPICard
              title="Người nhận hôm nay"
              value={452}
              growth={-2.4}
              icon={<Users size={20} />}
              colorTheme="orange"
            />
            <SmartKPICard
              title="Tỷ lệ thành công"
              value={99.8}
              suffix="%"
              icon={<Activity size={20} />}
              colorTheme="orange"
            />
          </div>
        </div>
      </div>
      {/* Main Content Card */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 pb-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          {/* Thanh Tab tinh chỉnh lại */}
          <div className="px-4 pt-4 bg-gray-50/50 border-b border-gray-100">
            <StatusTabs
              tabs={TABS}
              current={activeTab}
              onChange={(key) => setActiveTab(key as TabKey)}
              layoutId="notif-tabs"
            />
          </div>

          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {activeTab === "send" ? (
                  <BroadcastNotificationForm />
                ) : (
                  <NotificationHistoryTable />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Support Info */}
        <p className="text-center mt-8 text-gray-400 text-sm">
          Cần hỗ trợ kỹ thuật? Liên hệ{" "}
          <span className="text-orange-500 font-medium cursor-pointer hover:underline">
            Quản trị viên hệ thống
          </span>
        </p>
      </div>
    </div>
  );
};
