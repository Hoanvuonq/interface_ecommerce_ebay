"use client";

import { CardComponents } from "@/components/card";
import type { PublicProductDetailDTO, PublicProductVariantDTO } from "@/types/product/public-product.dto";
import React from "react";
import { cn } from "@/utils/cn";
import { Info, FileText, ChevronRight } from "lucide-react";

interface ProductInfoProps {
    product: PublicProductDetailDTO;
    selectedVariant: PublicProductVariantDTO | null;
}

export function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
    const specEntries = [
        { key: "category", label: "Danh mục", value: product.category?.name },
        { key: "version", label: "Phiên bản", value: product.version ? `v${product.version}` : undefined },
        { key: "variantCount", label: "Số biến thể", value: product.variants?.length ? `${product.variants.length} SKU` : undefined },
        { key: "options", label: "Tuỳ chọn", value: product.options?.map((o) => o.name).join(", ") },
        { key: "sku", label: "SKU đang chọn", value: selectedVariant?.sku },
        { key: "inventory", label: "Kho hàng", value: selectedVariant?.inventory?.stock !== undefined ? `${selectedVariant.inventory.stock} sản phẩm` : undefined },
        { 
            key: "dimensions", 
            label: "Kích thước", 
            value: selectedVariant?.dimensionsString ?? (selectedVariant?.lengthCm ? `${selectedVariant.lengthCm} x ${selectedVariant.widthCm} x ${selectedVariant.heightCm} cm` : undefined) 
        },
        { 
            key: "weight", 
            label: "Khối lượng", 
            value: selectedVariant?.weightString ?? (selectedVariant?.weightKg ? `${selectedVariant.weightKg} kg` : selectedVariant?.weightGrams ? `${selectedVariant.weightGrams} g` : undefined) 
        },
    ].filter((entry) => Boolean(entry.value));

    // Hàm xử lý sạch text mô tả để tránh lặp tiêu đề từ Backend
    const cleanDescription = (text: string) => {
        if (!text) return "Thông tin mô tả đang được cập nhật...";
        // Loại bỏ các dòng tiêu đề thừa nếu Backend lỡ gửi kèm
        return text.replace(/^(MÔ TẢ SẢN PHẨM|Mô tả sản phẩm)\s+/i, "").trim();
    };

    return (
        <CardComponents className="border-none shadow-sm overflow-hidden bg-white">
            <div className="flex flex-col gap-10">
                {/* PHẦN 1: THÔNG SỐ CHI TIẾT */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Info size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                            Chi tiết sản phẩm
                        </h3>
                    </div>

                    <div className="flex flex-col border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        {specEntries.map((entry, index) => (
                            <div 
                                key={entry.key} 
                                className={cn(
                                    "group flex items-center px-5 py-4 transition-colors",
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                                    index !== specEntries.length - 1 && "border-b border-gray-100"
                                )}
                            >
                                <div className="w-1/3 md:w-1/4 flex items-center text-sm font-medium text-gray-400">
                                    {entry.label}
                                </div>
                                <div className="flex-1 text-sm font-bold text-gray-800">
                                    {entry.value}
                                </div>
                                <ChevronRight size={14} className="text-gray-200 group-hover:text-blue-400 transition-colors" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* DẢI PHÂN CÁCH */}
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] italic">
                            Product Description
                        </span>
                    </div>
                </div>

                {/* PHẦN 2: MÔ TẢ SẢN PHẨM - FIXED UI */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                            Mô tả sản phẩm
                        </h3>
                    </div>
                    
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-8 shadow-inner-sm">
                        <div className="prose prose-blue max-w-none">
                            <p className="whitespace-pre-line text-gray-700 leading-[1.8] text-[15px] antialiased">
                                {cleanDescription(product.description || "")}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </CardComponents>
    );
}