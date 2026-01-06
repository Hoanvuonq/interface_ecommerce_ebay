"use client";
import { SectionLoading } from "@/components/loading";
import { Gift, Search, Sparkles, CheckCircle2 } from "lucide-react";
import React, { useMemo } from "react";
import { VoucherCard } from "../voucherCard";
import { ContentProps } from "./type";
import { formatPrice } from "@/hooks/useFormatPrice";
import _ from "lodash";

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

  // 1. Logic tính tiền CHUẨN: maxDiscount > 0 thì cộng maxDiscount, null thì cộng discountValue
  const calculateRealDiscount = (item: any) => {
    if (!item) return 0;
    const v = item.voucher || item;
    
    const discountVal = Number(v.discountValue || v.discountAmount || 0);
    const maxDisc = (v.maxDiscount !== null && v.maxDiscount !== undefined) 
                    ? Number(v.maxDiscount) 
                    : null;

    // Ưu tiên maxDiscount nếu có số
    if (maxDisc !== null && maxDisc > 0) return maxDisc;
    // Ngược lại lấy giá trị gốc
    return discountVal;
  };

  const totalReviewDiscount = useMemo(() => {
    const allVouchers = isGrouped 
      ? [...(groupedVouchers?.shippingVouchers || []), ...(groupedVouchers?.productOrderVouchers || [])]
      : (vouchers || []);

    const orderV = allVouchers.find(v => (v.voucher?.code || v.code) === selectedOrderId);
    const shipV = allVouchers.find(v => (v.voucher?.code || v.code) === selectedShipId);

    return calculateRealDiscount(orderV) + calculateRealDiscount(shipV);
  }, [selectedOrderId, selectedShipId, vouchers, groupedVouchers, isGrouped]);

  if (loading) return <SectionLoading message="Đang tải ưu đãi..." />;

  return (
    /* 2. Fix 2 Scroll: Container chính dùng h-[70vh] và flex-col, KHÔNG dùng overflow-hidden ở đây */
    <div className="flex flex-col h-[70vh] bg-white relative">
      
      {/* SEARCH BAR - CỐ ĐỊNH Ở TRÊN */}
      <div className="flex-none p-4 bg-white border-b border-slate-50 z-20">
        <div className="relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            placeholder="Nhập mã ưu đãi..."
            className="w-full pl-11 pr-24 py-3 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none focus:bg-white focus:shadow-sm transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-orange-500 text-white font-bold text-[10px] rounded-xl active:scale-95 transition-all">
            ÁP DỤNG
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-6 pb-2">
        {isGrouped ? (
          <div className="space-y-10">
            {groupedVouchers.shippingVouchers.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5 ml-1 text-slate-400">
                  <div className="h-1 w-6 bg-emerald-400 rounded-full" />
                  <h5 className="text-[10px] font-bold uppercase tracking-widest">Miễn phí vận chuyển</h5>
                </div>
                <div className="space-y-3">
                  {groupedVouchers.shippingVouchers.map((v: any) => (
                    <VoucherCard
                      key={v.voucher?.id || v.id}
                      voucher={v.voucher || v}
                      type="shipping"
                      isSelected={(v.voucher?.code || v.code) === selectedShipId}
                      onSelect={() => onSelectShip((v.voucher?.code || v.code) === selectedShipId ? undefined : (v.voucher?.code || v.code))}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Order section */}
            {groupedVouchers.productOrderVouchers.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5 ml-1 text-slate-400">
                  <div className="h-1 w-6 bg-orange-400 rounded-full" />
                  <h5 className="text-[10px] font-bold uppercase tracking-widest">Ưu đãi thanh toán</h5>
                </div>
                <div className="space-y-3">
                  {groupedVouchers.productOrderVouchers.map((v: any) => (
                    <VoucherCard
                      key={v.voucher?.id || v.id}
                      voucher={v.voucher || v}
                      type="order"
                      isSelected={(v.voucher?.code || v.code) === selectedOrderId}
                      onSelect={() => onSelectOrder((v.voucher?.code || v.code) === selectedOrderId ? undefined : (v.voucher?.code || v.code))}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {vouchers?.map((v: any) => {
              const code = v.voucher?.code || v.code;
              const isShip = (v.voucher?.voucherScope || v.voucherScope) === "SHIPPING";
              return (
                <VoucherCard
                  key={v.voucher?.id || v.id}
                  voucher={v.voucher || v}
                  type={isShip ? "shipping" : "order"}
                  isSelected={isShip ? selectedShipId === code : selectedOrderId === code}
                  onSelect={() => isShip ? onSelectShip(code) : onSelectOrder(code)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER REVIEW - CỐ ĐỊNH Ở DƯỚI (flex-none) */}
      <div className="flex-none p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${totalReviewDiscount > 0 ? 'bg-orange-500 text-white shadow-orange-200 rotate-3 shadow-md' : 'bg-slate-100 text-slate-300'}`}>
            <Sparkles size={18} className={totalReviewDiscount > 0 ? "animate-pulse" : ""} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Đơn của bạn được giảm</p>
            <p className="text-lg font-black text-slate-900 italic leading-none mt-0.5">
              {totalReviewDiscount > 0 ? `-${formatPrice(totalReviewDiscount)}` : "0đ"}
            </p>
          </div>
        </div>

        {totalReviewDiscount > 0 && (
          <div className="flex flex-col items-end">
            <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm uppercase tracking-tighter">
              <CheckCircle2 size={8} /> Đã tối ưu
            </span>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic tracking-widest">
              {(selectedOrderId ? 1 : 0) + (selectedShipId ? 1 : 0)} mã đã chọn
            </p>
          </div>
        )}
      </div>
    </div>
  );
};