"use client";

import React, { useMemo } from "react";
import { Info, Loader2, CheckCircle2, Ticket } from "lucide-react";
import { formatPrice } from "@/hooks/useFormatPrice";
import { useCheckoutStore } from "../../_store/useCheckoutStore";
import { ButtonField } from "@/components";

interface OrderSummaryProps {
  onSubmit: (e: React.FormEvent) => void;
}


export const OrderSummary = ({ onSubmit }: OrderSummaryProps) => {
  const preview = useCheckoutStore((state) => state.preview);
  const loading = useCheckoutStore((state) => state.loading);
  const summary = preview.summary || preview;
  // Always use summary.totalDiscount for voucher discount (new API)
  const totalDiscountAmount = summary.totalDiscount || 0;

  if (!preview) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50">
        <Info size={18} className="text-orange-500" />
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-900">
          Chi tiết thanh toán
        </h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-600 uppercase">
            Tổng tiền hàng
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {formatPrice(summary.subtotal || 0)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-600 uppercase">
            Phí vận chuyển
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {formatPrice(summary.totalShippingFee || 0)}
          </span>
        </div>

        {totalDiscountAmount > 0 && (
          <div className="flex justify-between items-center py-1 group animate-in fade-in slide-in-from-right-2">
            <div className="flex items-center gap-1.5">
              <Ticket size={14} className="text-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-600 uppercase italic">
                Voucher giảm giá
              </span>
            </div>
            <span className="text-sm font-semibold text-red-600 italic">
              -{formatPrice(totalDiscountAmount)}
            </span>
          </div>
        )}

        {summary.totalTaxAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-600 uppercase">
              Thuế (VAT)
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {formatPrice(summary.totalTaxAmount)}
            </span>
          </div>
        )}

        <div className="py-2">
          <div className="border-t-2 border-dashed border-slate-100" />
        </div>

        <div className="flex justify-between items-end pb-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-tighter">
              Tổng thanh toán
            </span>
            <span className="text-[10px] text-slate-600 font-bold italic opacity-70">
              Đã bao gồm phí & voucher
            </span>
          </div>
          <span className="text-4xl font-semibold text-orange-600 tracking-tighter italic leading-none animate-in fade-in zoom-in duration-500">
            {formatPrice(summary.grandTotal || 0)}
          </span>
        </div>
      </div>

      <div className="w-full p-4">
        <ButtonField
        htmlType="submit"
        type="login"
        onClick={onSubmit}
        disabled={loading || !preview.isValid}
        className="flex w-full items-center gap-2 px-5 py-4 rounded-full text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
      >
        <span className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-white group-hover:text-white transition-colors" />
          )}
          <span>{loading ? "Đang xử lý đơn..." : "Xác nhận đặt hàng"}</span>
        </span>
      </ButtonField>
      </div>

      {!preview.isValid && !loading && (
        <p className="mt-4 text-[10px] text-center font-bold text-red-500 uppercase tracking-tight italic">
          * Vui lòng kiểm tra lại thông tin đơn hàng
        </p>
      )}
    </div>
  );
};
