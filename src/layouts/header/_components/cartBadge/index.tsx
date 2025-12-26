"use client";

import { AppPopover } from '@/components/appPopover';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchCart } from '@/store/theme/cartSlice';
import { isLocalhost } from '@/utils/env';
import { isAuthenticated as checkAuth, getCachedUser } from '@/utils/local.storage';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartPopover } from '../cartPopover';

export const CartBadge = () => {
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector((state) => state.cart);
    
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setMounted(true);
        let authStatus = false;
        
        if (isLocalhost()) {
            authStatus = !!getCachedUser();
        } else {
            authStatus = checkAuth();
        }
        
        setIsLoggedIn(authStatus);

        if (authStatus) {
            dispatch(fetchCart());
        }
    }, [dispatch]);

    if (!mounted) return null;

    if (!isLoggedIn) return null;

    const itemCount = cart?.itemCount || 0;

    const handleOpenChange = (open: boolean) => {
        if (open) {
            dispatch(fetchCart());
        }
    };

    const Trigger = (
        <div className="p-2 relative rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer group">
            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
            
            {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center h-4.5 w-4.5 rounded-full bg-[#ee4d2d] text-[10px] text-white font-bold ring-2 ring-(--color-primary)">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </div>
    );

    return (
        <AppPopover 
            trigger={Trigger} 
            align="right"
            onOpenChange={handleOpenChange}
            isMobileFixed={true} 
            mobileTop="top-[50px]" 
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                    <ShoppingCart size={18} className="text-gray-400" />
                    <span className="font-bold text-base text-gray-800">Sản phẩm mới thêm</span>
                </div>
                {loading && <Loader2 size={14} className="animate-spin text-orange-500" />}
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <CartPopover open={true} />
            </div>
        </AppPopover>
    );
};