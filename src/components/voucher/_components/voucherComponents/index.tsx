"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { ChevronDown, Loader2, Ticket, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/hooks/useFormatPrice";
import { VoucherModal } from "../voucherModal";
import { useVoucherLogic } from "@/components/voucher/_hooks/useVoucherLogic";
import _ from "lodash";
import {
  GroupedVouchers,
  VoucherInputProps,
  VoucherOption,
} from "@/components/voucher/_types/voucher";

export const VoucherComponents: React.FC<VoucherInputProps> = (props) => {
  const { compact, shopName, appliedVouchers, forcePlatform, className } =
    props;
  const { state, actions } = useVoucherLogic(props);

  const activeOrderVoucherCode =
    _.get(appliedVouchers, "order.voucherCode") ||
    _.get(appliedVouchers, "order.code");

  const activeShippingVoucherCode =
    _.get(appliedVouchers, "shipping.voucherCode") ||
    _.get(appliedVouchers, "shipping.code");

  const orderDiscount = _.get(appliedVouchers, "order.discountAmount", 0);
  const shipDiscount = _.get(appliedVouchers, "shipping.discountAmount", 0);

  const hasAnyVoucher = !!activeOrderVoucherCode || !!activeShippingVoucherCode;

  if (compact) {
    return (
      <div className={cn("w-full", className)}>
        {hasAnyVoucher ? (
          <div
            className="bg-emerald-50 rounded-2xl py-2 px-3 border border-emerald-100 cursor-pointer hover:bg-emerald-100/50 transition-all shadow-sm group relative overflow-hidden"
            onClick={() => actions.setModalOpen(true)}
          >
            <div className="absolute -right-2 -top-2 opacity-5 group-hover:rotate-12 transition-transform text-emerald-600 pointer-events-none">
              <Ticket size={48} />
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between border-b border-emerald-200/30 pb-2">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 size={12} />
                  {forcePlatform
                    ? "Voucher Hệ Thống"
                    : `Ưu đãi từ ${shopName || "Shop"}`}
                </p>
                <div className="bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter animate-in fade-in zoom-in">
                  Đã áp dụng
                </div>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    code: activeOrderVoucherCode,
                    label: "Giảm đơn hàng",
                    color: "orange",
                    discount: Number(orderDiscount),
                  },
                  {
                    code: activeShippingVoucherCode,
                    label: "Miễn phí vận chuyển",
                    color: "blue",
                    discount: Number(shipDiscount),
                  },
                ].map(
                  (v, idx) =>
                    v.code && (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white/80 py-2 px-3 rounded-xl border border-emerald-50 shadow-sm backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={cn(
                              "p-1.5 rounded-lg shrink-0",
                              v.color === "orange"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-blue-100 text-blue-600"
                            )}
                          >
                            <Ticket size={12} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-gray-600 text-[7px] font-semibold uppercase -tracking-tighter leading-none mb-1">
                              {v.label}
                            </span>
                            <span className="text-gray-800 font-semibold text-[10px] truncate uppercase tracking-tighter">
                              {v.code}
                            </span>
                          </div>
                        </div>

                        {v.discount > 0 ? (
                          <span className="text-red-500 font-semibold text-[11px] shrink-0 italic">
                            -{formatPrice(v.discount)}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[9px] shrink-0 uppercase italic">
                            Đã tối ưu
                          </span>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => actions.setModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-gray-300 hover:text-orange-600 hover:bg-white transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 font-bold uppercase tracking-widest">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-orange-50 transition-all">
                <Ticket className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-[10px] tracking-tight">
                {shopName ? `Mã giảm giá ${shopName}` : "Chọn mã giảm giá"}
              </span>
            </div>
            <ChevronDown
              size={14}
              className="group-hover:trangray-y-0.5 transition-transform"
            />
          </button>
        )}

        <VoucherModal
          open={state.modalOpen}
          shopId={props.shopId}
          onClose={() => actions.setModalOpen(false)}
          onConfirm={actions.handleConfirm}
          shopName={shopName}
          onFetchVouchers={async () => {
            return state.vouchersData;
          }}
          vouchersData={state.vouchersData}
          isLoading={state.isLoading}
          appliedVouchers={appliedVouchers}
          isPlatform={forcePlatform}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Ticket
            size={14}
            className="absolute left-4 top-1/2 -trangray-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors pointer-events-none"
          />
          <input
            type="text"
            placeholder="NHẬP MÃ GIẢM GIÁ..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-[11px] uppercase tracking-wider focus:border-gray-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-gray-500"
            value={state.voucherCode}
            onChange={(e) =>
              actions.setVoucherCode(e.target.value.toUpperCase())
            }
            onKeyDown={(e) =>
              e.key === "Enter" && actions.applyVoucher(state.voucherCode)
            }
          />
        </div>
        <button
          type="button"
          onClick={() => actions.applyVoucher(state.voucherCode)}
          disabled={state.isApplying || !state.voucherCode}
          className="px-6 bg-gray-900 text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-orange-600 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95 shadow-lg shadow-gray-200"
        >
          {state.isApplying ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Áp dụng"
          )}
        </button>
      </div>

      <VoucherModal
        open={state.modalOpen}
        onClose={() => actions.setModalOpen(false)}
        onConfirm={actions.handleConfirm}
        shopName={shopName}
        onFetchVouchers={async () => state.vouchersData}
        vouchersData={state.vouchersData}
        isLoading={state.isLoading}
        appliedVouchers={appliedVouchers}
        isPlatform={forcePlatform}
      />
    </div>
  );
};
