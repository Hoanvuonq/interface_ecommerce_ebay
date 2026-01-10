"use client";

import { useCart } from "@/app/(main)/products/_hooks/useCart";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import { cn } from "@/utils/cn";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ButtonField } from "../buttonField";
import { CustomInputNumber } from "../custom/components/customInputNumber";
import { IButtonProps } from "./type";
import { useToast } from "@/hooks/useToast";

export const AddToCartButton: React.FC<
  IButtonProps & { onQuantityChange?: (q: number) => void }
> = ({
  variantId,
  maxQuantity = 999,
  block = false,
  showQuantityInput = false,
  defaultQuantity = 1,
  disabled = false,
  onQuantityChange,
}) => {
  const { quickAddToCart } = useCart();
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [loading, setLoading] = useState(false);
  const { error: toastError } = useToast();

  // Tự động điều chỉnh số lượng nếu vượt quá tồn kho khi đổi Variant
  useEffect(() => {
    if (maxQuantity === 0) {
      updateQuantity(0);
    } else if (quantity > maxQuantity) {
      updateQuantity(maxQuantity);
    } else if (quantity === 0 && maxQuantity > 0) {
      updateQuantity(1);
    }
  }, [maxQuantity]);

  const handleAddToCart = async () => {
    if (!requireAuthentication(window.location.pathname)) return;
    setLoading(true);
    try {
      const result = await quickAddToCart(variantId, quantity);
      if (!result.success) {
        toastError(result.error || "Lỗi thêm vào giỏ");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (val: number | null) => {
    let finalVal = val === null ? 1 : val;

    // Ràng buộc logic: Không nhỏ hơn 1 (trừ khi hết hàng) và không lớn hơn tồn kho
    if (maxQuantity > 0) {
      if (finalVal < 1) finalVal = 1;
      if (finalVal > maxQuantity) finalVal = maxQuantity;
    } else {
      finalVal = 0;
    }

    setQuantity(finalVal);
    onQuantityChange?.(finalVal);
  };

  const QuantitySelector = (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm h-11">
      <button
        type="button"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= 1 || loading || disabled || maxQuantity === 0}
        className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-orange-500 disabled:opacity-30 transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>

      <CustomInputNumber
        min={maxQuantity > 0 ? 1 : 0}
        max={maxQuantity}
        value={quantity}
        onChange={updateQuantity}
        disabled={loading || disabled || maxQuantity === 0}
      />

      <button
        type="button"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= maxQuantity || loading || disabled || maxQuantity === 0}
        className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-orange-500 disabled:opacity-30 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  const MainButton = (
    <ButtonField
      type="login"
      onClick={handleAddToCart}
      disabled={disabled || loading || quantity < 1 || maxQuantity === 0}
      className={cn("flex-1 h-11 flex items-center justify-center gap-2 rounded-lg px-6 text-white shadow-lg transition-all")}
    >
      <span className="flex items-center gap-2">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
        {maxQuantity === 0 ? "Hết hàng" : "Thêm vào giỏ"}
      </span>
    </ButtonField>
  );

  return (
    <div className={cn("flex flex-col sm:flex-row items-stretch gap-3", block && "w-full")}>
      {showQuantityInput && QuantitySelector}
      {MainButton}
    </div>
  );
};