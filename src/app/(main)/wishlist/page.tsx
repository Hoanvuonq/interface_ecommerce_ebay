"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Edit3,
  Heart,
  Home,
  Package,
  Plus,
  Share2,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { CustomBreadcrumb } from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import { cn } from "@/utils/cn";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import CreateWishlistModal from "./_components/CreateWishlistModal";
import EditWishlistItemModal from "./_components/EditWishlistItemModal";
import EditWishlistModal from "./_components/EditWishlistModal";
import { WishlistItemCard } from "./_components/WishlistItemCard";
import { WishlistListItem } from "./_components/WishlistListItem";
import WishlistShareModal from "./_components/WishlistShareModal";
import { useWishlistPage } from "./_hooks/useWishlistPage";

export default function WishlistPage() {
  const {
    wishlists,
    selectedWishlist,
    selectedWishlistId,
    loading,
    loadingDetails,
    removingIds,
    addingToCartIds,
    createModalVisible,
    editModalVisible,
    shareModalVisible,
    editItemModalVisible,
    editingItem,
    priceTargetMap,
    setCreateModalVisible,
    setEditModalVisible,
    setShareModalVisible,
    setEditItemModalVisible,
    setEditingItem,
    handleRemoveItem,
    handleAddToCartAction,
    handleSelect,
    loadAllWishlists,
    loadWishlistDetails,
    setSelectedWishlistId,
    regenerateShareToken,
  } = useWishlistPage();

  return (
    <PageContentTransition>
      <div className="min-h-screen bg-[#fcfcfc] text-slate-900 pb-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <CustomBreadcrumb
            items={[
              { title: "Trang chủ", href: "/" },
              { title: "WISHLIST", href: "" },
            ]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-3 sticky top-24 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[10px] font-bold uppercase tracking-tighter text-(--color-mainColor)">
                  My Collections
                </h2>
                <button
                  onClick={() => setCreateModalVisible(true)}
                  className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-orange-500 transition-all active:scale-95"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>

              <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 custom-scrollbar">
                {loading
                  ? [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 bg-slate-100 animate-pulse rounded-xl"
                      />
                    ))
                  : wishlists.map((w) => (
                      <WishlistListItem
                        key={w.id}
                        wishlist={w}
                        isSelected={selectedWishlistId === w.id}
                        onSelect={handleSelect}
                        priceTargetMetCount={priceTargetMap.get(w.id)}
                        onTogglePrivacy={() => {}}
                        onSetAsDefault={() => {}}
                      />
                    ))}
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {loadingDetails ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-4/5 bg-slate-100 rounded-3xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : selectedWishlist ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Header Banner Nhỏ gọn hơn */}
                    <div className="bg-white border border-slate-100 rounded-4xl p-4 shadow-sm relative overflow-hidden">
                      <div className="flex flex-row gap-6 items-center">
                        {/* Cover Image nhỏ gọn */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 relative">
                          <div className="absolute inset-0 bg-orange-50 rounded-3xl rotate-3" />
                          <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden border-2 border-white shadow-lg flex items-center justify-center">
                            {selectedWishlist.imageBasePath ? (
                              <img
                                src={toPublicUrl(
                                  toSizedVariant(
                                    `${selectedWishlist.imageBasePath}${selectedWishlist.imageExtension}`,
                                    "_medium"
                                  )
                                )}
                                className="w-full h-full object-cover"
                                alt="cover"
                              />
                            ) : (
                              <Heart
                                size={32}
                                className="text-orange-500/20 fill-orange-500/10"
                                strokeWidth={1.5}
                              />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {selectedWishlist.isDefault && (
                              <span className="px-2 py-0.5 bg-orange-500 text-white rounded-md text-[7px] font-bold uppercase tracking-tighter">
                                Default
                              </span>
                            )}
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-tighter border",
                                selectedWishlist.isPublic
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-slate-50 text-(--color-mainColor) border-slate-200"
                              )}
                            >
                              {selectedWishlist.isPublic ? "Public" : "Private"}
                            </span>
                          </div>

                          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-slate-900 uppercase italic leading-none">
                            {selectedWishlist.name}
                          </h1>

                          <p className="text-[11px] text-(--color-mainColor) font-medium line-clamp-1 max-w-md">
                            {selectedWishlist.description ||
                              "No description provided."}
                          </p>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => setEditModalVisible(true)}
                              className="p-2 hover:bg-slate-100 rounded-lg text-(--color-mainColor) hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                              title="Edit Collection"
                            >
                              <Settings size={14} />
                            </button>
                            {selectedWishlist.isPublic && (
                              <button
                                onClick={() => setShareModalVisible(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-(--color-mainColor) rounded-xl font-bold text-[9px] uppercase tracking-wider hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                              >
                                <Share2 size={12} /> Share
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grid Items - Sử dụng grid 3 cột trên desktop nhưng 2 cột trên mobile */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
                      {(selectedWishlist.items ?? []).length > 0 ? (
                        (selectedWishlist.items ?? []).map((item: any) => (
                          <WishlistItemCard
                            key={item.id}
                            item={item}
                            onRemove={handleRemoveItem}
                            onAddToCart={handleAddToCartAction}
                            onEdit={(i) => {
                              setEditingItem(i);
                              setEditItemModalVisible(true);
                            }}
                            isRemoving={removingIds.has(item.id)}
                            isAddingToCart={addingToCartIds.has(item.id)}
                          />
                        ))
                      ) : (
                        <div className="col-span-full py-16 bg-slate-50/50 rounded-4xl border border-dashed border-slate-200 text-center flex flex-col items-center">
                          <Package
                            size={32}
                            className="text-slate-300 mb-2"
                            strokeWidth={1.5}
                          />
                          <h3 className="text-(--color-mainColor) font-bold uppercase text-[10px] tracking-widest">
                            Collection is empty
                          </h3>
                          <Link
                            href="/products"
                            className="mt-4 text-[9px] font-bold uppercase text-orange-600 hover:underline tracking-tighter"
                          >
                            Explore Products →
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </main>
          </div>
        </div>

        {/* Modals giữ nguyên logic */}
        <CreateWishlistModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onSuccess={(id) => {
            setCreateModalVisible(false);
            loadAllWishlists();
            setSelectedWishlistId(id);
            loadWishlistDetails(id);
          }}
        />
        {selectedWishlist && (
          <>
            <EditWishlistModal
              visible={editModalVisible}
              onClose={() => setEditModalVisible(false)}
              wishlist={selectedWishlist}
              onUpdate={async () => {
                await loadAllWishlists();
                await loadWishlistDetails(selectedWishlist.id);
              }}
            />
            <WishlistShareModal
              visible={shareModalVisible}
              onClose={() => setShareModalVisible(false)}
              wishlistId={selectedWishlist.id}
              wishlistName={selectedWishlist.name}
              shareToken={selectedWishlist.shareToken}
              onRegenerateToken={async () => {
                await regenerateShareToken(selectedWishlist.id);
                await loadWishlistDetails(selectedWishlist.id);
              }}
            />
          </>
        )}
        {editingItem && selectedWishlist && (
          <EditWishlistItemModal
            visible={editItemModalVisible}
            onClose={() => {
              setEditItemModalVisible(false);
              setEditingItem(null);
            }}
            item={editingItem}
            wishlistId={selectedWishlist.id}
            onSuccess={() => loadWishlistDetails(selectedWishlist.id)}
          />
        )}
      </div>
    </PageContentTransition>
  );
}
