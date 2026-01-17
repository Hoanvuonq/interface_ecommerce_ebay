"use client";

import { Clock, Info, MailQuestion, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { SettingsAutoMessage } from "../SettingsAutoMessage";
import { SettingsQuickReply } from "../SettingsQuickReply";
import { motion, AnimatePresence } from "framer-motion";

type AutoReplyTab = "standard" | "offtime" | "question";

export const ShopChatSettingsScreen = () => {
  const [activeTab, setActiveTab] = useState<AutoReplyTab>("standard");

  const replyTabs: StatusTabItem<AutoReplyTab>[] = [
    { key: "standard", label: "Tin nhắn tự động", icon: Zap },
    { key: "offtime", label: "Tin nhắn nhanh", icon: Clock },
    { key: "question", label: "Hỏi đáp", icon: MailQuestion },
  ];

  const pageMeta = useMemo(() => {
    const meta = {
      standard: {
        title: "Tin nhắn tự động",
        desc: "Automated Messaging System",
      },
      offtime: { title: "Tin nhắn nhanh", desc: "Quick Response Templates" },
      question: { title: "Hỏi đáp thông minh", desc: "AI Smart Q&A Assistant" },
    };
    return meta[activeTab];
  }, [activeTab]);

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "standard":
        return <SettingsAutoMessage key="standard" />;
      case "offtime":
        return <SettingsQuickReply key="offtime" />;
      case "question":
        return (
          <div
            key="question"
            className="p-10 text-center text-slate-400 italic"
          >
            Tính năng Hỏi đáp đang được cập nhật...
          </div>
        );
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div className="mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
        <div className="flex w-full justify-between items-center gap-4">
          <StatusTabs
            tabs={replyTabs}
            current={activeTab}
            onChange={(key) => setActiveTab(key)}
            className="w-full md:w-auto"
          />

          <div className="text-right pr-10 py-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight italic uppercase leading-none">
                  {pageMeta.title}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mt-2">
                  {pageMeta.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="min-h-125 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
