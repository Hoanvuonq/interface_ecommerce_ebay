"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

import { CustomBreadcrumb, SectionLoading } from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import { CheckoutShippingAddress } from "../_components/CheckoutShippingAddress";
import CheckoutStepper from "../_components/CheckoutStepper";
import { NoteSection } from "../_components/NoteSection";
import { OrderSuccessModal } from "../_components/OrderSuccessModal";
import { OrderSummary } from "../_components/OrderSummary";
import { PaymentSection } from "../_components/PaymentSection";
import { PayOSCheckoutModal } from "../_components/PayOSCheckoutModal";
import AddressModal from "../_components/AddressModal";
import { VoucherComponents } from "@/components/voucherComponents";

import { useCheckoutActions } from "../_hooks/useCheckoutActions";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { useCheckoutAddress } from "../_hooks/useCheckoutAddress";
import { CheckoutShopList } from "../_components/CheckoutShopList";
import { useToast } from "@/hooks/useToast";
export const CheckoutScreen = () => {
  const router = useRouter();
  const {
    updateShippingMethod,
    confirmOrder,
    syncPreview,
    isLoading: actionLoading,
  } = useCheckoutActions();
  const { currentAddress, updateAddress, hasAddress } = useCheckoutAddress();
  const { preview, request, loading, savedAddresses } = useCheckoutStore();
  const { error } = useToast();
  const [formData, setFormData] = useState({
    paymentMethod: "COD",
    customerNote: "",
  });
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [payosModalVisible, setPayosModalVisible] = useState(false);
  const [payosInfo, setPayosInfo] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (preview?.paymentMethod) {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: preview.paymentMethod,
      }));
    }
  }, [preview?.paymentMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMethod)
      return error("Vui lòng chọn phương thức thanh toán");
    if (!hasAddress) return error("Vui lòng chọn địa chỉ giao hàng");

    try {
      const res = await confirmOrder(
        formData.customerNote,
        formData.paymentMethod
      );
      if (res?.paymentInfo) {
        setPayosInfo(res.paymentInfo);
        setSelectedOrder(res.orders[0]);
        setPayosModalVisible(true);
      } else if (res) {
        setSuccessModalVisible(true);
      }
    } catch (err) {}
  };

  if (!preview) return <SectionLoading message="Đang chuẩn bị đơn hàng..." />;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-16 font-sans text-slate-900">
      <PageContentTransition>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <CustomBreadcrumb
            items={[
              { title: "Trang chủ", href: "/" },
              { title: "Giỏ hàng", href: "/cart" },
              { title: "Thanh toán", href: "/checkout" },
            ]}
          />
          <div className="my-6 px-2 text-5xl font-black tracking-tighter uppercase italic text-slate-900">
            Thanh Toán
          </div>
          <CheckoutStepper
            currentStep={successModalVisible || payosModalVisible ? 3 : 1}
          />
          <div
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10"
          >
            <div className="lg:col-span-8 space-y-8">
              <CheckoutShippingAddress
                selectedAddress={currentAddress}
                hasAddress={hasAddress}
                onOpenModal={() => setAddressModalVisible(true)}
              />

              <CheckoutShopList
                shops={preview.shops}
                voucherApplication={preview.voucherApplication}
                loading={loading}
                updateShippingMethod={updateShippingMethod}
                request={request}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <PaymentSection
                selectedMethod={formData.paymentMethod}
                onChange={(val) =>
                  setFormData((p) => ({ ...p, paymentMethod: val }))
                }
              />
              <VoucherComponents
                compact
                onSelectVoucher={async (v: any) => {
                  const codes = [v.order?.code, v.shipping?.code].filter(
                    Boolean
                  ) as string[];
                  const result = await syncPreview({
                    ...request,
                    globalVouchers: codes,
                  });
                  return !!result;
                }}
                appliedVouchers={{
                  order:
                    preview.voucherApplication?.globalVouchers?.discountDetails?.find(
                      (d: any) =>
                        ["ORDER", "PRODUCT"].includes(d.discountTarget)
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
              <OrderSummary onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </PageContentTransition>

      <AddressModal
        isOpen={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        savedAddresses={savedAddresses}
        currentAddressId={request?.addressId}
        onConfirmSaved={(id) =>
          updateAddress(id).then(() => setAddressModalVisible(false))
        }
        onConfirmNew={(data) =>
          updateAddress(undefined, data).then(() =>
            setAddressModalVisible(false)
          )
        }
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
