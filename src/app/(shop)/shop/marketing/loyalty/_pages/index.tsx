/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/utils/cn";
import {
  Gift,
  Info,
  Settings,
  ShieldCheck,
  Trophy,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import React, { useCallback, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShopLoyaltyStatisticsCard,
  ProductPromotionList,
  ShopLoyaltyPolicyCard,
} from "../../loyalty/_components";
import type { LoyaltyPolicyResponse } from "../../loyalty/_types/loyalty.types";
import { StatusTabs, StatusTabItem } from "../../../_components";

type TabKey = "policy" | "products";

export const ShopLoyaltyScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("policy");
  const [hasPolicy, setHasPolicy] = useState(false);
  const [promotionCount, setPromotionCount] = useState(0);

  const handlePolicyChange = useCallback(
    (policy: LoyaltyPolicyResponse | null) => {
      setHasPolicy(!!policy);
    },
    [],
  );

  const handlePromotionCountUpdate = useCallback((count: number) => {
    setPromotionCount(count);
  }, []);

  const loyaltyTabs: StatusTabItem<TabKey>[] = useMemo(
    () => [
      {
        key: "policy",
        label: "Chính sách Shop",
        icon: Settings,
      },
      {
        key: "products",
        label: "Khuyến mãi Sản phẩm",
        icon: Gift,
        count: promotionCount > 0 ? promotionCount : undefined,
      },
    ],
    [promotionCount],
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="relative bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full -ml-10 -mb-10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-5 bg-linear-to-br from-orange-400 to-orange-600 rounded-4xl text-white shadow-2xl shadow-orange-200 transform group-hover:rotate-6 transition-transform duration-500">
                <Trophy size={36} strokeWidth={2.2} />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 text-orange-300"
              >
                <Sparkles size={20} fill="currentColor" />
              </motion.div>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-slate-800 uppercase tracking-tighter italic">
                Hệ thống <span className="text-orange-500">Loyalty</span>
              </h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                Chương trình tích điểm & thưởng
                <ChevronRight size={12} className="text-orange-500" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50/80 backdrop-blur-md rounded-2xl border border-blue-100/50 shadow-sm shadow-blue-100/20">
            <div className="p-2 bg-white rounded-xl shadow-xs">
              <ShieldCheck size={20} className="text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400 leading-none mb-0.5">
                Security Status
              </span>
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-tight">
                Hệ thống bảo mật & Tự động
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <ShopLoyaltyStatisticsCard />
      </div>

      <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-150">
        <div className="px-8 pt-8 pb-4 border-b border-gray-50 flex items-center justify-between">
          <StatusTabs
            tabs={loyaltyTabs}
            current={activeTab}
            onChange={(key) => setActiveTab(key)}
            layoutId="loyalty-nav-pill"
            className="w-auto"
          />

          {hasPolicy && activeTab === "policy" && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                Đang kích hoạt
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "mb-10 p-6 rounded-[2.5rem] border flex items-start gap-5 transition-all duration-500",
                activeTab === "policy"
                  ? "bg-orange-50/50 border-orange-100 shadow-sm shadow-orange-100/50"
                  : "bg-blue-50/50 border-blue-100 shadow-sm shadow-blue-100/50",
              )}
            >
              <div
                className={cn(
                  "mt-1 p-3 rounded-2xl shadow-sm bg-white",
                  activeTab === "policy" ? "text-orange-600" : "text-blue-600",
                )}
              >
                <Info size={22} strokeWidth={2.5} />
              </div>

              <div>
                <h4
                  className={cn(
                    "text-base font-bold uppercase tracking-tight mb-1",
                    activeTab === "policy"
                      ? "text-orange-900"
                      : "text-blue-900",
                  )}
                >
                  {activeTab === "policy"
                    ? "Quy tắc tích điểm mặc định"
                    : "Cấu hình riêng theo sản phẩm"}
                </h4>
                <p
                  className={cn(
                    "text-xs leading-relaxed font-semibold max-w-2xl opacity-70 italic",
                    activeTab === "policy"
                      ? "text-orange-800"
                      : "text-blue-800",
                  )}
                >
                  {activeTab === "policy"
                    ? "Thiết lập quy tắc tích điểm cho tất cả đơn hàng. Khách hàng sẽ dùng điểm tích lũy để được giảm giá cho lần mua sau."
                    : "Bạn có thể tạo các chương trình tích điểm đặc biệt cho từng sản phẩm. Lưu ý: Khuyến mãi này sẽ ghi đè chính sách chung của cửa hàng."}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {activeTab === "policy" ? (
                  <ShopLoyaltyPolicyCard onPolicyChange={handlePolicyChange} />
                ) : (
                  <ProductPromotionList
                    onCountUpdate={handlePromotionCountUpdate}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
