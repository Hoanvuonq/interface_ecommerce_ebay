"use client";
import React, { useMemo } from "react";
import _ from "lodash";
import { CheckCircle2, Gift, Sparkles } from "lucide-react";
import { SearchComponent } from "@/components/custom";
import { SectionLoading } from "@/components/loading";
import { formatPrice } from "@/hooks/useFormatPrice";
import { cn } from "@/utils/cn";
import { VoucherCard } from "../voucherCard";
import { flattenVoucher } from "../../_utils/voucher.mapper";

export const VoucherModalContent: React.FC<any> = (props) => {
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
    onApplyCode,
  } = props;

  const categorized = useMemo(() => {
    const rawList = isGrouped
      ? [
          ...(groupedVouchers?.shippingVouchers || []),
          ...(groupedVouchers?.productOrderVouchers || []),
        ]
      : (vouchers as any[]) || [];

    const allFlat = _.chain(rawList)
      .map(flattenVoucher)
      .filter((v): v is any => v !== null)
      .uniqBy("code")
      .value();

    const shipping = allFlat.filter(
      (v) =>
        v.voucherScope === "SHIPPING" ||
        v.voucherType === "SHIPPING" ||
        v.code.toUpperCase().includes("SHIP") ||
        v.code.toUpperCase().includes("FREE"),
    );

    const order = allFlat.filter(
      (v) => !shipping.find((s) => s.code === v.code),
    );

    return { shipping, order, all: allFlat };
  }, [isGrouped, groupedVouchers, vouchers]);

  const currentTotalSaving = useMemo(() => {
    const orderV = _.find(categorized.order, { code: selectedOrderId });
    const shipV = _.find(categorized.shipping, { code: selectedShipId });
    return (
      Number(orderV?.calculatedDiscount || 0) +
      Number(shipV?.calculatedDiscount || 0)
    );
  }, [selectedOrderId, selectedShipId, categorized]);

  if (loading) return <SectionLoading message="Đang tìm ưu đãi tốt nhất..." />;

  return (
    <div className="flex flex-col bg-white relative">
      <div className="flex-none p-5 bg-white border-b border-gray-50 z-20">
        <div className="flex items-center gap-3">
          <SearchComponent
            value={voucherCode}
            onChange={onCodeChange}
            onEnter={() => onApplyCode?.(voucherCode)}
            placeholder="Nhập mã ưu đãi..."
            size="md"
            className="flex-1"
          />
          <button
            onClick={() => onApplyCode?.(voucherCode)}
            className="px-6 h-12 bg-gray-900 text-white font-bold text-[10px] uppercase rounded-2xl active:scale-95 transition-all"
          >
            ÁP DỤNG
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-5 pb-2">
        <div className="space-y-10">
          {/* MỤC VẬN CHUYỂN */}
          {categorized.shipping.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5 ml-1">
                <div className="h-1.5 w-6 bg-emerald-500 rounded-full" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                  Miễn phí vận chuyển
                </h5>
              </div>
              <div className="space-y-3">
                {categorized.shipping.map((v) => (
                  <VoucherCard
                    key={v.id || v.code}
                    voucher={v}
                    type="shipping"
                    isSelected={v.code === selectedShipId}
                    onSelect={() => onSelectShip(v.code)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* MỤC ĐƠN HÀNG */}
          {categorized.order.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5 ml-1">
                <div className="h-1.5 w-6 bg-orange-500 rounded-full" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                  Ưu đãi thanh toán
                </h5>
              </div>
              <div className="space-y-3">
                {categorized.order.map((v) => (
                  <VoucherCard
                    key={v.id || v.code}
                    voucher={v}
                    type="order"
                    isSelected={v.code === selectedOrderId}
                    onSelect={() => onSelectOrder(v.code)}
                  />
                ))}
              </div>
            </section>
          )}

          {categorized.all.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 opacity-20">
              <Gift size={64} strokeWidth={1} />
              <p className="text-[10px] font-bold mt-4 uppercase tracking-widest">
                Không có mã giảm giá nào
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-none p-5 bg-white border-t border-gray-100 flex items-center justify-between z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              currentTotalSaving > 0
                ? "bg-orange-500 text-white shadow-xl rotate-6"
                : "bg-gray-100 text-gray-400",
            )}
          >
            <Sparkles
              size={22}
              className={currentTotalSaving > 0 ? "animate-pulse" : ""}
            />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase">
              Tiết kiệm dự kiến
            </p>
            <p className="text-xl font-black text-gray-900 italic mt-1">
              -{formatPrice(currentTotalSaving)}
            </p>
          </div>
        </div>
        {(selectedOrderId ? 1 : 0) + (selectedShipId ? 1 : 0) > 0 && (
          <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-xl flex items-center gap-1.5 uppercase shadow-sm">
            <CheckCircle2 size={10} />{" "}
            {(selectedOrderId ? 1 : 0) + (selectedShipId ? 1 : 0)} mã đã chọn
          </span>
        )}
      </div>
    </div>
  );
};
