"use client";

import { AppPopover } from "@/components/appPopover";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCart } from "@/store/theme/cartSlice";
import { isLocalhost } from "@/utils/env";
import {
    isAuthenticated as checkAuth,
    getCachedUser,
} from "@/utils/local.storage";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartPopover } from "../cartPopover";

export const CartBadge = () => {
  const dispatch = useAppDispatch();
  const { cart, loading } = useAppSelector((state) => state.cart);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const initialFetchCalled = useRef(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
    const authStatus = isLocalhost() ? !!getCachedUser() : checkAuth();
    setIsLoggedIn(authStatus);

    if (authStatus && !initialFetchCalled.current) {
      initialFetchCalled.current = true;
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const handleOpenChange = (open: boolean) => {
    if (open && isLoggedIn) {
      dispatch(fetchCart());
    }
  };
  const handleIconClick = (e: React.MouseEvent) => {
    router.push("/cart");
  };

  if (!mounted || !isLoggedIn) return null;

  const itemCount = cart?.itemCount || 0;

  const Trigger = (
    <div onClick={handleIconClick} className="p-2 relative rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer group">
      <ShoppingCart
        size={22}
        className="group-hover:scale-110 transition-transform"
      />
      {itemCount > 0 && (
        <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center h-4.5 w-4.5 rounded-full bg-[#ee4d2d] text-[10px] text-white font-bold ring-2 ring-orange-600">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </div>
  );

  return (
    <AppPopover trigger={Trigger} align="right" onOpenChange={handleOpenChange}>
      <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-2">
        <ShoppingCart size={16} className="text-gray-400" />
        <span className="text-sm font-bold text-gray-700">
          Sản phẩm mới thêm
        </span>
      </div>
      <CartPopover />
    </AppPopover>
  );
};
