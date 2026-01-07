"use client";

import { useCart } from "@/app/(main)/products/_hooks/useCart";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import { cn } from "@/utils/cn";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { IButtonProps, IInputProps } from "./type";

const CustomInputNumber: React.FC<IInputProps> = ({
  min,
  max,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="relative group">
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ""}
        onChange={(e) => {
          const numValue = parseInt(e.target.value);
          if (!isNaN(numValue)) onChange(numValue);
          else if (e.target.value === "") onChange(null);
        }}
        disabled={disabled}
        className={cn(
          "w-14 h-10 text-center font-bold text-gray-900 border-x-0 border-y border-gray-200 focus:outline-none transition duration-200",
          disabled && "bg-gray-50 text-gray-600"
        )}
      />
    </div>
  );
};

export const AddToCartButton: React.FC<IButtonProps> = ({
  variantId,
  productName,
  maxQuantity = 999,
  size = "large",
  block = false,
  showQuantityInput = false,
  defaultQuantity = 1,
  disabled = false,
}) => {
  const { quickAddToCart } = useCart();
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!requireAuthentication(window.location.pathname)) return;
    setLoading(true);
    try {
      const result = await quickAddToCart(variantId, quantity);
      if (result.success) {
      } else {
        toast.error(result.error || "Lỗi thêm vào giỏ");
      }
    } finally {
      setLoading(false);
    }
  };

  if (showQuantityInput) {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row items-stretch gap-3",
          block && "w-full"
        )}
      >
        <div className="flex items-center justify-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-12">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={quantity <= 1 || loading || disabled}
            className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-orange-500 disabled:opacity-30 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <CustomInputNumber
            min={1}
            size={size}
            max={maxQuantity}
            value={quantity}
            onChange={(val) => setQuantity(val ?? 1)}
            disabled={loading || disabled}
          />

          <button
            onClick={() =>
              setQuantity((prev) => Math.min(maxQuantity, prev + 1))
            }
            disabled={quantity >= maxQuantity || loading || disabled}
            className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-orange-500 disabled:opacity-30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={disabled || loading || quantity < 1}
          className={cn(
            "flex-1 h-12 flex items-center justify-center gap-2 rounded-xl px-6 font-bold text-white shadow-lg shadow-orange-200 transition-all active:scale-[0.98]",
            "bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600",
            "disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
          )}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
          <span>THÊM VÀO GIỎ</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || loading || quantity < 1}
      className={cn(
        "flex-1 h-12 flex items-center justify-center gap-2 rounded-xl px-6 font-bold text-white shadow-lg shadow-orange-200 transition-all active:scale-[0.98]",
        "bg-linear-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600",
        "disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
      )}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      <span>THÊM VÀO GIỎ</span>
    </button>
  );
};
