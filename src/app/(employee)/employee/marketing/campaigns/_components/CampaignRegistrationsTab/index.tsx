"use client";

import React from "react";
import {
  CheckCircle,
  XCircle,
  Package,
  ArrowRight,
  Store,
  Tag,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/hooks/useFormatPrice";
import type { CampaignSlotProductResponse } from "../../_types/types";

interface CampaignRegistrationsTabProps {
  pendingRegistrations: CampaignSlotProductResponse[];
  selectedRegistrations: string[];
  onBatchApprove: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleSelection: (id: string) => void;
}

export const CampaignRegistrationsTab: React.FC<
  CampaignRegistrationsTabProps
> = ({
  pendingRegistrations,
  selectedRegistrations,
  onBatchApprove,
  onApprove,
  onReject,
  onToggleSelection,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
            <Package className="text-orange-500" size={24} />
            Yêu cầu chờ duyệt
            <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full ml-2">
              {pendingRegistrations.length}
            </span>
          </h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Phê duyệt sản phẩm tham gia chiến dịch Platform
          </p>
        </div>

        <AnimatePresence>
          {selectedRegistrations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 bg-orange-50 p-2 pl-4 rounded-2xl border border-orange-100"
            >
              <span className="text-[11px] font-black text-orange-600 uppercase tracking-wider">
                Đã chọn {selectedRegistrations.length} mục
              </span>
              <button
                onClick={onBatchApprove}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <CheckCircle size={14} />
                Duyệt nhanh tất cả
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LIST SECTION */}
      {pendingRegistrations.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-orange-200" />
          </div>
          <h3 className="text-gray-900 font-bold uppercase text-sm tracking-widest">
            Sạch bong!
          </h3>
          <p className="text-gray-400 text-xs font-medium mt-1">
            Không còn đăng ký nào cần xử lý lúc này.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pendingRegistrations.map((reg) => {
            const isSelected = selectedRegistrations.includes(reg.id);
            return (
              <div
                key={reg.id}
                onClick={() => onToggleSelection(reg.id)}
                className={cn(
                  "group bg-white rounded-4xl p-5 border-2 transition-all duration-300 cursor-pointer relative overflow-hidden",
                  isSelected
                    ? "border-orange-500 shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)]"
                    : "border-gray-50 hover:border-orange-200 hover:shadow-md",
                )}
              >
                {/* Checkbox ẩn */}
                <div
                  className={cn(
                    "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-200 opacity-0 group-hover:opacity-100",
                  )}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100">
                    <img
                      src={
                        reg.productThumbnail || "https://picsum.photos/100/100"
                      }
                      alt={reg.productName}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-black text-gray-800 truncate text-[14px] leading-tight">
                      {reg.productName}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
                      <Store size={12} className="text-orange-400" />
                      {reg.shopName}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 mt-1 bg-orange-50 w-fit px-2 py-0.5 rounded-lg border border-orange-100">
                      <Tag size={10} />
                      {reg.campaignName}
                    </div>
                  </div>
                </div>

                {/* Pricing Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Giá gốc
                    </p>
                    <p className="text-xs line-through text-gray-400 font-bold">
                      {formatPrice(reg.originalPrice)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1">
                      Sale <ArrowRight size={10} />
                    </p>
                    <p className="text-sm font-black text-orange-600">
                      {formatPrice(reg.salePrice)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Giảm giá
                    </p>
                    <p className="text-xs font-black text-emerald-600">
                      -{reg.discountPercent}%
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Kho hàng
                    </p>
                    <p className="text-xs font-black text-gray-700">
                      {reg.stockLimit} item
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(reg.id);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all cursor-pointer text-[10px] font-black uppercase shadow-lg shadow-orange-100 active:scale-95"
                  >
                    <CheckCircle size={14} /> Phê duyệt
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(reg.id);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-white text-gray-400 border border-gray-100 rounded-xl hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all cursor-pointer text-[10px] font-black uppercase active:scale-95"
                  >
                    <XCircle size={14} /> Từ chối
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
