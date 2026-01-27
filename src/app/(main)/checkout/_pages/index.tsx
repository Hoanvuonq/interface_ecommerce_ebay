"use client";

import { SectionLoading } from "@/components";
import { SectionPageComponents } from "@/features/SectionPageComponents";
import { useToast } from "@/hooks/useToast";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  AddressModal,
  CheckoutShippingAddress,
  CheckoutShopList,
  CheckoutStepper,
  NoteSection,
  OrderSuccessModal,
  OrderSummary,
  PaymentSection,
  PayOSCheckoutModal,
} from "../_components";
import { useCheckoutActions } from "../_hooks/useCheckoutActions";
import { useCheckoutAddress } from "../_hooks/useCheckoutAddress";
import { useCheckoutStore } from "../_store/useCheckoutStore";

// Import thêm hook khởi tạo nếu bạn muốn gọi nó ở đây (thay vì page.tsx)
// import { useCheckoutInitialization } from "../_hooks/useCheckoutInitialization"; 

export const CheckoutScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("type") === "buy_now";

  // Gọi hook khởi tạo ở đây (NẾU chưa gọi ở page.tsx)
  // useCheckoutInitialization(null); 

  const {
    updateShippingMethod,
    confirmOrder,
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

  // Sync payment method từ preview nếu có
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
    if (!formData.paymentMethod) return error("Vui lòng chọn phương thức thanh toán");
    if (!hasAddress) return error("Vui lòng chọn địa chỉ giao hàng");

    try {
      const res = await confirmOrder(
        formData.customerNote,
        formData.paymentMethod,
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

  // Logic Loading: 
  // Nếu đang loading init (loading = true) HOẶC chưa có preview -> Hiện Loading
  // Trừ khi đã có preview và chỉ đang update nhỏ (loading = false)
  const isInitializing = loading && !preview;

  if (isInitializing) {
    return (
      <SectionLoading 
        message={isBuyNow ? "Đang xử lý mua ngay..." : "Đang chuẩn bị đơn hàng..."} 
      />
    );
  }

  // Nếu đã load xong mà vẫn không có preview -> Có lỗi hoặc giỏ hàng rỗng
  if (!preview && !loading) {
    return (
      <SectionPageComponents breadcrumbItems={breadcrumbData}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-gray-500 mb-4">Chưa có thông tin đơn hàng</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </SectionPageComponents>
    );
  }

  return (
    <SectionPageComponents
      // Chỉ hiện loading overlay khi đang thực hiện action (đổi ship, đặt hàng)
      loading={actionLoading} 
      loadingMessage="Đang xử lý..."
      breadcrumbItems={breadcrumbData}
    >
      <div className="mt-8 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter uppercase italic text-gray-900 leading-none">
            {isBuyNow ? (
               <>Mua <span className="text-orange-500">Ngay</span></>
            ) : (
               <>Thanh <span className="text-orange-500">Toán</span></>
            )}
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-2">
            Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng
          </p>
        </div>

        <div className="w-full md:w-auto min-w-180">
          <CheckoutStepper
            currentStep={successModalVisible || payosModalVisible ? 3 : 1}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
        <div className="lg:col-span-8 space-y-6">
          <CheckoutShippingAddress
            selectedAddress={currentAddress}
            hasAddress={hasAddress}
            onOpenModal={() => setAddressModalVisible(true)}
          />

          {/* Truyền key để force re-render khi đổi shop list nếu cần */}
          <CheckoutShopList
            key={preview?.shops?.map((s: any) => s.shopId).join('-')}
            shops={preview?.shops || []}
            voucherApplication={preview?.voucherApplication}
            loading={loading} // Loading cục bộ khi đổi shipping method
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
          
          <OrderSummary 
             // Truyền thẳng hàm submit vào nút đặt hàng
             onSubmit={handleSubmit} 
             // Có thể disable nút đặt hàng nếu đang loading
          />
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
            setAddressModalVisible(false),
          )
        }
      />
      
      <OrderSuccessModal
        isOpen={successModalVisible}
        onClose={() => {
           setSuccessModalVisible(false);
           // Redirect về trang đơn hàng hoặc trang chủ sau khi thành công
           router.push('/user/purchase');
        }}
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