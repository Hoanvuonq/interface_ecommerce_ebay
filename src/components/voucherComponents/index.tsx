'use client';

import { formatPrice } from '@/hooks/useFormatPrice';
import { voucherService } from '@/services/voucher/voucher.service';
import { cn } from '@/utils/cn';
import {
    CheckCircle2,
    ChevronDown,
    Ticket,
    X,
    XCircle,
    Loader2
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { VoucherInputProps } from './type';
import { VoucherModal } from '../voucherModal';

export const VoucherComponents: React.FC<VoucherInputProps> = ({
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
    const [voucherCode, setVoucherCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    // ✅ Lấy voucher Order và Shipping từ appliedVouchers (được sync từ preview API)
    const activeOrderVoucher = appliedVouchers?.order || (appliedVoucher ? { code: appliedVoucher.code, discount: appliedVoucher.discount } : null);
    const activeShippingVoucher = appliedVouchers?.shipping;
    const hasAnyVoucher = !!activeOrderVoucher || !!activeShippingVoucher;

    const handleApplyInput = async () => {
        if (!voucherCode.trim()) { setError('Vui lòng nhập mã voucher'); return; }
        setError('');
        setLoading(true);
        try {
            if (onApplyVoucher && shopId) {
                const success = await onApplyVoucher(shopId, voucherCode);
                if (success) { toast.success('Áp dụng voucher thành công!'); setVoucherCode(''); }
                else { setError('Mã voucher không hợp lệ'); }
            } else { toast.warning('Vui lòng dùng nút Chọn Voucher'); }
        } catch (err) { setError('Không thể áp dụng voucher'); } finally { setLoading(false); }
    };

    const handleRemove = async (e?: React.MouseEvent) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        if (onSelectVoucher) {
            await onSelectVoucher({});
            toast.info('Đã gỡ bỏ voucher');
        }
    };

    const mapForModal = (v: any) => v ? {
        id: v.code,
        code: v.code,
        description: v.description || '',
        discountAmount: v.discount || v.discountAmount || 0,
        discountType: 'FIXED' as const,
    } : undefined;

    if (compact) {
        return (
            <>
                <div className={cn("w-full", className)}>
                    {hasAnyVoucher ? (
                        <div
                            className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-all shadow-sm group relative overflow-hidden"
                            onClick={() => setModalOpen(true)}
                        >
                            {/* Icon vé mờ làm nền cho đẹp */}
                            <div className="absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform">
                                <Ticket size={48} className="text-emerald-600" />
                            </div>

                            <div className="relative z-10 space-y-2.5">
                                <div className="flex items-center justify-between border-b border-emerald-200/50 pb-1.5">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                        Voucher đang áp dụng
                                    </p>
                                    <div className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
                                        Tốt nhất
                                    </div>
                                </div>
                                
                                {/* Hiển thị chi tiết Voucher Giảm giá đơn hàng */}
                                {activeOrderVoucher && (
                                    <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="bg-orange-100 p-1.5 rounded-lg">
                                                <Ticket className="text-orange-500 w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-400 text-[9px] font-bold uppercase leading-none mb-1">Giảm giá</span>
                                                <span className="text-slate-900 font-black text-xs truncate uppercase tracking-tighter">
                                                    {activeOrderVoucher.code}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-red-600 font-black text-sm italic">
                                                -{formatPrice(activeOrderVoucher.discount || 0)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Hiển thị chi tiết Voucher Miễn phí vận chuyển */}
                                {activeShippingVoucher && (
                                    <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="bg-blue-100 p-1.5 rounded-lg">
                                                <Ticket className="text-blue-500 w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-400 text-[9px] font-bold uppercase leading-none mb-1">Vận chuyển</span>
                                                <span className="text-slate-900 font-black text-xs truncate uppercase tracking-tighter">
                                                    {activeShippingVoucher.code}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-red-600 font-black text-sm italic">
                                                -{formatPrice(activeShippingVoucher.discount || 0)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-center pt-1">
                                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest group-hover:underline flex items-center gap-1">
                                        <ChevronDown size={10} /> Chạm để thay đổi
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            type="button" 
                            onClick={() => setModalOpen(true)} 
                            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-orange-400 hover:text-orange-600 transition-all group active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                                <Ticket className="w-5 h-5 text-orange-500 group-hover:rotate-12 transition-transform" />
                                <span>{shopName ? `Voucher ${shopName}` : 'Chọn mã giảm giá'}</span>
                            </div>
                            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    )}
                </div>

                <VoucherModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={async (selected) => {
                        setModalOpen(false);
                        if (onSelectVoucher) await onSelectVoucher(selected || {});
                    }}
                    onFetchVouchers={async () => {
                        const fetchParams: any = {
                            ...context,
                            totalAmount: context?.totalAmount || 0,
                            shippingFee: context?.shippingFee || 0,
                        };
                        if (!forcePlatform && shopId) {
                            fetchParams.shopId = shopId;
                            return await voucherService.getShopVouchersWithContext(fetchParams);
                        }
                        return await voucherService.getPlatformVouchersWithContext(fetchParams);
                    }}
                    appliedVouchers={{ 
                        order: mapForModal(activeOrderVoucher), 
                        shipping: mapForModal(activeShippingVoucher) 
                    }}
                    title={shopName ? `${shopName} Voucher` : "Voucher của bạn"}
                    shopName={shopName}
                    isShopVoucher={!!shopId}
                />
            </>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Nhập mã voucher..."
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm uppercase focus:border-orange-500 outline-none transition-all"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                />
                <button 
                    type="button" 
                    onClick={handleApplyInput} 
                    disabled={loading || !voucherCode} 
                    className="px-6 bg-slate-900 text-white font-black text-xs uppercase rounded-xl hover:bg-orange-500 disabled:bg-slate-200 transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Áp dụng'}
                </button>
            </div>
            {/* Hiển thị card voucher cho mode full (nếu cần) tương tự như trên */}
        </div>
    );
};