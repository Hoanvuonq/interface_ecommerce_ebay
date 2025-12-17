"use client";
import { CustomPopover } from "@/components";
import { Flame, Info, Tag } from "lucide-react";
import React from "react";
import { PricingProps } from "../../_types/product";
import InfoSale from "../InfoSale";

const Pricing: React.FC<PricingProps> = ({
    discountInfo,
    primaryPrice,
    comparePrice,
    discountPercentage,
    priceAfterVoucher,
    formatPrice,
    priceRangeLabel
}) => {
    const hasDiscount = comparePrice && comparePrice > primaryPrice;

    return (
        <div className="relative rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-orange-50 to-white p-5 shadow-sm z-10">
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl" />
            </div>
            
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center justify-center bg-red-500 rounded-md p-1 shadow-sm">
                            <Flame className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                        <span className="uppercase text-[13px] font-extrabold tracking-wider text-black">
                            Giá tốt nhất
                        </span>
                        {discountInfo && (
                            
                            <CustomPopover
                                content={
                                    <InfoSale discountInfo={discountInfo} formatPrice={formatPrice} />
                                }
                                placement="bottomLeft"
                            >
                                <Info className="w-5 h-5 text-blue-500 cursor-pointer hover:text-red-500 transition-colors" />
                            </CustomPopover>
                        )}
                    </div>

                    {discountPercentage && (
                        <div className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm animate-pulse">
                            GIẢM {discountPercentage}%
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl sm:text-5xl font-black text-red-600 tracking-tight tabular-nums leading-none">
                        {formatPrice(primaryPrice)}
                    </span>
                    
                    {hasDiscount && (
                        <span className="text-lg font-medium text-gray-400 line-through decoration-gray-400/50">
                            {formatPrice(comparePrice)}
                        </span>
                    )}
                </div>

                {priceAfterVoucher && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100/50 border border-orange-200 rounded-lg w-fit shadow-sm">
                        <Tag className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
                        <span className="text-xs font-bold text-orange-700 uppercase tracking-tight">
                            Đã áp dụng voucher tốt nhất
                        </span>
                    </div>
                )}

                {priceRangeLabel && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
                        <span className="opacity-70 italic font-medium">Khoảng giá từ shop:</span>
                        <span className="font-bold text-gray-700">{priceRangeLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pricing;