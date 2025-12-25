"use client";

import { CustomBreadcrumb, SectionLoading } from "@/components";
import { VoucherComponents } from "@/components/voucherComponents";
import PageContentTransition from "@/features/PageContentTransition";
import { formatPrice } from "@/hooks/useFormatPrice";
import { PayOSPaymentResponse } from "@/types/payment/payment.types";
import { Store, CreditCard, Home, ChevronRight, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import AddressModal from "../_components/AddressModal";
import CheckoutStepper from "../_components/CheckoutStepper";
import { ShippingAddressCard } from "../_components/ShippingAddressCard";
import { ItemImage } from "@/components/ItemImage";
import { NoteSection } from "../_components/NoteSection";
import { OrderSuccessModal } from "../_components/OrderSuccessModal";
import { OrderSummary } from "../_components/OrderSummary";
import { PaymentSection } from "../_components/PaymentSection";
import { PayOSCheckoutModal } from "../_components/PayOSCheckoutModal";
import { ShopShippingSelector } from "../_components/ShopShippingSelector";
import { useCheckout } from "../context/checkout";
import Link from "next/link";

export const CheckoutScreen = () => {
  const router = useRouter();

  const {
    preview,
    request,
    loading,
    savedAddresses,
    updateShippingMethod,
    updateGlobalVouchers,
    updateAddress,
    confirmOrder,
  } = useCheckout();

  const [formData, setFormData] = useState({
    paymentMethod: "COD",
    customerNote: "",
  });

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [payosModalVisible, setPayosModalVisible] = useState(false);
  const [payosInfo, setPayosInfo] = useState<PayOSPaymentResponse | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (preview?.paymentMethod) {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: preview.paymentMethod,
      }));
    }
  }, [preview?.paymentMethod]);

  const currentDisplayAddress = useMemo(() => {
    if (request?.shippingAddress) return request.shippingAddress;
    if (request?.addressId)
      return (
        savedAddresses.find((a) => a.addressId === request.addressId) || null
      );
    return null;
  }, [request, savedAddresses]);

  const handleShippingMethodChange = async (
    shopId: string,
    methodCode: string
  ) => {
    if (loading) return;
    try {
      await updateShippingMethod(shopId, methodCode);
      toast.success("Đã cập nhật phí vận chuyển");
    } catch (error) {
      console.error("Lỗi cập nhật ship:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMethod)
      return toast.error("Vui lòng chọn phương thức thanh toán");
    if (!currentDisplayAddress)
      return toast.error("Vui lòng chọn địa chỉ giao hàng");

    try {
      const res = await confirmOrder(
        formData.customerNote,
        formData.paymentMethod
      );
      if (res.paymentInfo) {
        setPayosInfo(res.paymentInfo);
        setSelectedOrder(res.orders[0]);
        setPayosModalVisible(true);
      } else {
        setSuccessModalVisible(true);
      }
    } catch (err) {}
  };

  // ✅ Thoát loading nếu ko có data sau 5s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!preview && !loading) {
        toast.error("Vui lòng chọn sản phẩm trước khi thanh toán");
        router.push("/cart");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [preview, loading, router]);

  if (!preview) return <SectionLoading message="Đang kiểm tra đơn hàng..." />;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 font-sans">
      <PageContentTransition>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 px-2">
            <Link
              href="/"
              className="hover:text-orange-500 flex items-center gap-1"
            >
              <Home size={12} /> HOME
            </Link>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-slate-900 tracking-widest">THANH TOÁN</span>
          </nav>

          <div className="mb-10 px-2 text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none flex items-center gap-4">
            Thanh <span className="text-orange-500 text-outline">Toán</span>
          </div>

          <CheckoutStepper
            currentStep={successModalVisible || payosModalVisible ? 3 : 1}
          />

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
            <div className="lg:col-span-8 space-y-6">
              <ShippingAddressCard
                selectedAddress={currentDisplayAddress}
                hasAddress={!!currentDisplayAddress}
                onOpenModal={() => setAddressModalVisible(true)}
              />

            <div className="space-y-6">
                {preview.shops.map((shop: any) => {
                  // ✅ Lấy thông tin voucher của shop này từ kết quả voucherApplication
                  const shopVoucherResult = preview.voucherApplication?.shopResults?.find(
                    (res: any) => res.shopId === shop.shopId
                  );

                  return (
                    <div key={shop.shopId} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
                        <Store className="text-orange-500" size={24} />
                        <h3 className="font-black text-slate-900 uppercase italic tracking-tight">{shop.shopName}</h3>
                      </div>

                      <div className="p-6 space-y-6">
                        {shop.items.map((item: any) => (
                          <div key={item.itemId} className="flex gap-4 items-center group">
                            <ItemImage item={item} className="w-20 h-20 rounded-2xl border border-slate-100 shadow-sm" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-800 uppercase truncate">{item.productName}</h4>
                              <p className="text-[11px] text-slate-400 font-bold tracking-tight">{item.variantAttributes}</p>
                              <div className="flex justify-between items-center mt-2 font-black">
                                <span className="text-xs text-slate-400 italic">x{item.quantity}</span>
                                <span className="text-sm text-slate-900">{formatPrice(item.lineTotal || 0)}</span>
                              </div>
                            </div>
                          </div>
                        ))}

                        <ShopShippingSelector
                          key={shop.shopId + shop.selectedShippingMethod}
                          shopId={shop.shopId}
                          shopName={shop.shopName}
                          availableOptions={shop.availableShippingOptions || []}
                          selectedMethodCode={shop.selectedShippingMethod}
                          isLoading={loading}
                          onMethodChange={updateShippingMethod}
                        />

                        {shopVoucherResult && shopVoucherResult.totalDiscount > 0 && (
                          <div className="flex items-center justify-between py-3 px-4 bg-orange-50 border border-orange-100 rounded-2xl animate-in fade-in duration-500">
                            <div className="flex items-center gap-2">
                              <div className="bg-orange-500 p-1 rounded-md">
                                <Ticket size={14} className="text-white" />
                              </div>
                              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                Đã áp dụng: {shopVoucherResult.discountDetails[0]?.voucherCode}
                              </span>
                            </div>
                            <span className="text-sm font-black text-red-600 italic">
                              -{formatPrice(shopVoucherResult.totalDiscount)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ✅ TỔNG SHOP (Đã trừ voucher shop) */}
                      <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng Shop:</span>
                        <span className="text-2xl font-black text-orange-600 tracking-tighter italic leading-none">
                          {formatPrice(shop.shopTotal || 0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-4xl shadow-xl border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="text-orange-500" size={20} />
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Thanh toán
                  </h2>
                </div>
                <PaymentSection
                  selectedMethod={formData.paymentMethod}
                  onChange={(val: string) =>
                    setFormData((p) => ({ ...p, paymentMethod: val }))
                  }
                />
              </div>

              <VoucherComponents
                compact
                onSelectVoucher={async (v) => {
                  const codes: string[] = [];
                  if (v.order?.code) codes.push(v.order.code);
                  if (v.shipping?.code) codes.push(v.shipping.code);
                  return await updateGlobalVouchers(codes);
                }}
                appliedVouchers={{
                  order:
                    preview.voucherApplication?.globalVouchers?.discountDetails?.find(
                      (d: any) =>
                        d.discountTarget === "ORDER" ||
                        d.discountTarget === "PRODUCT"
                    )?.voucherCode,
                  shipping:
                    preview.voucherApplication?.globalVouchers?.discountDetails?.find(
                      (d: any) => d.discountTarget === "SHIPPING"
                    )?.voucherCode,
                }}
                context={{
                  totalAmount: preview.subtotal,
                  shippingFee: preview.totalShippingFee,
                }}
              />
              <NoteSection
                value={formData.customerNote}
                onChange={(val: string) =>
                  setFormData((p) => ({ ...p, customerNote: val }))
                }
              />

              <OrderSummary
  subtotal={preview.subtotal || 0}
  shippingFee={preview.totalShippingFee || 0}
  discount={preview.totalDiscount || 0}
  tax={preview.totalTaxAmount || 0}
  total={preview.grandTotal || 0}
  loading={loading}
  onSubmit={handleSubmit}
  // ✅ FIX: Sử dụng trường isValid từ API để mở khóa nút bấm
  canSubmit={!!preview?.isValid && !loading} 
/>
            </div>
          </form>
        </div>
      </PageContentTransition>

      <AddressModal
        isOpen={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        savedAddresses={savedAddresses}
        currentAddressId={request?.addressId}
        onConfirmSaved={(id) => {
          updateAddress(id);
          setAddressModalVisible(false);
        }}
        onConfirmNew={(data) => {
          updateAddress(undefined, data);
          setAddressModalVisible(false);
        }}
      />

      <OrderSuccessModal
        isOpen={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
      />

      <PayOSCheckoutModal
        isOpen={payosModalVisible}
        onClose={() => setPayosModalVisible(false)}
        payosInfo={payosInfo}
        selectedOrder={selectedOrder}
        remainingSeconds={null}
        formatRemain={() => "00:00"}
      />
    </div>
  );
};
