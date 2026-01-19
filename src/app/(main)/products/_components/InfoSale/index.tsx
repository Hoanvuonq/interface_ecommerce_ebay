import { AlertCircle, Tag, Ticket } from "lucide-react";
import React from "react";

interface InfoSaleProps {
    discountInfo: {
        voucherName?: string;
        voucherCode?: string;
        description?: string;
        originalPrice: number;
        variantPrice: number;
        finalPrice: number;
        discountText?: string;
        actualDiscount: number;
    } | null;
    formatPrice: (price: number) => string;
}

const InfoSale: React.FC<InfoSaleProps> = ({ discountInfo, formatPrice }) => {
    if (!discountInfo) return null;

    return (
        <div className="w-80 bg-white overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-sm uppercase tracking-tight text-gray-700">
                    Chi tiết giảm giá
                </span>
            </div>

            <div className="p-4 space-y-4">
                {discountInfo.voucherName && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                            <Ticket className="w-3 h-3" />
                            Voucher áp dụng
                        </div>
                        <div className="bg-orange-50 border border-gray-100 rounded-lg p-3 relative overflow-hidden">
                            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-r border-gray-100" />
                            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-l border-gray-100" />
                            
                            <div className="font-bold text-orange-700 text-sm leading-tight">
                                {discountInfo.voucherName}
                            </div>
                            {discountInfo.voucherCode && (
                                <div className="text-[10px] font-mono text-orange-400 mt-1 uppercase tracking-tighter">
                                    Mã: {discountInfo.voucherCode}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {discountInfo.description && (
                    <div className="text-xs text-gray-500 italic leading-relaxed bg-blue-50/50 p-2 rounded border-l-2 border-blue-200">
                        "{discountInfo.description}"
                    </div>
                )}

                <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Giá niêm yết</span>
                        <span className="text-gray-600 line-through tabular-nums">
                            {formatPrice(discountInfo.originalPrice)}
                        </span>
                    </div>

                    {discountInfo.variantPrice !== discountInfo.finalPrice && (
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Giá đang bán</span>
                            <span className="text-gray-600 line-through tabular-nums">
                                {formatPrice(discountInfo.variantPrice)}
                            </span>
                        </div>
                    )}

                    {discountInfo.discountText && discountInfo.actualDiscount > 0 && (
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 flex items-center gap-1">
                                <Tag className="w-3 h-3 text-orange-500" />
                                Ưu đãi từ Shop
                            </span>
                            <span className="font-bold text-orange-600 tabular-nums">
                                -{formatPrice(discountInfo.actualDiscount)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-none mb-1">
                                Giá thanh toán
                            </span>
                            <span className="text-sm font-medium text-gray-600">Tiết kiệm {formatPrice(discountInfo.originalPrice - discountInfo.finalPrice)}</span>
                        </div>
                        <div className="text-2xl font-semibold text-red-600 tracking-tighter tabular-nums">
                            {formatPrice(discountInfo.finalPrice)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-2 bg-gray-50 text-[10px] text-gray-600 text-center border-t border-gray-100">
                Giá cuối cùng đã bao gồm các loại thuế và phí
            </div>
        </div>
    );
};

export default InfoSale;