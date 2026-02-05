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
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CartItemProps } from "../../_types/cartItems";
import { NotificationRemoveModal } from "../NotificationRemoveModal";

const STORAGE_BASE_URL = "https://pub-5341c10461574a539df355b9fbe87197.r2.dev/";

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
    (state) => state.cart.cart?.version,
  );

  const { categoryUI, categoryEmoji, effectivePrice, initialImageUrl } =
    useMemo(() => {
      const categoryKey = getStandardizedKey(item.productName);

      let url = null;
      if (item.imagePath) {
        const cleanPath = item.imagePath.replace(/^\//, ""); 
        url = `${STORAGE_BASE_URL}${cleanPath.replace("*", "thumb")}`;
      }

      return {
        categoryUI: ICON_BG_COLORS[categoryKey] || ICON_BG_COLORS["default"],
        categoryEmoji: categoryIcons[categoryKey] || "📦",
        effectivePrice:
          item.discountAmount > 0
            ? item.unitPrice - item.discountAmount
            : item.unitPrice,
        initialImageUrl: url,
      };
    }, [item]);

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
          }),
        ).unwrap();
      } catch (err: any) {
        setQuantity(oldQuantity);
        error(err?.message || "Không thể cập nhật số lượng");
      } finally {
        setUpdating(false);
      }
    },
    [updating, item, quantity, dispatch, currentCartVersion, etag, error],
  );

  const handleConfirmRemove = useCallback(async () => {
    try {
      await dispatch(
        removeCartItem({
          itemId: item.id,
          etag: currentCartVersion?.toString() || etag,
        }),
      ).unwrap();
      success("Đã xóa sản phẩm");
      setShowDeleteModal(false);
    } catch (err: any) {
      error(err?.message || "Lỗi khi xóa sản phẩm");
    }
  }, [dispatch, item.id, currentCartVersion, etag, success, error]);

  const handleToggleSelection = (e?: any) => {
    e?.stopPropagation();
    if (onToggleSelection) onToggleSelection(item.id);
    else dispatch(toggleItemSelectionLocal(item.id));
  };

  const ProductImage = () => (
    <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
      {initialImageUrl && !imgError ? (
        <img
          src={initialImageUrl}
          alt={item.productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes("thumb")) {
              const cleanPath = item.imagePath!.replace(/^\//, "");
              target.src = `${STORAGE_BASE_URL}${cleanPath.replace("*", "orig")}`;
            } else {
              setImgError(true);
            }
          }}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center text-2xl bg-gray-50",
            categoryUI.bg,
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
    <div onClick={(e) => e.stopPropagation()} className="flex items-center">
      <Checkbox
        id={`checkbox-item-${item.id}`}
        checked={selected}
        onChange={handleToggleSelection}
      />
    </div>
  );

  // Render content giữ nguyên logic UI cũ nhưng dùng ProductImage mới
  const renderContent = () => {
    if (isMobile) {
      return (
        <div
          className={cn(
            "flex gap-3 p-4 rounded-2xl transition-all border border-transparent",
            selected ? "bg-gray-50/40 " : "bg-gray-50/10",
          )}
        >
          {renderCheckbox()}
          <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <ProductImage />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div className="space-y-1">
              <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 uppercase leading-tight">
                {item.productName}
              </h4>
              <span className="inline-block text-[10px] font-bold text-gray-600 uppercase bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100 italic">
                # {item.sku || "Mặc định"}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                {item.discountAmount > 0 && (
                  <span className="text-[10px] text-gray-600 line-through leading-none mb-1">
                    {formatPriceFull(item.unitPrice)}
                  </span>
                )}
                <span className="text-sm font-bold text-orange-600 leading-none">
                  {formatPriceFull(effectivePrice)}
                </span>
              </div>
              <div className="flex items-center bg-white rounded-xl p-1 shadow-custom scale-90">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || updating}
                  className="p-1.5 hover:bg-gray-50 rounded-lg"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <div className="w-8 text-center text-xs font-bold">
                  {updating ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    quantity
                  )}
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={
                    quantity >= (item.availableStock || 999) || updating
                  }
                  className="p-1.5 hover:bg-gray-50 rounded-lg"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-gray-500 hover:text-orange-600 p-2 self-start"
          >
            <Trash2 size={18} />
          </button>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "grid grid-cols-12 items-center px-8 py-6 transition-all border-b border-gray-50 bg-white",
          selected && "bg-gray-50/10",
        )}
      >
        <div className="col-span-5 flex items-center gap-2">
          {renderCheckbox()}
          <div className="relative w-20 h-20 shrink-0 border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
            <ProductImage />
          </div>
          <div className="min-w-0 flex-1 pr-2 space-y-2">
            <Link
              href={`/products/${item?.productId}`}
              className="font-semibold text-gray-700 hover:text-orange-600 transition-colors block text-[12px] truncate"
            >
              {item.productName}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border border-gray-100 italic">
                # {item.sku || "Mặc định"}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-2 text-center flex flex-col items-center">
          {item.discountAmount > 0 && (
            <span className="text-[11px] text-gray-500 line-through mb-1 font-bold">
              {formatPriceFull(item.unitPrice)}
            </span>
          )}
          <span className="text-sm font-bold text-gray-700">
            {formatPriceFull(effectivePrice)}
          </span>
        </div>
        <div className="col-span-2 flex justify-center">
          <div className="flex items-center rounded-2xl bg-white shadow-custom overflow-hidden">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || updating}
              className="px-3.5 py-2.5 hover:bg-gray-50"
            >
              <Minus size={14} strokeWidth={3} />
            </button>
            <div className="w-10 text-center text-xs font-bold">
              {updating ? (
                <Loader2 size={12} className="animate-spin inline" />
              ) : (
                quantity
              )}
            </div>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= (item.availableStock || 999) || updating}
              className="px-3.5 py-2.5 hover:bg-gray-50"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
        <div className="col-span-2 text-center">
          <span className="text-base font-bold text-orange-600 italic tracking-tighter">
            {formatPriceFull(item.totalPrice)}
          </span>
        </div>
        <div className="col-span-1 text-right">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2.5 text-gray-600 hover:text-orange-600 rounded-2xl transition-all active:scale-90"
          >
            <Trash2 size={20} />
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
