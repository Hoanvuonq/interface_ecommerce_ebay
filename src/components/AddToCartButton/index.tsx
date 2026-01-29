"use client";

import { useCart } from "@/app/(main)/products/_hooks/useCart";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import { cn } from "@/utils/cn";
import { Loader2, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ButtonField } from "../buttonField";
import { CustomInputNumber } from "../custom/components/customInputNumber";
import { IButtonProps } from "./type";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { fetchCart, checkoutPreview } from "@/store/theme/cartSlice";

export const AddToCartButton: React.FC<
  IButtonProps & {
    onQuantityChange?: (q: number) => void;
    shopId?: string;
    price?: number;
  }
> = ({
  variantId,
  maxQuantity = 999,
  block = false,
  showQuantityInput = false,
  defaultQuantity = 1,
  disabled = false,
  onQuantityChange,
  shopId,
}) => {
  const router = useRouter();
  const { quickAddToCart } = useCart();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [loading, setLoading] = useState<"cart" | "buy" | null>(null);
  const { error: toastError } = useToast();

  useEffect(() => {
    if (maxQuantity === 0) updateQuantity(0);
    else if (quantity > maxQuantity) updateQuantity(maxQuantity);
    else if (quantity === 0 && maxQuantity > 0) updateQuantity(1);
  }, [maxQuantity]);

  const updateQuantity = (val: number | null) => {
    let finalVal = val === null ? 1 : val;
    if (maxQuantity > 0) {
      if (finalVal < 1) finalVal = 1;
      if (finalVal > maxQuantity) finalVal = maxQuantity;
    } else finalVal = 0;
    setQuantity(finalVal);
    onQuantityChange?.(finalVal);
  };

  const handleAddToCart = async () => {
    if (!requireAuthentication(window.location.pathname)) return;
    setLoading("cart");
    try {
      const result = await quickAddToCart(variantId, quantity);
      if (!result.success) toastError(result.error || "Lỗi thao tác");
    } finally {
      setLoading(null);
    }
  };

  const handleBuyNow = async () => {
    // 1. Check Auth
    if (!requireAuthentication(window.location.pathname)) return;
    if (!shopId) {
      toastError("Thiếu thông tin cửa hàng.");
      return;
    }
    setLoading("buy");
    try {
      const result = await quickAddToCart(variantId, quantity);
      console.debug("BuyNow: quickAddToCart result", { variantId, quantity, result });
      if (!result.success) {
        toastError(result.error || "Không thể khởi tạo đơn hàng");
        return;
      }

      // Refresh cart to get the newly added item ID
      const refreshed = await dispatch(fetchCart()).unwrap();
      console.debug("BuyNow: refreshed cart", refreshed);

      // Try to locate the cart item that was just added (match by variantId or other fields)
      let foundItem: any = null;
      if (refreshed && Array.isArray(refreshed.shops)) {
        for (const s of refreshed.shops) {
          for (const it of s.items || []) {
            const candidateVariantIds = [
              it.variantId,
              // sometimes backend might use different field names
              (it as any).productVariantId,
              // nested variant object
              (it as any).variant?.id,
            ].filter(Boolean);

            if (candidateVariantIds.includes(variantId)) {
              foundItem = it;
              break;
            }
          }
          if (foundItem) {
            break;
          }
        }
      }

      let checkoutRequest: any = null;

      if (foundItem) {
        checkoutRequest = {
          shops: [
            {
              shopId: foundItem.shopId,
              items: [
                {
                  itemId: foundItem.id,
                  quantity: foundItem.quantity,
                },
              ],
              vouchers: [],
            },
          ],
          promotion: [],
        };
      } else {
        console.warn("BuyNow: could not find newly added cart item by variantId, falling back to buy-now style request", { variantId, refreshed });
        // Fallback: build buy-now style request using variantId (backend accepts this in buy-now flow)
        checkoutRequest = {
          shops: [
            {
              shopId: shopId,
              items: [
                {
                  // backend buy-now expects itemId to be variantId in this flow
                  itemId: variantId,
                  quantity: quantity,
                },
              ],
              itemIds: [variantId],
              vouchers: [],
              globalVouchers: [],
              serviceCode: 0,
              shippingFee: 0,
            },
          ],
          promotion: [],
        };
      }

      // Create preview and store it so /checkout can initialize
      let previewData: any = null;
      try {
        previewData = await dispatch(checkoutPreview(checkoutRequest)).unwrap();
        console.debug("BuyNow: checkoutPreview result", previewData);
      } catch (e) {
        console.error("BuyNow: checkoutPreview failed", e);
      }

      try {
        if (previewData) sessionStorage.setItem("checkoutPreview", JSON.stringify(previewData));
        sessionStorage.setItem("checkoutRequest", JSON.stringify(checkoutRequest));
      } catch (e) {
        console.warn("BuyNow: sessionStorage write failed", e);
      }

      window.location.href = "/checkout";
    } catch (err: any) {
      console.error(err);
      toastError("Lỗi hệ thống.");
    } finally {
      setLoading(null);
    }
  };

  const QuantitySelector = (
    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-12 min-w-32.5">
      <button
        type="button"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= 1 || !!loading || disabled || maxQuantity === 0}
        className={cn(
          "w-10 h-full flex items-center justify-center text-gray-500 hover:bg-slate-50",
          "hover:text-orange-600 disabled:opacity-30 transition-all active:scale-90",
        )}
      >
        <Minus className="w-4 h-4" strokeWidth={3} />
      </button>
      <div className="flex-1 h-full font-bold text-gray-800 italic">
        <CustomInputNumber
          min={maxQuantity > 0 ? 1 : 0}
          max={maxQuantity}
          value={quantity}
          onChange={updateQuantity}
          disabled={!!loading || disabled || maxQuantity === 0}
        />
      </div>
      <button
        type="button"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={
          quantity >= maxQuantity || !!loading || disabled || maxQuantity === 0
        }
        className={cn(
          "w-10 h-full flex items-center justify-center text-gray-500",
          "hover:bg-slate-50 hover:text-orange-600 disabled:opacity-30 transition-all active:scale-90",
        )}
      >
        <Plus className="w-4 h-4" strokeWidth={3} />
      </button>
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-4", block && "w-full")}>
      <div className="flex flex-wrap items-center gap-3">
        {showQuantityInput && QuantitySelector}
        
        {/* Nút Thêm vào giỏ */}
        <button
          onClick={handleAddToCart}
          disabled={disabled || !!loading || maxQuantity === 0}
          className={cn(
            "flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl px-6 font-bold uppercase text-[12px] tracking-widest transition-all shadow-sm active:scale-95 border-2",
            "border-orange-500 text-orange-600 bg-white hover:bg-orange-50 disabled:opacity-50",
          )}
        >
          {loading === "cart" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
          {maxQuantity === 0 ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
        </button>

        {/* Nút Mua ngay */}
        <ButtonField
          type="login"
          onClick={handleBuyNow}
          disabled={disabled || !!loading || maxQuantity === 0}
          className={cn(
            "flex-2 h-12 flex items-center justify-center gap-2 rounded-2xl px-8 text-white shadow-xl transition-all active:scale-95 font-bold uppercase italic tracking-tighter text-[14px]",
          )}
        >
          <span className="flex gap-2 items-center">
            {loading === "buy" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 fill-current" />
            )}
            MUA NGAY
          </span>
        </ButtonField>
      </div>
    </div>
  );
};