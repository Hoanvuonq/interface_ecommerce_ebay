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
        <CardComponents className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white rounded-4xl">
            <div className="flex flex-col gap-10 p-2 sm:p-4">
                <section>
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="p-2.5 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-200">
                            <Package size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                            Thông số kỹ thuật
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {specEntries.map((entry) => (
                            <div 
                                key={entry.label} 
                                className="group cursor-pointer flex items-center justify-between px-5 py-4 bg-gray-50/50 hover:bg-orange-50/50 rounded-2xl border border-transparent hover:border-orange-100 transition-all duration-300"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        {entry.label}
                                    </span>
                                    <span className="text-[14px] font-bold text-gray-700 group-hover:text-orange-600">
                                        {entry.value}
                                    </span>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </section>

                <div className="relative py-2 ">
                    <div className="absolute inset-0 flex items-center px-10">
                        <div className="w-full border-t border-dashed border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                            Details View
                        </span>
                    </div>
                </div>
                <section>
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl">
                            <FileText size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                            Mô tả sản phẩm
                        </h3>
                    </div>
                    
                    <div className="bg-orange-50/30 border border-orange-100/50 rounded-[28px] p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12">
                            <Package size={200} />
                        </div>

                        <p className="relative whitespace-pre-line text-gray-600 leading-[1.8] text-[15px] antialiased font-medium">
                            {cleanDescription(product.description || "")}
                        </p>
                    </div>
                </section>
            </div>
        </CardComponents>
    );
}