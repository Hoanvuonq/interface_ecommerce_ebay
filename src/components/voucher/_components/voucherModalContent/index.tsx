"use client";
import { SectionLoading } from "@/components/loading";
import { Gift, Search } from "lucide-react";
import React from "react";
import { VoucherCard } from "../voucherCard";
import { ContentProps } from "./type";

export const VoucherModalContent: React.FC<ContentProps> = (props) => {
  const {
    loading,
    isGrouped,
    groupedVouchers,
    vouchers,
    selectedOrderId,
    selectedShipId,
    onSelectOrder,
    onSelectShip,
    voucherCode,
    onCodeChange,
  } = props;

  if (loading) return <SectionLoading message="Đang tải ưu đãi..." />;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 bg-white border-b border-slate-50 shadow-sm relative z-10">
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
          />
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            placeholder="Nhập mã ưu đãi..."
            className="w-full pl-11 pr-24 py-4 bg-slate-50 rounded-2xl text-[11px] font-bold transition-all outline-none border-none focus:bg-white focus:shadow-xl focus:shadow-orange-500/5"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] rounded-xl shadow-lg shadow-orange-100 active:scale-95 transition-all">
            ÁP DỤNG
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto max-h-[55vh] scrollbar-hide bg-[#f8fafc]">
        {isGrouped ? (
          <div className="space-y-10">
            {groupedVouchers.shippingVouchers.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5 ml-1">
                  <div className="h-1 w-6 bg-emerald-400 rounded-full" />
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Miễn phí vận chuyển
                  </h5>
                </div>
                {groupedVouchers.shippingVouchers.map((v) => (
                  <VoucherCard
                    key={v.id}
                    voucher={v}
                    type="shipping" 
                    isSelected={
                      selectedShipId === v.code || selectedShipId === v.id
                    }
                    onSelect={() =>
                      onSelectShip(
                        selectedShipId === v.code ? undefined : v.code
                      )
                    }
                  />
                ))}
              </section>
            )}

            {groupedVouchers.productOrderVouchers.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5 ml-1">
                  <div className="h-1 w-6 bg-orange-400 rounded-full" />
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Ưu đãi thanh toán
                  </h5>
                </div>
                {groupedVouchers.productOrderVouchers.map((v) => (
                  <VoucherCard
                    key={v.id}
                    voucher={v}
                    type="order" 
                    isSelected={
                      selectedOrderId === v.code || selectedOrderId === v.id
                    }
                    onSelect={() =>
                      onSelectOrder(
                        selectedOrderId === v.code ? undefined : v.code
                      )
                    }
                  />
                ))}
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {vouchers && vouchers.length > 0 ? (
              vouchers.map((v) => (
                <VoucherCard
                  key={v.id}
                  voucher={v}
                  type="order" 
                  isSelected={
                    selectedOrderId === v.code || selectedOrderId === v.id
                  }
                  onSelect={() =>
                    onSelectOrder(
                      selectedOrderId === v.code ? undefined : v.code
                    )
                  }
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-20 italic">
                <Gift
                  size={60}
                  strokeWidth={1}
                  className="text-slate-700 mb-4"
                />
                <p className="font-bold text-slate-700 uppercase text-[9px] tracking-widest">
                  Danh sách trống
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
