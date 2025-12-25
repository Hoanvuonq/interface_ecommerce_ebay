"use client";

import React from "react";
import { ProductStats, VoucherList } from "@/app/products/_components";
import Pricing from "@/app/products/_components/Pricing";
import { ShippingInfo } from "@/app/products/_components/ShippingInfo";
import { VariantSelector } from "@/app/products/_components/VariantSelector";
import { AddToCartButton } from "@/components";
import { TagComponents } from "@/components/tags";
import { cn } from "@/utils/cn";
import { ProductPurchaseActionsProps } from "../../_types/products";


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
    return (
        <section className="flex flex-col gap-y-5">
            <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    {!product.active && (
                        <TagComponents colorClass="bg-red-500 text-white font-bold px-3 py-0.5 rounded text-[10px] uppercase tracking-wider">
                            Hết hàng
                        </TagComponents>
                    )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                    {product.name}
                </h1>
                <ProductStats
                    averageRating={reviewSummary?.averageRating}
                    totalReviews={reviewSummary?.totalReviews}
                    soldCount={soldCount}
                    formatCompactNumber={formatCompactNumber}
                />
            </div>

            <div className="border border-gray-100/50">
                <Pricing
                    discountInfo={discountInfo}
                    priceRangeLabel={priceRangeLabel}
                    primaryPrice={primaryPrice}
                    comparePrice={comparePrice}
                    discountPercentage={discountPercentage}
                    priceAfterVoucher={priceAfterVoucher}
                    formatPrice={formatPrice}
                />
                {product && <div className="mt-3"><VoucherList product={product} /></div>}
            </div>

            <div className="space-y-5 px-1">
                <ShippingInfo
                    shopName={product.shop?.shopName}
                    bestPlatformVoucher={bestPlatformVoucher ? {
                        voucherScope: bestPlatformVoucher.voucherScope,
                        description: bestPlatformVoucher.description ?? undefined,
                    } : undefined}
                />

                {product.variants && product.variants.length > 1 && (
                    <div className="space-y-3 pt-2 border-t border-gray-50">
                        <div className="text-[14px] font-bold text-gray-800 uppercase tracking-tight">
                            Chọn phiên bản
                        </div>
                        <VariantSelector
                            variants={product.variants}
                            options={product.options}
                            onVariantChange={setSelectedVariant}
                        />
                        {selectedVariant?.optionValues && (
                            <div className="flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-top-1">
                                <span className="text-gray-500">Đã chọn:</span>
                                <span className="font-bold text-blue-600">{selectedVariant.optionValues.map(v => v.name).join(" / ")}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="sticky bottom-4 z-10 sm:static sm:z-auto">
                <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-md p-4 shadow-2xl space-y-4 ring-1 ring-black/3">
                    {selectedVariant && (
                        <div className="flex items-center justify-between px-1">
                            <div className="text-[12px] text-gray-500 uppercase font-medium">
                                SKU: <span className="font-mono text-gray-900">{selectedVariant.sku}</span>
                            </div>
                            {selectedVariant.inventory?.stock !== undefined && (
                                <div className="text-[13px] text-gray-500">
                                    Còn <span className={cn(
                                        "font-bold",
                                        selectedVariant.inventory.stock <= 5 ? "text-red-500" : "text-green-600"
                                    )}>
                                        {selectedVariant.inventory.stock}
                                    </span> sản phẩm
                                </div>
                            )}
                        </div>
                    )}
                    <AddToCartButton
                        variantId={selectedVariant?.id ?? ""}
                        productName={product.name}
                        size="large"
                        type="primary"
                        block
                        showQuantityInput={true}
                        disabled={!selectedVariant || selectedVariant.inventory?.stock === 0}
                    />
                </div>
            </div>
        </section>
    );
};