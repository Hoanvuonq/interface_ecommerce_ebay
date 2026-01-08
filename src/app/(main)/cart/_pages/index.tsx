"use client";

import { SectionPageComponents } from "@/features/SectionPageComponents";
import { useToast } from "@/hooks/useToast";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  checkoutPreview,
  deselectAllItemsLocal,
  fetchCart,
  removeCartItems,
  selectAllItemsLocal,
} from "@/store/theme/cartSlice";
import { isAuthenticated } from "@/utils/local.storage";
import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartSummary } from "../_components/CartSummary";
import { CheckoutPreview } from "../_components/CheckoutPreview";
import { EmptyCart } from "../_components/EmptyCart";
import { NotificationRemoveModal } from "../_components/NotificationRemoveModal";
import { ShopCartSection } from "../_components/ShopCartSection";
import { HeaderCart } from "../_layouts/headerCart";
import { Checkbox } from "@/components/checkbox";

export const CartScreen = () => {
  const [showCheckoutPreview, setShowCheckoutPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useAppDispatch();
  const {
    cart,
    loading,
    error,
    checkoutPreview: preview,
    checkoutLoading,
  } = useAppSelector((state) => state.cart);

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { error: toastError, warning } = useToast();

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      dispatch(fetchCart());
    } else {
      window.location.href = "/login?redirect=/cart";
    }
  }, [dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const selectedCount = useMemo(() => {
    if (!cart) return 0;
    return cart.shops.reduce((acc, shop) => {
      return acc + shop.items.filter((item) => item.selectedForCheckout).length;
    }, 0);
  }, [cart]);

  const handleDeleteClick = () => {
    if (selectedCount === 0) {
      warning("Vui lòng chọn sản phẩm cần xóa");
      return;
    }
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!cart) return;

    const selectedItemIds: string[] = [];
    cart.shops.forEach((shop) => {
      shop.items.forEach((item) => {
        if (item.selectedForCheckout) {
          selectedItemIds.push(item.id);
        }
      });
    });

    if (selectedItemIds.length === 0) return;
    const version = String(cart.version);

    try {
      await dispatch(
        removeCartItems({
          itemIds: selectedItemIds,
          etag: version,
        })
      ).unwrap();
      setShowDeleteModal(false);
      dispatch(fetchCart());
    } catch (err: any) {}
  };

  const handleCheckout = async () => {
    if (!cart) return;

    const hasSelectedItems = cart.shops.some((shop) =>
      shop.items.some((item) => item.selectedForCheckout)
    );

    if (!hasSelectedItems) {
      warning("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
      return;
    }

    const checkoutRequest = {
      shops: cart.shops
        .filter((shop) => shop.hasSelectedItems)
        .map((shop) => ({
          shopId: shop.shopId,
          itemIds: shop.items
            .filter((item) => item.selectedForCheckout)
            .map((item) => item.id),
          vouchers: [],
        })),
    };

    try {
      const previewData = await dispatch(
        checkoutPreview(checkoutRequest)
      ).unwrap();
      sessionStorage.setItem("checkoutPreview", JSON.stringify(previewData));
      sessionStorage.setItem(
        "checkoutRequest",
        JSON.stringify(checkoutRequest)
      );
      window.location.href = "/checkout";
    } catch (error) {
      toastError("Không thể tạo đơn hàng. Vui lòng thử lại");
    }
  };

  const allSelected =
    cart?.shops.every((shop: any) => shop.allSelected) || false;

  if (!mounted) return null;

  const breadcrumbData = [
    { title: "Trang chủ", href: "/" },
    { title: "Giỏ hàng", href: "" },
  ];

  return (
    <SectionPageComponents
      loading={loading && !cart}
      breadcrumbItems={breadcrumbData}
    >
      {!cart || cart.itemCount === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col ">
          <div className="shrink-0 ">
            <HeaderCart
              itemCount={cart?.itemCount || 0}
              loading={loading}
              onRefresh={() => dispatch(fetchCart())}
            />
            {cart?.warnings && cart.warnings.length > 0 && (
              <div className="mb-6 space-y-2">
                {cart.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-amber-50 text-amber-700 border border-amber-100 rounded-2xl text-sm animate-in slide-in-from-top-2"
                  >
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <p className="font-medium">{warning}</p>
                  </div>
                ))}
              </div>
            )}
            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm">
                <AlertTriangle size={18} />
                <p className="font-bold">{error}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-start mt-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white py-3 px-4 rounded-2xl shadow-custom border border-gray-100 flex items-center justify-between z-10 sticky top-4">
                <Checkbox
                  label={`Chọn tất cả ${cart.itemCount} sản phẩm`}
                  checked={allSelected}
                  onChange={
                    allSelected
                      ? () => dispatch(deselectAllItemsLocal())
                      : () => dispatch(selectAllItemsLocal())
                  }
                />

                <button
                  onClick={handleDeleteClick}
                  disabled={selectedCount === 0}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all uppercase tracking-tighter
                        ${
                          selectedCount > 0
                            ? "text-red-500 hover:bg-red-50 active:scale-95 cursor-pointer"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">
                    Xóa đã chọn ({selectedCount})
                  </span>
                  <span className="sm:hidden">Xóa ({selectedCount})</span>
                </button>
              </div>

              <div className="space-y-6 pb-4">
                {cart.shops.map((shop, index) => (
                  <div
                    key={shop.shopId}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <ShopCartSection
                      shop={shop}
                      etag={cart.version.toString()}
                    />
                  </div>
                ))}

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-4 transition-all text-xs uppercase py-4"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
            {!isMobile && (
              <aside className="lg:col-span-1 h-fit sticky top-30">
                <CartSummary
                  cart={cart}
                  onCheckout={handleCheckout}
                  loading={checkoutLoading}
                  isMobile={false}
                />
              </aside>
            )}
          </div>
        </div>
      )}

      {isMobile && cart && cart.itemCount > 0 && (
        <CartSummary
          cart={cart}
          onCheckout={handleCheckout}
          loading={checkoutLoading}
          isMobile={true}
        />
      )}

      {showCheckoutPreview && preview && (
        <CheckoutPreview
          preview={preview}
          open={showCheckoutPreview}
          onClose={() => setShowCheckoutPreview(false)}
        />
      )}

      <NotificationRemoveModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        count={selectedCount}
        isLoading={loading}
      />
    </SectionPageComponents>
  );
};
