"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Home,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  Loader2,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchCart,
  selectAllItemsLocal,
  deselectAllItemsLocal,
  clearCart,
  checkoutPreview,
} from "@/store/theme/cartSlice";
import { ShopCartSection } from "../_components/ShopCartSection";
import { CartSummary } from "../_components/CartSummary";
import { EmptyCart } from "../_components/EmptyCart";
import { CheckoutPreview } from "../_components/CheckoutPreview";
import Link from "next/link";
import { toast } from "sonner";
import PageContentTransition from "@/features/PageContentTransition";
import { isAuthenticated } from "@/utils/local.storage";
import { cn } from "@/utils/cn";
import { CustomBreadcrumb, SectionLoading } from "@/components";
import { HeaderCart } from "../_layouts/headerCart";

export const CartScreen = () => {
  const [showCheckoutPreview, setShowCheckoutPreview] = useState(false);
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

  const handleClearCart = async () => {
    if (!cart?.version) return;
    if (
      window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")
    ) {
      try {
        await dispatch(clearCart(cart.version.toString())).unwrap();
        toast.success("Đã xóa sạch giỏ hàng");
      } catch (err) {
        toast.error("Không thể xóa giỏ hàng");
      }
    }
  };

  const handleCheckout = async () => {
    if (!cart) return;

    const hasSelectedItems = cart.shops.some((shop) =>
      shop.items.some((item) => item.selectedForCheckout)
    );

    if (!hasSelectedItems) {
      toast.warning("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
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
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại");
    }
  };

  const allSelected = cart?.shops.every((shop) => shop.allSelected) || false;
  const someSelected = cart?.shops.some((shop) => shop.hasSelectedItems) || false;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      <PageContentTransition>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 lg:pb-12">
          <div className="mb-4 sm:mb-6">
            <CustomBreadcrumb
              items={[
                { title: "Trang chủ", href: "/" },
                { title: "Giỏ hàng", href: "" },
              ]}
            />
          </div>

          {loading && !cart ? (
            <SectionLoading message="Đang tải dữ liệu..." />
          ) : !cart || cart.itemCount === 0 ? (
            <EmptyCart />
          ) : (
            <>
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between sticky top-20 ">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={
                            allSelected
                              ? () => dispatch(deselectAllItemsLocal())
                              : () => dispatch(selectAllItemsLocal())
                          }
                          className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-lg checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer"
                        />
                        <CheckCircle
                          size={14}
                          className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        />
                      </div>
                      <span className="text-sm sm:text-base font-black text-gray-700 group-hover:text-gray-900 transition-colors uppercase tracking-tight">
                        Chọn tất cả ({cart.itemCount})
                      </span>
                    </label>

                    <button
                      onClick={handleClearCart}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95 uppercase tracking-tighter"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Xóa giỏ hàng</span>
                      <span className="sm:hidden">Xóa</span>
                    </button>
                  </div>

                  <div className="space-y-6">
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
                  </div>

                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-orange-600 font-black hover:gap-4 transition-all text-xs uppercase tracking-widest py-4"
                  >
                    ← Tiếp tục mua sắm
                  </Link>
                </div>

                {!isMobile && (
                  <aside className="lg:col-span-1 h-fit">
                    <CartSummary
                      cart={cart}
                      onCheckout={handleCheckout}
                      loading={checkoutLoading}
                      isMobile={false}
                    />
                  </aside>
                )}
              </div>
            </>
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
        </main>
      </PageContentTransition>
    </div>
  );
};
