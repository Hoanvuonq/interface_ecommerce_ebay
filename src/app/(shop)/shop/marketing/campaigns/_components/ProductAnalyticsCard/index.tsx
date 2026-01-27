"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { Calendar, Zap, User, Clock, ShieldCheck, History } from "lucide-react";

export const ProductAnalyticsCard = ({ prod, formatPrice }: any) => {
  const sellRatio = Math.min(
    (prod.stockSold / (prod.stockLimit || 1)) * 100,
    100,
  );

  const discountPercent =
    prod.discountPercent ||
    Math.round(((prod.price - prod.salePrice) / (prod.price || 1)) * 100) ||
    0;

  const formatDateTime = (dateStr: any) => {
    if (!dateStr) return "---";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "---";
      return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: false,
      })
        .format(date)
        .replace(",", " -");
    } catch (e) {
      return "---";
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-5 p-5 bg-white border border-slate-100 rounded-4xl",
        "shadow-custom transition-all duration-500 hover:-translate-y-2 overflow-hidden",
      )}
    >
      {discountPercent > 0 && (
        <div className="absolute top-5 right-5 z-20 flex items-center h-6 pl-2.5 pr-2 bg-linear-to-r from-rose-500 to-red-600 text-white shadow-lg overflow-hidden rounded-sm">
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full z-10" />
          <span className="text-[10px] font-bold tracking-tighter uppercase pl-1.5">
            -{discountPercent}%
          </span>
          <div className="ml-2 h-4 border-l border-dashed border-white/40" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 shrink-0 rounded-3xl overflow-hidden shadow-inner bg-slate-50 border border-slate-100">
          <Image
            src={
              prod.imageUrl ||
              prod.productThumbnail ||
              "https://picsum.photos/100/100"
            }
            alt="thumb"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <ShieldCheck size={12} className="fill-current/10" />
            <span className="text-[10px] font-bold  text-gray-400 uppercase tracking-widest truncate">
              ID: {prod.id?.slice(-8) || "N/A"}
            </span>
          </div>
          <h4 className="font-bold  text-gray-800 text-sm truncate uppercase italic group-hover:text-orange-600 transition-colors">
            {prod.name || prod.productName || "Sản phẩm không tên"}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-orange-600 tracking-tighter tabular-nums leading-none">
              {formatPrice(prod.salePrice)}
            </span>
            <span className="text-[11px] font-bold  text-gray-300 line-through">
              {formatPrice(prod.price || prod.salePrice * 1.2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 italic shadow-inner">
        <div className="space-y-1">
          <p className="text-[8px] font-bold  text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Clock size={10} className="text-emerald-500" /> Bắt đầu
          </p>
          <div className="text-[10px] font-bold  text-gray-600 bg-white py-1 px-2 rounded-lg border border-slate-200 w-fit">
            {formatDateTime(prod.startDate)}
          </div>
        </div>
        <div className="space-y-1 border-l border-slate-200 pl-3">
          <p className="text-[8px] font-bold  text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Calendar size={10} className="text-rose-500" /> Kết thúc
          </p>
          <div className="text-[10px] font-bold  text-gray-600 bg-white py-1 px-2 rounded-lg border border-slate-200 w-fit">
            {formatDateTime(prod.endDate)}
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE HUB */}
      <div className="space-y-3 bg-slate-900 p-4 rounded-4xl shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-end mb-1">
          <div className="flex flex-col z-10">
            <span className="text-[9px] font-bold uppercase  text-gray-500">
              Performance
            </span>
            <span className="text-xl font-bold text-white">
              {Math.round(sellRatio)}%{" "}
              <span className="text-[10px]  text-gray-500">SOLD</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 z-10">
            <Zap
              size={10}
              className={cn(
                "fill-current",
                sellRatio > 80
                  ? "text-red-500 animate-pulse"
                  : "text-orange-400",
              )}
            />
            <span className="text-[11px] font-bold text-white tabular-nums">
              {prod.stockSold || 0}{" "}
              <span className=" text-gray-500 mx-0.5">/</span>{" "}
              {prod.stockLimit || 0}
            </span>
          </div>
        </div>
        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              sellRatio > 80
                ? "bg-linear-to-r from-red-500 to-rose-600"
                : "bg-orange-500",
            )}
            style={{ width: `${sellRatio}%` }}
          />
        </div>
      </div>

      {/* 5. FOOTER LOGS */}
      <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-50 mt-1">
        <div className="flex items-center gap-2">
          <User size={12} className=" text-gray-500" />
          <p className="text-[10px] font-bold  text-gray-600">
            @{prod.createdBy || "system"}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-[8px] font-bold  text-gray-300 uppercase tracking-widest italic">
            <History size={10} /> Scheduled
          </div>
          <p className="text-[10px] font-bold  text-gray-400 tabular-nums">
            {formatDateTime(prod.scheduledAt)}
          </p>
        </div>
      </div>
    </div>
  );
};
