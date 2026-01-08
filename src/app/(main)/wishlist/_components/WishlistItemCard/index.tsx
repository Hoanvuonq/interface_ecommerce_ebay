"use client";

import React, { memo, useMemo, useState } from "react";
import {
  Trash2,
  ShoppingCart,
  CheckCircle2,
  Edit3,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { WishlistItemResponse } from "@/types/wishlist/wishlist.types";
import { toPublicUrl } from "@/utils/storage/url";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";
import { formatPrice } from "@/hooks/useFormatPrice";
import { cn } from "@/utils/cn";

export interface WishlistItemCardProps {
  item: WishlistItemResponse;
  onRemove: (variantId: string, itemId: string) => void;
  onAddToCart: (variantId: string, productName: string, itemId: string) => void;
  onEdit?: (item: WishlistItemResponse) => void;
  isRemoving: boolean;
  isAddingToCart: boolean;
  readOnly?: boolean;
}

export const WishlistItemCard = memo<WishlistItemCardProps>(
  ({
    item,
    onRemove,
    onAddToCart,
    onEdit,
    isRemoving,
    isAddingToCart,
    readOnly = false,
  }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const imageUrl = useMemo(() => {
      const resolvedUrl =
        item.imageBasePath && item.imageExtension
          ? resolveVariantImageUrl(
              {
                imageBasePath: item.imageBasePath,
                imageExtension: item.imageExtension,
              },
              "_medium"
            )
          : "";
      let finalUrl = resolvedUrl || item.productImage || "";
      if (
        finalUrl &&
        !finalUrl.startsWith("http") &&
        !finalUrl.startsWith("/")
      ) {
        finalUrl = toPublicUrl(finalUrl);
      }
      return finalUrl || "/placeholder-product.png";
    }, [item]);

    // Priority styles theo chủ đạo Cam/Đỏ
    const priorityStyles = useMemo(() => {
      switch (item.priority) {
        case 1:
          return "bg-(--color-mainColor) text-white border-(--color-mainColor) shadow-orange-100";
        case 2:
          return "bg-red-600 text-white border-red-600 shadow-red-100";
        default:
          return "bg-white text-gray-600 border-gray-100";
      }
    }, [item.priority]);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -6 }}
        className="group relative h-full flex flex-col bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.15)] transition-all duration-500"
      >
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-[#fafafa]">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin text-orange-200" />
            </div>
          )}

          <img
            src={imageUrl}
            alt={item.productName}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setImageLoading(false)}
          />

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {item.isPriceTargetMet && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-semibold shadow-lg shadow-emerald-200"
              >
                <CheckCircle2 size={12} strokeWidth={3} />
                ĐẠT GIÁ
              </motion.div>
            )}
            {item.priority > 0 && (
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-semibold border shadow-md tracking-tighter",
                  priorityStyles
                )}
              >
                {item.priority === 2 ? "GẤP" : "ƯU TIÊN"}
              </div>
            )}
          </div>

          {/* Quick Actions Overlay */}
          {!readOnly && (
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
              <button
                onClick={() => onEdit?.(item)}
                className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-gray-700 hover:text-(--color-mainColor) hover:scale-110 transition-all"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-gray-700 hover:text-red-500 hover:scale-110 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 flex flex-col">
          <Link href={`/products/${item.productId}`} className="block mb-3">
            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-(--color-mainColor) transition-colors leading-snug h-10">
              {item.productName}
            </h3>
          </Link>

          {/* Target Price */}
          {item.desiredPrice && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 rounded-lg">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                  Mục tiêu
                </span>
                <span className="text-[11px] font-semibold text-orange-600">
                  {formatPrice(item.desiredPrice)}
                </span>
              </div>
            </div>
          )}

          {/* Current Price & Cart Button */}
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                Giá hiện tại
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold text-(--color-mainColor) tracking-tighter">
                  {formatPrice(item.productPrice).replace("₫", "")}
                </span>
                <span className="text-xs font-bold text-(--color-mainColor)">
                  ₫
                </span>
              </div>
            </div>

            <button
              disabled={isAddingToCart}
              onClick={() =>
                onAddToCart(item.variantId, item.productName, item.id)
              }
              className="w-12 h-12 bg-(--color-mainColor) hover:bg-gray-900 disabled:bg-gray-100 text-white rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg shadow-orange-200 group/btn"
            >
              {isAddingToCart ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <ShoppingCart
                  size={20}
                  strokeWidth={2.5}
                  className="group-hover/btn:scale-110 transition-transform"
                />
              )}
            </button>
          </div>
        </div>

        {/* Delete Confirmation Overlay (Glassmorphism) */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-gray-900/40 backdrop-blur-xs p-6 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-4xl p-6 shadow-2xl w-full text-center border border-gray-100"
              >
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
                  <AlertCircle size={24} />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-tight">
                  Xóa sản phẩm?
                </h4>
                <p className="text-[11px] text-gray-500 mb-6 font-medium">
                  Hành động này không thể hoàn tác.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-xl text-[10px] font-semibold uppercase bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    disabled={isRemoving}
                    onClick={() => {
                      onRemove(item.variantId, item.id);
                      setShowDeleteConfirm(false);
                    }}
                    className="flex-1 py-3 rounded-xl text-[10px] font-semibold uppercase bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                  >
                    {isRemoving ? "..." : "Xác nhận"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
  (prev, next) => {
    return (
      prev.item.id === next.item.id &&
      prev.item.productPrice === next.item.productPrice &&
      prev.item.priority === next.item.priority &&
      prev.isAddingToCart === next.isAddingToCart &&
      prev.isRemoving === next.isRemoving &&
      prev.item.isPriceTargetMet === next.item.isPriceTargetMet
    );
  }
);

WishlistItemCard.displayName = "WishlistItemCard";
