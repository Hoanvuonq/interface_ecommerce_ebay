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

  const [isExpanded, setIsExpanded] = useState(true);

  if (!preview || !summary) return null;

  const totalDiscountAmount = summary.totalDiscount || 0;
  const shops = preview.shops || (preview.data && preview.data.shops) || [];

  const hasMultipleShops = shops.length > 1;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden sticky top-30 transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-gray-900" />
          <h2 className="text-sm font-bold uppercase  text-gray-900">
            Chi tiết thanh toán
          </h2>
        </div>
        {hasMultipleShops && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-orange-500 p-1 transition-colors"
          >
            <ChevronDown
              size={20}
              className={cn(
                "transition-transform duration-300",
                !isExpanded && "-rotate-180"
              )}
            />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {hasMultipleShops && isExpanded && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] pb-2 border-b border-gray-50">
              <span>Cửa hàng / Sản phẩm</span>
              <span>Thành tiền</span>
            </div>

            <div className="space-y-4 max-h-75 overflow-y-auto custom-scrollbar pr-1">
              {shops.map((shop: any) => (
                <div
                  key={shop.shopId}
                  className="flex justify-between items-start text-sm group"
                >
                  <div className="flex flex-col gap-1 max-w-[60%]">
                    <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                      <Store size={14} className="text-orange-500 shrink-0" />
                      <span className="truncate">{shop.shopName}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium pl-5">
                      {shop.items?.length || 0} sản phẩm
                    </span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="font-bold text-gray-800 block">
                      {formatPrice(
                        shop.shopTotal || shop.summary?.shopTotal || 0
                      )}
                    </span>
                    <div className="flex flex-col gap-0">
                      <span className="text-[10px] text-gray-400">
                        Ship: {formatPrice(shop.summary?.shippingFee)}
                      </span>
                      {shop.voucherResult?.totalDiscount > 0 && (
                        <span className="text-[10px] text-rose-500 font-bold">
                          Giảm: -{formatPrice(shop.voucherResult.totalDiscount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-b border-dashed border-gray-200" />
          </div>
        )}

        <div className="space-y-3.5 bg-gray-50/80 p-5 rounded-2xl border border-gray-100/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Tổng tiền hàng</span>
            <span className="font-bold text-gray-800">
              {formatPrice(summary.subtotal || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Phí vận chuyển</span>
            <span className="font-bold text-gray-800">
              {formatPrice(summary.totalShippingFee || 0)}
            </span>
          </div>

          {summary.totalTaxAmount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Thuế (VAT)</span>
              <span className="font-bold text-gray-800">
                {formatPrice(summary.totalTaxAmount)}
              </span>
            </div>
          )}

          {totalDiscountAmount > 0 && (
            <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200 mt-2">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Ticket size={14} strokeWidth={2.5} />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Tổng giảm giá
                </span>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                -{formatPrice(totalDiscountAmount)}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end py-2">
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-gray-800 uppercase tracking-tight">
              Tổng thanh toán
            </span>
            <span className="text-[10px] text-gray-400 font-medium italic">
              (Đã bao gồm VAT & Phí)
            </span>
          </div>
          <span className="text-3xl font-bold text-orange-600 tracking-tighter leading-none">
            {formatPrice(summary.grandTotal || 0)}
          </span>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-50">
        <ButtonField
          htmlType="submit"
          type="login"
          onClick={onSubmit}
          disabled={loading || !preview.isValid}
          className="flex w-full items-center justify-center gap-3 px-6 py-4 rounded-full text-[14px] font-bold shadow-xl shadow-orange-500/20 transition-all active:scale-95 border-0 h-12"
        >
          <span className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>{loading ? "Đang xử lý đơn..." : "Xác nhận đặt hàng"}</span>
          </span>
        </ButtonField>

        {!preview.isValid && !loading && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
            <Info size={14} className="text-rose-500 mt-0.5 shrink-0" />
            <p className="text-[11px] font-bold text-rose-600 leading-tight">
              VUI LÒNG KIỂM TRA LẠI THÔNG TIN ĐƠN HÀNG
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
