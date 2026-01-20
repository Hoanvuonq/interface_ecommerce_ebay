"use client";

import {
  categoryIcons,
  getStandardizedKey,
  ICON_BG_COLORS,
} from "@/app/(main)/(home)/_types/categories";
import { Checkbox } from "@/components/checkbox";
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
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CartItemProps } from "../../_types/cartItems";
import { NotificationRemoveModal } from "../NotificationRemoveModal";

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // --- Handlers ---

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

  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmRemove = useCallback(async () => {
    try {
      await dispatch(
        removeCartItem({
          itemId: item.id,
          etag: currentCartVersion?.toString() || etag,
        })
      ).unwrap();
      success("Đã xóa sản phẩm");
      setShowDeleteModal(false);
    } catch (error: any) {
      error(error?.message || "Lỗi khi xóa sản phẩm");
    }
  }, [dispatch, item.id, currentCartVersion, etag, success, error]);

 const handleToggleSelection = useCallback(
  (e?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => {
    e?.stopPropagation(); 
    
    if (onToggleSelection) {
      onToggleSelection(item.id);
    } else {
      dispatch(toggleItemSelectionLocal(item.id));
    }
  },
  [onToggleSelection, item.id, dispatch]
);

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
            "w-full h-full flex items-center justify-center text-2xl bg-gray-50",
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
  const renderCheckbox = () => (
    <div 
      onClick={(e) => e.stopPropagation()} 
      className="flex items-center"
    >
      <Checkbox 
        id={`checkbox-item-${item.id}`} 
        checked={selected} 
        onChange={handleToggleSelection} 
      />
    </div>
  );

  const renderContent = () => {
    if (isMobile) {
      return (
        <div
          className={cn(
            "flex gap-3 p-4 rounded-2xl transition-all border border-transparent",
            selected ? "bg-gray-50/40 " : "bg-gray-50/10"
          )}
        >
          {renderCheckbox()}

          <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <ProductImage />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div className="space-y-1">
              <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 uppercase leading-tight tracking-tight">
                {item.productName}
              </h4>
              <span className="inline-block text-[10px] font-bold text-gray-600 uppercase tracking-wider bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                {item.variantAttributes || "Mặc định"}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                {item.discountAmount > 0 && (
                  <span className="text-[10px] text-gray-600 line-through leading-none mb-1">
                    {formatPriceFull(item.unitPrice)}
                  </span>
                )}
                <span className="text-sm font-bold text-orange-600 leading-none tracking-tighter">
                  {formatPriceFull(effectivePrice)}
                </span>
              </div>

              <div className="flex items-center bg-white rounded-xl p-1 shadow-custom scale-90">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || updating}
                  className="p-1.5 hover:bg-gray-50 rounded-lg disabled:opacity-20 active:scale-90 transition-all"
                >
                  <Minus
                    size={14}
                    strokeWidth={2.5}
                    className="text-gray-600"
                  />
                </button>
                <div className="w-8 text-center text-xs font-bold text-gray-800">
                  {updating ? (
                    <Loader2 size={12} className="animate-spin inline" />
                  ) : (
                    quantity
                  )}
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={
                    quantity >= (item.availableStock || 999) || updating
                  }
                  className="p-1.5 hover:bg-gray-50 rounded-lg disabled:opacity-20 active:scale-90 transition-all"
                >
                  <Plus size={14} strokeWidth={2.5} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleRemoveClick}
            className="text-gray-500 hover:text-orange-600 hover:bg-orange-50 p-2 self-start transition-colors rounded-lg"
          >
            <Trash2 size={18} strokeWidth={2} />
          </button>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "grid grid-cols-12 items-center px-8 py-6 transition-all border-b border-gray-50 group bg-white",
          selected && "bg-gray-50/10"
        )}
      >
        <div className="col-span-5 flex items-center gap-2">
          {renderCheckbox()}

          <div className="relative w-20 h-20 shrink-0 border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
            <ProductImage />
          </div>

          <div className="min-w-0 flex-1 pr-2 space-y-2">
            <Link
              href={`/products/${item?.id}`}
              className="font-semibold text-gray-700 hover:text-orange-600 transition-colors block text-[12px] truncate pr-4"
            >
              {item.productName}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg  tracking-widest border border-gray-100">
                {item.variantAttributes || "Mặc định"}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-2 text-center">
          <div className="flex flex-col items-center">
            {item.discountAmount > 0 && (
              <span className="text-[11px] text-gray-500 line-through mb-1 font-bold">
                {formatPriceFull(item.unitPrice)}
              </span>
            )}
            <span className="text-sm font-bold text-gray-700 tracking-tight">
              {formatPriceFull(effectivePrice)}
            </span>
          </div>
        </div>

        <div className="col-span-2 flex justify-center">
          <div className="flex items-center rounded-2xl bg-white overflow-hidden shadow-custom">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || updating}
              className="px-3.5 py-2.5 hover:bg-gray-50 disabled:opacity-20 transition-all"
            >
              <Minus size={14} strokeWidth={3} className="text-gray-600" />
            </button>
            <div className="w-10 text-center text-xs font-bold text-gray-900">
              {updating ? (
                <Loader2 size={12} className="animate-spin inline" />
              ) : (
                quantity
              )}
            </div>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= (item.availableStock || 999) || updating}
              className="px-3.5 py-2.5 hover:bg-gray-50 disabled:opacity-20 transition-all"
            >
              <Plus size={14} strokeWidth={3} className="text-gray-600" />
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
            onClick={handleRemoveClick}
            className="p-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all active:scale-90"
          >
            <Trash2 size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      <NotificationRemoveModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmRemove}
        itemName={item.productName}
      />
    </>
  );
};
