"use client";

import { SectionLoading } from "@/components";
import { SectionPageComponents } from "@/features/SectionPageComponents";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddressModal from "../_components/AddressModal";
import { CheckoutShippingAddress } from "../_components/CheckoutShippingAddress";
import { CheckoutShopList } from "../_components/CheckoutShopList";
import {CheckoutStepper} from "../_components/CheckoutStepper";
import { NoteSection } from "../_components/NoteSection";
import { OrderSuccessModal } from "../_components/OrderSuccessModal";
import { OrderSummary } from "../_components/OrderSummary";
import { PaymentSection } from "../_components/PaymentSection";
import { PayOSCheckoutModal } from "../_components/PayOSCheckoutModal";
import { useCheckoutActions } from "../_hooks/useCheckoutActions";
import { useCheckoutAddress } from "../_hooks/useCheckoutAddress";
import { useCheckoutStore } from "../_store/useCheckoutStore";

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
  const breadcrumbData = [
    { title: "Trang chủ", href: "/" },
    { title: "Giỏ hàng", href: "/cart" },
    { title: "Thanh toán", href: "/checkout" },
  ];

  if (!preview) return <SectionLoading message="Đang chuẩn bị đơn hàng..." />;

  return (
    <SectionPageComponents
      loading={loading && !preview}
      breadcrumbItems={breadcrumbData}
    >
      <div className="mt-8 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter uppercase italic  text-gray-900 leading-none">
            Thanh <span className="text-orange-500">Toán</span>
          </h1>
          <p className=" text-gray-400 text-sm font-medium mt-2">Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng</p>
        </div>
        
        <div className="w-full md:w-auto min-w-180">
          <CheckoutStepper currentStep={successModalVisible || payosModalVisible ? 3 : 1} />
        </div>
      </div>
      <div
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2"
      >
        <div className="lg:col-span-8 space-y-6">
          
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
              preview={preview}
            />
          </div>

        <div className="lg:col-span-4 space-y-2">
          <PaymentSection
            selectedMethod={formData.paymentMethod}
            onChange={(val) =>
              setFormData((p) => ({ ...p, paymentMethod: val }))
            }
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

      <AddressModal
        isOpen={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        savedAddresses={savedAddresses}
        currentAddressId={request?.addressId}
        onConfirmSaved={(id) =>
          updateAddress(id).then(() => setAddressModalVisible(false))
        }
        onConfirmNew={(data: any) =>
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
    </SectionPageComponents>
  );
};
