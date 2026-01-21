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
import { useBuyNowStore } from "@/store/buyNowStore";



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
  const router = useRouter();
  const { quickAddToCart } = useCart();
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [loading, setLoading] = useState<"cart" | "buy" | null>(null);
  const { error: toastError } = useToast();

  useEffect(() => {
    if (maxQuantity === 0) {
      updateQuantity(0);
    } else if (quantity > maxQuantity) {
      updateQuantity(maxQuantity);
    } else if (quantity === 0 && maxQuantity > 0) {
      updateQuantity(1);
    }
  }, [maxQuantity]);

  const handleAction = async (type: "cart" | "buy") => {
    if (!requireAuthentication(window.location.pathname)) return;
    setLoading(type);
    try {
      const result = await quickAddToCart(variantId, quantity);
      if (!result.success) {
        toastError(result.error || "Lỗi thao tác");
      }
    } finally {
      setLoading(null);
    }
  };

  const updateQuantity = (val: number | null) => {
    let finalVal = val === null ? 1 : val;
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
    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-12 min-w-32.5">
      <button
        type="button"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= 1 || !!loading || disabled || maxQuantity === 0}
        className={cn(
          "w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50",
          "hover:text-orange-600 disabled:opacity-30 transition-all active:scale-90",
        )}
      >
        <Minus className="w-4 h-4" strokeWidth={3} />
      </button>

      <div className="flex-1 h-full font-black text-slate-800 italic">
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
          "w-10 h-full flex items-center justify-center text-slate-500",
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

        <button
          onClick={() => handleAction("cart")}
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

        <ButtonField
          type="login"
          onClick={() => handleAction("buy")}
          disabled={disabled || !!loading || maxQuantity === 0}
          className={cn(
            "flex-2 h-12 flex items-center justify-center gap-2 rounded-2xl px-8 text-white shadow-xl transition-all active:scale-95 font-black uppercase italic tracking-tighter text-[14px]",
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
