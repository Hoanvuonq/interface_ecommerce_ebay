'use client';

import { formatPriceFull } from '@/hooks/useFormatPrice';
import { VoucherOption } from '@/services/voucher/voucher.service';
import { cn } from '@/utils/cn';
import { toPublicUrl } from '@/utils/storage/url';
import { createPortal } from "react-dom";
import {
    AlertCircle,
    Gift,
    Info,
    Loader2,
    Tag as TagIcon,
    Truck,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GroupedVouchers, VoucherModalProps } from '../../_types/voucher';


export const VoucherModal: React.FC<VoucherModalProps> = ({
    open,
    onClose,
    onConfirm,
    onFetchVouchers,
    onApplyVoucherCode,
    appliedVouchers,
    appliedVoucher,
    title,
    shopName,
    isShopVoucher = false,
}) => {
    const [voucherCode, setVoucherCode] = useState('');
    const [applyingCode, setApplyingCode] = useState(false);
    const [vouchers, setVouchers] = useState<VoucherOption[]>([]);
    const [groupedVouchers, setGroupedVouchers] = useState<GroupedVouchers>({
        productOrderVouchers: [],
        shippingVouchers: [],
    });
    const [isGrouped, setIsGrouped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedOrderVoucherId, setSelectedOrderVoucherId] = useState<string | undefined>(
        appliedVouchers?.order?.id || appliedVoucher?.id
    );
    const [selectedShippingVoucherId, setSelectedShippingVoucherId] = useState<string | undefined>(
        appliedVouchers?.shipping?.id
    );

    // --- GIỮ NGUYÊN TOÀN BỘ USEEFFECTS ---
    useEffect(() => {
        if (open) {
            if (appliedVouchers) {
                setSelectedOrderVoucherId(appliedVouchers.order?.id || appliedVouchers.order?.code);
                setSelectedShippingVoucherId(appliedVouchers.shipping?.id || appliedVouchers.shipping?.code);
            } else if (appliedVoucher) {
                setSelectedOrderVoucherId(appliedVoucher.id || appliedVoucher.code);
                setSelectedShippingVoucherId(undefined);
            }
        }
    }, [open, appliedVouchers, appliedVoucher]);

    useEffect(() => {
        if (open && onFetchVouchers) {
            setLoading(true);
            onFetchVouchers()
                .then((result) => {
                    if (Array.isArray(result)) {
                        setVouchers(result);
                        setIsGrouped(false);
                    } else {
                        setGroupedVouchers(result);
                        setIsGrouped(true);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching vouchers:', error);
                    toast.error('Không thể tải danh sách voucher');
                })
                .finally(() => setLoading(false));
        }
    }, [open, onFetchVouchers]);

    

    const formatDiscount = (voucher: VoucherOption) => {
        if (voucher.discountType === 'PERCENTAGE' && voucher.discountAmount) {
            return `Giảm ${voucher.discountAmount}%`;
        } else if (voucher.discountType === 'FIXED' && voucher.discountAmount) {
            return `Giảm ${formatPriceFull(voucher.discountAmount)}`;
        }
        return 'Giảm giá';
    };

    const handleApplyCode = async () => {
        if (!voucherCode.trim()) { toast.warning('Vui lòng nhập mã voucher'); return; }
        if (!onApplyVoucherCode) return;
        setApplyingCode(true);
        try {
            const result = await onApplyVoucherCode(voucherCode.trim().toUpperCase());
            if (result.success && result.voucher) {
                toast.success(`Đã áp dụng voucher ${result.voucher.code} thành công!`);
                setVoucherCode('');
                if (onFetchVouchers) {
                    const refreshed = await onFetchVouchers();
                    setVouchers(Array.isArray(refreshed) ? refreshed : []);
                }
            } else {
                toast.error(result.error || 'Không thể áp dụng voucher này');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Có lỗi xảy ra');
        } finally { setApplyingCode(false); }
    };

    const handleConfirm = () => {
        if (isGrouped) {
            const selected: { order?: VoucherOption; shipping?: VoucherOption } = {};
            if (selectedOrderVoucherId) {
                const voucher = groupedVouchers.productOrderVouchers.find(v => v.id === selectedOrderVoucherId || v.code === selectedOrderVoucherId);
                if (voucher) selected.order = voucher;
            }
            if (selectedShippingVoucherId) {
                const voucher = groupedVouchers.shippingVouchers.find(v => v.id === selectedShippingVoucherId || v.code === selectedShippingVoucherId);
                if (voucher) selected.shipping = voucher;
            }
            onConfirm(selected.order || selected.shipping ? selected : undefined);
        } else {
            const selected = selectedOrderVoucherId 
                ? vouchers.find(v => v.id === selectedOrderVoucherId || v.code === selectedOrderVoucherId)
                : undefined;
            onConfirm(selected ? { order: selected } : undefined);
        }
        onClose();
    };

    const resolveVoucherImageUrl = (voucher: VoucherOption) => {
        if (voucher.imageBasePath && voucher.imageExtension) {
            return toPublicUrl(`${voucher.imageBasePath}_thumb${voucher.imageExtension}`);
        }
        return null;
    };

    // --- RENDER VOUCHER CARD (TỐI ƯU UI) ---
    const renderVoucherCard = (voucher: VoucherOption, type?: 'order' | 'shipping') => {
        const canSelect = voucher.canSelect !== false;
        const remainingCount = voucher.remainingCount ?? voucher.maxUsage;
        const remainingPercentage = voucher.remainingPercentage ?? 
            (voucher.maxUsage && voucher.usedCount !== undefined 
                ? Math.round(((voucher.maxUsage - voucher.usedCount) / voucher.maxUsage) * 100) : undefined);
        const isOutOfStock = remainingCount !== undefined && remainingCount <= 0;
        const isLowStock = remainingPercentage !== undefined && remainingPercentage < 30;

        const isSelected = isGrouped
            ? (type === 'order' 
                ? (selectedOrderVoucherId === voucher.id || selectedOrderVoucherId === voucher.code)
                : (selectedShippingVoucherId === voucher.id || selectedShippingVoucherId === voucher.code))
            : (selectedOrderVoucherId === voucher.id || selectedOrderVoucherId === voucher.code);

        const imageUrl = resolveVoucherImageUrl(voucher);
        const isShipping = type === 'shipping' || voucher.code?.toLowerCase().includes('ship');

        const handleSelect = () => {
            if (!canSelect || isOutOfStock) return;
            const isSame = isSelected;
            if (isGrouped && type) {
                if (type === 'order') setSelectedOrderVoucherId(isSame ? undefined : voucher.id);
                else setSelectedShippingVoucherId(isSame ? undefined : voucher.id);
            } else {
                setSelectedOrderVoucherId(isSame ? undefined : voucher.id);
            }
        };

        return (
            <div
                key={voucher.id}
                onClick={handleSelect}
                className={cn(
                    "relative flex bg-white mb-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden",
                    isSelected ? "border-orange-500 bg-orange-50/30" : "border-gray-100 hover:border-orange-200",
                    (!canSelect || isOutOfStock) && "opacity-60 grayscale bg-gray-50 cursor-not-allowed"
                )}
            >
                {/* Left: Icon Section (Thiết kế răng cưa) */}
                <div className={cn(
                    "w-24 shrink-0 flex flex-col items-center justify-center p-3 text-white relative",
                    isShipping ? "bg-cyan-500" : "bg-orange-500"
                )}>
                    {imageUrl ? (
                        <img src={imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm" />
                    ) : (
                        isShipping ? <Truck size={32} /> : <TagIcon size={32} />
                    )}
                    <span className="text-[10px] font-black mt-2 uppercase text-center leading-tight">
                        {isShipping ? "Vận chuyển" : "Giảm giá"}
                    </span>
                    {/* Sawtooth Effect */}
                    <div className="absolute top-0 bottom-0 -right-1 w-2 flex flex-col justify-around">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-white -mr-1" />
                        ))}
                    </div>
                </div>

                {/* Right: Content Section */}
                <div className="flex-1 p-4 min-w-0 flex flex-col justify-between relative">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate uppercase tracking-tighter">
                                {voucher.code}
                            </h4>
                            <p className="text-orange-600 font-black text-sm mt-1">
                                {formatDiscount(voucher)}
                            </p>
                        </div>
                        {/* Radio custom */}
                        <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                            isSelected ? "border-orange-500 bg-orange-500" : "border-gray-300"
                        )}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                    </div>

                    <div className="mt-2 space-y-2">
                        <p className="text-[11px] text-gray-500 line-clamp-1">
                            Đơn tối thiểu {formatPriceFull(voucher.minOrderValue || 0)}
                        </p>
                        
                        {remainingPercentage !== undefined && (
                            <div className="space-y-1">
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full transition-all duration-500", isLowStock ? "bg-red-500" : "bg-green-500")}
                                        style={{ width: `${100 - remainingPercentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tight text-gray-400">
                                    <span>Đã dùng {100 - remainingPercentage}%</span>
                                    {isLowStock && <span className="text-red-500 italic">Sắp hết!</span>}
                                </div>
                            </div>
                        )}

                        {/* Reason / Conditions link */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                            {!canSelect && voucher.reason ? (
                                <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                    <AlertCircle size={10} /> {voucher.reason}
                                </span>
                            ) : (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); /* Logic mở tooltip/popover chi tiết nếu cần */ }}
                                    className="text-[10px] text-blue-500 font-bold hover:underline flex items-center gap-1"
                                >
                                    <Info size={10} /> Điều kiện
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!open) return null;

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                        {title || (isShopVoucher ? `${shopName || 'Shop'} Voucher` : 'Chọn voucher')}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex gap-2">
                        <div className="relative flex-1 group">
                            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input 
                                type="text"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
                                placeholder="Nhập mã voucher tại đây..."
                                className="w-full pl-10 pr-4 py-3 bg-white border text-black border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all uppercase font-bold tracking-wider"
                            />
                        </div>
                        <button 
                            onClick={handleApplyCode}
                            disabled={applyingCode || !voucherCode}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-200 active:scale-95 flex items-center gap-2"
                        >
                            {applyingCode ? <Loader2 size={18} className="animate-spin" /> : "ÁP DỤNG"}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/30">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 size={40} className="animate-spin text-orange-500" />
                            <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Đang tìm ưu đãi...</p>
                        </div>
                    ) : isGrouped ? (
                        <div className="space-y-8">
                            {groupedVouchers.productOrderVouchers.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-end mb-4 px-1">
                                        <div>
                                            <h4 className="font-black text-gray-800 text-sm uppercase tracking-tighter">Mã Giảm Giá của Shop</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase italic">Có thể chọn 1 Voucher</p>
                                        </div>
                                    </div>
                                    {groupedVouchers.productOrderVouchers.map(v => renderVoucherCard(v, 'order'))}
                                </div>
                            )}
                            {groupedVouchers.shippingVouchers.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-end mb-4 px-1">
                                        <div>
                                            <h4 className="font-black text-gray-800 text-sm uppercase tracking-tighter">Mã Miễn Phí Vận Chuyển</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase italic">Có thể chọn 1 Voucher</p>
                                        </div>
                                    </div>
                                    {groupedVouchers.shippingVouchers.map(v => renderVoucherCard(v, 'shipping'))}
                                </div>
                            )}
                        </div>
                    ) : vouchers.length > 0 ? (
                        <div className="space-y-4">
                             <h4 className="font-black text-gray-800 text-sm uppercase tracking-widest mb-4 px-1">Ưu đãi từ cửa hàng</h4>
                             {vouchers.map(v => renderVoucherCard(v))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Gift size={64} className="text-orange-600 mb-4 animate-bounce" />
                            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Hiện không có voucher nào khả dụng</p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 cursor-pointer py-3.5 text-sm font-black text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all active:scale-95"
                    >
                        TRỞ LẠI
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className="flex-1 cursor-pointer py-3.5 text-sm font-black text-white bg-orange-500 hover:bg-orange-600 rounded-2xl transition-all shadow-xl shadow-orange-200 active:scale-95"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
     return createPortal(modalContent, document.body);
};