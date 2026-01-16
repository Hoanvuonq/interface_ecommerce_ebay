'use client';

import React from 'react';
import {
    ShoppingCart,
    Tag as TagIcon,
    Truck,
    CheckCircle,
    Gift,
    Loader2,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import type { CartDto } from '@/types/cart/cart.types';
import { VoucherComponents } from '@/components/voucher/_components/voucherComponents';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/hooks/useFormatPrice';

interface CartSummaryProps {
    cart: CartDto | null;
    onCheckout?: () => void;
    loading?: boolean;
    isMobile?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
    cart,
    onCheckout,
    loading = false,
    isMobile = false
}) => {
    if (!cart) return null;

  
    const selectedItems = cart.shops.reduce((acc, shop) => {
        return acc + shop.items.filter(item => item.selectedForCheckout).length;
    }, 0);

    const selectedTotal = cart.shops.reduce((acc, shop) => {
        const shopTotal = shop.items
            .filter(item => item.selectedForCheckout)
            .reduce((sum, item) => sum + item.totalPrice, 0);
        return acc + shopTotal;
    }, 0);

    const selectedDiscount = cart.shops.reduce((acc, shop) => {
        const shopDiscount = shop.items
            .filter(item => item.selectedForCheckout)
            .reduce((sum, item) => sum + item.discountAmount * item.quantity, 0);
        return acc + shopDiscount;
    }, 0);

    const hasSelectedItems = selectedItems > 0;

    if (isMobile) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-50 safe-area-bottom">
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] uppercase font-bold text-gray-600">
                                Tổng cộng ({selectedItems})
                            </span>
                            {selectedDiscount > 0 && (
                                <span className="bg-red-50 text-red-600 text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase">
                                    Giảm {formatPrice(selectedDiscount)}
                                </span>
                            )}
                        </div>
                        <div className="text-xl font-semibold text-orange-600 truncate leading-none">
                            {formatPrice(selectedTotal)}
                        </div>
                    </div>

                    <button
                        onClick={onCheckout}
                        disabled={!hasSelectedItems || loading}
                        className={cn(
                            "h-12 px-8 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2 min-w-35",
                            hasSelectedItems
                                ? "bg-orange-500 shadow-lg shadow-orange-200"
                                : "bg-gray-300 cursor-not-allowed"
                        )}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <span>{hasSelectedItems ? 'Mua hàng' : 'Chọn SP'}</span>
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-custom shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-5 space-y-5">
                <div className="flex items-center justify-between bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <CheckCircle className={cn("w-5 h-5", hasSelectedItems ? "text-green-500" : "text-gray-300")} />
                        <span className="text-sm font-bold text-gray-600">
                            Đã chọn <span className="text-gray-900">{selectedItems}/{cart.itemCount}</span> sản phẩm
                        </span>
                    </div>
                </div>

                <div className="space-y-3 px-1">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Tạm tính</span>
                        <span className="text-gray-900 font-bold">
                            {formatPrice(selectedTotal)}
                        </span>
                    </div>

                    {selectedDiscount > 0 && (
                        <div className="flex justify-between items-center bg-red-50/50 p-2.5 rounded-lg border border-red-100/50">
                            <div className="flex items-center gap-2 text-red-600">
                                <TagIcon size={14} className="fill-red-100" />
                                <span className="text-xs font-bold uppercase">Giảm giá</span>
                            </div>
                            <span className="text-sm font-semibold text-red-600">
                                -{formatPrice(selectedDiscount)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Truck size={16} />
                            <span>Phí vận chuyển</span>
                        </div>
                        <span className="text-xs text-gray-600 italic">Tính khi thanh toán</span>
                    </div>
                </div>

                <div className="h-px bg-dashed-gray bg-[linear-gradient(to_right,#e5e7eb_50%,transparent_50%)] bg-size-[8px_1px] w-full" />

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-100 rounded-lg text-(--color-mainColor)">
                            <TagIcon size={16} />
                        </div>
                        <span className="text-sm font-bold text-gray-800">Mã giảm giá</span>
                    </div>
                    <VoucherComponents compact />
                </div>

                <div className="bg-gray-50 -mx-5 px-5 py-5 border-t border-gray-100 mt-2">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-base font-bold text-gray-800 uppercase tracking-tight">Tổng cộng</span>
                        <div className="text-right">
                            <p className="text-3xl font-semibold text-(--color-mainColor) leading-none mb-1">
                                {formatPrice(selectedTotal)}
                            </p>
                            {selectedDiscount > 0 && (
                                <p className="text-[10px] text-gray-600 font-medium uppercase">
                                    Bạn đã tiết kiệm được {formatPrice(selectedDiscount)}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onCheckout}
                        disabled={!hasSelectedItems || loading}
                        className={cn(
                            "w-full h-12 rounded-2xl font-semibold text-md transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 border-none",
                            hasSelectedItems 
                                ? "bg-(--color-mainColor) hover:bg-orange-600 text-white shadow-orange-200" 
                                : "bg-gray-200 text-gray-600 cursor-not-allowed shadow-none"
                        )}
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                <ShoppingCart size={18} />
                                <span>THANH TOÁN {hasSelectedItems && `(${selectedItems})`}</span>
                            </>
                        )}
                    </button>
                </div>

                {hasSelectedItems && selectedDiscount > 0 && (
                    <div className="flex items-center gap-2 justify-center bg-green-50 p-2.5 rounded-xl border border-green-100">
                        <Gift className="w-4 h-4 text-green-600 animate-bounce" />
                        <span className="text-[11px] font-bold text-green-700">
                            Đơn hàng của bạn đủ điều kiện nhận quà!
                        </span>
                    </div>
                )}

                {!hasSelectedItems && (
                    <div className="text-center pt-2">
                        <Link href="/products" className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group">
                            Tiếp tục mua sắm
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};