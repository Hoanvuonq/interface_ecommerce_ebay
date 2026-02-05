"use client";
import React from "react";
import { cn } from "@/utils/cn";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { Ticket, Truck, CheckCircle2, Info, Clock } from "lucide-react";

export const VoucherCard: React.FC<any> = ({
  voucher,
  isSelected,
  onSelect,
  type,
}) => {
  const isShipping =
    type === "shipping" || voucher.code.toUpperCase().includes("SHIP");

  const canSelect = voucher.applicable !== false;
  const showActive = isSelected || canSelect;

  const displayDiscount =
    voucher.discount || voucher.calculatedDiscount || voucher.discountValue;

  return (
    <div
      onClick={() => (isSelected || canSelect) && onSelect()}
      className={cn(
        "group relative flex border-2 rounded-2xl transition-all duration-500 mb-4 cursor-pointer overflow-visible min-h-28.75",
        isSelected
          ? isShipping
            ? "border-emerald-500 bg-emerald-50/40 shadow-lg scale-[1.01] z-10"
            : "border-orange-500 bg-orange-50/40 shadow-lg scale-[1.01] z-10"
          : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md",
        !showActive && "opacity-50 grayscale border-dashed bg-gray-50",
      )}
    >
      {/* TRÁI: ICON & TYPE */}
      <div
        className={cn(
          "w-28 shrink-0 flex flex-col items-center justify-center p-4 text-white rounded-l-[13px] relative overflow-hidden",
          isShipping ? "bg-emerald-500" : "bg-orange-500",
        )}
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
        <div className="bg-white/25 p-3 rounded-2xl backdrop-blur-md transition-transform group-hover:scale-110">
          {isShipping ? (
            <Truck size={24} strokeWidth={2.5} />
          ) : (
            <Ticket size={24} strokeWidth={2.5} />
          )}
        </div>
        <span className="text-[10px] font-black uppercase mt-3 tracking-widest">
          {isShipping ? "FREESHIP" : "VOUCHER"}
        </span>
        <div className="absolute right-px top-4 bottom-4 w-0.5 border-r-2 border-dashed border-white/30 z-20" />
      </div>

      {/* PHẢI: THÔNG TIN */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0 relative">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h4 className="font-black text-gray-800 text-[11px] truncate uppercase bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/50 mb-1.5 inline-block">
              {voucher.code}
            </h4>
            <p
              className={cn(
                "font-black text-2xl leading-none tracking-tight",
                isShipping ? "text-emerald-600" : "text-orange-600",
              )}
            >
              {voucher.discountType === "PERCENTAGE"
                ? `Giảm ${voucher.discountValue}%`
                : `Giảm ${formatPriceFull(displayDiscount)}`}
            </p>
          </div>

          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-all border-2 shrink-0",
              isSelected
                ? isShipping
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-orange-500 border-orange-500"
                : "bg-white border-gray-200 shadow-inner",
            )}
          >
            {isSelected && (
              <CheckCircle2 size={16} className="text-white" strokeWidth={4} />
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between min-w-0">
          {!canSelect && voucher.reason && !isSelected ? (
            <div className="flex items-center gap-1 text-rose-500 font-bold animate-in fade-in slide-in-from-bottom-1">
              <Info size={12} className="shrink-0" />
              <p className="text-[9px] uppercase italic truncate">
                {voucher.reason}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock size={11} />
              <p className="text-[9px] font-black uppercase tracking-tighter truncate">
                Đơn tối thiểu {formatPriceFull(voucher.minOrderValue || 0)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute left-25.75 -top-[9.5px] w-5 h-5 bg-[#f8fafc] border-b-2 border-gray-100 rounded-full z-20" />
      <div className="absolute left-25.75 -bottom-[9.5px] w-5 h-5 bg-[#f8fafc] border-t-2 border-gray-100 rounded-full z-20" />
    </div>
  );
};
