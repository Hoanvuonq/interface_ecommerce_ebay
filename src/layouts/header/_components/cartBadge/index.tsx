"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/utils/cn';

const itemCount = 0; 

export const CartBadge = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 relative rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-expanded={isOpen}
                aria-label={`Giỏ hàng có ${itemCount} mặt hàng`}
            >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                    <span 
                        className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-[10px] text-white font-bold ring-2 ring-[var(--color-primary)]"
                    >
                        {itemCount > 9 ? '9+' : itemCount}
                    </span>
                )}
            </button>

            {/* Dropdown Giỏ hàng */}
            {isOpen && (
                <div 
                    className={cn(
                        "absolute right-0 top-full mt-2 w-80 max-w-sm bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-30 transform origin-top-right",
                    )}
                    style={{ minWidth: '320px' }}
                >
                    <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                        <ShoppingCart size={18} className="text-gray-600" />
                        <span className="font-bold text-base">Giỏ hàng của bạn</span>
                    </div>

                    {/* Nội dung Giỏ hàng rỗng (Dựa trên image_6472e1.png) */}
                    {itemCount === 0 ? (
                        <div className="p-8 flex flex-col items-center justify-center text-center">
                            {/* Icon Giỏ hàng rỗng (Ví dụ: Icon Package) */}
                            <div className="text-gray-300 mb-3">
                                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-8 4h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="font-semibold text-gray-700 mb-1">Giỏ hàng trống</p>
                            <p className="text-sm text-gray-500 mb-4">Thêm sản phẩm để bắt đầu mua sắm</p>
                            
                            <Link 
                                href="/products"
                                onClick={() => setIsOpen(false)}
                                className="bg-red-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-900 transition-colors shadow-md"
                                style={{ backgroundColor: '#661b1b' }}
                            >
                                Khám phá sản phẩm
                            </Link>
                        </div>
                    ) : (
                        <div className="p-4 text-center">
                            <Link href="/cart" className="text-sm text-pink-600 font-medium">Xem giỏ hàng</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};