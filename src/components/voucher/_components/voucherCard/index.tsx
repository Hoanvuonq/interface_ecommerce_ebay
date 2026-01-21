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
  const isShipping = type === "shipping" || voucher.voucherScope === "SHIPPING" || voucher.voucherType === "SHIPPING";
  const canSelect = voucher.canSelect !== false;

  return (
    <div
      onClick={() => canSelect && onSelect()}
      className={cn(
        "group relative flex border rounded-2xl transition-all duration-300 mb-4 cursor-pointer overflow-visible min-h-27.5",
        isSelected
          ? isShipping 
            ? "border-emerald-500 bg-emerald-50/30 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.15)] scale-[1.01] z-10"
            : "border-gray-500 bg-orange-50/30 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.15)] scale-[1.01] z-10"
          : "border-gray-100 bg-white hover:border-gray-300 shadow-sm",
        !canSelect && "opacity-60 grayscale cursor-not-allowed border-dashed"
      )}
    >
      <div
        className={cn(
          "w-24 shrink-0 flex flex-col items-center justify-center p-4 text-white rounded-l-[15px] relative transition-all duration-500",
          isShipping ? "bg-emerald-400" : "bg-orange-400",
          isSelected ? "brightness-105" : "brightness-100"
        )}
      >
        <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm border border-white/10 shadow-sm transition-transform group-hover:scale-110">
          {isShipping ? (
            <Truck size={22} strokeWidth={2.5} />
          ) : (
            <Ticket size={22} strokeWidth={2.5} />
          )}
        </div>
        <span className="text-[8px] font-bold uppercase mt-3 tracking-[0.15em] opacity-90 text-center leading-none">
          {isShipping ? "FREESHIP" : "VOUCHER"}
        </span>
        
        <div className="absolute right-0 top-3 bottom-3 w-px border-r-2 border-dashed border-white/40" />
      </div>

      <div className="flex-1 p-4 flex flex-col justify-center min-w-0 relative">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-gray-600 text-[9px] truncate uppercase tracking-widest mb-1">
              {voucher.code}
            </h4>
            <p
              className={cn(
                "font-bold text-lg leading-tight tracking-tight",
                isShipping ? "text-emerald-600" : "text-orange-600"
              )}
            >
              {voucher.discountMethod === "PERCENTAGE" || voucher.discountType === "PERCENTAGE"
                ? `Giảm ${voucher.discountAmount}%`
                : `Giảm ${formatPriceFull(voucher.discountAmount)}`}
            </p>
            <p className="text-[10px] font-medium text-gray-500 mt-1">
              Đơn tối thiểu {formatPriceFull(voucher.minOrderValue)}
            </p>
          </div>

          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border-2 shrink-0",
              isSelected
                ? isShipping 
                  ? "bg-emerald-500 border-emerald-500" 
                  : "bg-orange-500 border-gray-500"
                : "bg-white border-gray-200"
            )}
          >
            <CheckCircle2
              size={14}
              className={cn(
                "transition-all duration-300",
                isSelected ? "text-white opacity-100 scale-100" : "text-transparent opacity-0 scale-50"
              )}
              strokeWidth={4}
            />
          </div>
        </div>

        {voucher.endDate && (
          <div className="mt-3 pt-2 border-t border-gray-50">
             <p className="text-[9px] text-gray-600 font-medium italic">
                HSD: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
             </p>
          </div>
        )}
      </div>

      <div className="absolute left-22.5 -top-2 w-4 h-4 bg-white border-b border-gray-100 rounded-full z-10" />
      <div className="absolute left-22.5 -bottom-2 w-4 h-4 bg-white border-t border-gray-100 rounded-full z-10" />
    </div>
  );
};