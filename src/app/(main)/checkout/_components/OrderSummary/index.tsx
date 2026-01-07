"use client";

import { ButtonField } from "@/components";
import { formatPrice } from "@/hooks/useFormatPrice";
import {
  CheckCircle2,
  Info,
  Loader2,
  Store,
  Ticket,
  ChevronDown,
} from "lucide-react";
import React, { useState } from "react";
import { useCheckoutStore } from "../../_store/useCheckoutStore";
import { cn } from "@/utils/cn";

interface OrderSummaryProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const OrderSummary = ({ onSubmit }: OrderSummaryProps) => {
  const preview = useCheckoutStore((state) => state.preview);
  const loading = useCheckoutStore((state) => state.loading);
  const summary = preview?.summary || preview;

  // Thêm state để collapse chi tiết nếu danh sách quá dài
  const [isExpanded, setIsExpanded] = useState(true);

  if (!preview || !summary) return null;

  const totalDiscountAmount = summary.totalDiscount || 0;
  const shops = preview.shops || (preview.data && preview.data.shops) || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-30">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
        <div className="flex items-center gap-2.5">
          <Info size={18} className="text-orange-500" />
          <h2 className="text-sm font-bold uppercase text-gray-900 tracking-tight">
            Chi tiết thanh toán
          </h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-orange-500"
        >
          <ChevronDown
            size={18}
            className={cn("transition-transform", !isExpanded && "-rotate-90")}
          />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {shops.length > 0 && isExpanded && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
              <span>Cửa hàng / Sản phẩm</span>
              <span>Thành tiền</span>
            </div>

            <div className="space-y-3 max-h-75 overflow-y-auto custom-scrollbar pr-1">
              {shops.map((shop: any) => (
                <div
                  key={shop.shopId}
                  className="flex justify-between items-center text-sm group"
                >
                  <div className="flex flex-col gap-1 max-w-[65%]">
                    <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
                      <Store size={14} className="text-orange-500 shrink-0" />
                      <span className="truncate">{shop.shopName}</span>
                    </div>
                    <span className="text-[11px] text-gray-500 pl-5">
                      {shop.items?.length || 0} sản phẩm
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 block">
                      {formatPrice(
                        shop.shopTotal || shop.summary?.subtotal || 0
                      )}
                    </span>
                    {/* {shop.voucherResult?.totalDiscount > 0 && (
                      <span className="text-[10px] text-red-500 block">
                        -{formatPrice(shop.voucherResult.totalDiscount)}
                      </span>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-b-2 border-dashed border-gray-100" />
          </div>
        )}

        <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600">
              Tổng tiền hàng
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(summary.subtotal || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600">
              Phí vận chuyển
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(summary.totalShippingFee || 0)}
            </span>
          </div>

          {summary.totalTaxAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                Thuế (VAT)
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatPrice(summary.totalTaxAmount)}
              </span>
            </div>
          )}

          {/* Highlight phần giảm giá */}
          {totalDiscountAmount > 0 && (
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Ticket size={14} />
                <span className="text-xs font-bold uppercase">
                  Tổng giảm giá
                </span>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                -{formatPrice(totalDiscountAmount)}
              </span>
            </div>
          )}
        </div>

        {/* --- PHẦN 3: TỔNG THANH TOÁN (To & Rõ) --- */}
        <div className="flex justify-between items-end pt-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 uppercase">
              Tổng thanh toán
            </span>
            <span className="text-[10px] text-gray-500 font-medium italic">
              (Đã bao gồm VAT & Phí)
            </span>
          </div>
          <span className="text-3xl font-bold text-orange-600 tracking-tight leading-none">
            {formatPrice(summary.grandTotal || 0)}
          </span>
        </div>
      </div>

      <div className="p-5 bg-gray-50 border-t border-gray-100">
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

        {!preview.isValid && !loading && (
          <p className="mt-3 text-[11px] text-center font-bold text-red-500 uppercase tracking-tight bg-red-50 py-2 rounded-lg border border-red-100">
            * Vui lòng kiểm tra lại thông tin đơn hàng
          </p>
        )}
      </div>
    </div>
  );
};
