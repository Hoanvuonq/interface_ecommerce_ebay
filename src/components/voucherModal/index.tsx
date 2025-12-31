"use client";

import React from "react";
import { PortalModal } from "@/features/PortalModal";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { VoucherOption } from "@/services/voucher/voucher.service";
import { cn } from "@/utils/cn";
import {
  AlertCircle,
  Gift,
  Loader2,
  Tag as TagIcon,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { VoucherModalProps } from "../voucherComponents/type";
import { Button } from "../button/button";
import { ButtonField } from "../buttonField";
import { FaSave } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useVoucherModalLogic } from "@/hooks/useVoucherModalLogic";

export const VoucherModal: React.FC<VoucherModalProps> = (props) => {
  const { open, onClose, title, shopName, isShopVoucher } = props;
  const { state, actions } = useVoucherModalLogic(props);

  const renderCard = (voucher: VoucherOption, type: "order" | "shipping") => {
    const isSelected =
      type === "order"
        ? state.selectedOrderVoucherId === voucher.id ||
          state.selectedOrderVoucherId === voucher.code
        : state.selectedShippingVoucherId === voucher.id ||
          state.selectedShippingVoucherId === voucher.code;

    const isShipping =
      type === "shipping" || voucher.code?.toLowerCase().includes("ship");

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          if (voucher.canSelect === false) return;
          const setter =
            type === "order"
              ? actions.setSelectedOrderVoucherId
              : actions.setSelectedShippingVoucherId;
          setter(isSelected ? undefined : voucher.id || voucher.code);
        }}
        className={cn(
          "relative flex bg-white mb-2.5 rounded-xl border-2 transition-all cursor-pointer overflow-hidden active:scale-[0.98]",
          isSelected
            ? "border-orange-500 bg-orange-50/20"
            : "border-slate-100 hover:border-orange-200",
          voucher.canSelect === false &&
            "opacity-60 grayscale cursor-not-allowed"
        )}
      >
        <div
          className={cn(
            "w-20 shrink-0 flex flex-col items-center justify-center p-2 text-white relative",
            isShipping ? "bg-cyan-500" : "bg-[#c26d4b]"
          )}
        >
          {isShipping ? <Truck size={22} /> : <TagIcon size={22} />}
          <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">
            {isShipping ? "Vận chuyển" : "Giảm giá"}
          </span>
          <div className="absolute top-0 bottom-0 -right-1 w-2 flex flex-col justify-around">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white -mr-1"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 p-3 min-w-0 flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-[11px] truncate uppercase tracking-tight">
                {voucher.code}
              </h4>
              <p className="text-[#c26d4b] font-black text-xs">
                {voucher.discountType === "PERCENTAGE"
                  ? `Giảm ${voucher.discountAmount}%`
                  : `Giảm ${formatPriceFull(voucher.discountAmount || 0)}`}
              </p>
            </div>
            {isSelected && (
              <CheckCircle2 size={16} className="text-orange-500 shrink-0" />
            )}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
              Tối thiểu {formatPriceFull(voucher.minOrderValue || 0)}
            </p>
            {voucher.canSelect === false && (
              <span className="text-[8px] text-red-500 font-bold flex items-center gap-0.5">
                <AlertCircle size={8} /> Hết hạn/Không đủ đ/k
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      className="max-h-[60vh]!"
      title={
        <span className="font-bold uppercase text-sm tracking-tight text-slate-800">
          {title || (isShopVoucher ? `${shopName} Voucher` : "Chọn mã ưu đãi")}
        </span>
      }
      footer={
        <div className="flex w-full gap-2 px-2 ">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-slate-200 h-11! text-[11px]"
            onClick={onClose}
          >
            TRỞ LẠI
          </Button>
          <ButtonField
            htmlType="button"
            type="login"
            onClick={actions.handleConfirm}
            className="flex-1 h-11 "
          >
            <span className="flex items-center gap-2 justify-center font-bold uppercase text-[10px] tracking-widest text-white">
              <FaSave /> SỬ DỤNG NGAY
            </span>
          </ButtonField>
        </div>
      }
      width="max-w-md"
    >
      <div className="p-4 bg-white border-b border-slate-50">
        <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-orange-500 transition-all">
          <input
            type="text"
            value={state.voucherCode}
            onChange={(e) =>
              actions.setVoucherCode(e.target.value.toUpperCase())
            }
            placeholder="NHẬP MÃ ƯU ĐÃI..."
            className="flex-1 px-3 py-2 bg-transparent text-[11px] font-bold outline-none uppercase placeholder:text-slate-300"
          />
          <button className="px-4 py-2 bg-orange-600 text-white font-black text-[9px] rounded-lg active:scale-95 transition-all">
            ÁP DỤNG
          </button>
        </div>
      </div>

      <div className="overflow-y-auto p-4 min-h-87.5 max-h-[55vh] bg-slate-50/30 custom-scrollbar">
        {state.loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-[#c26d4b]" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              Đang tìm ưu đãi...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {state.isGrouped ? (
              <div className="space-y-6">
                {state.groupedVouchers.productOrderVouchers.length > 0 && (
                  <section>
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1 flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#c26d4b] rounded-full" /> Giảm
                      giá đơn hàng
                    </h5>
                    {state.groupedVouchers.productOrderVouchers.map((v) =>
                      renderCard(v, "order")
                    )}
                  </section>
                )}
                {state.groupedVouchers.shippingVouchers.length > 0 && (
                  <section>
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1 flex items-center gap-2">
                      <div className="w-1 h-1 bg-cyan-500 rounded-full" /> Vận
                      chuyển
                    </h5>
                    {state.groupedVouchers.shippingVouchers.map((v) =>
                      renderCard(v, "shipping")
                    )}
                  </section>
                )}
              </div>
            ) : state.vouchers.length > 0 ? (
              <div className="space-y-2">
                {state.vouchers.map((v) => renderCard(v, "order"))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <Gift size={48} className="text-slate-300 mb-3" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-[9px]">
                  Không có mã khả dụng
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </PortalModal>
  );
};
