"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { ChevronDown, Loader2, Ticket } from "lucide-react";
import { formatPrice } from "@/hooks/useFormatPrice";
import { VoucherModal } from "../voucherModal";
import { useVoucherLogic } from "@/hooks/useVoucherLogic";
import _ from "lodash";

export const VoucherComponents: React.FC<any> = (props) => {
  const { compact, shopName, appliedVouchers, appliedVoucher } = props;

  const logic = useVoucherLogic(props);

  const activeOrderVoucher =
    _.get(appliedVouchers, "order") ||
    (appliedVoucher
      ? { code: appliedVoucher.code, discount: appliedVoucher.discount }
      : null);
  const activeShippingVoucher = _.get(appliedVouchers, "shipping");
  const hasAnyVoucher = !!activeOrderVoucher || !!activeShippingVoucher;

  if (compact) {
    return (
      <div className={cn("w-full", props.className)}>
        {hasAnyVoucher ? (
          <div
            className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-all shadow-sm group relative overflow-hidden"
            onClick={() => logic.setModalOpen(true)}
          >
            <div className="absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform text-emerald-600">
              <Ticket size={48} />
            </div>

            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center justify-between border-b border-emerald-200/50 pb-1.5">
                <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">
                  Voucher đang áp dụng
                </p>
                <div className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase">
                  Tốt nhất
                </div>
              </div>

              {_.map(
                [activeOrderVoucher, activeShippingVoucher],
                (v, idx) =>
                  v && (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={cn(
                            "p-1.5 rounded-lg",
                            idx === 0 ? "bg-orange-100" : "bg-blue-100"
                          )}
                        >
                          <Ticket
                            className={cn(
                              "w-3.5 h-3.5",
                              idx === 0 ? "text-orange-500" : "text-blue-500"
                            )}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[9px] font-bold uppercase">
                            {idx === 0 ? "Giảm giá" : "Vận chuyển"}
                          </span>
                          <span className="text-slate-900 font-semibold text-xs truncate uppercase">
                            {v.code}
                          </span>
                        </div>
                      </div>
                      <span className="text-red-600 font-semibold text-sm italic">
                        -{formatPrice(_.get(v, "discount", 0))}
                      </span>
                    </div>
                  )
              )}

              <div className="flex items-center justify-center pt-1">
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 group-hover:underline">
                  <ChevronDown size={10} /> Chạm để thay đổi
                </span>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => logic.setModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-orange-400 hover:text-orange-600 transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 font-semibold uppercase tracking-widest">
              <Ticket className="w-5 h-5 group-hover:rotate-12 transition-transform text-orange-500" />
              <span className="text-[10px]">
                {shopName ? `Voucher ${shopName}` : "Chọn mã giảm giá"}
              </span>
            </div>
            <ChevronDown
              size={16}
              className="group-hover:translate-y-0.5 transition-transform"
            />
          </button>
        )}

        <VoucherModal
          open={logic.modalOpen}
          onClose={() => logic.setModalOpen(false)}
          onConfirm={logic.handleConfirm}
          vouchersData={logic.vouchersData} 
          isLoading={logic.isLoading}
          appliedVouchers={{
            order: activeOrderVoucher,
            shipping: activeShippingVoucher,
          }}
          title={shopName ? `${shopName} Voucher` : "Voucher của bạn"}
          shopName={shopName}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", props.className)}>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nhập mã voucher..."
          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium text-xs uppercase focus:border-orange-500 outline-none transition-all"
          value={logic.voucherCode}
          onChange={(e) => logic.setVoucherCode(e.target.value.toUpperCase())}
        />
        <button
          type="button"
          onClick={() => logic.applyMutation.mutate(logic.voucherCode)}
          disabled={logic.applyMutation.isPending || !logic.voucherCode}
          className="px-6 bg-slate-900 text-white font-semibold text-xs uppercase rounded-xl hover:bg-orange-500 disabled:bg-slate-200 transition-all active:scale-95"
        >
          {logic.applyMutation.isPending ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Áp dụng"
          )}
        </button>
      </div>
    </div>
  );
};
