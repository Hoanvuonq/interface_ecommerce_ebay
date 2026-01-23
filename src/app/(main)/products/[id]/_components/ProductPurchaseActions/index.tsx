"use client";

import { ProductStats, VoucherList } from "@/app/(main)/products/_components";
import Pricing from "@/app/(main)/products/_components/Pricing";
import { ShippingInfo } from "@/app/(main)/products/_components/ShippingInfo";
import { VariantSelector } from "@/app/(main)/products/_components/VariantSelector";
import { AddToCartButton } from "@/components";
import { TagComponents } from "@/components/tags";
import { cn } from "@/utils/cn";
import React from "react";
import { ProductPurchaseActionsProps } from "../../_types/products";
import { ActiveCampaignBanner } from "../ActiveCampaignBanner";

export const ProductPurchaseActions: React.FC<ProductPurchaseActionsProps> = ({
  product,
  selectedVariant,
  setSelectedVariant,
  reviewSummary,
  soldCount,
  formatCompactNumber,
  discountInfo,
  priceRangeLabel,
  primaryPrice,
  comparePrice,
  discountPercentage,
  priceAfterVoucher,
  formatPrice,
  bestPlatformVoucher,
}) => {
  const [currentQuantity, setCurrentQuantity] = React.useState(1);
  const activeCampaign = product.activeCampaigns?.[0] || null;
  const variant = selectedVariant || (product.variants?.[0] ?? null);

  // const primaryPrice = variant ? variant.price : (product.priceMin ?? 0);

  const totalPrice = React.useMemo(() => {
    return primaryPrice * currentQuantity;
  }, [primaryPrice, currentQuantity]);

  // const comparePrice = variant
  //   ? variant.priceBeforeDiscount
  //   : product.priceBeforeDiscount;

  // const discountPercentage =
  //   variant?.promotion?.discountPercent ?? product.showDiscount ?? null;

  // const priceAfterVoucher = product.priceAfterBestVoucher;

  return (
    <section className="flex flex-col gap-y-3">
      
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {!product.category.active && (
            <TagComponents colorClass="bg-red-500 text-white font-bold px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider">
              Hết hàng
            </TagComponents>
          )}
        </div>
        {activeCampaign && <ActiveCampaignBanner campaign={activeCampaign} />}
        <h1 className="text-2xl font-bold text-gray-900 leading-snug tracking-tight">
          {product.name}
        </h1>
        <ProductStats
          averageRating={reviewSummary?.averageRating}
          totalReviews={reviewSummary?.totalReviews}
          soldCount={soldCount}
          formatCompactNumber={formatCompactNumber}
          className="mt-1"
        />
      </div>

      <Pricing
        discountInfo={discountInfo}
        priceRangeLabel={priceRangeLabel}
        primaryPrice={primaryPrice}
        comparePrice={comparePrice}
        discountPercentage={discountPercentage}
        priceAfterVoucher={priceAfterVoucher}
        formatPrice={formatPrice}
      />
      {product && (
        <div className="mt-2">
          <VoucherList product={product} />
        </div>
      )}

      <div className="space-y-5 px-1">
        <ShippingInfo
          shopName={product.shop?.shopName}
          bestPlatformVoucher={
            bestPlatformVoucher
              ? {
                  voucherScope: bestPlatformVoucher.voucherScope,
                  description: bestPlatformVoucher.description ?? undefined,
                }
              : undefined
          }
        />

        {product.variants && product.variants.length > 1 && (
          <div className="space-y-4 pt-2 border-t border-gray-50">
            <div className="text-[14px] font-bold text-gray-800 uppercase tracking-tight">
              Chọn phiên bản
            </div>
            <VariantSelector
              variants={product.variants}
              options={product.options}
              onVariantChange={setSelectedVariant}
              selectedVariant={selectedVariant}
            />
            {selectedVariant?.optionValues && (
              <div className="flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-1">
                <span className="text-gray-500">Đã chọn:</span>
                <span className="font-bold text-blue-600">
                  {selectedVariant.optionValues.map((v) => v.name).join(" / ")}
                </span>
              </div>
            )}
            {/* Hiển thị giá gốc và giá sale nếu có promotion */}
            {/* {selectedVariant?.promotion && (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-medium text-gray-600 line-through decoration-gray-400/50">
                  {formatPrice(selectedVariant.promotion.originalPrice)}
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(selectedVariant.promotion.salePrice)}
                </span>
                <span className="ml-2 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                  -{selectedVariant.promotion.discountPercent}%
                </span>
              </div>
            )} */}
          </div>
        )}
      </div>

      <div className="sticky bottom-4 z-10 sm:static sm:z-auto">
        <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-md p-4 shadow-2xl space-y-4 ring-1 ring-black/3">
          {selectedVariant && (
            <div className="flex items-center justify-between gap-y-2 px-1">
              <div className="flex items-center gap-2">
                <div className="text-[12px] flex items-center gap-1 text-gray-500 uppercase font-medium">
                  SKU:
                  <span className="font-semibold text-gray-700">
                    {selectedVariant.sku}
                  </span>
                </div>
                {selectedVariant.inventory?.stock !== undefined && (
                  <div className="text-[12px] flex items-center gap-1 text-gray-500">
                    Còn
                    <span
                      className={cn(
                        "font-bold",
                        selectedVariant.inventory.stock <= 5
                          ? "text-red-500"
                          : "text-(--color-mainColor)",
                      )}
                    >
                      {selectedVariant.inventory.stock}
                    </span>
                    sản phẩm
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <div className="text-[13px] font-medium text-gray-600">
                  Tạm tính:
                </div>
                <div className="text-[16px] font-bold text-(--color-mainColor) animate-in fade-in zoom-in duration-300">
                  {formatPrice(totalPrice)}
                </div>
              </div>
            </div>
          )}

          <AddToCartButton
            variantId={selectedVariant?.id ?? ""}
            productName={product.name}
            block
            showQuantityInput={true}
            maxQuantity={selectedVariant?.inventory?.stock ?? 0}
            onQuantityChange={setCurrentQuantity}
            disabled={
              !selectedVariant || selectedVariant.inventory?.stock === 0
            }
          />
        </div>
      </div>
    </section>
  );
};
