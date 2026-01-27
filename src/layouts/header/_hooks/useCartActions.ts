import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkoutPreview, selectAllItemsLocal } from "@/store/theme/cartSlice";
import { useToast } from "@/hooks/useToast";

export const useCartActions = () => {
  const dispatch = useAppDispatch();
  const { cart, checkoutLoading } = useAppSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const { error } = useToast();

  const handleCheckout = async () => {
    if (!cart || cart.itemCount === 0) {
      error("Giỏ hàng của bạn đang trống");
      return;
    }

    setIsProcessing(true);
    try {
      dispatch(selectAllItemsLocal());

      const checkoutRequest = {
        shops: cart.shops.map((shop) => ({
          shopId: shop.shopId,
          items: shop.items.map((item) => ({
            itemId: item.id,
            quantity: item.quantity, 
          })),
          vouchers: [],
        })),
        promotion: [],
      };

      const preview = await dispatch(checkoutPreview(checkoutRequest as any)).unwrap();

      sessionStorage.setItem("checkoutPreview", JSON.stringify(preview));
      sessionStorage.setItem(
        "checkoutRequest",
        JSON.stringify(checkoutRequest)
      );
      window.location.href = "/checkout";
    } catch (err: any) {
      console.error(err);
      error("Không thể tạo đơn hàng. Vui lòng thử lại");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleCheckout,
    isProcessing: isProcessing || checkoutLoading,
  };
};