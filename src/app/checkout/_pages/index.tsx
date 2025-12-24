"use client";

import { CheckCircle2, Loader2, Store, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// --- Components ---
import { PayOSQRPayment } from "@/app/orders/_components/PayOSQRPayment";
import { CustomBreadcrumb, SectionLoading } from "@/components";
import { VoucherComponents } from "@/components/voucherComponents";
import PageContentTransition from "@/features/PageContentTransition";
import AddressModal from "../_components/AddressModal";
import CheckoutStepper from "../_components/CheckoutStepper";
import { ShippingAddressCard } from "../_components/ShippingAddressCard";

// --- Hooks & Context ---
import { formatPrice } from "@/hooks/useFormatPrice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
import { useCheckoutAddress } from "../context/address";

// --- Services & APIs ---
import { getCostsShipments } from "@/features/Shipment";
import { orderService } from "@/services/orders/order.service";
import { paymentService } from "@/services/payment/payment.service"; // Thêm import này

// --- Types ---
import { CostsShipmentResponse } from "@/features/Shipment/types/shipment.types";
import { OrderCreationResponse } from "@/types/orders/order-creation.types";
import {
  OrderCreateRequest,
  ShippingAddressInfo,
} from "@/types/orders/order.types";
import { PayOSPaymentResponse } from "@/types/payment/payment.types";

// --- Utils ---
import { CustomModal } from "@/components";
import { ItemImage } from "@/components/ItemImage";
import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
import { extractItemDimensions } from "@/utils/packaging-optimizer";
import { NoteSection } from "../_components/NoteSection";
import { OrderSummary } from "../_components/OrderSummary";
import { PaymentSection } from "../_components/PaymentSection";
import { getShipmentCost } from "../_types/checkout";
import { values } from "lodash";
export const CheckoutScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { checkoutPreview: reduxPreview } = useAppSelector(
    (state) => state.cart
  );

  const {
    savedAddresses,
    buyerInfo,
    shopAddressIdMap,
    shopProvince,
    loadingShopAddress,
  } = useCheckoutAddress();

  const [formData, setFormData] = useState<{
    addressId: string | undefined;
    paymentMethod:
      | "COD"
      | "VNPAY"
      | "MOMO"
      | "BANK_TRANSFER"
      | "CREDIT_CARD"
      | "PAYOS";
    shippingMethod:
      | "CONKIN"
      | "STANDARD"
      | "EXPRESS"
      | "ECONOMY"
      | "GHN"
      | "GHTK"
      | "VNPOST"
      | "NINJA_VAN"
      | "J&T"
      | "BEST_EXPRESS"
      | "FPT"
      | "OTHER"
      | undefined;
    customerNote: string;
    recipientName: string;
    phoneNumber: string;
    addressLine1: string;
    ward: string;
    district: string;
    province: string;
    email: string;
    country: string;
    globalVouchers?: string[];
  }>({
    addressId: undefined,
    paymentMethod: "COD",
    shippingMethod: "CONKIN",
    customerNote: "",
    recipientName: "",
    phoneNumber: "",
    addressLine1: "",
    ward: "",
    district: "",
    province: "",
    email: "",
    country: "Vietnam",
    globalVouchers: [],
  });

  const [loading, setLoading] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // --- Logic State ---
  const [checkoutPreview, setCheckoutPreview] = useState<any>(null);
  const [checkoutRequest, setCheckoutRequest] = useState<any>(null);

  // Shipment Logic
  const [shopShipmentMethods, setShopShipmentMethods] = useState<
    Record<string, CostsShipmentResponse[]>
  >({});
  const [shopSelectedShippingMethod, setShopSelectedShippingMethod] = useState<
    Record<string, string>
  >({});
  const [loadingShopShipmentMethods, setLoadingShopShipmentMethods] = useState<
    Record<string, boolean>
  >({});

  // Payment & Order Result
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [payosModalVisible, setPayosModalVisible] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [payosInfo, setPayosInfo] = useState<PayOSPaymentResponse | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  // Vouchers
  const [voucherErrors, setVoucherErrors] = useState<
    Array<{ code: string; reason: string }>
  >([]);

  // Refs
  const lastCheckoutRequestRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    let preview = reduxPreview;
    let request = null;

    if (!preview) {
      const savedPreview = sessionStorage.getItem("checkoutPreview");
      const savedRequest = sessionStorage.getItem("checkoutRequest");
      if (savedPreview) {
        try {
          preview = JSON.parse(savedPreview);
          request = savedRequest ? JSON.parse(savedRequest) : null;
        } catch (e) {}
      }
    }

    if (!preview) {
      toast.warning("Vui lòng chọn sản phẩm từ giỏ hàng");
      router.push("/cart");
      return;
    }
    setCheckoutPreview(preview);
    setCheckoutRequest(request);
  }, [reduxPreview, router]);

  // Auto-fill Data
  useEffect(() => {
    if (savedAddresses.length > 0 && !formData.addressId && !useNewAddress) {
      setFormData((prev) => ({
        ...prev,
        addressId: savedAddresses[0].addressId,
      }));
    }
    if (buyerInfo && useNewAddress) {
      setFormData((prev) => ({
        ...prev,
        recipientName: prev.recipientName || buyerInfo.fullName,
        phoneNumber: prev.phoneNumber || buyerInfo.phone,
      }));
    }
  }, [savedAddresses, buyerInfo, useNewAddress]);

  // --- LOGIC: Shipping Calculation ---
  const fetchCostsShipmentsForShop = useCallback(
    async (buyerAddrId: string, shopId: string, items: any[]) => {
      if (!buyerAddrId || !shopId || !items.length) return;

      setLoadingShopShipmentMethods((prev) => ({ ...prev, [shopId]: true }));
      try {
        const shopAddrId = shopAddressIdMap[shopId];
        if (!shopAddrId) return;

        const costsItems = items.map((item: any) => {
          const dims = extractItemDimensions(item);
          return {
            name: item.productName || "Sản phẩm",
            code: item.sku || `SKU-${item.productId}`,
            price: item.price || item.unitPrice || 0,
            quantity: item.quantity || 1,
            length: dims?.length || 10,
            width: dims?.width || 10,
            height: dims?.height || 10,
            weight: dims?.weight || 0.5,
            category: { level1: "Áo" },
          };
        });

        const subtotal = items.reduce((sum, i) => sum + (i.lineTotal || 0), 0);
        const res = await getCostsShipments({
          items: costsItems,
          id_buyer_address: buyerAddrId,
          id_shop_address: shopAddrId,
          cod_value: subtotal,
          insurance_value: 0,
        });

        if (res && res.length > 0) {
          setShopShipmentMethods((prev) => ({ ...prev, [shopId]: res }));
          const firstMethod =
            res[0].serviceCompanyType?.toUpperCase() || "METHOD_0";
          setShopSelectedShippingMethod((prev) => ({
            ...prev,
            [shopId]: firstMethod,
          }));
        } else {
          setShopShipmentMethods((prev) => ({ ...prev, [shopId]: [] }));
        }
      } catch (err) {
        console.error("Lỗi tính ship:", err);
      } finally {
        setLoadingShopShipmentMethods((prev) => ({ ...prev, [shopId]: false }));
      }
    },
    [shopAddressIdMap]
  );

  // Trigger Calc
  useEffect(() => {
    const currentAddrId = formData.addressId;
    if (
      currentAddrId &&
      !useNewAddress &&
      !loadingShopAddress &&
      checkoutPreview?.shops
    ) {
      checkoutPreview.shops.forEach((shop: any) => {
        if (shopAddressIdMap[shop.shopId]) {
          fetchCostsShipmentsForShop(currentAddrId, shop.shopId, shop.items);
        }
      });
    }
  }, [
    formData.addressId,
    useNewAddress,
    loadingShopAddress,
    checkoutPreview,
    shopAddressIdMap,
    fetchCostsShipmentsForShop,
  ]);

  // --- LOGIC: Totals ---
  const getCurrentShippingFee = useCallback(() => {
    if (!checkoutPreview?.shops) return 0;
    return checkoutPreview.shops.reduce((total: number, shop: any) => {
      const methods = shopShipmentMethods[shop.shopId] || [];
      const selectedKey = shopSelectedShippingMethod[shop.shopId];
      const method = methods.find(
        (m) =>
          (m.serviceCompanyType?.toUpperCase() || "") ===
          selectedKey?.toUpperCase()
      );
      return total + (method ? getShipmentCost(method) : 0);
    }, 0);
  }, [checkoutPreview, shopShipmentMethods, shopSelectedShippingMethod]);

  const calculateGrandTotal = useCallback(() => {
    if (!checkoutPreview) return 0;
    return (
      (checkoutPreview.subtotal || 0) -
      (checkoutPreview.totalDiscount || 0) +
      getCurrentShippingFee() +
      (checkoutPreview.totalTaxAmount || 0)
    );
  }, [checkoutPreview, getCurrentShippingFee]);

  // --- LOGIC: Submit ---
  // ...existing code...

  // Remove this if you don't use lodash's values anywhere else
  // import { values } from "lodash";

  // --- LOGIC: Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate cart items
      if (
        !checkoutPreview?.shops?.length ||
        checkoutPreview.shops.every((shop: any) => !shop.items?.length)
      ) {
        toast.error("Giỏ hàng của bạn đang trống hoặc không hợp lệ.");
        setLoading(false);
        return;
      }

      // Validate order total
      if (calculateGrandTotal() <= 0) {
        toast.error("Tổng đơn hàng phải lớn hơn 0.");
        setLoading(false);
        return;
      }

      // Validate shipping address
      const currentAddrId = formData.addressId;
      if (!currentAddrId && !useNewAddress) {
        toast.error("Vui lòng chọn địa chỉ giao hàng.");
        setLoading(false);
        return;
      }
      if (!formData.paymentMethod) {
        toast.error("Vui lòng chọn phương thức thanh toán.");
        setLoading(false);
        return;
      }

      // Validate shipping method for each shop
      if (
        !checkoutPreview?.buyerAddressData ||
        !checkoutPreview?.shops?.every(
          (shop: any) => shop.shippingFee && shop.shippingMethod
        )
      ) {
        toast.error(
          "Vui lòng chọn địa chỉ và phương thức vận chuyển hợp lệ trước khi đặt hàng."
        );
        setLoading(false);
        return;
      }

      // Prepare shipping address
      let finalShippingAddress: ShippingAddressInfo;
      if (useNewAddress) {
        const oldAddr = mapAddressToOldFormat(formData.ward, formData.province);
        finalShippingAddress = {
          country: formData.country,
          state: formData.province,
          city: formData.district,
          postalCode: formData.ward,
          addressLine1: formData.addressLine1,
          ...(oldAddr.old_ward_name && {
            districtNameOld: oldAddr.old_district_name,
            provinceNameOld: oldAddr.old_province_name,
            wardNameOld: oldAddr.old_ward_name,
          }),
        };
      } else {
        const savedAddr = savedAddresses.find(
          (a) => a.addressId === currentAddrId
        );
        if (!savedAddr) throw new Error("Địa chỉ không hợp lệ");
        const oldAddr = mapAddressToOldFormat(
          savedAddr.ward,
          savedAddr.province
        );
        finalShippingAddress = {
          addressId: currentAddrId,
          ...(oldAddr.old_ward_name && {
            districtNameOld: oldAddr.old_district_name,
            provinceNameOld: oldAddr.old_province_name,
            wardNameOld: oldAddr.old_ward_name,
          }),
        };
      }

      // ...existing code...
      const orderRequest: OrderCreateRequest = {
        shops: checkoutPreview.shops.map((shop: any) => {
          // Lấy shippingMethod và shippingFee đúng từ preview
          const selectedMethod = shop.selectedShippingMethod;
          const selectedOption = shop.availableShippingOptions?.find(
            (opt: any) => opt.code === selectedMethod
          );
          return {
            shopId: shop.shopId,
            itemIds: shop.items.map((item: any) => item.itemId),
            shippingMethod: selectedMethod,
            shippingFee: selectedOption?.fee ?? 0,
            vouchers: [],
          };
        }),
        shippingMethod: formData.shippingMethod || "CONKIN",
        shippingAddress: finalShippingAddress,
        globalVouchers: formData.globalVouchers || [],
        paymentMethod: formData.paymentMethod,
        customerNote: formData.customerNote,
        buyerAddressId: !useNewAddress ? currentAddrId : undefined,
      };
      // ...existing code...

      // Submit order
      const res: OrderCreationResponse = await orderService.createOrder(
        orderRequest
      );
      sessionStorage.removeItem("checkoutPreview");
      sessionStorage.removeItem("checkoutRequest");

      if (res.paymentInfo) {
        setPayosInfo({
          ...res.paymentInfo,
          expiredAt: res.paymentInfo.expiredAt
            ? String(res.paymentInfo.expiredAt)
            : undefined,
          amount: res.paymentInfo.amount,
        } as any);
        setSelectedOrder(res.orders[0]);
        setPayosModalVisible(true);
      } else {
        setOrderSuccess(res.orders);
        setSuccessModalVisible(true);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...
  const handleAddressConfirm = async (isNew: boolean, data: any) => {
    setLoading(true); // Thêm loading để chặn submit khi đang cập nhật preview
    try {
      if (isNew) {
        setFormData((prev) => ({ ...prev, ...data, addressId: undefined }));
        setUseNewAddress(true);

        const updatedRequest = {
          ...checkoutRequest,
          shippingAddress: {
            recipientName: data.recipientName,
            phoneNumber: data.phoneNumber,
            addressLine1: data.detailAddress,
            ward: data.ward,
            district: data.district,
            province: data.province,
            country: "Vietnam",
          },
          addressId: undefined,
        };
        const result = await dispatch(
          checkoutPreviewAction(updatedRequest)
        ).unwrap();
        setCheckoutPreview(result);
        setCheckoutRequest(updatedRequest);
        sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
        sessionStorage.setItem(
          "checkoutRequest",
          JSON.stringify(updatedRequest)
        );
      } else {
        setFormData((prev) => ({ ...prev, addressId: data }));
        setUseNewAddress(false);

        const updatedRequest = {
          ...checkoutRequest,
          addressId: data,
        };
        const result = await dispatch(
          checkoutPreviewAction(updatedRequest)
        ).unwrap();
        setCheckoutPreview(result);
        setCheckoutRequest(updatedRequest);
        sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
        sessionStorage.setItem(
          "checkoutRequest",
          JSON.stringify(updatedRequest)
        );
      }
      setAddressModalVisible(false);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };
  // --- LOGIC: Vouchers ---
  const handleVoucherSelect = async (vouchers: {
    order?: any;
    shipping?: any;
  }) => {
    if (!checkoutPreview) {
      toast.error("Không thể cập nhật voucher");
      return false;
    }

    try {
      // Build globalVouchers array
      const globalVouchers: string[] = [];
      if (vouchers.order?.code) globalVouchers.push(vouchers.order.code);
      if (vouchers.shipping?.code) globalVouchers.push(vouchers.shipping.code);

      if (globalVouchers.length === 0) return false;

      // Update checkout request
      const updatedRequest = {
        ...(checkoutRequest || {}),
        globalVouchers,
        // Giữ nguyên shipping method hiện tại
        shippingMethod: formData.shippingMethod || "CONKIN",
      };

      // Prevent duplicates
      const requestKey = JSON.stringify(updatedRequest);
      if (lastCheckoutRequestRef.current === requestKey) return false;

      // Dispatch action
      lastCheckoutRequestRef.current = requestKey;
      const result = await dispatch(
        checkoutPreviewAction(updatedRequest)
      ).unwrap();

      // Update State
      setCheckoutPreview(result);
      setCheckoutRequest(updatedRequest);
      sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
      sessionStorage.setItem("checkoutRequest", JSON.stringify(updatedRequest));

      // Validate Result
      const voucherApp = result.voucherApplication;
      const validVouchers = voucherApp?.globalVouchers?.validVouchers || [];

      if (
        voucherApp?.success === false ||
        (voucherApp?.globalVouchers?.invalidVouchers?.length || 0) > 0
      ) {
        // Lấy lỗi đầu tiên để hiển thị
        const firstInvalid = voucherApp?.globalVouchers?.invalidVouchers?.[0];
        const reason = voucherApp?.globalVouchers?.discountDetails?.find(
          (d: any) => d.voucherCode === firstInvalid
        )?.reason;
        toast.error(
          `Voucher ${firstInvalid} không áp dụng được: ${
            reason || "Lỗi không xác định"
          }`
        );
        return false;
      }

      if (validVouchers.length > 0) {
        toast.success("Áp dụng voucher thành công!");
        return true;
      }

      return false;
    } catch (error: any) {
      console.error(error);
      toast.error("Lỗi khi áp dụng voucher");
      return false;
    }
  };

  // --- LOGIC: Payment Polling ---
  useEffect(() => {
    if (!payosModalVisible || !selectedOrder?.orderId) {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      return;
    }

    const pollStatus = async () => {
      try {
        let statusData;
        if (payosInfo?.depositId) {
          statusData = await paymentService.getPaymentStatus(
            payosInfo.depositId
          );
        } else {
          statusData = await paymentService.getPaymentStatusByOrder(
            selectedOrder.orderId
          );
        }

        const status = statusData?.status?.toUpperCase();

        if (["SUCCEEDED", "SUCCESS", "PAID"].includes(status)) {
          if (pollingIntervalRef.current)
            clearInterval(pollingIntervalRef.current);
          setPayosModalVisible(false);
          toast.success("Thanh toán thành công!");
          router.push(`/orders/${selectedOrder.orderId}`);
        } else if (["FAILED", "CANCELLED"].includes(status)) {
          if (pollingIntervalRef.current)
            clearInterval(pollingIntervalRef.current);
          toast.error("Thanh toán thất bại hoặc đã bị hủy");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    };

    pollingIntervalRef.current = setInterval(pollStatus, 2000);
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [payosModalVisible, selectedOrder, payosInfo, router]);

  // Format Helper
  const formatRemain = (sec: number | null) => {
    if (sec === null) return "";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentDisplayAddr = useNewAddress
    ? {
        recipientName: formData.recipientName,
        phone: formData.phoneNumber,
        detailAddress: formData.addressLine1,
        ward: formData.ward,
        district: formData.district,
        province: formData.province,
      }
    : savedAddresses.find((a) => a.addressId === formData.addressId) || null;

  // --- RENDER ---
  if (!checkoutPreview) return <SectionLoading message="Đang tải..." />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageContentTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CustomBreadcrumb
            items={[
              { title: "Giỏ hàng", href: "/cart" },
              { title: "Thanh toán", href: "#" },
            ]}
          />
          <CheckoutStepper currentStep={orderSuccess ? 3 : 0} />

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <ShippingAddressCard
                selectedAddress={currentDisplayAddr}
                hasAddress={!!currentDisplayAddr}
                onOpenModal={() => setAddressModalVisible(true)}
              />

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800">Sản phẩm</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {checkoutPreview.shops.map((shop: any) => (
                    <div key={shop.shopId} className="p-4 sm:p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Store className="text-blue-600 w-5 h-5" />
                        <span className="font-medium text-gray-900">
                          {shop.shopName}
                        </span>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                          {shop.itemCount} SP
                        </span>
                      </div>
                      <div className="space-y-3">
                        {shop.items.map((item: any) => (
                          <div key={item.itemId} className="flex gap-4">
                            <ItemImage item={item} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {item.productName}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {item.variantAttributes}
                              </p>
                              <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  x{item.quantity}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatPrice(item.lineTotal)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-4 h-4 text-gray-500" />
                          <h4 className="text-sm font-medium text-gray-700">
                            Phương thức vận chuyển
                          </h4>
                        </div>
                        {loadingShopShipmentMethods[shop.shopId] ? (
                          <div className="flex gap-2 items-center text-sm text-gray-500 py-2">
                            <Loader2 className="animate-spin w-4 h-4" /> Đang
                            tính phí vận chuyển...
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {shopShipmentMethods[shop.shopId]?.map(
                              (method, idx) => {
                                const val =
                                  method.serviceCompanyType?.toUpperCase() ||
                                  `METHOD_${idx}`;
                                const isSelected =
                                  shopSelectedShippingMethod[shop.shopId] ===
                                  val;
                                function getShipmentMethodName(
                                  serviceCompanyType: string | undefined
                                ): React.ReactNode | Iterable<React.ReactNode> {
                                  throw new Error("Function not implemented.");
                                }

                                return (
                                  <div
                                    key={val}
                                    onClick={() =>
                                      setShopSelectedShippingMethod((prev) => ({
                                        ...prev,
                                        [shop.shopId]: val,
                                      }))
                                    }
                                    className={`relative p-3 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${
                                      isSelected
                                        ? "border-orange-500 bg-white shadow-sm ring-1 ring-orange-500"
                                        : "border-gray-200 hover:border-orange-300 bg-white"
                                    }`}
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">
                                        {getShipmentMethodName(
                                          method.serviceCompanyType
                                        )}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-0.5">
                                        Nhận hàng: 3-5 ngày
                                      </p>
                                    </div>
                                    <span className="text-sm font-bold text-green-600 ml-2">
                                      {formatPrice(getShipmentCost(method))}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                            {!loadingShopShipmentMethods[shop.shopId] &&
                              (!shopShipmentMethods[shop.shopId] ||
                                shopShipmentMethods[shop.shopId].length ===
                                  0) && (
                                <div className="col-span-full text-center py-2 text-sm text-red-500 bg-red-50 rounded-lg">
                                  Chưa hỗ trợ vận chuyển đến địa chỉ này
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end pt-3 border-t border-gray-100 border-dashed">
                        <div className="text-right">
                          <span className="text-sm text-gray-500 mr-2">
                            Tổng số tiền ({shop.itemCount} sản phẩm):
                          </span>
                          <span className="text-base font-bold text-orange-600">
                            {formatPrice(
                              (shop.subtotal || 0) +
                                (shopShipmentMethods[shop.shopId]?.find(
                                  (m) =>
                                    m.serviceCompanyType?.toUpperCase() ===
                                    shopSelectedShippingMethod[shop.shopId]
                                )?.total || 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1 space-y-6">
              <PaymentSection
                selectedMethod={formData.paymentMethod}
                onChange={(val: string) =>
                  setFormData((p) => ({
                    ...p,
                    paymentMethod: val as
                      | "COD"
                      | "VNPAY"
                      | "MOMO"
                      | "BANK_TRANSFER"
                      | "CREDIT_CARD"
                      | "PAYOS",
                  }))
                }
              />

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <VoucherComponents
                  compact
                  onSelectVoucher={handleVoucherSelect}
                  context={{ totalAmount: checkoutPreview.subtotal }}
                />
              </div>
              <NoteSection
                value={formData.customerNote}
                onChange={(val: string) =>
                  setFormData((p) => ({ ...p, customerNote: val }))
                }
              />
              <OrderSummary
                subtotal={checkoutPreview.subtotal}
                shippingFee={getCurrentShippingFee()}
                discount={checkoutPreview.totalDiscount}
                tax={checkoutPreview.totalTaxAmount}
                total={calculateGrandTotal()}
                loading={loading}
                canSubmit={
                  !!checkoutPreview?.buyerAddressData &&
                  checkoutPreview?.shops?.every(
                    (shop: any) => shop.shippingFee && shop.shippingMethod
                  )
                }
              />
            </div>
          </form>
        </div>
      </PageContentTransition>

      <AddressModal
        isOpen={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        savedAddresses={savedAddresses}
        currentAddressId={formData.addressId}
        onConfirmSaved={(id) => handleAddressConfirm(false, id)}
        onConfirmNew={(data) => handleAddressConfirm(true, data)}
      />
      <CustomModal isOpen={successModalVisible} onClose={() => {}}>
        <div className="text-center py-8 px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đặt hàng thành công!
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Cảm ơn bạn đã mua sắm.
          </p>
          <div className="flex gap-3 justify-center w-full">
            <button
              type="button"
              onClick={() => router.push("/orders")}
              className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
            >
              Xem đơn hàng
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </CustomModal>
      <CustomModal
        isOpen={payosModalVisible}
        onClose={() => router.push("/orders")}
        title="Thanh toán đơn hàng"
      >
        {payosInfo ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
              <span className="text-gray-500">Hết hạn sau:</span>
              <span
                className={`font-bold font-mono ${
                  remainingSeconds && remainingSeconds < 60
                    ? "text-red-500"
                    : "text-blue-600"
                }`}
              >
                {formatRemain(remainingSeconds)}
              </span>
            </div>
            <PayOSQRPayment
              orderId={selectedOrder?.orderId}
              orderNumber={selectedOrder?.orderNumber || ""}
              amount={selectedOrder?.grandTotal}
              onRefresh={() => {}}
              onCancelPayment={() => setPayosModalVisible(false)}
            />
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-orange-500 w-12 h-12" />
            <p className="text-gray-500 font-medium">
              Đang tạo mã thanh toán...
            </p>
          </div>
        )}
      </CustomModal>
    </div>
  );
};
