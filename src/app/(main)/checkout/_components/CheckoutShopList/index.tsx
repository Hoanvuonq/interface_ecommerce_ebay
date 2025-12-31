"use client";

import React from "react";
import { Store, Ticket, Gift, Sparkles } from "lucide-react";
import { ItemImage } from "@/components/ItemImage";
import { formatPrice } from "@/hooks/useFormatPrice";
import { ShopShippingSelector } from "../ShopShippingSelector";
import { VoucherComponents } from "@/components/voucherComponents";
import { useCheckoutActions } from "../../_hooks/useCheckoutActions";
import { ShopLoyaltySection } from "../ShopLoyaltySection";

interface CheckoutShopListProps {
  shops: any[];
  voucherApplication: any;
  loading: boolean;
  updateShippingMethod: (shopId: string, methodCode: string) => void;
  request: any;
}

export const CheckoutShopList: React.FC<CheckoutShopListProps> = ({
  shops,
  voucherApplication,
  loading,
  updateShippingMethod,
  request,
}) => {
  const { syncPreview } = useCheckoutActions();

  const handleSelectShopVoucher = async (
    shopId: string,
    selectedVoucher: any
  ): Promise<boolean> => {
    const voucherCode =
      selectedVoucher?.order?.code || selectedVoucher?.code || null;

    const updatedShops = request.shops.map((s: any) => {
      if (s.shopId === shopId) {
        return {
          ...s,
          vouchers: voucherCode ? [voucherCode] : [],
        };
      }
      return s;
    });

    await syncPreview({ ...request, shops: updatedShops });
    return true;
  };

  return (
    <div className="space-y-6">
      {shops.map((shop) => {
        const shopVoucherResult = voucherApplication?.shopResults?.find(
          (res: any) => res.shopId === shop.shopId
        );

        const discountAmount = shopVoucherResult?.totalDiscount || 0;
        const finalShopTotal = shop.shopTotal;
        const loyalty = shop.loyaltyInfo;

        return (
          <div
            key={shop.shopId}
            className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Store className="text-[#c26d4b]" size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                {shop.shopName}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="divide-y divide-slate-50">
                {shop.items.map((item: any) => (
                  <div
                    key={item.itemId}
                    className="flex gap-4 items-center py-4 first:pt-0 last:pb-0 group"
                  >
                    <ItemImage
                      item={item}
                      className="w-16 h-16 rounded-2xl border border-slate-50 object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate uppercase">
                        {item.productName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold italic">
                        {item.variantAttributes}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-lg">
                          x{item.quantity}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {formatPrice(item.lineTotal || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-4">
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                    Vận chuyển & Ưu đãi
                  </p>
                  <ShopShippingSelector
                    shopId={shop.shopId}
                    shopName={shop.shopName}
                    availableOptions={shop.availableShippingOptions || []}
                    selectedMethodCode={shop.selectedShippingMethod}
                    isLoading={loading}
                    onMethodChange={updateShippingMethod}
                  />
                </div>
                <div className="flex w-full items-start gap-4">
                  <div className="w-1/2">
                    <VoucherComponents
                      compact
                      shopId={shop.shopId}
                      shopName={shop.shopName}
                      onSelectVoucher={(v) =>
                        handleSelectShopVoucher(shop.shopId, v)
                      }
                      appliedVouchers={{
                        order:
                          shopVoucherResult?.discountDetails?.[0]?.voucherCode,
                      }}
                      context={{
                        totalAmount: shop.subtotal,
                        shopIds: [shop.shopId],
                      }}
                    />
                  </div>
                  <div className="w-1/2">
                    <ShopLoyaltySection loyalty={shop.loyaltyInfo} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Tổng cộng shop
                </span>
                {discountAmount > 0 && (
                  <p className="text-[10px] text-red-500 font-medium">
                    Đã giảm: -{formatPrice(discountAmount)}
                  </p>
                )}
              </div>
              <div className="text-right">
                {discountAmount > 0 && (
                  <p className="text-[10px] text-slate-400 line-through mb-1">
                    {formatPrice(shop.subtotal + (shop.shippingFee || 0))}
                  </p>
                )}
                <span className="text-2xl font-black text-[#c26d4b] tracking-tighter">
                  {formatPrice(finalShopTotal)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
