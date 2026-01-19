"use client";

import React, { useState } from "react";
import { Bell, ShoppingBag, Store, Cpu, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { hasAnyRole } from "@/utils/jwt";
import { RoleEnum } from "@/auth/_types/auth";
import type { RecipientRole } from "@/layouts/header/_service/notification.service";
import NotificationList from "../_components/NotificationList";
import { cn } from "@/utils/cn";

export const NotificationScreen = () => {
  const [activeTab, setActiveTab] = useState<RecipientRole>("BUYER");

  const tabs = [
    {
      key: "BUYER",
      label: "Mua hàng",
      icon: <ShoppingBag size={16} />,
      show: true,
    },
    {
      key: "SHOP",
      label: "Bán hàng",
      icon: <Store size={16} />,
      show: hasAnyRole([RoleEnum.SHOP]),
    },
    {
      key: "SYSTEM",
      label: "Hệ thống",
      icon: <Cpu size={16} />,
      show: true,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.show);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <div className="bg-white rounded-[2.5rem] border border-gray-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between border-b border-gray-50 px-6 py-2 gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 bg-(--color-mainColor) rounded-xl shadow-md shadow-orange-100">
              <Bell className="text-white w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-gray-900 italic uppercase tracking-tighter leading-none">
                Thông báo
              </h1>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                Calatha Hub
              </span>
            </div>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-1 p-1 bg-gray-50/50 rounded-2xl border border-gray-100">
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as RecipientRole)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-500 min-w-max",
                    isActive
                      ? "text-(--color-mainColor)"
                      : "text-gray-500 hover:text-gray-600"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabInside"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100/30"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "p-1.5 rounded-lg transition-colors relative z-10",
                      isActive
                        ? "bg-(--color-mainColor) text-white shadow-sm"
                        : "bg-white border border-gray-100"
                    )}
                  >
                    {tab.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest italic relative z-10">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button className="hidden lg:flex p-2 rounded-xl bg-gray-50 text-gray-500 hover:text-(--color-mainColor) border border-transparent hover:border-gray-100 transition-all">
            <Settings2 size={16} />
          </button>
        </div>

        <div className="p-2 md:p-6 min-h-137.5 bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <NotificationList recipientRole={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
