"use client";

import { formatCurrency } from "@/hooks/format";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface VoucherProps {
  code: string;
  discountType: "PERCENTAGE" | "AMOUNT";
  value: number;
  minOrder: number;
  endDate: string;
  onSave?: () => void;
  onUse?: () => void;
  isSavedInitial?: boolean;
}

export const ShopVoucherCard = ({
  code,
  discountType,
  value,
  minOrder,
  endDate,
  onSave,
  onUse,
  isSavedInitial = false,
}: VoucherProps) => {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsSaved(isSavedInitial);
  }, [isSavedInitial]);

  const handleButtonClick = () => {
    if (isSaved) {
      if (onUse) onUse();
      else alert(`Áp dụng mã ${code} ngay!`);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      if (onSave) onSave();
    }, 600);
  };

  return (
    <div className="relative flex w-77.5 h-28 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-orange-100/60 group shrink-0">
      <div className="w-28 bg-orange-50 flex flex-col items-center justify-center border-r border-dashed border-orange-200/50 relative p-2 text-center">
        <span className="text-[10px] font-semibold text-(--color-mainColor) uppercase tracking-widest">
          Giảm
        </span>
        <div className="text-3xl font-extrabold text-(--color-mainColor)/90 tracking-tighter mt-0.5">
          {discountType === "PERCENTAGE" ? `${value}%` : `${value / 1000}k`}
        </div>
        <span className="text-[9px] font-bold text-(--color-mainColor)/70 mt-1 uppercase tracking-tight">
          Shop Voucher
        </span>

        <div className="absolute -top-2 -right-2 w-4 h-4 bg-neutral-50 border border-orange-100/60 rounded-full z-10" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-neutral-50 border border-orange-100/60 rounded-full z-10" />
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between bg-white relative">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-neutral-50 border-b border-r border-orange-100/60 rounded-full z-10" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-neutral-50 border-t border-r border-orange-100/60 rounded-full z-10" />

        <div className="space-y-1 pr-1">
          <h3 className="text-sm font-bold text-gray-700 leading-snug line-clamp-1">
            Giảm tối đa{" "}
            {discountType === "PERCENTAGE" ? "50k" : formatCurrency(value)}
          </h3>
          <div className="space-y-0.5 tracking-tight">
            <p className="text-xs text-gray-500 font-medium">
              Đơn tối thiểu {formatCurrency(minOrder)}
            </p>
            <p className="text-[10px] text-gray-600 font-medium">
              HSD: {new Date(endDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1 gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-(--color-mainColor)/80 bg-orange-50 px-2 py-1 rounded border border-orange-100 truncate tracking-wider w-fit max-w-full">
              #{code}
            </div>
          </div>

          <button
            onClick={handleButtonClick}
            disabled={isSaving}
            className={`
              relative text-xs font-bold h-7 rounded-full transition-all duration-300 
              flex items-center justify-center shrink-0 w-22.5
              ${
                isSaved
                  ? "bg-orange-50 text-(--color-mainColor) border border-orange-200 hover:bg-orange-100" 
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200 shadow-sm"
              }
            `}
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isSaved ? (
              <span className="animate-in fade-in zoom-in duration-300">
                Dùng ngay
              </span>
            ) : (
              <span>Lưu</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
