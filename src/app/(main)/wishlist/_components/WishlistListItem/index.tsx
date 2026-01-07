"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Lock,
  Unlock,
  Star,
  ChevronRight,
  CheckCircle2,
  Package,
} from "lucide-react";
import type { WishlistSummaryResponse } from "@/types/wishlist/wishlist.types";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { cn } from "@/utils/cn";
import Image from "next/image";

const normalizeWishlistName = (name: string): string => {
  if (name?.toLowerCase() === "deauft" || name?.toLowerCase() === "default")
    return "Danh sách mặc định";
  return name;
};

const resolveCoverImageUrl = (
  basePath: string | null | undefined,
  extension: string | null | undefined,
  size: "_thumb" | "_medium" | "_large" | "_orig" = "_thumb"
): string | null => {
  if (basePath && extension) {
    const rawPath = `${basePath}${extension}`;
    const sizedPath = toSizedVariant(rawPath, size);
    return toPublicUrl(sizedPath);
  }
  return null;
};

export interface WishlistListItemProps {
  wishlist: WishlistSummaryResponse;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onTogglePrivacy: (
    wishlist: WishlistSummaryResponse,
    e?: React.MouseEvent
  ) => void;
  onSetAsDefault: (
    wishlist: WishlistSummaryResponse,
    e?: React.MouseEvent
  ) => void;
  priceTargetMetCount?: number;
}

export const WishlistListItem = memo<WishlistListItemProps>(
  ({
    wishlist,
    isSelected,
    onSelect,
    onTogglePrivacy,
    onSetAsDefault,
    priceTargetMetCount = 0,
  }) => {
    const coverImageUrl = useMemo(() => {
      return resolveCoverImageUrl(
        wishlist.imageBasePath,
        wishlist.imageExtension,
        "_thumb"
      );
    }, [wishlist.imageBasePath, wishlist.imageExtension]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01, x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(wishlist.id)}
        className={cn(
          "group relative cursor-pointer rounded-2xl border p-3 transition-all duration-300",
          isSelected
            ? "border-orange-500 bg-white shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/20"
            : "border-gray-100 bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-gray-200/50"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {coverImageUrl ? (
              <div className="h-14 w-14 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                <Image
                  src={coverImageUrl}
                  alt={wishlist.name}
                  fill
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                  isSelected
                    ? "bg-orange-500 text-white"
                    : "bg-gray-50 text-gray-600 group-hover:bg-orange-50 group-hover:text-orange-500"
                )}
              >
                <Heart
                  size={24}
                  fill={isSelected ? "currentColor" : "none"}
                  strokeWidth={isSelected ? 1.5 : 2}
                />
              </div>
            )}

            {wishlist.isDefault && (
              <div className="absolute -right-1 -top-1 rounded-full bg-amber-400 p-1 text-white shadow-sm ring-2 ring-white">
                <Star size={10} fill="currentColor" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4
                className={cn(
                  "truncate text-[15px] font-semibold uppercase tracking-tight transition-colors",
                  isSelected
                    ? "text-gray-900"
                    : "text-gray-700 group-hover:text-orange-600"
                )}
              >
                {normalizeWishlistName(wishlist.name)}
              </h4>
              <ChevronRight
                size={16}
                className={cn(
                  "transition-all",
                  isSelected
                    ? "translate-x-0 text-orange-500 opacity-100"
                    : "-translate-x-2 text-gray-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )}
              />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                <Package size={12} />
                <span>{wishlist.itemCount} Items</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePrivacy(wishlist, e);
                }}
                className={cn(
                  "flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest transition-colors",
                  wishlist.isPublic
                    ? "text-emerald-500 hover:text-emerald-600"
                    : "text-gray-600 hover:text-gray-600"
                )}
              >
                {wishlist.isPublic ? (
                  <Unlock size={12} strokeWidth={3} />
                ) : (
                  <Lock size={12} strokeWidth={3} />
                )}
                <span>{wishlist.isPublic ? "Public" : "Private"}</span>
              </button>

              {priceTargetMetCount > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-orange-600">
                  <CheckCircle2 size={12} strokeWidth={3} />
                  <span>{priceTargetMetCount} Met Goal</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isSelected && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-orange-500"
          />
        )}
      </motion.div>
    );
  },
  (prev, next) => {
    return (
      prev.wishlist.id === next.wishlist.id &&
      prev.wishlist.name === next.wishlist.name &&
      prev.wishlist.itemCount === next.wishlist.itemCount &&
      prev.wishlist.isDefault === next.wishlist.isDefault &&
      prev.wishlist.isPublic === next.wishlist.isPublic &&
      prev.wishlist.imageBasePath === next.wishlist.imageBasePath &&
      prev.isSelected === next.isSelected &&
      prev.priceTargetMetCount === next.priceTargetMetCount
    );
  }
);

WishlistListItem.displayName = "WishlistListItem";
