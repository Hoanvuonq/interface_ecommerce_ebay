"use client";

import React from "react";
import Image from "next/image";
import {
  Tag,
  Trash2,
  Activity,
  Clock,
  Calendar,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { CustomHasDiscount, CustomProgressBar } from "@/components";
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
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "--:--";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  return (
    <div className="group relative bg-white rounded-4xl transition-all duration-500 shadow-custom flex flex-col overflow-hidden p-3">
      <div className="flex gap-3">
        <div className="relative shrink-0 w-20 h-20">
          <div className="w-full h-full rounded-2xl overflow-hidden ring-1 ring-slate-100 group-hover:ring-orange-500/20 transition-all">
            <Image
              src={reg.productThumbnail || "https://picsum.photos/200/200"}
              alt={reg.productName}
              fill
              className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              sizes="80px"
            />
          </div>
          <div
            className={cn(
              "absolute -top-1 -right-1 size-6 rounded-lg border-2 border-white flex items-center justify-center shadow-md z-20 text-white",
              statusStyles.bg,
            )}
          >
            {React.cloneElement(statusStyles.icon as React.ReactElement)}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <h3 className="font-bold  text-gray-800 text-[13px] leading-tight line-clamp-1 uppercase tracking-tight">
              {reg.productName}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded uppercase border border-orange-100 italic">
                {reg.campaignName || "SALE"}
              </span>
              <span className="text-[12px] font-bold text-gray-600 flex items-center gap-1">
                <ShieldCheck size={14} className="text-blue-500" />
                {reg.variantSku || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex w-auto items-center justify-center gap-1.5 py-1 px-2 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1">
              <Clock size={10} className="text-emerald-500" />
              <span className="text-[12px] font-bold text-gray-800 tabular-nums">
                {formatDateTime(reg.slotStartTime)}
              </span>
            </div>
            <span className="text-gray-500 text-[12px]">—</span>
            <div className="flex items-center gap-1">
              <Calendar size={10} className="text-rose-500" />
              <span className="text-[12px] font-bold text-gray-800 tabular-nums">
                {formatDateTime(reg.slotEndTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-600 tracking-tighter tabular-nums leading-none">
            {formatPrice(reg.salePrice || 0)}
          </span>
          <span className="text-[14px] font-bold text-gray-500 line-through mt-0.5">
            {formatPrice(reg.originalPrice || 0)}
          </span>
        </div>
        {reg.discountPercent > 0 && (
          <CustomHasDiscount discount={reg.discountPercent} size="lg" />
        )}
      </div>

      <div className="mt-3 px-1 space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-600">
          <div className="flex items-center gap-1">
            <Activity size={10} className="text-orange-500" />
            <span>Stock Intensity</span>
          </div>
          <span className=" text-gray-600 font-bold tabular-nums">
            {reg.stockSold}/{reg.stockLimit}
          </span>
        </div>
       
        <CustomProgressBar
          percent={reg.stockSold}
          color="bg-linear-to-r from-orange-500 to-red-600"
          className="h-2 rounded-full shadow-inner"
        />
      </div>

      <div className="flex items-center justify-between mt-3 px-1 pt-2 border-t border-slate-50 opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5">
          <User size={15} className="text-gray-600" />
          <p className="text-[12px] font-bold text-gray-900 lowercase italic">
            @{reg.createdBy || "ebay"}
          </p>
        </div>
        <p className="text-[11px] font-bold text-gray-900 ">
          ID: {reg.id.slice(-6)}
        </p>
      </div>

      {reg.status === "PENDING" && (
        <button
          onClick={() => onCancel(reg.id)}
          className="absolute top-2 right-2 size-7 rounded-full bg-slate-100 text-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-500 z-30"
          title="Hủy đăng ký"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};
