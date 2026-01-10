"use client";
import { SectionLoading } from "@/components/loading";
import { Gift, Search, Sparkles, CheckCircle2 } from "lucide-react";
import React, { useMemo } from "react";
import { VoucherCard } from "../voucherCard";
import { ContentProps } from "./type";
import { formatPrice } from "@/hooks/useFormatPrice";
import { cn } from "@/utils/cn";
import _ from "lodash";
import { VoucherOption } from "../../_types/voucher";

export const VoucherModalContent: React.FC<ContentProps> = (props) => {
  const {
    loading,
    isGrouped,
    groupedVouchers,
    vouchers,
    selectedOrderId, // Nhận từ tempSelection trong hook
    selectedShipId,  // Nhận từ tempSelection trong hook
    onSelectOrder,
    onSelectShip,
    voucherCode,
    onCodeChange,
    onApplyCode,
    previewData,
    shopId,
  } = props;

  // 1. Tìm dữ liệu voucher thực tế để hiển thị đúng mô tả/giảm giá
  const allVouchersFlat = useMemo(() => {
    return isGrouped 
      ? [...(groupedVouchers?.shippingVouchers || []), ...(groupedVouchers?.productOrderVouchers || [])]
      : (vouchers as VoucherOption[]) || [];
  }, [isGrouped, groupedVouchers, vouchers]);

  // 2. Tính toán TIẾT KIỆM DỰ KIẾN dựa trên những gì đang tick chọn (Real-time)
  const currentTotalSaving = useMemo(() => {
    const orderV = allVouchersFlat.find(v => v.code === selectedOrderId);
    const shipV = allVouchersFlat.find(v => v.code === selectedShipId);
    
    // Ưu tiên dùng calculatedDiscount (số tiền giảm thực tế Backend tính)
    return (orderV?.calculatedDiscount || 0) + (shipV?.calculatedDiscount || 0);
  }, [selectedOrderId, selectedShipId, allVouchersFlat]);

  // 3. Đếm số mã đang chọn
  const selectedCount = useMemo(() => {
    return (selectedOrderId ? 1 : 0) + (selectedShipId ? 1 : 0);
  }, [selectedOrderId, selectedShipId]);
console.log("Debug Selection:", { 
    selectedOrderId, 
    selectedShipId, 
    availableCodes: allVouchersFlat.map(v => v.code) 
});
  if (loading) return <SectionLoading message="Đang tải ưu đãi..." />;

  return (
    <div className="flex flex-col h-[70vh] bg-white relative font-sans">
      {/* SEARCH BAR */}
      <div className="flex-none p-4 bg-white border-b border-gray-50 z-20">
        <form 
          className="relative group" 
          onSubmit={(e) => { e.preventDefault(); onApplyCode?.(voucherCode); }}
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            placeholder="Nhập mã ưu đãi..."
            className="w-full pl-11 pr-24 py-3 bg-gray-50 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:shadow-sm transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-orange-500 text-white font-bold text-[10px] rounded-xl active:scale-95 transition-all"
          >
            ÁP DỤNG
          </button>
        </form>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-4 sm:p-6 pb-2">
        {isGrouped ? (
          <div className="space-y-10">
            {/* Shipping section */}
            {groupedVouchers.shippingVouchers.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5 ml-1">
                  <div className="h-1 w-6 bg-emerald-400 rounded-full" />
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Miễn phí vận chuyển</h5>
                </div>
                <div className="space-y-3">
                  {groupedVouchers.shippingVouchers.map((v) => (
                    <VoucherCard
                      key={v.id}
                      voucher={v}
                      type="shipping"
                      isSelected={v.code === selectedShipId} 
                      onSelect={() => onSelectShip(v.code)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Order section */}
            {groupedVouchers.productOrderVouchers.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5 ml-1">
                  <div className="h-1 w-6 bg-orange-400 rounded-full" />
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Ưu đãi thanh toán</h5>
                </div>
                <div className="space-y-3">
                  {groupedVouchers.productOrderVouchers.map((v) => (
                    <VoucherCard
                      key={v.id}
                      voucher={v}
                      type="order"
                      isSelected={v.code === selectedOrderId}
                      onSelect={() => onSelectOrder(v.code)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-4">
             {allVouchersFlat.length > 0 ? (
               allVouchersFlat.map((v) => {
                const isShip = v.voucherScope === "SHIPPING" || v.voucherType === "SHIPPING";
                const isSelected = isShip ? selectedShipId === v.code : selectedOrderId === v.code;
                return (
                  <VoucherCard
                    key={v.id}
                    voucher={v}
                    type={isShip ? "shipping" : "order"}
                    isSelected={isSelected}
                    onSelect={() => isShip ? onSelectShip(v.code) : onSelectOrder(v.code)}
                  />
                );
              })
             ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <Gift size={48} />
                    <p className="text-xs font-bold mt-2">KHÔNG CÓ MÃ GIẢM GIÁ NÀO</p>
                </div>
             )}
          </div>
        )}
      </div>

      {/* FOOTER REVIEW - THAY ĐỔI THEO LỰA CHỌN TẠM THỜI */}
      <div className="flex-none p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-between z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all", 
            currentTotalSaving > 0 ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-gray-100 text-gray-300"
          )}>
            <Sparkles size={18} className={currentTotalSaving > 0 ? "animate-pulse" : ""} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-600 uppercase leading-tight">Tiết kiệm dự kiến</p>
            <p className="text-lg font-bold text-gray-900 italic leading-none mt-0.5">
              {currentTotalSaving > 0 ? `-${formatPrice(currentTotalSaving)}` : "0đ"}
            </p>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-2">
            <span className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 uppercase">
              <CheckCircle2 size={8} /> {selectedCount} mã đang chọn
            </span>
            <p className="text-[9px] font-bold text-gray-600 uppercase mt-1 italic">Tạm tính trong modal</p>
          </div>
        )}
      </div>
    </div>
  );
};