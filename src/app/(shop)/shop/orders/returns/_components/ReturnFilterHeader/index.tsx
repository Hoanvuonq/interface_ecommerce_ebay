"use client";

import React, { useState } from "react";
import { Search, RotateCcw, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/utils/cn";
import {motion} from "framer-motion";
import { FormInput, SelectComponent } from "@/components";

// Option mẫu cho SelectComponent
const ACTION_OPTIONS = [
  { label: "Toàn bộ thao tác", value: "all" },
  { label: "Thương lượng với Người mua", value: "negotiate" },
  { label: "Cần cung cấp bằng chứng", value: "evidence" },
  { label: "Kiểm tra hàng hoàn", value: "check_return" },
  { label: "Phản hồi quyết định của Shopee", value: "dispute_shopee" },
  { label: "Hoàn tiền một phần", value: "partial_refund" },
  { label: "Hoàn tiền toàn phần", value: "full_refund" },
];

const ACTIONS_BY_TAB: Record<string, string[]> = {
  all: ["Thương lượng với Người mua", "Cần cung cấp bằng chứng", "Giữ lại kiện hàng", "Kiểm tra hàng hoàn", "Phản hồi quyết định của Shopee"],
  returns: ["Cần cung cấp bằng chứng", "Kiểm tra hàng hoàn", "Phản hồi quyết định của Shopee"],
  cancelled_orders: ["Thương lượng với Người mua", "Giữ lại kiện hàng"],
  failed_deliveries: ["Cần cung cấp bằng chứng", "Kiểm tra hàng hoàn"],
};

interface ReturnFilterHeaderProps {
  activeMainTab: string;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  priority: string;
  setPriority: (p: string) => void;
}

export const ReturnFilterHeader = ({
  activeMainTab,
  activeSubTab,
  setActiveSubTab,
  priority,
  setPriority,
}: ReturnFilterHeaderProps) => {
  const [selectedAction, setSelectedAction] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const subTabs = [
    { key: "all", label: "Tất cả" },
    { key: "reviewing", label: "Shopee đang xem xét" },
    { key: "returning", label: "Đang trả hàng cho Người bán" },
    { key: "refunded", label: "Đã hoàn tiền cho Người mua" },
    { key: "disputed", label: "Đã khiếu nại đến Shopee" },
  ];

  const currentActions = ACTIONS_BY_TAB[activeMainTab] || ACTIONS_BY_TAB.all;

  return (
    <div className="space-y-6 bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* 1. Sub-Tabs Section */}
      <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={cn(
              "pb-4 text-[13px] font-black transition-all relative whitespace-nowrap tracking-tight",
              activeSubTab === tab.key ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab.label}
            {activeSubTab === tab.key && (
              <motion.div 
                layoutId="activeSubTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* 2. Filter Rows */}
        <div className="flex flex-wrap items-center gap-y-4 gap-x-10">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest min-w-[70px]">Ưu tiên</span>
            <div className="flex gap-2">
              {["Tất cả", "Hết hạn sau 1 ngày", "Hết hạn sau 2 ngày"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "px-5 py-2 rounded-full border-2 text-[12px] font-bold transition-all",
                    priority === p 
                      ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200" 
                      : "border-gray-100 text-gray-500 hover:border-gray-200 bg-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest min-w-[70px]">Hành động</span>
            <div className="flex flex-wrap gap-2">
              {currentActions.slice(0, isExpanded ? undefined : 3).map((action) => (
                <button
                  key={action}
                  className="px-5 py-2 rounded-full border-2 border-gray-50 text-gray-600 hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50 transition-all text-[12px] font-bold bg-gray-50/30"
                >
                  {action}
                </button>
              ))}
              {currentActions.length > 3 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-orange-500 text-[12px] font-black ml-2 hover:underline"
                >
                  {isExpanded ? "Thu gọn" : `+${currentActions.length - 3} khác`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Select Group */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-6 border-t border-gray-50">
        <div className="lg:col-span-5 relative group">
          <FormInput 
            placeholder="Mã đơn hàng / Tên khách hàng / Mã vận đơn..." 
            className="pl-14 h-14 rounded-2xl bg-gray-50/80 border-transparent focus:bg-white focus:border-orange-200 focus:ring-orange-100 transition-all shadow-none font-bold text-gray-700"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
        </div>

        <div className="lg:col-span-4">
          <SelectComponent
            options={ACTION_OPTIONS}
            value={selectedAction}
            onChange={(val) => setSelectedAction(val)}
            placeholder="Toàn bộ thao tác"
            className="h-14" // Fix chiều cao đồng bộ với FormInput
          />
        </div>

        <div className="lg:col-span-3 flex gap-3">
          <button className="flex-[2] bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-95 text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
            <Search size={16} strokeWidth={3} />
            Tìm kiếm
          </button>
          <button className="flex-1 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-400 rounded-2xl transition-all active:scale-95 border-2 border-gray-100 group">
            <RotateCcw size={20} className="group-hover:rotate-[-45deg] transition-transform" />
          </button>
        </div>
      </div>
      
      {/* 4. Mở rộng Action (Optional như ảnh Shopee) */}
      <div className="flex items-center justify-start">
        <button className="text-blue-500 flex items-center gap-1.5 text-[12px] font-bold hover:opacity-80 transition-opacity">
          Mở rộng bộ lọc <ChevronDown size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};