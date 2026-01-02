"use client";

import { AppPopover } from "@/components/appPopover";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCart } from "@/store/theme/cartSlice";
import { isLocalhost } from "@/utils/env";
import { isAuthenticated as checkAuth,getCachedUser } from "@/utils/local.storage";
import { ArrowRight, Container, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartPopoverContent } from "../cartPopover";
import { DropdownContainer } from "@/components";
import { useCartActions } from "../../_hooks/useCartActions";
import { Trigger } from "../trigger";

export const CartBadge = () => {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const { handleCheckout, isProcessing } = useCartActions(); 
  
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

  if (!mounted || !isLoggedIn) return null;

  const itemCount = cart?.itemCount || 0;

 const CartTrigger = (
  <Trigger 
    mounted={mounted} 
    unreadCount={itemCount} 
    onClick={() => router.push("/cart")}
    icon={<ShoppingCart size={22} />} 
  />
);
  return (
    <AppPopover trigger={CartTrigger} align="right" onOpenChange={handleOpenChange}>
      <DropdownContainer
        title="Sản phẩm mới thêm"
        icon={<Container size={18} />}
        footerActions={[
          { 
            label: "Giỏ hàng", 
            onClick: () => router.push("/cart"),
            variant: "secondary" 
          },
          { 
            label: "Thanh toán", 
            onClick: handleCheckout, 
            variant: "primary",
            icon: <ArrowRight size={14} />,
            loading: isProcessing 
          }
        ]}
      >
        <CartPopoverContent /> 
      </DropdownContainer>
    </AppPopover>
  );
};