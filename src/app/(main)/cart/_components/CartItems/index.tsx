"use client";

import {
  categoryIcons,
  getStandardizedKey,
  ICON_BG_COLORS,
} from "@/app/(main)/(home)/_types/categories";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { useToast } from "@/hooks/useToast";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  removeCartItem,
  toggleItemSelectionLocal,
  updateCartItem,
} from "@/store/theme/cartSlice";
import { cn } from "@/utils/cn";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";
import { CheckCircle2, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CartItemProps } from "../../_types/cartItems";
import Link from "next/link";
export const CartItem: React.FC<CartItemProps> = ({
  item,
  etag,
  selected = false,
  onToggleSelection,
  isMobile = false,
}) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { success, error } = useToast();
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const currentCartVersion = useAppSelector(
    (state) => state.cart.cart?.version
  );

  const { categoryUI, categoryEmoji, effectivePrice, imageUrl } =
    useMemo(() => {
      const categoryKey = getStandardizedKey(item.productName);
      return {
        categoryKey,
        categoryUI: ICON_BG_COLORS[categoryKey] || ICON_BG_COLORS["default"],
        categoryEmoji: categoryIcons[categoryKey] || "📦",
        effectivePrice:
          item.discountAmount > 0
            ? item.unitPrice - item.discountAmount
            : item.unitPrice,
        imageUrl: resolveVariantImageUrl(
          {
            imageBasePath: item.imageBasePath,
            imageExtension: item.imageExtension,
            imageUrl: (item as any).thumbnailUrl || (item as any).imageUrl,
          },
          "_thumb"
        ),
      };
    }, [item]);

  // Handlers
  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      const maxStock = item.availableStock || 999;
      if (
        updating ||
        newQuantity < 1 ||
        newQuantity > maxStock ||
        newQuantity === item.quantity
      )
        return;

      setUpdating(true);
      const oldQuantity = quantity;
      setQuantity(newQuantity);

      try {
        await dispatch(
          updateCartItem({
            itemId: item.id,
            request: { quantity: newQuantity },
            etag: currentCartVersion?.toString() || etag,
          })
        ).unwrap();
      } catch (error: any) {
        setQuantity(oldQuantity);
        error(error?.message || "Không thể cập nhật số lượng");
      } finally {
        setUpdating(false);
      }
    },
    [updating, item, quantity, dispatch, currentCartVersion, etag]
  );

  const handleRemove = useCallback(async () => {
    if (window.confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
      try {
        await dispatch(
          removeCartItem({
            itemId: item.id,
            etag: currentCartVersion?.toString() || etag,
          })
        ).unwrap();
        success("Đã xóa sản phẩm");
      } catch (error: any) {
        error(error?.message || "Lỗi khi xóa sản phẩm");
      }
    }
  }, [dispatch, item.id, currentCartVersion, etag]);

  const handleToggleSelection = useCallback(() => {
    if (onToggleSelection) onToggleSelection(item.id);
    else dispatch(toggleItemSelectionLocal(item.id));
  }, [onToggleSelection, item.id, dispatch]);

  // Sub-components
  const ProductImage = () => (
    <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={item.productName}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center text-2xl bg-slate-50",
            categoryUI.bg
          )}
        >
          <span className={cn(categoryUI.text, "filter drop-shadow-sm")}>
            {categoryEmoji}
          </span>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div
        className={cn(
          "flex gap-3 p-4 rounded-2xl transition-all border border-transparent",
          selected ? "bg-orange-50/40 border-orange-100" : "bg-white"
        )}
      >
        <label className="flex items-center cursor-pointer h-fit mt-1">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer"
              checked={selected}
              onChange={handleToggleSelection}
            />
            <CheckCircle2
              size={12}
              className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
            />
          </div>
        </label>

        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
          <ProductImage />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <h4 className="text-[13px] font-bold text-slate-800 line-clamp-2 uppercase leading-tight tracking-tight">
              {item.productName}
            </h4>
            <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
              {item.variantAttributes || "Mặc định"}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              {item.discountAmount > 0 && (
                <span className="text-[10px] text-slate-400 line-through leading-none mb-1">
                  {formatPriceFull(item.unitPrice)}
                </span>
              )}
              <span className="text-sm font-bold text-orange-600 leading-none tracking-tighter">
                {formatPriceFull(effectivePrice)}
              </span>
            </div>

            <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-sm scale-90">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || updating}
                className="p-1.5 hover:bg-slate-50 rounded-lg disabled:opacity-20 active:scale-90 transition-all"
              >
                <Minus size={14} strokeWidth={2.5} className="text-slate-600" />
              </button>
              <div className="w-8 text-center text-xs font-bold text-slate-800">
                {updating ? (
                  <Loader2 size={12} className="animate-spin inline" />
                ) : (
                  quantity
                )}
              </div>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (item.availableStock || 999) || updating}
                className="p-1.5 hover:bg-slate-50 rounded-lg disabled:opacity-20 active:scale-90 transition-all"
              >
                <Plus size={14} strokeWidth={2.5} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleRemove}
          className="text-slate-300 hover:text-red-500 p-1 self-start transition-colors"
        >
          <Trash2 size={18} strokeWidth={2} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-12 items-center px-8 py-6 transition-all border-b border-slate-50 group bg-white",
        selected && "bg-orange-50/20"
      )}
    >
      <div className="col-span-5 flex items-center gap-5">
        <label className="relative flex items-center justify-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-orange-500 checked:border-orange-500 transition-all"
            checked={selected}
            onChange={handleToggleSelection}
          />
          <CheckCircle2
            size={12}
            className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
          />
        </label>

        <div className="relative w-20 h-20 shrink-0 border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50">
          <ProductImage />
        </div>

        <div className="min-w-0 flex-1 pr-2 space-y-2">
          <Link
            href={`/products/${item?.id}`}
            className="font-semibold text-slate-700 hover:text-orange-600 transition-colors block text-[12px] truncate pr-4"
          >
            {item.productName}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg  tracking-widest border border-slate-100">
              {item.variantAttributes || "Mặc định"}
            </span>
            
          </div>
        </div>
      </div>

      <div className="col-span-2 text-center">
        <div className="flex flex-col items-center">
          {item.discountAmount > 0 && (
            <span className="text-[11px] text-slate-300 line-through mb-1 font-bold">
              {formatPriceFull(item.unitPrice)}
            </span>
          )}
          <span className="text-sm font-bold text-slate-700 tracking-tight">
            {formatPriceFull(effectivePrice)}
          </span>
        </div>
      </div>

      <div className="col-span-2 flex justify-center">
        <div className="flex items-center border-2 border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || updating}
            className="px-3.5 py-2.5 hover:bg-slate-50 disabled:opacity-20 transition-all"
          >
            <Minus size={14} strokeWidth={3} className="text-slate-600" />
          </button>
          <div className="w-10 text-center text-xs font-bold text-slate-900">
            {updating ? (
              <Loader2 size={12} className="animate-spin inline" />
            ) : (
              quantity
            )}
          </div>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= (item.availableStock || 999) || updating}
            className="px-3.5 py-2.5 hover:bg-slate-50 disabled:opacity-20 transition-all"
          >
            <Plus size={14} strokeWidth={3} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="col-span-2 text-center">
        <span className="text-base font-bold text-orange-600 tracking-tighter italic">
          {formatPriceFull(item.totalPrice)}
        </span>
      </div>

      <div className="col-span-1 text-right">
        <button
          onClick={handleRemove}
          className="p-2.5 text-slate-400 hover:text-orange-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
        >
          <Trash2 size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
