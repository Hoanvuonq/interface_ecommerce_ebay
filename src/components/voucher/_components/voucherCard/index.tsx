"use client";
import React from "react";
import { VoucherOption } from "../../_types/voucher";
import { cn } from "@/utils/cn";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { Ticket, Truck, CheckCircle2 } from "lucide-react";

interface VoucherCardProps {
  voucher: VoucherOption;
  isSelected: boolean;
  onSelect: () => void;
  type: "order" | "shipping" | "auto";
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  isSelected,
  onSelect,
  type,
}) => {
  const isShipping = type === "shipping" || voucher.voucherScope === "SHIPPING";

  return (
    <div
      onClick={() => voucher.canSelect !== false && onSelect()}
      className={cn(
        "group relative flex border border-orange-200 rounded-2xl transition-all duration-300 mb-4 cursor-pointer overflow-visible",
        isSelected
          ? " shadow-[0_15px_30px_-5px_rgba(249,115,22,0.2)] scale-[1.015] z-10"
          : "shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5",
        !voucher.canSelect &&
          "opacity-50 grayscale cursor-not-allowed border border-dashed border-slate-200"
      )}
    >
      <div
        className={cn(
          "w-24 shrink-0 flex flex-col items-center justify-center p-4 text-white rounded-l-2xl relative transition-all duration-500",
          isShipping ? "bg-emerald-400" : "bg-orange-400",
          isSelected ? "brightness-105" : "brightness-100"
        )}
      >
        <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm border border-white/10 shadow-sm">
          {isShipping ? (
            <Truck size={22} strokeWidth={2} />
          ) : (
            <Ticket size={22} strokeWidth={2} />
          )}
        </div>
        <span className="text-[7px] font-bold uppercase mt-2.5 tracking-[0.2em] opacity-80 text-center leading-none">
          {isShipping ? "FREESHIP" : "VOUCHER"}
        </span>
        <div className="absolute right-0 top-4 bottom-4 w-px border-r border-dashed border-white/30" />
      </div>

      <div className="flex-1 p-5 flex flex-col justify-center min-w-0 bg-slate-100 rounded-2xl  relative">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h4 className="font-bold text-slate-400 text-[10px] truncate uppercase tracking-[0.15em] mb-1.5">
              {voucher.code}
            </h4>
            <p
              className={cn(
                "font-bold text-xl leading-none tracking-tight",
                isShipping ? "text-emerald-500" : "text-orange-500"
              )}
            >
              {voucher.discountType === "PERCENTAGE"
                ? `Giảm ${voucher.discountAmount}%`
                : `Giảm ${formatPriceFull(voucher.discountAmount)}`}
            </p>
          </div>
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-inner",
              isSelected
                ? "bg-orange-500 border-orange-500 shadow-orange-100 scale-110"
                : "bg-slate-50 border-slate-100"
            )}
          >
            <CheckCircle2
              size={12}
              className={cn(
                "transition-all duration-300",
                isSelected
                  ? "text-white opacity-100"
                  : "text-transparent opacity-0"
              )}
              strokeWidth={3}
            />
          </div>
        </div>
        <div className="mt-4 flex">
          <span className="px-2 py-0.5 bg-slate-50 text-[8px] font-bold text-slate-400 rounded border border-slate-100/50 uppercase tracking-tighter">
            Đơn tối thiểu {formatPriceFull(voucher.minOrderValue)}
          </span>
        </div>
      </div>

      <div className="absolute left-22.5 -top-2 w-4 h-4 bg-[#f8fafc] rounded-full z-20 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.02)]" />
      <div className="absolute left-22.5 -bottom-2 w-4 h-4 bg-[#f8fafc] rounded-full z-20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
    </div>
  );
};
