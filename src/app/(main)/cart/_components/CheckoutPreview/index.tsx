"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Truck,
  Tag as TagIcon,
  Store,
  X,
  Loader2,
  ShieldCheck,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import type { OrderPreviewResponse } from "@/types/cart/cart.types";
import { cn } from "@/utils/cn";
import { formatPriceFull } from "@/hooks/useFormatPrice";

interface CheckoutPreviewProps {
  open: boolean;
  onClose: () => void;
  preview: OrderPreviewResponse | null;
  loading?: boolean;
  onConfirm?: () => void;
}

export const CheckoutPreview: React.FC<CheckoutPreviewProps> = ({
  open,
  onClose,
  preview,
  loading = false,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-xl",
                preview?.isValid
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              )}
            >
              {preview?.isValid ? (
                <ShieldCheck size={24} />
              ) : (
                <AlertTriangle size={24} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-tight">
                Xem trước đơn hàng
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Vui lòng kiểm tra kỹ thông tin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-gray-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={40} className="animate-spin text-orange-500" />
              <p className="text-gray-400 font-semibold uppercase tracking-widest text-xs">
                Đang tính toán đơn hàng...
              </p>
            </div>
          ) : (
            preview && (
              <>
                {/* Validation Alerts */}
                {preview.validationErrors &&
                  preview.validationErrors.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 animate-in slide-in-from-top-2">
                      <AlertCircle
                        className="text-red-500 shrink-0"
                        size={20}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-red-700 uppercase">
                          Lỗi đơn hàng
                        </h4>
                        <ul className="list-disc pl-4 mt-1 text-xs text-red-600 space-y-1 font-medium">
                          {preview.validationErrors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                {preview.warnings && preview.warnings.length > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                    <AlertTriangle
                      className="text-amber-500 shrink-0"
                      size={20}
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-700 uppercase">
                        Cảnh báo
                      </h4>
                      <ul className="list-disc pl-4 mt-1 text-xs text-amber-600 space-y-1 font-medium">
                        {preview.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Shop Sections */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
                    Chi tiết từng shop
                  </h4>
                  {preview.shops.map((shop) => (
                    <div
                      key={shop.shopId}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      {/* Shop Sub-header */}
                      <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Store size={16} className="text-gray-400" />
                          <span className="text-sm font-semibold text-gray-800 uppercase tracking-tighter">
                            {shop.shopName}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {shop.itemCount} sản phẩm
                        </span>
                      </div>

                      {/* Items in Shop */}
                      <div className="divide-y divide-gray-50 px-4">
                        {shop.items.map((item, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "py-3 flex justify-between items-center",
                              !item.isAvailable && "opacity-40 grayscale"
                            )}
                          >
                            <div className="min-w-0 flex-1 pr-4">
                              <p className="text-sm font-bold text-gray-900 truncate tracking-tight">
                                {item.productName}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 font-medium italic">
                                <span>Số lượng: {item.quantity}</span>
                                {!item.isAvailable && (
                                  <span className="text-red-500 not-italic font-semibold text-[10px] uppercase underline">
                                    {item.availabilityMessage || "Hết hàng"}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              {formatPriceFull(item.lineTotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Shop Mini-Summary */}
                      <div className="p-4 bg-gray-50/30 border-t border-gray-100 text-xs space-y-2">
                        <div className="flex justify-between font-medium text-gray-500">
                          <span>Tạm tính shop:</span>
                          <span className="text-gray-800">
                            {formatPriceFull(shop.subtotal)}
                          </span>
                        </div>
                        {shop.discount > 0 && (
                          <div className="flex justify-between font-bold text-red-500">
                            <span>Giảm giá shop:</span>
                            <span>-{formatPriceFull(shop.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-gray-900 text-sm pt-1 border-t border-dashed border-gray-200">
                          <span>Tổng Shop:</span>
                          <span className="text-orange-600">
                            {formatPriceFull(shop.shopTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl shadow-gray-200">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <CreditCard size={14} /> Tổng kết đơn hàng
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium text-gray-400">
                      <span>Tạm tính ({preview.totalItems} SP)</span>
                      <span className="text-white">
                        {formatPriceFull(preview.subtotal)}
                      </span>
                    </div>
                    {preview.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm font-bold text-green-400">
                        <span>Tổng voucher & giảm giá</span>
                        <span>-{formatPriceFull(preview.totalDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-medium text-gray-400">
                      <span>Phí vận chuyển toàn quốc</span>
                      <span className="text-white">
                        {formatPriceFull(preview.totalShippingFee)}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                      <span className="text-sm font-semibold uppercase tracking-widest">
                        Thành tiền
                      </span>
                      <span className="text-3xl font-semibold text-orange-500 tracking-tighter">
                        {formatPriceFull(preview.grandTotal)}
                      </span>
                    </div>
                  </div>

                  {preview.loyaltyPointsInfo?.canRedeem && (
                    <div className="mt-6 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0">
                        <TagIcon size={20} className="fill-white" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-blue-400 uppercase leading-none mb-1">
                          Điểm thành viên
                        </p>
                        <p className="text-xs font-medium text-gray-300">
                          Đổi{" "}
                          <span className="text-white font-bold">
                            {preview.loyaltyPointsInfo.pointsToRedeem} điểm
                          </span>{" "}
                          ={" "}
                          <span className="text-white font-bold">
                            {formatPriceFull(
                              preview.loyaltyPointsInfo.discountAmount
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all active:scale-95 uppercase tracking-widest"
          >
            Trở lại
          </button>
          <button
            onClick={onConfirm}
            disabled={!preview?.isValid || loading}
            className={cn(
              "flex-2 py-3.5 text-sm font-semibold text-white rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2",
              preview?.isValid
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            )}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Xác nhận đặt hàng</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
