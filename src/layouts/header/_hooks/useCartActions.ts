import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkoutPreview, selectAllItemsLocal } from "@/store/theme/cartSlice";
import { toast } from "sonner";

export const useCartActions = () => {
  const dispatch = useAppDispatch();
  const { cart, checkoutLoading } = useAppSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!cart || cart.itemCount === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }
    
    setIsProcessing(true);
    try {
      dispatch(selectAllItemsLocal());
      
      const checkoutRequest = {
        shops: cart.shops.map((shop) => ({
          shopId: shop.shopId,
          itemIds: shop.items.map((item) => item.id),
          vouchers: [],
        })),
      };

      const preview = await dispatch(checkoutPreview(checkoutRequest)).unwrap();
      
      sessionStorage.setItem("checkoutPreview", JSON.stringify(preview));
      sessionStorage.setItem("checkoutRequest", JSON.stringify(checkoutRequest));
      window.location.href = "/checkout";
    } catch (error: any) {
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleCheckout,
    isProcessing: isProcessing || checkoutLoading
  };
};