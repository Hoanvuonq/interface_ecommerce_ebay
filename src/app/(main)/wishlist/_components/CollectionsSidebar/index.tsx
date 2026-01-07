"use client";

import React from "react";
import { Plus, FolderOpen } from "lucide-react";
import { WishlistListItem } from "../WishlistListItem";

interface CollectionsSidebarProps {
  className?: string;
  wishlists: any[];
  loading: boolean;
  selectedWishlistId: string | null;
  priceTargetMap: Map<any, any>;
  onCreate: () => void;
  onSelect: (id: string) => void;
  onTogglePrivacy: (id: string) => void;
  onSetAsDefault: (id: string) => void;
}

export const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
  className,
  wishlists,
  loading,
  selectedWishlistId,
  priceTargetMap,
  onCreate,
  onSelect,
  onTogglePrivacy,
  onSetAsDefault,
}) => {
  return (
    <aside
      className={`lg:col-span-3 sticky top-24 h-fit space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100">
        <h2 className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">
          My Collections
        </h2>
        <button
          onClick={onCreate}
          className="group p-1.5 bg-gray-900 text-white rounded-lg hover:bg-orange-500 transition-all active:scale-95"
        >
          <Plus
            size={14}
            strokeWidth={3}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>
      </div>

      <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 custom-scrollbar scroll-smooth">
        {loading && wishlists.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : wishlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-600 border border-dashed border-gray-200 rounded-2xl">
            <FolderOpen size={24} className="mb-2 opacity-50" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Empty
            </p>
          </div>
        ) : (
          wishlists.map((w: any) => (
            <WishlistListItem
              key={w.id}
              wishlist={w}
              isSelected={selectedWishlistId === w.id}
              onSelect={() => onSelect(w.id)}
              priceTargetMetCount={priceTargetMap?.get(w.id) || 0}
              onTogglePrivacy={(item, e) => {
                e?.stopPropagation();
                onTogglePrivacy(item.id);
              }}
              onSetAsDefault={(item, e) => {
                e?.stopPropagation();
                onSetAsDefault(item.id);
              }}
            />
          ))
        )}
      </div>
    </aside>
  );
};
