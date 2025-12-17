"use client";

import { AppPopover } from '@/components/appPopover';
import { Package, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const itemCount = 0; 

export const CartBadge = () => {
    const Trigger = (
        <div className="p-2 relative rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-[10px] text-white font-bold ring-2 ring-[var(--color-primary)]">
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </div>
    );

    return (
        <AppPopover trigger={Trigger} className="w-80" align="right">
            <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-white">
                <ShoppingCart size={18} className="text-gray-600" />
                <span className="font-bold text-base text-gray-800">Giỏ hàng của bạn</span>
            </div>

            {itemCount === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center text-center bg-white">
                    <div className="text-gray-200 mb-4">
                        <Package size={64} strokeWidth={1} />
                    </div>
                    <p className="font-bold text-gray-700 mb-1">Giỏ hàng trống</p>
                    <p className="text-sm text-gray-500 mb-6 px-4">
                        Bạn chưa có sản phẩm nào. Hãy khám phá ngay để tìm món đồ ưng ý!
                    </p>
                    
                    <Link 
                        href="/products"
                        className="w-full bg-[#661b1b] text-white font-medium py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                    >
                        Khám phá sản phẩm
                    </Link>
                </div>
            ) : (
                // Trường hợp có sản phẩm (bạn có thể map danh sách sản phẩm ở đây)
                <div className="p-4 text-center bg-white">
                    <Link 
                        href="/cart" 
                        className="text-sm text-pink-600 font-bold hover:underline"
                    >
                        Xem chi tiết giỏ hàng ({itemCount})
                    </Link>
                </div>
            )}
        </AppPopover>
    );
};