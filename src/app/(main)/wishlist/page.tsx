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
} from "lucide-react";
import Link from "next/link";

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
    priceTargetMetData,
    regenerateShareToken,
  } = useWishlistPage();
  return (
    <PageContentTransition>
      <div className="min-h-screen bg-[#fafafa] text-slate-900 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
            <Link
              href="/"
              className="hover:text-orange-500 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Home size={12} /> HOME
            </Link>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-slate-900 font-bold">
              WISHLIST COLLECTIONS
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <aside className="lg:col-span-3 sticky top-28 space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 italic">
                    Collections
                  </h2>
                </div>
                <button
                  onClick={() => setCreateModalVisible(true)}
                  className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                {loading
                  ? [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-white border border-slate-100 animate-pulse rounded-2xl"
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

            <main className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {loadingDetails ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-3/4 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"
                      />
                    ))}
                  </motion.div>
                ) : selectedWishlist ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="bg-white border border-slate-100 rounded-[3rem] p-6 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-colors" />
                      <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                        <div className="w-44 h-44 shrink-0 relative">
                          <div className="absolute inset-0 bg-orange-100 rounded-[2.8rem] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                          <div className="relative w-full h-full bg-white rounded-[2.8rem] overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
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
                                size={56}
                                className="text-orange-500 fill-orange-50"
                                strokeWidth={1}
                              />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 font-black">
                            {selectedWishlist.isDefault && (
                              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-[9px] uppercase tracking-widest">
                                Default
                              </span>
                            )}
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border",
                                selectedWishlist.isPublic
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-slate-50 text-slate-400 border-slate-200"
                              )}
                            >
                              {selectedWishlist.isPublic ? "Public" : "Private"}
                            </span>
                          </div>
                          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-[0.9] mb-4">
                            {selectedWishlist.name}
                          </h1>
                          <p className="text-slate-400 font-medium line-clamp-2 max-w-xl mb-8">
                            {selectedWishlist.description}
                          </p>
                          <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <button
                              onClick={() => setEditModalVisible(true)}
                              className="flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            {selectedWishlist.isPublic && (
                              <button
                                onClick={() => setShareModalVisible(true)}
                                className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                              >
                                <Share2 size={14} /> Share Link
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                        <div className="col-span-full py-28 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
                          <Package
                            size={48}
                            className="text-orange-200 mb-4"
                            strokeWidth={1}
                          />
                          <h3 className="text-slate-900 font-black uppercase text-sm tracking-widest">
                            Danh sách trống
                          </h3>
                          <Link
                            href="/products"
                            className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-all"
                          >
                            Khám phá ngay{" "}
                            <ChevronRight size={14} strokeWidth={3} />
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
