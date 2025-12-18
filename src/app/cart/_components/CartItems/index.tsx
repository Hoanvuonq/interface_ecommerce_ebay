"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { CartItemDto } from "@/types/cart/cart.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  updateCartItem,
  removeCartItem,
  toggleItemSelectionLocal,
  fetchCart,
} from "@/store/theme/cartSlice";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { getStandardizedKey,ICON_BG_COLORS,categoryIcons} from "@/app/(home)/_types/categories";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { CartItemProps } from "../../_types/cartItems";


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

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);
 

  const currentCartVersion = useAppSelector((state) => state.cart.cart?.version);
  const categoryKey = getStandardizedKey(item.productName);
  const categoryUI = ICON_BG_COLORS[categoryKey] || ICON_BG_COLORS["default"];
  const categoryEmoji = categoryIcons[categoryKey] || "📦";

  const handleImageError = () => {
    setImgError(true);
  };

 const handleQuantityChange = async (newQuantity: number) => {
    if (updating || newQuantity < 1 || newQuantity > (item.availableStock || 999) || newQuantity === item.quantity) 
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
        console.error("Update Cart Error detail:", error);

        const errorMessage = error?.message || "Không thể cập nhật số lượng";
        toast.error(errorMessage);
    } finally {
        setUpdating(false);
    }
};

const handleRemove = async () => {
    if (window.confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
        try {
            const activeEtag = currentCartVersion?.toString() || etag;

            await dispatch(
                removeCartItem({ 
                    itemId: item.id, 
                    etag: activeEtag 
                })
            ).unwrap();

        } catch (error: any) {
            const errorMessage = error?.message || "Lỗi khi xóa sản phẩm";
            toast.error(errorMessage);
        }
    }
};

  const handleToggleSelection = () => {
    if (onToggleSelection) onToggleSelection(item.id);
    else dispatch(toggleItemSelectionLocal(item.id));
  };

  

  const effectivePrice =
    item.discountAmount > 0
      ? item.unitPrice - item.discountAmount
      : item.unitPrice;

  const imageUrl = resolveVariantImageUrl(
    {
      imageBasePath: item.imageBasePath,
      imageExtension: item.imageExtension,
      imageUrl: (item as any).thumbnailUrl || (item as any).imageUrl,
    },
    "_thumb"
  );

  const RenderProductImage = () => {
    if (imageUrl && !imgError) {
      return (
        <img
          src={imageUrl}
          alt={item.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={handleImageError}
        />
      );
    }
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center text-2xl shadow-inner",
          categoryUI.bg
        )}
      >
        <span className={cn(categoryUI.text, "filter drop-shadow-sm")}>
          {categoryEmoji}
        </span>
      </div>
    );
  };

  if (isMobile) {
    return (
      <div
        className={cn(
          "flex gap-3 p-3 rounded-xl transition-all",
          selected ? "bg-orange-50/50" : "bg-white"
        )}
      >
        <label className="relative flex items-center justify-center cursor-pointer h-fit mt-1">
          <input
            type="checkbox"
            className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-orange-500 checked:border-orange-500 transition-all"
            checked={selected}
            onChange={handleToggleSelection}
          />
          <CheckCircle2
            size={12}
            className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
          />
        </label>

        <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
          <RenderProductImage />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight uppercase">
              {item.productName}
            </h4>
            <p className="text-[11px] text-gray-400 mt-1 italic line-clamp-1">
              {item.variantAttributes || "Mặc định"}
            </p>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div className="flex flex-col">
              {item.discountAmount > 0 && (
                <span className="text-[10px] text-gray-400 line-through">
                  {formatPriceFull(item.unitPrice)}
                </span>
              )}
              <span className="text-sm font-black text-orange-600">
                {formatPriceFull(effectivePrice)}
              </span>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200 shadow-sm">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || updating}
                className="p-1 hover:bg-white rounded-md disabled:opacity-30 transition-all active:scale-90"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-xs font-black">
                {updating ? (
                  <Loader2 size={12} className="animate-spin inline" />
                ) : (
                  quantity
                )}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (item.availableStock || 999) || updating}
                className="p-1 hover:bg-white rounded-md disabled:opacity-30 transition-all active:scale-90"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-gray-300 hover:text-red-500 transition-colors self-start p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-12 items-center px-6 py-5 bg-white hover:bg-gray-50/50 transition-all group border-b border-gray-50",
        selected && "bg-orange-50/30"
      )}
    >
      <div className="col-span-5 flex items-center gap-4">
        <label className="relative flex items-center justify-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-orange-500 checked:border-orange-500 transition-all"
            checked={selected}
            onChange={handleToggleSelection}
          />
          <CheckCircle2
            size={12}
            className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
          />
        </label>

        <div className="relative w-20 h-20 shrink-0 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <RenderProductImage />
        </div>

        <div className="min-w-0 flex-1 pr-4">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug uppercase group-hover:text-orange-600 transition-colors">
            {item.productName}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-gray-200">
              {item.variantAttributes || "Mặc định"}
            </span>
            {item.availableStock !== undefined && item.availableStock < 10 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <AlertCircle size={10} /> Chỉ còn {item.availableStock}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-2 text-center flex flex-col justify-center">
        {item.discountAmount > 0 && (
          <span className="text-xs text-gray-400 line-through mb-0.5 font-medium">
            {formatPriceFull(item.unitPrice)}
          </span>
        )}
        <span className="text-sm font-black text-gray-700">
          {formatPriceFull(effectivePrice)}
        </span>
      </div>

      <div className="col-span-2 flex justify-center">
        <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || updating}
            className="px-3 py-2 hover:bg-gray-50 disabled:opacity-20 border-r border-gray-100 transition-all active:bg-gray-100"
          >
            <Minus size={14} className="text-gray-600" />
          </button>
          <div className="w-12 text-center text-xs font-black text-gray-800">
            {updating ? (
              <Loader2 size={12} className="animate-spin inline" />
            ) : (
              quantity
            )}
          </div>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= (item.availableStock || 999) || updating}
            className="px-3 py-2 hover:bg-gray-50 disabled:opacity-20 border-l border-gray-100 transition-all active:bg-gray-100"
          >
            <Plus size={14} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="col-span-2 text-center">
        <span className="text-base font-black text-orange-600 tracking-tighter">
          {formatPriceFull(item.totalPrice)}
        </span>
      </div>

      <div className="col-span-1 text-right pr-2">
        <button
          onClick={handleRemove}
          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
