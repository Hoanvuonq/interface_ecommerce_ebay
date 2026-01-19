"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings, Share2, Package, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { WishlistItemCard } from "../WishlistItemCard";

interface WishlistMainContentProps {
  selectedWishlist: any;
  loadingDetails: boolean;
  removingIds: Set<string>;
  addingToCartIds: Set<string>;
  onEditWishlist: () => void;
  onShareWishlist: () => void;

  onRemoveItem: (variantId: string, itemId: string) => void;
  onAddToCart: (variantId: string, productName: string, itemId: string) => void;
  onEditItem: (item: any) => void;
}

export const WishlistMainContent: React.FC<WishlistMainContentProps> = ({
  selectedWishlist,
  loadingDetails,
  removingIds,
  addingToCartIds,
  onEditWishlist,
  onShareWishlist,
  onRemoveItem,
  onAddToCart,
  onEditItem,
}) => {
  if (loadingDetails) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[4/5] bg-gray-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!selectedWishlist) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Banner Header */}
      <div className="bg-white border border-gray-100 rounded-4xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex flex-row gap-6 items-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 relative">
            <div className="absolute inset-0 bg-orange-50 rounded-3xl rotate-3" />
            <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden border-2 border-white shadow-lg flex items-center justify-center">
              {selectedWishlist.imageBasePath ? (
                <img
                  src={toPublicUrl(toSizedVariant(`${selectedWishlist.imageBasePath}${selectedWishlist.imageExtension}`, "_medium"))}
                  className="w-full h-full object-cover"
                  alt="cover"
                />
              ) : (
                <Heart size={32} className="text-orange-500/20 fill-orange-500/10" strokeWidth={1.5} />
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {selectedWishlist.isDefault && (
                <span className="px-2 py-0.5 bg-orange-500 text-white rounded-md text-[7px] font-bold uppercase tracking-tighter">Default</span>
              )}
              <span className={cn(
                "px-2 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-tighter border",
                selectedWishlist.isPublic ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-600 border-gray-200"
              )}>
                {selectedWishlist.isPublic ? "Public" : "Private"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-gray-900 uppercase italic leading-none">
              {selectedWishlist.name}
            </h1>
            <p className="text-[11px] text-gray-500 font-medium line-clamp-1 max-w-md">
              {selectedWishlist.description || "No description."}
            </p>
            <div className="flex gap-2 pt-1">
              <button onClick={onEditWishlist} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 border border-transparent hover:border-gray-200 transition-all">
                <Settings size={14} />
              </button>
              {selectedWishlist.isPublic && (
                <button onClick={onShareWishlist} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm">
                  <Share2 size={12} /> Share
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(selectedWishlist.items ?? []).length > 0 ? (
          selectedWishlist.items.map((item: any) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
              onAddToCart={onAddToCart}
              onEdit={onEditItem}
              isRemoving={removingIds.has(item.id)}
              isAddingToCart={addingToCartIds.has(item.id)}
            />
          ))
        ) : (
          <div className="col-span-full py-16 bg-gray-50/50 rounded-4xl border border-dashed border-gray-200 text-center flex flex-col items-center">
            <Package size={32} className="text-gray-500 mb-2" strokeWidth={1.5} />
            <h3 className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Empty</h3>
            <Link href="/products" className="mt-4 text-[9px] font-bold uppercase text-orange-600 hover:underline">
              Explore Products →
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};