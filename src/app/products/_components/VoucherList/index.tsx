'use client';

import { CustomButton } from "@/components/button";
import { CardComponents } from "@/components/card";
import { voucherService } from "@/services/voucher/voucher.service";
import type { PublicProductDetailDTO } from "@/types/product/public-product.dto";
import { cn } from "@/utils/cn";
import { formatVND } from '@/utils/product.utils';
import { Gift, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const CustomTag: React.FC<any> = ({ children, colorClass, className, ...rest }) => (
    <span
        className={cn(
            "inline-block text-sm font-semibold px-3 py-1 rounded-lg shadow-sm",
            colorClass,
            className
        )}
        {...rest}
    >
        {children}
    </span>
);

// Tái tạo Antd Spin
const CustomSpinner: React.FC<any> = ({ size = 'small' }) => {
    const sizeMap = { small: 4, middle: 6, large: 8 };
    const currentSize = sizeMap[size as keyof typeof sizeMap] || 4;
    return (
        <div className="flex items-center justify-center">
            <Loader2 className={`w-${currentSize} h-${currentSize} animate-spin text-blue-500`} />
        </div>
    );
};

const CustomModal: React.FC<any> = ({ open, onCancel, title, children, width = 600 }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1050] flex justify-center items-start pt-10 px-4 sm:px-0 transition-opacity duration-300">
            <div 
                className="bg-white rounded-xl shadow-2xl relative animate-fadeInDown"
                style={{ width: width, maxWidth: '90vw' }}
            >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <CustomButton onClick={onCancel} type="text" className="!p-1 !h-auto">
                        <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                    </CustomButton>
                </div>
                
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};


interface VoucherListProps {
    product: PublicProductDetailDTO;
}

interface VoucherDisplay {
    id: string;
    code: string;
    name?: string;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue?: number;
    discountAmount?: number;
    description?: string;
    type: "SHOP" | "PLATFORM";
}

export function VoucherList({ product }: VoucherListProps) {
    const [shopVouchers, setShopVouchers] = useState<VoucherDisplay[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const initialVouchers: VoucherDisplay[] = [];
    if (product.bestShopVoucher) {
        initialVouchers.push({
            id: product.bestShopVoucher.voucherId,
            code: product.bestShopVoucher.code,
            name: product.bestShopVoucher.name || undefined,
            discountType: product.bestShopVoucher.discountType,
            discountValue: product.bestShopVoucher.discountValue || undefined,
            discountAmount: product.bestShopVoucher.discountAmount || undefined,
            description: product.bestShopVoucher.description || undefined,
            type: "SHOP",
        });
    }

    const formatDiscount = (voucher: VoucherDisplay) => {
        if (voucher.discountType === "PERCENTAGE" && voucher.discountValue) {
            return `Giảm ${voucher.discountValue}%`;
        } else if (voucher.discountType === "FIXED_AMOUNT" && voucher.discountAmount) {
            return `Giảm ${formatVND(voucher.discountAmount)}`;
        }
        return "Giảm giá";
    };

    const loadVouchers = useCallback(async () => {
        if (!product.shop?.shopId) return;

        setLoading(true);
        try {
            const shopVouchersData = await voucherService.getShopVouchersForBuyer(
                product.shop.shopId
            );
            const shopVouchersList: VoucherDisplay[] = shopVouchersData.map((v: any) => ({
                id: v.id,
                code: v.code,
                name: v.description,
                discountType: v.discountType === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",
                discountValue: v.discountType === "PERCENTAGE" ? v.discountAmount : undefined, 
                discountAmount: v.discountType === "FIXED" ? v.discountAmount : undefined,
                description: v.description,
                type: "SHOP",
            }));
            setShopVouchers(shopVouchersList);
        } catch (error) {
            console.error("Failed to load shop vouchers:", error);
        } finally {
            setLoading(false);
        }
    }, [product.shop?.shopId]);

    useEffect(() => {
        if (expanded || modalOpen) {
            loadVouchers();
        }
    }, [expanded, modalOpen, loadVouchers]);

    const allVouchers = useMemo(() => {
        const merged = [...initialVouchers];
        shopVouchers.forEach(v => {
            if (!initialVouchers.some(iv => iv.id === v.id)) {
                merged.push(v);
            }
        });
        return merged;
    }, [initialVouchers, shopVouchers]);
    
    const displayVouchers = expanded ? allVouchers : allVouchers.slice(0, 4);

    if (allVouchers.length === 0 && !loading) {
        return null;
    }
    
    const renderVoucherItem = (voucher: VoucherDisplay, isModal: boolean = false) => (
        <div
            key={voucher.id}
            className={cn(
                "flex items-center gap-3 rounded-lg border border-gray-200 transition-colors cursor-pointer p-2 sm:p-3",
                isModal ? "hover:border-blue-400" : "hover:border-orange-400"
            )}
        >
            <CustomTag
                colorClass="bg-orange-500 text-white"
                className={cn("m-0 font-bold shrink-0", isModal ? "text-base" : "text-sm")}
            >
                {formatDiscount(voucher)}
            </CustomTag>

            {/* Voucher Info */}
            <div className="flex-1 min-w-0">
                <p className={cn("font-medium text-gray-800 line-clamp-1", isModal ? "text-sm" : "text-xs")}>
                    {voucher.description || voucher.name || "Voucher Shop"}
                </p>
                {voucher.code && (
                    <p className="text-xs text-gray-500 mt-0.5">Mã: {voucher.code}</p>
                )}
            </div>

            <CustomButton 
                type="primary" 
                size="small"
                className="bg-blue-600 hover:bg-blue-700 !h-8 px-3 rounded-lg"
                onClick={() => alert(`Đã lưu voucher ${voucher.code}`)} // Placeholder action
            >
                Lưu
            </CustomButton>
        </div>
    );

    return (
        <>
            <CardComponents className="shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-orange-500" />
                        <span className="font-bold text-lg text-gray-800">Voucher của Shop</span>
                    </div>
                    {allVouchers.length > 4 && (
                        <CustomButton
                            type="link"
                            size="small"
                            onClick={() => setModalOpen(true)}
                            className="p-0 text-orange-600 hover:text-orange-700 text-sm font-semibold"
                        >
                            Xem tất cả ({allVouchers.length})
                        </CustomButton>
                    )}
                </div>

                {loading && allVouchers.length === 0 ? (
                    <div className="py-4 text-center">
                        <CustomSpinner size="small" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayVouchers.map((voucher) => renderVoucherItem(voucher))}

                        {!expanded && allVouchers.length > 4 && (
                            <CustomButton
                                type="default"
                                size="small"
                                onClick={() => setExpanded(true)}
                                className="w-full mt-2 text-orange-600 hover:text-orange-700 font-semibold border-orange-300 hover:border-orange-400 rounded-xl"
                            >
                                Xem thêm ({allVouchers.length - 4} voucher)
                            </CustomButton>
                        )}
                    </div>
                )}
            </CardComponents>

            {/* Modal */}
            <CustomModal
                title={
                    <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-orange-500" />
                        <span>Voucher của Shop</span>
                    </div>
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                width={600}
            >
                {loading ? (
                    <div className="py-8 text-center">
                        <CustomSpinner size="large" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {allVouchers.map((voucher) => renderVoucherItem(voucher, true))}

                        {allVouchers.length === 0 && (
                            <div className="py-8 text-center text-gray-500">
                                Không có voucher nào
                            </div>
                        )}
                    </div>
                )}
            </CustomModal>
        </>
    );
}