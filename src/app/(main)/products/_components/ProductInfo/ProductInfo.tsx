"use client";

import React, { useMemo } from "react";
import { CardComponents } from "@/components/card";
import { cn } from "@/utils/cn";
import { 
  FileText, 
  ChevronRight, 
  Package, 
  Tags, 
  Layers, 
  ShieldCheck 
} from "lucide-react";
import { ProductInfoProps, SpecEntry } from "../../_types/product";

export function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
    const specEntries = useMemo((): SpecEntry[] => {
        return [
            { key: "category", label: "Danh mục", value: product.category?.name },
            { key: "version", label: "Phiên bản", value: product.version ? `v${product.version}` : undefined },
            { key: "variantCount", label: "Số biến thể", value: product.variants?.length ? `${product.variants.length} SKU` : undefined },
            { key: "options", label: "Tuỳ chọn", value: product.options?.map((o) => o.name).join(", ") },
            { key: "sku", label: "SKU hiện tại", value: selectedVariant?.sku },
            { key: "inventory", label: "Kho hàng", value: selectedVariant?.inventory?.stock !== undefined ? `${selectedVariant.inventory.stock} sản phẩm` : undefined },
            { 
                key: "dimensions", 
                label: "Kích thước", 
                value: selectedVariant?.dimensionsString ?? (selectedVariant?.lengthCm ? `${selectedVariant.lengthCm}x${selectedVariant.widthCm}x${selectedVariant.heightCm} cm` : undefined) 
            },
            { 
                key: "weight", 
                label: "Khối lượng", 
                value: selectedVariant?.weightString ?? (selectedVariant?.weightKg ? `${selectedVariant.weightKg} kg` : selectedVariant?.weightGrams ? `${selectedVariant.weightGrams} g` : undefined) 
            },
        ].filter((entry) => Boolean(entry.value));
    }, [product, selectedVariant]);

    const cleanDescription = (text: string) => {
        if (!text) return "Thông tin mô tả đang được cập nhật...";
        return text.replace(/^(MÔ TẢ SẢN PHẨM|Mô tả sản phẩm)\s+/i, "").trim();
    };
    return (
        <CardComponents className="border-none shadow-custom overflow-hidden bg-[#fdfdfd] rounded-4xl">
            <div className="flex flex-col gap-10 p-2 sm:p-4">
                <section>
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="p-2.5 bg-orange-100 text-(--color-mainColor) rounded-2xl">
                            <Package size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-tight">
                            Thông số kỹ thuật
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {specEntries.map((entry) => (
                            <div 
                                key={entry.label} 
                                className="group cursor-pointer flex items-center justify-between px-4 py-2 bg-gray-50/50 hover:bg-orange-50/50 shadow-custom rounded-2xl border border-transparent hover:border-gray-100 transition-all duration-300"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[12px] font-bold text-orange-700 ">
                                        {entry.label}
                                    </span>
                                    <span className="text-[14px] font-bold text-gray-700 group-hover:text-(--color-mainColor)">
                                        {entry.value}
                                    </span>
                                </div>
                                <ChevronRight size={14} className="text-gray-500 group-hover:text-(--color-mainColor) group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </section>

              
                <section>
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="p-2.5 bg-orange-100 text-(--color-mainColor) rounded-2xl">
                            <FileText size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 uppercase">
                            Mô tả sản phẩm
                        </h3>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-[28px] p-6 relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 opacity-40 rotate-12 text-(--color-mainColor) animate-infinite-scroll">
                            <Package size={200} />
                        </div>

                        <p className="relative whitespace-pre-line text-gray-700 leading-[1.8] text-[15px] antialiased font-medium">
                            {cleanDescription(product.description || "")}
                        </p>
                    </div>
                </section>
            </div>
        </CardComponents>
    );
}