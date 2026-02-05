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

  // --- FIX 1: Đưa logic tìm shopReq vào trong handler để lấy data mới nhất và merge ---
  const handleSelectShopVoucher = async (shopId: string, selected: any) => {
    const shopReq = _.find(request?.shops, { shopId }); // Tìm data hiện tại của shop này

    const orderCode = selected?.order?.code || selected?.order?.voucherCode;
    const shipCode =
      selected?.shipping?.code || selected?.shipping?.voucherCode;

    updateShopVouchers(shopId, {
      platformOrder: shopReq?.globalVouchers?.[0],
      platformShipping: shopReq?.globalVouchers?.[1],
      order: orderCode,
      shipping: shipCode,
    });

    await syncPreview();
    return true;
  };

 const handleSelectPlatformVoucher = async (shopId: string, selected: any) => {
  // --- FIX 1: Lấy state mới nhất từ Store bằng getState() ---
  const currentRequest = useCheckoutStore.getState().request;
  const shopReq = _.find(currentRequest?.shops, { shopId });

  const orderCode = selected?.order?.code || selected?.order?.voucherCode;
  const shipCode = selected?.shipping?.code || selected?.shipping?.voucherCode;

  // Gọi update
  updateShopVouchers(shopId, {
    // Giữ nguyên voucher của shop
    order: shopReq?.vouchers?.[0],
    shipping: shopReq?.vouchers?.[1],
    // Update voucher sàn
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
        // --- FIX 2: shopReq ở đây dùng để hiển thị UI (Voucher nào đang tick chọn) ---
        const shopReq = _.find(request?.shops, { shopId: shop.shopId });
        const shopPricing = _.get(shop, "pricing", {});
        const subtotal = Number(shopPricing.subtotal || 0);
        const shippingFee = Number(shopPricing.shippingFee || 0);
        const voucherDiscount = Number(shopPricing.voucherDiscount || 0);
        const shopTotal = Number(shopPricing.shopTotal || 0);
        const validVouchers = _.get(shop, "voucher.valid", []);

        const getAppliedVoucherInfo = (
          type: "SHOP" | "PLATFORM",
          target: "ORDER" | "SHIP",
        ) => {
          const codes =
            type === "SHOP" ? shopReq?.vouchers : shopReq?.globalVouchers;
          const confirmedDetail = _.find(
            validVouchers,
            (v: any) =>
              codes?.includes(v.code) &&
              v.type === type &&
              (target === "ORDER"
                ? ["ORDER", "PRODUCT"].includes(v.target)
                : ["SHIP", "SHIPPING"].includes(v.target)),
          );
          return confirmedDetail;
        };

        return (
          <div
            key={shop.shopId}
            className={cn(
              "bg-white rounded-xl shadow-custom border border-gray-100 overflow-hidden relative",
              isSyncing && "opacity-75",
            )}
          >
            {/* ... (Phần Header và Items giữ nguyên như cũ của bro) ... */}

            <div className="py-2 px-6 space-y-2">
              <div className="divide-y divide-gray-50">
                {/* Item mapping... */}
                {shop.items.map((item: any) => (
                  <div key={item.itemId}> {/* Render item... */} </div>
                ))}
              </div>

              <div className="space-y-6 pt-4 border-t border-gray-100">
                <ShopShippingSelector
                  shopId={shop.shopId}
                  shopName={shop.shopName}
                  isLoading={loading}
                  availableOptions={shop.shipping?.options || []}
                  selectedMethodCode={String(
                    shop.shipping?.selectedCodes?.serviceCode,
                  )}
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
                        onSelectVoucher={(v: any) =>
                          handleSelectShopVoucher(shop.shopId, v)
                        }
                        appliedVouchers={{
                          order: getAppliedVoucherInfo("SHOP", "ORDER"),
                          shipping: getAppliedVoucherInfo("SHOP", "SHIP"),
                        }}
                        context={{
                          totalAmount: subtotal,
                          shippingFee,
                          items: shop.items.map((item: any) => ({
                            productId: item.productId,
                            unitPrice: item.unitPrice,
                            quantity: item.quantity,
                            lineTotal:
                              (item.pricing?.finalPrice || item.unitPrice) *
                              item.quantity,
                          })),
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <VoucherComponents
                        compact
                        forcePlatform
                        onSelectVoucher={(v: any) =>
                          handleSelectPlatformVoucher(shop.shopId, v)
                        }
                        appliedVouchers={{
                          order: getAppliedVoucherInfo("PLATFORM", "ORDER"),
                          shipping: getAppliedVoucherInfo("PLATFORM", "SHIP"),
                        }}
                        context={{
                          totalAmount: subtotal,
                          shippingFee,
                          items: shop.items.map((item: any) => ({
                            productId: item.productId,
                            unitPrice: item.unitPrice,
                            quantity: item.quantity,
                            lineTotal:
                              (item.pricing?.finalPrice || item.unitPrice) *
                              item.quantity,
                          })),
                        }}
                      />
                    </div>
                  </div>
                </div>
                <ShopLoyaltySection loyalty={shop.loyaltyInfo} />
              </div>
            </div>

            <TotalAmountCheckoutList
              originalShopPrice={subtotal + shippingFee}
              finalShopTotal={shopTotal}
              totalDiscount={voucherDiscount}
              productOrOrderDiscount={_.chain(validVouchers)
                .filter((v) => ["PRODUCT", "ORDER"].includes(v.target))
                .sumBy("discount")
                .value()}
              shipDiscount={_.chain(validVouchers)
                .filter((v) => ["SHIP", "SHIPPING"].includes(v.target))
                .sumBy("discount")
                .value()}
            />
          </div>
        );
      })}
    </div>
  );
};
