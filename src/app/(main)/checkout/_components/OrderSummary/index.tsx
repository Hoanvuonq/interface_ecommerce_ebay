"use client";

import React, { useMemo } from "react";
import { Info, Loader2, CheckCircle2, Ticket } from "lucide-react";
import { formatPrice } from "@/hooks/useFormatPrice";
import { useCheckoutStore } from "../../_store/useCheckoutStore";

interface OrderSummaryProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const OrderSummary = ({ onSubmit }: OrderSummaryProps) => {
  const preview = useCheckoutStore((state) => state.preview);
  const loading = useCheckoutStore((state) => state.loading);

  const totalDiscountAmount = useMemo(() => {
    if (!preview?.voucherApplication) return 0;
    
    const mainTotal = preview.voucherApplication.totalDiscount || 0;
    const shipping = preview.voucherApplication.shippingDiscountTotal || 0;
    const product = preview.voucherApplication.productDiscountTotal || 0;

    return mainTotal > 0 ? mainTotal : (shipping + product);
  }, [preview]);

  if (!preview) return null;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 sticky top-6 overflow-hidden">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 mb-8 flex items-center gap-2">
        <Info size={18} className="text-orange-500" />
        Chi tiết thanh toán
      </h3>

      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tổng tiền hàng</span>
          <span className="text-sm font-semibold text-slate-900">
            {formatPrice(preview.subtotal || 0)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phí vận chuyển</span>
          <span className="text-sm font-semibold text-slate-900">
            {formatPrice(preview.totalShippingFee || 0)}
          </span>
        </div>

        {/* ✅ Dòng giảm giá: Dùng biến đã cộng dồn ở trên */}
        {totalDiscountAmount > 0 && (
          <div className="flex justify-between items-center py-1 group animate-in fade-in slide-in-from-right-2">
            <div className="flex items-center gap-1.5">
              <Ticket size={14} className="text-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-600 uppercase italic">Voucher giảm giá</span>
            </div>
            <span className="text-sm font-semibold text-red-600 italic">
              -{formatPrice(totalDiscountAmount)}
            </span>
          </div>
        )}

        {/* ✅ FIX: Thuế (VAT) - Bạn đang để formatPrice(preview.grandTotal) là sai */}
        {preview.totalTaxAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thuế (VAT)</span>
            <span className="text-sm font-semibold text-slate-900">
              {formatPrice(preview.totalTaxAmount)}
            </span>
          </div>
        )}

        <div className="py-2">
          <div className="border-t-2 border-dashed border-slate-100" />
        </div>

        <div className="flex justify-between items-end pb-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-tighter">Tổng thanh toán</span>
            <span className="text-[10px] text-slate-400 font-bold italic opacity-70">
              Đã bao gồm phí & voucher
            </span>
          </div>
          <span className="text-4xl font-semibold text-orange-600 tracking-tighter italic leading-none animate-in fade-in zoom-in duration-500">
            {formatPrice(preview.grandTotal || 0)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={loading || !preview.isValid}
        className="w-full mt-10 group relative overflow-hidden bg-slate-950 disabled:bg-slate-200 text-white font-semibold py-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
      >
        <div className="relative z-10 flex justify-center items-center gap-3 uppercase tracking-[0.2em] text-xs">
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors" />
          )}
          <span>{loading ? "Đang xử lý đơn..." : "Xác nhận đặt hàng"}</span>
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>

      {!preview.isValid && !loading && (
        <p className="mt-4 text-[10px] text-center font-bold text-red-500 uppercase tracking-tight italic">
          * Vui lòng kiểm tra lại thông tin đơn hàng
        </p>
      )}
    </div>
  );
};