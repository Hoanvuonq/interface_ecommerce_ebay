"use client";

import { ItemImage } from "@/components/ItemImage";
import { VoucherComponents } from "@/components/voucher/_components/voucherComponents";
import { formatPrice } from "@/hooks/useFormatPrice";
import _ from "lodash";
import { CheckCircle2, Store, Truck } from "lucide-react";
import React, { useMemo } from "react";
import { useCheckoutActions } from "../../_hooks/useCheckoutActions";
import { ShopLoyaltySection } from "../ShopLoyaltySection";
import { ShopShippingSelector } from "../ShopShippingSelector";

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

  const allProductIds = useMemo(
    () => _.flatMap(shops, (s) => s.items.map((i: any) => i.itemId)),
    [shops]
  );
  const allShopIds = useMemo(() => shops.map((s) => s.shopId), [shops]);

  const findAppliedPlatformVoucher = (target: "ORDER" | "SHIP") => {
    const globalDetails =
      preview?.voucherApplication?.globalVouchers?.discountDetails || [];
    const shopDetails =
      _.flatMap(preview?.voucherApplication?.shopResults, "discountDetails") ||
      [];

    const allDetails = [...globalDetails, ...shopDetails];

    return allDetails.find(
      (d: any) =>
        d.voucherType === "PLATFORM" &&
        (target === "ORDER"
          ? ["ORDER", "PRODUCT"].includes(d.discountTarget)
          : d.discountTarget === "SHIP" || d.discountTarget === "SHIPPING")
    )?.voucherCode;
  };

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
    shopId: string, // Thêm tham số shopId
    selected: any
  ): Promise<boolean> => {
    // 1. Lấy mã mới từ Modal (Order và Shipping)
    const newCodes = [selected?.order?.code, selected?.shipping?.code].filter(
      Boolean
    ) as string[];

    // 2. Cập nhật mảng globalVouchers của RIÊNG shop này trong mảng shops
    const updatedShops = request.shops.map((s: any) => {
      if (s.shopId === shopId) {
        return {
          ...s,
          globalVouchers: newCodes, // Gán vào shop cụ thể
        };
      }
      return s;
    });

    // 3. Gửi request đồng bộ. Lưu ý: request.globalVouchers ở root có thể để rỗng
    // vì ta đã chuyển sang dùng globalVouchers theo từng shop.
    const result = await syncPreview({
      ...request,
      shops: updatedShops,
    });

    return !!result;
  };
  return (
    <div className="space-y-6">
      {shops.map((shop) => {
        const shopVoucherResult =
          preview?.voucherApplication?.shopResults?.find(
            (res: any) => res.shopId === shop.shopId
          );

        const totalDiscount = shopVoucherResult?.totalDiscount || 0;

        const shipDiscount =
          shopVoucherResult?.discountDetails?.find(
            (d: any) =>
              d.discountTarget === "SHIP" || d.discountTarget === "SHIPPING"
          )?.discountAmount || 0;

        const productOrOrderDiscount = totalDiscount - shipDiscount;
        const shopInRequest = request?.shops?.find(
          (s: any) => s.shopId === shop.shopId
        );
        const originalShopPrice = shop.subtotal + (shop.shippingFee || 0);
        const finalShopTotal = originalShopPrice - totalDiscount;

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

              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
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
                          order: shopInRequest?.vouchers?.[0], // Lấy từ mảng vouchers của shop
                        }}
                        context={{
                          totalAmount: shop.subtotal,
                          shopId: shop.shopId,
                          shippingFee: shop.shippingFee,
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <VoucherComponents
                        compact
                        forcePlatform={true}
                        onSelectVoucher={(selected: any) =>
                          handleSelectPlatformVoucher(shop.shopId, selected)
                        }
                        appliedVouchers={{
                          order: (
                            request?.shops?.find(
                              (s: any) => s.shopId === shop.shopId
                            )?.globalVouchers || []
                          ).find((c: string) => !c.includes("FREESHIP")),
                          shipping: (
                            request?.shops?.find(
                              (s: any) => s.shopId === shop.shopId
                            )?.globalVouchers || []
                          ).find((c: string) => c.includes("FREESHIP")),
                        }}
                        context={{
                          totalAmount: shop.subtotal,
                          shopIds: [shop.shopId],
                          productIds: shop.items.map((i: any) => i.itemId),
                          shippingFee: shop.shippingFee,
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

            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Tổng shop
                </span>
                {productOrOrderDiscount > 0 && (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Giảm đơn hàng: -
                    {formatPrice(productOrOrderDiscount)}
                  </p>
                )}
                {shipDiscount > 0 && (
                  <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                    <Truck size={12} /> Giảm vận chuyển: -
                    {formatPrice(shipDiscount)}
                  </p>
                )}
              </div>
              <div className="text-right">
                {totalDiscount > 0 && (
                  <p className="text-[10px] text-slate-400 line-through mb-1">
                    {formatPrice(originalShopPrice)}
                  </p>
                )}
                <span className="text-2xl font-black text-slate-900 tracking-tighter">
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
