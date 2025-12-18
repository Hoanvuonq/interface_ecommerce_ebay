'use client';

import React, { useState } from 'react';
import { 
    Tag as TagIcon, 
    CheckCircle2, 
    XCircle, 
    ChevronDown, 
    Ticket, 
    Loader2,
    X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { VoucherModal } from '../VoucherModal';
import { voucherService } from '@/services/voucher/voucher.service';
import { toast } from 'sonner';
import { VoucherInputProps } from '../../_types/voucher';
import { formatPrice } from '@/hooks/useFormatPrice';


export const VoucherInput: React.FC<VoucherInputProps> = ({
    shopId,
    shopName,
    onApplyVoucher,
    onSelectVoucher,
    appliedVoucher,
    appliedVouchers,
    compact = false,
    className,
    context,
    forcePlatform = false,
}) => {
    // --- GIỮ NGUYÊN LOGIC STATES ---
    const [voucherCode, setVoucherCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingVoucher, setPendingVoucher] = useState<{
        order?: { code: string; discount: number; description?: string };
        shipping?: { code: string; discount: number; description?: string };
    } | null>(null);

    
    const handleApply = async () => {
        if (!voucherCode.trim()) {
            setError('Vui lòng nhập mã voucher');
            return;
        }
        setError('');
        setLoading(true);
        try {
            if (onApplyVoucher && shopId) {
                const success = await onApplyVoucher(shopId, voucherCode);
                if (success) {
                    toast.success('Áp dụng voucher thành công!');
                    setVoucherCode('');
                } else {
                    setError('Mã voucher không hợp lệ hoặc đã hết hạn');
                }
            } else {
                toast.warning('Tính năng đang phát triển');
            }
        } catch (err) {
            setError('Không thể áp dụng voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        setVoucherCode('');
        setError('');
        setPendingVoucher(null);
        if (onSelectVoucher) {
            try {
                await onSelectVoucher({});
            } catch (err) {
                console.error('Failed to clear voucher', err);
            }
        } else {
            toast.info('Đã xóa voucher');
        }
    };

    // --- COMPACT MODE LOGIC (GIỮ NGUYÊN LOGIC MAPPING) ---
    if (compact) {
        const effectiveAppliedVoucher = pendingVoucher?.order
            ? { code: pendingVoucher.order.code, discount: pendingVoucher.order.discount, description: pendingVoucher.order.description }
            : appliedVoucher;

        const effectiveAppliedVouchers = pendingVoucher
            ? { order: pendingVoucher.order, shipping: pendingVoucher.shipping }
            : appliedVouchers;

        const appliedVouchersOption = effectiveAppliedVouchers ? {
            order: effectiveAppliedVouchers.order ? {
                id: effectiveAppliedVouchers.order.code,
                code: effectiveAppliedVouchers.order.code,
                description: effectiveAppliedVouchers.order.description,
                discountAmount: effectiveAppliedVouchers.order.discount,
                discountType: 'FIXED' as const,
            } : undefined,
            shipping: effectiveAppliedVouchers.shipping ? {
                id: effectiveAppliedVouchers.shipping.code,
                code: effectiveAppliedVouchers.shipping.code,
                description: effectiveAppliedVouchers.shipping.description,
                discountAmount: effectiveAppliedVouchers.shipping.discount,
                discountType: 'FIXED' as const,
            } : undefined,
        } : undefined;

        const appliedVoucherOption = effectiveAppliedVoucher ? {
            id: effectiveAppliedVoucher.code,
            code: effectiveAppliedVoucher.code,
            description: effectiveAppliedVoucher.description,
            discountAmount: effectiveAppliedVoucher.discount,
            discountType: 'FIXED' as const,
        } : undefined;

        const hasAppliedVouchers = effectiveAppliedVouchers && (effectiveAppliedVouchers.order || effectiveAppliedVouchers.shipping);
        const hasAppliedVoucher = !!effectiveAppliedVoucher;

        return (
            <>
                <div className={className}>
                    {(hasAppliedVouchers || hasAppliedVoucher) ? (
                        <div
                            className="bg-green-50 rounded-xl p-3 border border-green-200 cursor-pointer hover:bg-green-100 transition-all shadow-sm"
                            onClick={() => setModalOpen(true)}
                        >
                            <div className="space-y-2">
                                {effectiveAppliedVouchers?.order && (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <CheckCircle2 className="text-green-600 w-3.5 h-3.5 shrink-0" />
                                            <span className="text-gray-900 font-bold text-[11px] sm:text-xs truncate uppercase">
                                                {effectiveAppliedVouchers.order.code}
                                            </span>
                                        </div>
                                        <span className="text-red-600 font-black text-[11px] sm:text-xs whitespace-nowrap">
                                            -{formatPrice(effectiveAppliedVouchers.order.discount)}
                                        </span>
                                    </div>
                                )}
                                {effectiveAppliedVouchers?.shipping && (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <CheckCircle2 className="text-green-600 w-3.5 h-3.5 shrink-0" />
                                            <span className="text-gray-900 font-bold text-[11px] sm:text-xs truncate uppercase">
                                                {effectiveAppliedVouchers.shipping.code}
                                            </span>
                                        </div>
                                        <span className="text-red-600 font-black text-[11px] sm:text-xs whitespace-nowrap">
                                            -{formatPrice(effectiveAppliedVouchers.shipping.discount)}
                                        </span>
                                    </div>
                                )}
                                {effectiveAppliedVoucher && !effectiveAppliedVouchers && (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <CheckCircle2 className="text-green-600 w-3.5 h-3.5 shrink-0" />
                                            <span className="text-gray-900 font-bold text-[11px] sm:text-xs truncate uppercase">
                                                {effectiveAppliedVoucher.code}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-600 font-black text-[11px] sm:text-xs whitespace-nowrap">
                                                -{formatPrice(effectiveAppliedVoucher.discount)}
                                            </span>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await handleRemove();
                                                }}
                                                className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-center mt-2 pt-2 border-t border-green-200/50">
                                <ChevronDown className="text-green-400 w-4 h-4 animate-bounce" />
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-blue-50/50 border border-dashed border-blue-300 rounded-xl text-blue-600 hover:bg-blue-100/50 hover:border-blue-400 transition-all group active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <Ticket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span>Chọn voucher</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-blue-400 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    )}
                </div>

                <VoucherModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={async (selectedVouchers) => {
                        if (!selectedVouchers) {
                            setPendingVoucher(null);
                            setModalOpen(false);
                            if (onSelectVoucher) await onSelectVoucher({});
                            return;
                        }
                        const pendingData: any = {};
                        if (selectedVouchers.order) {
                            pendingData.order = {
                                code: selectedVouchers.order.code,
                                discount: selectedVouchers.order.discountAmount || 0,
                                description: selectedVouchers.order.description,
                            };
                        }
                        if (selectedVouchers.shipping) {
                            pendingData.shipping = {
                                code: selectedVouchers.shipping.code,
                                discount: selectedVouchers.shipping.discountAmount || 0,
                                description: selectedVouchers.shipping.description,
                            };
                        }
                        setPendingVoucher(pendingData);
                        setModalOpen(false);

                        if (onSelectVoucher) {
                            const success = await onSelectVoucher(selectedVouchers);
                            if (success) { toast.success('Áp dụng voucher thành công!'); setPendingVoucher(null); }
                            else { setPendingVoucher(null); toast.error('Không thể áp dụng voucher'); }
                        } else if (selectedVouchers.order && onApplyVoucher && shopId) {
                            const success = await onApplyVoucher(shopId, selectedVouchers.order.code);
                            if (success) { toast.success('Áp dụng voucher thành công!'); setPendingVoucher(null); }
                            else { setPendingVoucher(null); toast.error('Không thể áp dụng voucher'); }
                        }
                    }}
                     onFetchVouchers={async () => {
                        if (!forcePlatform && shopId) {
                            if (context && context.totalAmount !== undefined) {
                                return await voucherService.getShopVouchersWithContext({
                                    shopId,
                                    totalAmount: context.totalAmount,
                                    shopIds: context.shopIds,
                                    productIds: context.productIds,
                                    shippingFee: context.shippingFee,
                                    shippingMethod: context.shippingMethod,
                                    shippingProvince: context.shippingProvince,
                                    shippingDistrict: context.shippingDistrict,
                                    shippingWard: context.shippingWard,
                                    failedVoucherCodes: context.failedVoucherCodes,
                                    preferences: context.preferences,
                                });
                            } else {
                                return await voucherService.getShopVouchersForBuyer(shopId);
                            }
                        } else {
                            if (context && context.totalAmount !== undefined) {
                                return await voucherService.getPlatformVouchersWithContext({
                                    totalAmount: context.totalAmount,
                                    shopIds: context.shopIds,
                                    productIds: context.productIds,
                                    shippingFee: context.shippingFee,
                                    shippingMethod: context.shippingMethod,
                                    shippingProvince: context.shippingProvince,
                                    shippingDistrict: context.shippingDistrict,
                                    shippingWard: context.shippingWard,
                                    failedVoucherCodes: context.failedVoucherCodes,
                                    preferences: context.preferences,
                                });
                            } else {
                                // Fallback to legacy API
                                return await voucherService.getPlatformVouchers();
                            }
                        }
                    }}
                    appliedVouchers={appliedVouchersOption}
                    appliedVoucher={appliedVoucherOption}
                    title={shopName ? `${shopName} Voucher` : 'Chọn voucher platform'}
                    shopName={shopName}
                    isShopVoucher={!!shopId}
                />
            </>
        );
    }

    // --- FULL MODE FOR MAIN CONTENT ---
    return (
        <div className={cn("space-y-3", className)}>
            {appliedVoucher ? (
                <div className="bg-green-50 rounded-xl p-3 border border-green-200 shadow-sm animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="bg-green-100 p-2 rounded-lg text-green-600 shrink-0">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="min-w-0">
                                <span className="text-gray-900 font-black text-sm block truncate uppercase tracking-tight">
                                    {appliedVoucher.code}
                                </span>
                                <span className="text-gray-500 text-[11px] font-medium">
                                    Đã tiết kiệm {formatPrice(appliedVoucher.discount)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all rounded-lg"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors active:opacity-70"
                >
                    <Ticket className="w-4 h-4" />
                    <span>{shopName ? 'Chọn Voucher Shop' : 'Chọn hoặc nhập mã giảm giá'}</span>
                </button>
            )}

            <VoucherModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={async (selectedVouchers) => {
                    if (!selectedVouchers) {
                        if (onSelectVoucher) await onSelectVoucher({});
                        setModalOpen(false);
                        return;
                    }
                    if (onSelectVoucher) {
                        const success = await onSelectVoucher(selectedVouchers);
                        if (success) toast.success('Áp dụng voucher thành công!');
                    } else if (selectedVouchers.order && onApplyVoucher && shopId) {
                        const success = await onApplyVoucher(shopId, selectedVouchers.order.code);
                        if (success) toast.success('Áp dụng voucher thành công!');
                    }
                    setModalOpen(false);
                }}
               onFetchVouchers={async () => {
                    if (shopId) {
                        if (context && context.totalAmount !== undefined) {
                            return await voucherService.getShopVouchersWithContext({
                                shopId,
                                totalAmount: context.totalAmount,
                                shopIds: context.shopIds,
                                productIds: context.productIds,
                                shippingFee: context.shippingFee,
                                shippingMethod: context.shippingMethod,
                                shippingProvince: context.shippingProvince,
                                shippingDistrict: context.shippingDistrict,
                                shippingWard: context.shippingWard,
                                failedVoucherCodes: context.failedVoucherCodes,
                                preferences: context.preferences,
                            });
                        } else {
                            return await voucherService.getShopVouchersForBuyer(shopId);
                        }
                    } else {
                        if (context && context.totalAmount !== undefined) {
                            return await voucherService.getPlatformVouchersWithContext({
                                totalAmount: context.totalAmount,
                                shopIds: context.shopIds,
                                productIds: context.productIds,
                                shippingFee: context.shippingFee,
                                shippingMethod: context.shippingMethod,
                                shippingProvince: context.shippingProvince,
                                shippingDistrict: context.shippingDistrict,
                                shippingWard: context.shippingWard,
                                failedVoucherCodes: context.failedVoucherCodes,
                                preferences: context.preferences,
                            });
                        } else {
                            return await voucherService.getPlatformVouchers();
                        }
                    }
                }}
                appliedVouchers={appliedVouchers ? {
                    order: appliedVouchers.order ? {
                        id: appliedVouchers.order.code,
                        code: appliedVouchers.order.code,
                        description: appliedVouchers.order.description,
                        discountAmount: appliedVouchers.order.discount,
                        discountType: 'FIXED' as const,
                    } : undefined,
                    shipping: appliedVouchers.shipping ? {
                        id: appliedVouchers.shipping.code,
                        code: appliedVouchers.shipping.code,
                        description: appliedVouchers.shipping.description,
                        discountAmount: appliedVouchers.shipping.discount,
                        discountType: 'FIXED' as const,
                    } : undefined,
                } : undefined}
                appliedVoucher={appliedVoucher ? {
                    id: appliedVoucher.code,
                    code: appliedVoucher.code,
                    description: appliedVoucher.description,
                    discountAmount: appliedVoucher.discount,
                    discountType: 'FIXED' as const,
                } : undefined}
                title={shopName ? `${shopName} Voucher` : 'Chọn voucher platform'}
                shopName={shopName}
                isShopVoucher={!!shopId}
            />
        </div>
    );
};