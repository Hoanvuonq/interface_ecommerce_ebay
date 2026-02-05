"use client";

import { useVoucherLogic } from "@/components/voucher/_hooks/useVoucherLogic";
import { VoucherInputProps } from "@/components/voucher/_types/voucher";
import { formatPrice } from "@/hooks/useFormatPrice";
import { cn } from "@/utils/cn";
import _ from "lodash";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  Ticket,
  Truck,
} from "lucide-react";
import React from "react";
import { VoucherModal } from "../voucherModal";

export const VoucherComponents: React.FC<VoucherInputProps> = (props) => {
  const { compact, shopName, appliedVouchers, forcePlatform, className } =
    props;
  const { state, actions } = useVoucherLogic(props);

  const orderVoucher = appliedVouchers?.order;
  const shipVoucher = appliedVouchers?.shipping;

  const activeOrderCode = orderVoucher?.code;
  const activeShipCode = shipVoucher?.code;

  const orderDiscount = Number(orderVoucher?.discount || 0);
  const shipDiscount = Number(shipVoucher?.discount || 0);

  const hasAnyVoucher = !!activeOrderCode || !!activeShipCode;

  if (compact) {
    return (
      <div className={cn("w-full", className)}>
        {hasAnyVoucher ? (
          <div
            className="bg-white rounded-2xl p-4 border border-emerald-100 cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all group relative overflow-hidden"
            onClick={() => actions.setModalOpen(true)}
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform text-emerald-900 pointer-events-none">
              <Ticket size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">
                    {forcePlatform ? "Hệ thống ưu đãi" : `Voucher ${shopName}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 group-hover:text-orange-500 transition-colors">
                  Thay đổi <ChevronRight size={14} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeOrderCode && (
                  <div className="flex items-center justify-between bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                        <Ticket size={14} />
                      </div>
                      <div className="truncate">
                        <p className="text-[8px] font-bold text-orange-400 uppercase leading-none mb-1">
                          Giảm đơn hàng
                        </p>
                        <p className="text-[11px] font-black text-gray-800 truncate uppercase">
                          {activeOrderCode}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-orange-600">
                      -{formatPrice(orderDiscount)}
                    </span>
                  </div>
                )}

                {activeShipCode && (
                  <div className="flex items-center justify-between bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                        <Truck size={14} />
                      </div>
                      <div className="truncate">
                        <p className="text-[8px] font-bold text-blue-400 uppercase leading-none mb-1">
                          Miễn phí vận chuyển
                        </p>
                        <p className="text-[11px] font-black text-gray-800 truncate uppercase">
                          {activeShipCode}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-blue-600">
                      -{formatPrice(shipDiscount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => actions.setModalOpen(true)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/30 transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-orange-100 transition-all">
                <Ticket className="w-5 h-5 text-slate-400 group-hover:text-orange-500" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1.5">
                  Mã giảm giá
                </p>
                <p className="text-[10px] font-bold text-slate-400">
                  Chọn hoặc nhập mã ưu đãi của {shopName || "shop"}
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-300 group-hover:trangray-x-1 transition-transform"
            />
          </button>
        )}

        <VoucherModal
          open={state.modalOpen}
          shopId={props.shopId}
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
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Ticket
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="NHẬP MÃ GIẢM GIÁ..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/30 outline-none transition-all"
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
          disabled={state.isApplying || !state.voucherCode}
          onClick={() => actions.applyVoucher(state.voucherCode)}
          className="px-8 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-lg shadow-gray-200/50"
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
