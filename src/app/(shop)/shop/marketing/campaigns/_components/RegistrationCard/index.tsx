"use client";

import React from "react";
import Image from "next/image";
import { Tag, Trash2, ArrowUpRight, ShoppingBag, Activity } from "lucide-react";
import { cn } from "@/utils/cn";

interface RegistrationCardProps {
  reg: any;
  statusStyles: any;
  progress: number;
  formatPrice: (price: number) => string;
  onCancel: (id: string) => void;
}

export const RegistrationCard: React.FC<RegistrationCardProps> = ({
  reg,
  statusStyles,
  progress,
  formatPrice,
  onCancel,
}) => {
  return (
    <div className="group relative bg-[#fcfcfd] rounded-4xl p-1.5 border border-slate-200/60 shadow-custom transition-all duration-700 overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-linear-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 bg-white rounded-[28px] p-5 shadow-sm flex-1 flex flex-col">
        <div className="flex gap-5">
          <div className="relative shrink-0 w-28 h-28">
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/50 group-hover:ring-orange-500/20 transition-all duration-700">
              <Image
                src={reg.productThumbnail || "https://picsum.photos/200/200"}
                alt={reg.productName}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                sizes="112px"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>

            <div
              className={cn(
                "absolute -top-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-xl z-20 transition-transform group-hover:scale-110",
                statusStyles.bg,
                "text-white",
              )}
            >
              {React.cloneElement(statusStyles.icon as React.ReactElement, {})}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full tracking-widest uppercase mb-2">
                {reg.campaignType}
              </span>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-2 tracking-tight">
              {reg.productName}
            </h3>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
              <Tag size={12} className="text-gray-400" />
              <span className="truncate">{reg.campaignName}</span>
            </div>
          </div>
        </div>

        <div className="my-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase  mb-1">
            Giá đăng ký hiện tại
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-950 tracking-tighter">
              {formatPrice(reg.salePrice || 0)}
            </span>
            <span className="text-sm font-semibold text-gray-400 line-through decoration-slate-200">
              {formatPrice((reg.salePrice || 0) * 1.2)}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-slate-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-orange-500" />
              <span className="text-[12px] font-bold text-gray-600 ">
                Sức mua thị trường
              </span>
            </div>
            <span className="text-xs font-bold text-gray-900">
              {reg.stockSold}
              <span className="text-gray-400 font-medium">/</span>
              {reg.stockLimit}
            </span>
          </div>

          <div className="relative h-3 bg-slate-100 rounded-full p-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/20 to-transparent" />
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-in-out relative shadow-[0_0_15px_rgba(0,0,0,0.1)]",
                statusStyles.bg,
              )}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent w-full animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {reg.status === "PENDING" && (
        <button
          onClick={() => onCancel(reg.id)}
          className="absolute bottom-10 right-10 w-12 h-12 rounded-[20px] bg-slate-950 text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-red-600 shadow-2xl shadow-slate-900/40 active:scale-90"
          title="Hủy đăng ký"
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
};
