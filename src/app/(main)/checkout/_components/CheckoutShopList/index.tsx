"use client";

import { ItemImage } from "@/components/ItemImage";
import { VoucherComponents } from "@/components/voucher/_components/voucherComponents";
import { formatPrice } from "@/hooks/useFormatPrice";
import { cn } from "@/utils/cn";
import _ from "lodash";
import { Loader2, Store } from "lucide-react";
import React from "react";
import { useCheckoutActions } from "../../_hooks/useCheckoutActions";
import { useCheckoutStore } from "../../_store/useCheckoutStore";
import { ShopLoyaltySection } from "../ShopLoyaltySection";
import { ShopShippingSelector } from "../ShopShippingSelector";
import { TotalAmountCheckoutList } from "../TotalAmountCheckoutList";
import { CheckoutShopListProps } from "./type";

export const CheckoutShopList: React.FC<CheckoutShopListProps> = ({
  shops,
  loading,
  updateShippingMethod,
  request,
  preview,
}) => {
  const { syncPreview } = useCheckoutActions();
  const { updateShopVouchers, isSyncing } = useCheckoutStore();

  const handleSelectShopVoucher = async (shopId: string, selected: any) => {
    const orderCode = selected?.order?.code || selected?.order?.voucherCode;
    const shipCode =
      selected?.shipping?.code || selected?.shipping?.voucherCode;

    updateShopVouchers(shopId, {
      order: orderCode,
      shipping: shipCode,
    });

    await syncPreview();
    return true;
  };

  const handleSelectPlatformVoucher = async (shopId: string, selected: any) => {
    const orderCode = selected?.order?.code || selected?.order?.voucherCode;
    const shipCode =
      selected?.shipping?.code || selected?.shipping?.voucherCode;

    updateShopVouchers(shopId, {
      platformOrder: orderCode,
      platformShipping: shipCode,
    });

    await syncPreview();
    return true;
  };

  if (!shops || !Array.isArray(shops)) return null;

  return (
    <div className="space-y-6">
      {shops.map((shop) => {
        const shopSummary = _.get(shop, "summary", {});
        const subtotal = Number(shopSummary.subtotal || 0);
        const shippingFee = Number(shopSummary.shippingFee || 0);
        const voucherResult = _.get(shop, "voucherResult", {});
        const totalDiscount = Number(voucherResult.totalDiscount || 0);
        const discountDetails = _.get(voucherResult, "discountDetails", []);

        const originalShopPrice = subtotal + shippingFee;
        const finalShopTotal = Number(
          shopSummary.shopTotal || originalShopPrice - totalDiscount,
        );

        const shopReq = _.find(request?.shops, { shopId: shop.shopId });

        const getAppliedVoucherInfo = (
          type: "SHOP" | "PLATFORM",
          target: "ORDER" | "SHIP",
        ) => {
          const codes =
            type === "SHOP" ? shopReq?.vouchers : shopReq?.globalVouchers;

          const confirmedDetail = _.find(
            discountDetails,
            (d: any) =>
              codes?.includes(d.voucherCode) &&
              d.voucherType === type &&
              (target === "ORDER"
                ? ["ORDER", "PRODUCT"].includes(d.discountTarget)
                : ["SHIPPING", "SHIP"].includes(d.discountTarget)),
          );

          const targetIndex = target === "ORDER" ? 0 : 1;
          const pendingCode = codes?.[targetIndex];

          if (!confirmedDetail && pendingCode) {
            return {
              voucherCode: pendingCode,
              pending: true,
              discountAmount: 0,
              valid: true,
            };
          }
          return confirmedDetail;
        };

        return (
          <div
            key={shop.shopId}
            className={cn(
              "bg-white rounded-xl shadow-custom border border-gray-100 overflow-hidden transition-all duration-300 relative",
              isSyncing && "opacity-75 pointer-events-none",
            )}
          >
            {isSyncing && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                <Loader2 className="animate-spin text-orange-500" size={32} />
              </div>
            )}

            <div className="px-5 py-2 border-b border-gray-50 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-orange-600">
                  <Store size={20} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight">
                  {shop.shopName}
                </h3>
              </div>
            </div>

            <div className="py-2 px-6 space-y-2">
              <div className="divide-y divide-gray-50">
                {shop.items.map((item: any, idx: number) => (
                  <div
                    key={`${item.itemId}-${idx}`}
                    className="flex gap-4 items-center py-2 group"
                  >
                    <ItemImage
                      items={item}
                      className="w-16 h-16 rounded-2xl border border-gray-50 object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-700 truncate uppercase tracking-wide">
                        {item.productName}
                      </h4>
                      <p className="text-[10px] text-gray-600 font-semibold italic">
                        {item.variantAttributes}
                      </p>
                      <div className="flex justify-between items-center ">
                        <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-lg">
                          x{item.quantity}
                        </span>
                        <span className="text-md font-mono text-gray-900">
                          {formatPrice(item.lineTotal || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-4 border-t border-gray-100">
                <ShopShippingSelector
                  shopId={shop.shopId}
                  shopName={shop.shopName}
                  availableOptions={shop.availableShippingOptions || []}
                  selectedMethodCode={String(shop.selectedShippingMethod)}
                  isLoading={loading || isSyncing}
                  onMethodChange={updateShippingMethod}
                />

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-600 uppercase">
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
                          order: getAppliedVoucherInfo("SHOP", "ORDER"),
                          shipping: getAppliedVoucherInfo("SHOP", "SHIP"),
                        }}
                        context={{
                          totalAmount: subtotal,
                          shippingFee: shippingFee,
                          items: shop.items.map((item: any) => ({
                            productId: item.productId,
                            shopId: shop.shopId,
                            unitPrice: item.unitPrice,
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
                          order: getAppliedVoucherInfo("PLATFORM", "ORDER"),
                          shipping: getAppliedVoucherInfo("PLATFORM", "SHIP"),
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
                <div className="flex w-full gap-2 items-end pb-2">
                  <ShopLoyaltySection loyalty={shop.loyaltyInfo} />
                </div>
              </div>
            </div>
            <TotalAmountCheckoutList
              originalShopPrice={originalShopPrice}
              finalShopTotal={finalShopTotal}
              totalDiscount={totalDiscount}
              productOrOrderDiscount={
                totalDiscount -
                (_.chain(discountDetails)
                  .filter(
                    (d: any) =>
                      d.valid &&
                      (d.discountTarget === "SHIPPING" ||
                        d.discountTarget === "SHIP"),
                  )
                  .sumBy("discountAmount")
                  .value() || 0)
              }
              shipDiscount={
                _.chain(discountDetails)
                  .filter(
                    (d: any) =>
                      d.valid &&
                      (d.discountTarget === "SHIPPING" ||
                        d.discountTarget === "SHIP"),
                  )
                  .sumBy("discountAmount")
                  .value() || 0
              }
            />
          </div>
        );
      })}
    </div>
  );
};
