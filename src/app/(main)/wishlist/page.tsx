"use client";

import { AnimatePresence } from "framer-motion";
import { SectionPageComponents } from "@/features/SectionPageComponents";
import { useWishlistPage } from "./_hooks/useWishlistPage";
import { CollectionsSidebar } from "./_components/CollectionsSidebar";
import { WishlistMainContent } from "./_components/WishlistMainContent";

// Modals
import CreateWishlistModal from "./_components/CreateWishlistModal";
import EditWishlistItemModal from "./_components/EditWishlistItemModal";
import EditWishlistModal from "./_components/EditWishlistModal";
import WishlistShareModal from "./_components/WishlistShareModal";

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

  const breadcrumbData = [
    { title: "Trang chủ", href: "/" },
    { title: "WISHLIST", href: "" },
  ];

  return (
    <SectionPageComponents
      loading={loading && wishlists.length === 0}
      loadingMessage="Đang tải danh mục yêu thích..."
      breadcrumbItems={breadcrumbData}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SIDEBAR: Chỉ nhận data qua props */}
        <CollectionsSidebar
          wishlists={wishlists}
          loading={loading}
          selectedWishlistId={selectedWishlistId}
          priceTargetMap={priceTargetMap}
          onCreate={() => setCreateModalVisible(true)}
          onSelect={handleSelect}
          onTogglePrivacy={(id) => console.log("Toggle", id)}
          onSetAsDefault={(id) => console.log("Set Default", id)}
        />

        {/* MAIN CONTENT: Chỉ nhận data qua props */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <WishlistMainContent
              selectedWishlist={selectedWishlist}
              loadingDetails={loadingDetails}
              removingIds={removingIds}
              addingToCartIds={addingToCartIds}
              onEditWishlist={() => setEditModalVisible(true)}
              onShareWishlist={() => setShareModalVisible(true)}
              onRemoveItem={handleRemoveItem}
              onAddToCart={handleAddToCartAction}
              onEditItem={(i) => {
                setEditingItem(i);
                setEditItemModalVisible(true);
              }}
            />
          </AnimatePresence>
        </main>
      </div>

      {/* --- MODALS SECTION --- */}
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
    </SectionPageComponents>
  );
}