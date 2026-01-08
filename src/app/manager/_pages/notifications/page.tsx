"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    History,
    LayoutGrid,
    Send,
    Users,
    Zap
} from "lucide-react";
import { useState } from "react";
import BroadcastNotificationForm from "../../_components/notifications/_components/BroadcastNoti";
import NotificationHistoryTable from "../../_components/notifications/_components/HistoryNoti";
import { StatCard } from "../../_components/analytics/_components/StatCard";

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState<"send" | "history">("send");

    const tabs = [
        {
            id: "send",
            label: "Gửi thông báo mới",
            icon: <Send size={18} strokeWidth={2.5} />,
            component: <BroadcastNotificationForm />
        },
        {
            id: "history",
            label: "Lịch sử thông báo",
            icon: <History size={18} strokeWidth={2.5} />,
            component: <NotificationHistoryTable />
        }
    ];

    return (
        <div className="min-h-screen bg-[#fffcf9]">
            <div className="relative bg-white py-16 overflow-hidden border-b border-gray-100">
                <div className="absolute top-0 left-0 w-full h-full opacity-40">
                    <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-orange-100 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-red-50 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-semibold uppercase tracking-[0.2em]">
                                Communication Hub
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-200">
                                    <Bell className="text-white" size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tighter uppercase italic">
                                        Quản lý <span className="text-orange-500">Thông báo</span>
                                    </h1>
                                    <p className="text-gray-500 font-medium text-sm md:text-base">
                                        Điều phối luồng tin nhắn hệ thống đến cộng đồng CaLaTha.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard label="Tổng broadcast" value="1,284" icon={<LayoutGrid size={16}/>} color="orange" />
                            <StatCard label="Người nhận/ngày" value="45.2K" icon={<Users size={16}/>} color="red" />
                            <StatCard label="Tỷ lệ thành công" value="99.9%" icon={<Zap size={16}/>} color="emerald" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    
                    <div className="flex border-b border-gray-50 bg-gray-50/30 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 rounded-3xl text-sm font-semibold uppercase tracking-widest transition-all duration-300",
                                    activeTab === tab.id 
                                        ? "bg-white text-orange-600 shadow-sm border border-gray-100" 
                                        : "text-gray-600 hover:text-gray-600"
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === "send" ? (
                                    <div className="max-w-3xl mx-auto">
                                        <div className="mb-8 text-center">
                                            <h3 className="text-xl font-semibold text-gray-800 uppercase italic">Soạn thảo nội dung</h3>
                                            <p className="text-gray-600 text-sm font-medium italic">Vui lòng kiểm tra kỹ đối tượng trước khi gửi</p>
                                        </div>
                                        <BroadcastNotificationForm />
                                    </div>
                                ) : (
                                    <NotificationHistoryTable />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

