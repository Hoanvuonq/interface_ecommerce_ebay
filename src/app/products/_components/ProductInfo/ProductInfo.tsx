"use client";

import { CardComponents } from "@/components/card";
import type { PublicProductDetailDTO, PublicProductVariantDTO } from "@/types/product/public-product.dto";
import React from "react";

interface ProductInfoProps {
    product: PublicProductDetailDTO;
    selectedVariant: PublicProductVariantDTO | null;
}

export function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
    const specEntries = [
        {
            key: "category",
            label: "Danh mục",
            value: product.category?.name,
        },
        {
            key: "version",
            label: "Phiên bản",
            value: product.version ? `v${product.version}` : undefined,
        },
        {
            key: "variantCount",
            label: "Số biến thể",
            value: product.variants?.length
                ? `${product.variants.length} SKU`
                : undefined,
        },
        {
            key: "options",
            label: "Tuỳ chọn",
            value: product.options?.length
                ? product.options.map((o) => o.name).join(", ")
                : undefined,
        },
        {
            key: "sku",
            label: "SKU đang chọn",
            value: selectedVariant?.sku,
        },
        {
            key: "inventory",
            label: "Kho hàng",
            value:
                selectedVariant?.inventory?.stock !== undefined
                    ? `${selectedVariant.inventory.stock} sản phẩm`
                    : undefined,
        },
        {
            key: "dimensions",
            label: "Kích thước",
            value:
                selectedVariant?.dimensionsString ??
                (selectedVariant?.lengthCm &&
                selectedVariant?.widthCm &&
                selectedVariant?.heightCm
                    ? `${selectedVariant.lengthCm} x ${selectedVariant.widthCm} x ${selectedVariant.heightCm} cm`
                    : undefined),
        },
        {
            key: "weight",
            label: "Khối lượng",
            value:
                selectedVariant?.weightString ??
                (selectedVariant?.weightKg
                    ? `${selectedVariant.weightKg} kg`
                    : selectedVariant?.weightGrams
                    ? `${selectedVariant.weightGrams} g`
                    : undefined),
        },
    ].filter((entry) => Boolean(entry.value));

    const DescriptionItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
            <dt className="text-sm font-medium text-gray-500 w-1/3 flex-shrink-0">{label}</dt>
            <dd className="text-sm font-semibold text-gray-800 w-2/3 text-right break-words">{value}</dd>
        </div>
    );
    
    return (
        <CardComponents className="shadow-sm">
            <div className="space-y-6">
                
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Thông tin sản phẩm
                    </h3>
                    
                    {specEntries.length > 0 ? (
                        <dl className="divide-y divide-gray-100">
                            {specEntries.map((entry) => (
                                <DescriptionItem 
                                    key={entry.key}
                                    label={entry.label}
                                    value={entry.value}
                                />
                            ))}
                        </dl>
                    ) : (
                        <p className="text-sm text-gray-500">Không có thông số kỹ thuật.</p>
                    )}
                </div>

                <div className="border-t border-gray-200" /> 
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        Mô tả sản phẩm
                    </h3>
                    <p className="mt-3 whitespace-pre-line text-gray-700">
                        {product.description || "Thông tin đang được cập nhật."}
                    </p>
                </div>
            </div>
        </CardComponents>
    );
}