"use client";

import { ItemImage } from "@/components/ItemImage";
import { VoucherComponents } from "@/components/voucher/_components/voucherComponents";
import { formatPrice } from "@/hooks/useFormatPrice";
import _ from "lodash";
import { Store } from "lucide-react";
import React, { useMemo } from "react";
import { useCheckoutActions } from "../../_hooks/useCheckoutActions";
import { ShopLoyaltySection } from "../ShopLoyaltySection";
import { ShopShippingSelector } from "../ShopShippingSelector";
import { TotalAmountCheckoutList } from "../TotalAmountCheckoutList";

interface CheckoutShopListProps {
  shops: any[];
  voucherApplication: any;
  loading: boolean;
  updateShippingMethod: (shopId: string, methodCode: string) => void;
  request: any;
  preview: any;
}

export const CheckoutShopList: React.FC<CheckoutShopListProps> = ({
  shops,
  voucherApplication,
  loading,
  updateShippingMethod,
  request,
  preview,
}) => {
  const { syncPreview } = useCheckoutActions();

  const handleSelectShopVoucher = async (
    shopId: string,
    selected: any
  ): Promise<boolean> => {
    const voucherCode = selected?.order?.code || selected?.code || null;

    const updatedShops = request.shops.map((s: any) => {
      if (s.shopId === shopId) {
        return {
          ...s,
          vouchers: voucherCode ? [voucherCode] : [],
        };
      }
      return s;
    });

    const currentGlobalVouchers = request.globalVouchers || [];

    const result = await syncPreview({
      ...request,
      shops: updatedShops,
      globalVouchers: currentGlobalVouchers,
    });

    return !!result;
  };

  const handleSelectPlatformVoucher = async (
    shopId: string,
    selected: any
  ): Promise<boolean> => {
    const newCodes = [selected?.order?.code, selected?.shipping?.code].filter(
      Boolean
    ) as string[];

    const updatedShops = request.shops.map((s: any) => {
      if (s.shopId === shopId) {
        return {
          ...s,
          globalVouchers: newCodes,
        };
      }
      return s;
    });

    const result = await syncPreview({
      ...request,
      shops: updatedShops,
    });

    return !!result;
  };
  return (
    <div className="space-y-6">
      {shops.map((shop) => {
        const shopSummary = _.get(shop, "summary", {});
        const subtotal = Number(shopSummary.subtotal || 0);
        const shippingFee = Number(shopSummary.shippingFee || 0);

        const voucherResult = _.get(shop, "voucherResult", {});
        const totalDiscount = Number(voucherResult.totalDiscount || 0);

        const shipDiscount =
          _.chain(voucherResult.discountDetails)
            .filter(
              (d: any) =>
                d.discountTarget === "SHIPPING" || d.discountTarget === "SHIP"
            )
            .sumBy("discountAmount")
            .value() || 0;

        const productOrOrderDiscount = totalDiscount - shipDiscount;

        const originalShopPrice = subtotal + shippingFee;
        const finalShopTotal = Number(
          shopSummary.shopTotal || originalShopPrice - totalDiscount
        );

        const discountDetails = _.get(voucherResult, "discountDetails", []);

        return (
          <div
            key={shop.shopId}
            className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-orange-600">
                  <Store size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                  {shop.shopName}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div className="divide-y divide-slate-50">
                {shop.items.map((item: any) => (
                  <div
                    key={item.itemId}
                    className="flex gap-4 items-center py-4 group"
                  >
                    <ItemImage
                      item={item}
                      className="w-16 h-16 rounded-2xl border border-slate-50 object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-700 truncate uppercase tracking-wide">
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

              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase ">
                    Vận chuyển
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

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase ">
                    Ưu đãi mã giảm giá
                  </p>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <VoucherComponents
                        compact
                        shopId={shop.shopId}
                        shopName={shop.shopName}
                        onSelectVoucher={(v: any) =>
                          handleSelectShopVoucher(shop.shopId, v)
                        }
                        appliedVouchers={{
                          order: _.find(
                            discountDetails,
                            (d: any) =>
                              d.voucherType === "SHOP" &&
                              ["ORDER", "PRODUCT"].includes(d.discountTarget)
                          ),
                        }}
                        context={{
                          totalAmount: subtotal,
                          shippingFee: shippingFee,
                          items: shop.items.map((item: any) => ({
                            productId: item.productId,
                            shopId: shop.shopId,
                            unitPrice: item.unitPrice, // Theo JSON response là unitPrice
                            quantity: item.quantity,
                            lineTotal: item.lineTotal,
                          })),
                          shippingProvince:
                            preview?.buyerAddressData?.province || "",
                          shippingDistrict:
                            preview?.buyerAddressData?.district || "",
                          shippingWard: preview?.buyerAddressData?.ward || "",
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <VoucherComponents
                        compact
                        forcePlatform
                        onSelectVoucher={(selected: any) =>
                          handleSelectPlatformVoucher(shop.shopId, selected)
                        }
                        appliedVouchers={{
                          order: _.find(
                            discountDetails,
                            (d: any) =>
                              d.voucherType === "PLATFORM" &&
                              ["ORDER", "PRODUCT"].includes(d.discountTarget)
                          ),
                          shipping: _.find(
                            discountDetails,
                            (d: any) =>
                              d.voucherType === "PLATFORM" &&
                              ["SHIPPING", "SHIP"].includes(d.discountTarget)
                          ),
                        }}
                        context={{
                          totalAmount: subtotal,
                          shippingFee: shippingFee,
                          shopIds: [shop.shopId],
                          productIds: shop.items.map((i: any) => i.itemId),
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full gap-2 items-end">
                  <ShopLoyaltySection loyalty={shop.loyaltyInfo} />
                  <ShopLoyaltySection loyalty={shop.loyaltyInfo} />
                </div>
              </div>
            </div>
            <TotalAmountCheckoutList
              originalShopPrice={originalShopPrice}
              finalShopTotal={finalShopTotal}
              totalDiscount={totalDiscount}
              productOrOrderDiscount={productOrOrderDiscount}
              shipDiscount={shipDiscount}
            />
          </div>
        );
      })}
    </div>
  );
};
