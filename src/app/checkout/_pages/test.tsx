// "use client";

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import {
//   CheckCircle2,
//   CreditCard,
//   MapPin,
//   Store,
//   ChevronRight,
//   X,
//   Loader2,
//   ShoppingCart,
//   Tag,
// } from "lucide-react";
// import _ from "lodash";

// import { CustomBreadcrumb, SectionLoading } from "@/components";
// import CheckoutStepper from "../_components/CheckoutStepper";
// import { ShippingAddressCard } from "../_components/ShippingAddressCard";
// import AddressModal from "../_components/AddressModal";
// import { VoucherInput } from "@/app/cart/_components/VoucherInput";
// import { PayOSQRPayment } from "@/app/orders/_components/PayOSQRPayment";
// import PageContentTransition from "@/features/PageContentTransition";

// import { useAppDispatch, useAppSelector } from "@/store/store";
// import { useCheckoutAddress } from "../context/address";
// import { formatPrice } from "@/hooks/useFormatPrice";
// import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";

// import { orderService } from "@/services/orders/order.service";
// import { paymentService } from "@/services/payment/payment.service";
// import { buyerService } from "@/services/buyer/buyer.service";
// import { getAllShopAddresses } from "@/services/shop/shop.service";
// import {
//   getConkinShipmentPrice,
//   getCostsShipments,
//   getGHNCosts,
// } from "@/features/Shipment";

// import {
//   OrderCreateRequest,
//   ShippingAddressInfo,
// } from "@/types/orders/order.types";
// import { PayOSPaymentResponse } from "@/types/payment/payment.types";
// import { getShipmentCost, getShipmentMethodName } from "../_types/checkout";
// import { OrderCreationResponse } from "@/types/orders/order-creation.types";
// import {
//   CostsShipmentResponse,
//   GHNCostsResponse,
//   PackageConkinResponse,
// } from "@/features/Shipment/types/shipment.types";

// import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
// import { resolvePreviewItemImageUrl } from "@/utils/cart/image.utils";
// import { extractItemDimensions } from "@/utils/packaging-optimizer";
// import { getStoredUserDetail } from "@/utils/jwt";

// // --- Main Component ---
// import { CustomModal } from "@/components/Checkout/CustomModal";
// import { RadioOption } from "@/components/Checkout/RadioOption";
// import { ShippingMethodModal } from "../_components/ShippingMethodModal";

// export const CheckoutScreen = () => {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { cart, checkoutPreview: reduxPreview } = useAppSelector(
//     (state) => state.cart
//   );
//   const {
//     savedAddresses,
//     buyerInfo,
//     shopAddressIdMap,
//     shopProvince,
//     allWardsData,
//     loadingShopAddress,
//     provincesData,
//   } = useCheckoutAddress();

//   const [formData, setFormData] = useState({
//     addressId: undefined as string | undefined,
//     paymentMethod: "COD",
//     shippingMethod: "CONKIN",
//     customerNote: "",
//     recipientName: "",
//     phoneNumber: "",
//     addressLine1: "",
//     ward: "",
//     district: "",
//     province: "",
//     email: "",
//     country: "Vietnam",
//   });

//   // --- UI State ---
//   const [loading, setLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [useNewAddress, setUseNewAddress] = useState(false);
//   const [addressModalVisible, setAddressModalVisible] = useState(false);
//   // --- Logic State ---
//   const [checkoutPreview, setCheckoutPreview] = useState<any>(null);
//   const [checkoutRequest, setCheckoutRequest] = useState<any>(null);
//   // Shipment
//   const [shopShipmentMethods, setShopShipmentMethods] = useState<
//     Record<string, CostsShipmentResponse[]>
//   >({});
//   const [shopSelectedShippingMethod, setShopSelectedShippingMethod] = useState<
//     Record<string, string>
//   >({});
//   const [loadingShopShipmentMethods, setLoadingShopShipmentMethods] = useState<
//     Record<string, boolean>
//   >({});
//   const [conkinShipmentPrice, setConkinShipmentPrice] =
//     useState<PackageConkinResponse | null>(null);
//   const [ghnShipmentPrice, setGhnShipmentPrice] =
//     useState<GHNCostsResponse | null>(null);
//   const [loadingGHNShipmentPrice, setLoadingGHNShipmentPrice] = useState(false);
//   // Payment & Order
//   const [successModalVisible, setSuccessModalVisible] = useState(false);
//   const [payosModalVisible, setPayosModalVisible] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState<any>(null);
//   const [payosInfo, setPayosInfo] = useState<PayOSPaymentResponse | null>(null);
//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
//   const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
//   // Vouchers
//   const [voucherErrors, setVoucherErrors] = useState<
//     Array<{ code: string; reason: string }>
//   >([]);
//   // Refs
//   const lastCheckoutRequestRef = useRef<string | null>(null);
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
//   //
//   const [selectedAddressIdState, setSelectedAddressIdState] = useState<
//     string | undefined
//   >(undefined);
//   const [shippingMethodModalVisible, setShippingMethodModalVisible] =
//     useState(false);
//   const [loadingBuyerInfo, setLoadingBuyerInfo] = useState(false);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [paymentExpiresAt, setPaymentExpiresAt] = useState<string | null>(null);
//   const [loadingShipmentPrice, setLoadingShipmentPrice] = useState(false);
//   const [shopDistrict, setShopDistrict] = useState<string | null>(null);
//   const [shopWard, setShopWard] = useState<string | null>(null);
//   const [shopAddressesMap, setShopAddressesMap] = useState<
//     Record<string, string>
//   >({});
//   const [shopFullAddressMap, setShopFullAddressMap] = useState<
//     Record<string, { province: string; district: string; ward: string }>
//   >({});

//   // --- INITIALIZATION ---
//   // Load preview data
//   useEffect(() => {
//     let preview = reduxPreview;
//     let request = null;
//     if (!preview) {
//       const savedPreview = sessionStorage.getItem("checkoutPreview");
//       const savedRequest = sessionStorage.getItem("checkoutRequest");
//       if (savedPreview && savedRequest) {
//         try {
//           preview = JSON.parse(savedPreview);
//           request = JSON.parse(savedRequest);
//         } catch (e) {}
//       }
//     }

//     if (!preview) {
//       toast.warning("Vui lòng chọn sản phẩm từ giỏ hàng");
//       router.push("/cart");
//       return;
//     }

//     setCheckoutPreview(preview);
//     setCheckoutRequest(request);
//   }, [reduxPreview, router]);

//   // Auto-fill form data
//   useEffect(() => {
//     if (savedAddresses.length > 0 && !formData.addressId && !useNewAddress) {
//       setFormData((prev) => ({
//         ...prev,
//         addressId: savedAddresses[0].addressId,
//       }));
//     }
//     if (buyerInfo && useNewAddress) {
//       setFormData((prev) => ({
//         ...prev,
//         recipientName: prev.recipientName || buyerInfo.fullName,
//         phoneNumber: prev.phoneNumber || buyerInfo.phone,
//       }));
//     }
//   }, [savedAddresses, buyerInfo, useNewAddress]);

//   const [hasShownInitialVoucherErrors, setHasShownInitialVoucherErrors] =
//     useState(false); 
//   const [isUpdatingCheckoutPreview, setIsUpdatingCheckoutPreview] =
//     useState(false);
//   const checkoutRequestRef = useRef<any>(null);
//   const previousShopsRef = useRef<string | null>(null); // Track previous shops data to avoid unnecessary shop address loads
//   const hasLoadedBuyerInfoRef = useRef(false); // Track if buyer info has been loaded to prevent duplicate calls
//   const isInitialMountRef = useRef(true); // Track if this is the initial mount

//   const loadBuyerInfo = useCallback(async () => {
//     if (hasLoadedBuyerInfoRef.current) {
//       return;
//     }

//     hasLoadedBuyerInfoRef.current = true; // Set flag immediately to prevent duplicate calls
//     setLoadingBuyerInfo(true);
//     try {
//       const storedUser = getStoredUserDetail();
//       const buyerId = storedUser?.buyerId;

//       if (!buyerId) {
//         hasLoadedBuyerInfoRef.current = false; // Reset flag on error
//         setLoadingBuyerInfo(false);
//         return;
//       }
//       const buyerDetail = await buyerService.getBuyerDetail(buyerId);

//       if (!buyerDetail) {
//         console.error("❌ buyerDetail is null or undefined");
//         setLoadingBuyerInfo(false);
//         return;
//       }

//       if (buyerDetail.addresses && buyerDetail.addresses.length > 0) {
//         const sortedAddresses = [...buyerDetail.addresses].sort((a, b) => {
//           const dateA = new Date(a.createdDate || 0).getTime();
//           const dateB = new Date(b.createdDate || 0).getTime();
//           return dateB - dateA; // Descending order (newest first)
//         });

//         const newestAddress = sortedAddresses[0];

//         formData.setFieldsValue({
//           addressId: newestAddress.addressId,
//         });
//         setSelectedAddressIdState(newestAddress.addressId);

//         // Nếu shop addresses đã load xong, fetch shipping methods ngay với địa chỉ mới nhất
//         if (
//           Object.keys(shopAddressIdMap).length > 0 &&
//           checkoutPreview?.shops &&
//           checkoutPreview.shops.length > 0
//         ) {
//           checkoutPreview.shops.forEach((shop: any) => {
//             const shopId = shop.shopId;
//             const shopAddressId = shopAddressIdMap[shopId];
//             if (
//               shopId &&
//               shopAddressId &&
//               shop.items &&
//               shop.items.length > 0
//             ) {
//               fetchCostsShipmentsForShop(
//                 newestAddress.addressId,
//                 shopId,
//                 shop.items
//               );
//             }
//           });
//         } else {
//         }
//       } else {
//       }

//       if (!buyerDetail.addresses || buyerDetail.addresses.length === 0) {
//         formData.setFieldsValue({
//           recipientName: buyerDetail.fullName,
//           phoneNumber: buyerDetail.phone,
//         });
//       }
//     } catch (error: any) {
//       console.error("❌ Failed to load buyer info:", error);
//       console.error("❌ Error status:", error?.response?.status);
//       console.error("❌ Error message:", error?.message);
//       console.error("❌ Error stack:", error?.stack);
//       console.error("❌ Full error object:", error);

//       hasLoadedBuyerInfoRef.current = false;
//     } finally {
//       setLoadingBuyerInfo(false);
//     }
//   }, [formData]); // Only form is in deps - it's stable from formData.useForm()

//   // Track last preview key to avoid duplicate calls
//   const lastPreviewKeyRef = useRef<string | null>(null);

//   useEffect(() => {
//     // Create a unique key from preview to detect actual changes
//     const currentPreviewKey = reduxPreview
//       ? JSON.stringify({
//           cartId: reduxPreview.cartId,
//           previewAt: reduxPreview.previewAt,
//         })
//       : null;

//     // Skip if preview hasn't actually changed (React 18 StrictMode double render)
//     if (currentPreviewKey && currentPreviewKey === lastPreviewKeyRef.current) {
//       return;
//     }

//     if (currentPreviewKey) {
//       lastPreviewKeyRef.current = currentPreviewKey;
//     }
//     // Mark initial mount as done
//     if (isInitialMountRef.current) {
//       isInitialMountRef.current = false;
//     }

//     // Try to get preview from Redux or sessionStorage
//     let preview = reduxPreview;
//     let request = null;

//     if (!preview) {
//       // Try sessionStorage
//       const savedPreview = sessionStorage.getItem("checkoutPreview");
//       const savedRequest = sessionStorage.getItem("checkoutRequest");

//       if (savedPreview && savedRequest) {
//         try {
//           preview = JSON.parse(savedPreview);
//           request = JSON.parse(savedRequest);
//         } catch (parseError) {
//           console.error("❌ Failed to parse sessionStorage data:", parseError);
//         }
//       }
//     }

//     if (!preview) {
//       console.error("❌ No preview found - redirecting to cart");
//       toast.warning("Vui lòng chọn sản phẩm từ giỏ hàng");
//       router.push("/cart");
//       return;
//     }

//     setCheckoutPreview(preview);
//     setCheckoutRequest(request);
//     checkoutRequestRef.current = request; // Update ref

//     if (!hasShownInitialVoucherErrors && preview.voucherApplication) {
//       const voucherApp = preview.voucherApplication;
//       let hasShownAnyMessage = false;

//       // ALWAYS check globalVouchers for errors, regardless of success flag
//       if (voucherApp.globalVouchers) {
//         const invalidVouchers = voucherApp.globalVouchers.invalidVouchers || [];
//         const discountDetails = voucherApp.globalVouchers.discountDetails || [];

//         // Show error for each invalid voucher - collect for UI display
//         const initialErrors: Array<{ code: string; reason: string }> = [];

//         discountDetails.forEach((detail: any) => {
//           if (detail.valid === false || detail.valid === "false") {
//             let errorMsg = "";
//             if (detail.reason) {
//               errorMsg = `${detail.voucherCode} không áp dụng được: ${detail.reason}`;
//             } else {
//               errorMsg = `Voucher ${detail.voucherCode} không áp dụng được`;
//             }
//             toast.error(errorMsg);
//             initialErrors.push({
//               code: detail.voucherCode,
//               reason: detail.reason || "Không áp dụng được",
//             });

//             hasShownAnyMessage = true;
//           }
//         });

//         // If there are invalid vouchers but no details with reason, show generic error
//         if (invalidVouchers.length > 0) {
//           const coveredCodes = new Set(
//             discountDetails.map((d: any) => d.voucherCode)
//           );
//           invalidVouchers.forEach((code: string) => {
//             if (!coveredCodes.has(code)) {
//               const errorMsg = `Voucher ${code} không áp dụng được`;
//               console.log(
//                 "❌ Showing generic error on preview load:",
//                 errorMsg
//               );
//               toast.error(errorMsg);

//               initialErrors.push({
//                 code: code,
//                 reason: "Không áp dụng được",
//               });

//               hasShownAnyMessage = true;
//             }
//           });
//         }

//         // Update voucher errors state
//         if (initialErrors.length > 0) {
//           setVoucherErrors(initialErrors);
//         }
//       }

//       // ALWAYS show warnings if they exist
//       if (voucherApp.warnings && voucherApp.warnings.length > 0) {
//         voucherApp.warnings.forEach((warning: string) => {
//           toast.warning(warning);
//           hasShownAnyMessage = true;
//         });
//       }

//       // Show general errors if they exist
//       if (voucherApp.errors && voucherApp.errors.length > 0) {
//         voucherApp.errors.forEach((error: any) => {
//           const errorMsg =
//             typeof error === "string"
//               ? error
//               : error.message || "Lỗi áp dụng voucher";
//           toast.error(errorMsg);
//           hasShownAnyMessage = true;
//         });
//       }

//       if (hasShownAnyMessage) {
//         setHasShownInitialVoucherErrors(true);
//       }
//     }

//     // Load buyer info (which includes addresses) - more efficient than calling 2 separate APIs
//     // Only call if not already loaded
//     if (!hasLoadedBuyerInfoRef.current) {
//       loadBuyerInfo();
//     } else {
//     }
//     // Shop address will be loaded in separate useEffect when checkoutPreview is set
//   }, [reduxPreview, router, loadBuyerInfo]);

//   // Auto-fill form when switching to new address or when buyer info is loaded
//   useEffect(() => {
//     if (buyerInfo && useNewAddress) {
//       formData.setFieldsValue({
//         recipientName: buyerInfo.fullName,
//         phoneNumber: buyerInfo.phone,
//       });
//     }
//   }, [useNewAddress, buyerInfo, formData]);

//   const loadShopAddress = async () => {
//     if (
//       !checkoutPreview ||
//       !checkoutPreview.shops ||
//       checkoutPreview.shops.length === 0
//     ) {
//       return;
//     }

//     try {
//       const shops = checkoutPreview.shops;
//       // Lấy địa chỉ của tất cả các shop
//       const addressesMap: Record<string, string> = {};
//       const fullAddressesMap: Record<
//         string,
//         { province: string; district: string; ward: string }
//       > = {};
//       const shopAddressIdMap: Record<string, string> = {}; // Map shopId -> shop addressId
//       const shopPromises = shops.map(async (shop: any) => {
//         const shopId = shop.shopId;
//         const shopName = shop.shopName || shopId;
//         const itemCount = shop.items?.length || 0;

//         try {
//           const response = await getAllShopAddresses(shopId);

//           // Response có structure: ApiResponse<ShopAddressResponse[]>
//           const shopAddresses = response.data || [];

//           if (shopAddresses && shopAddresses.length > 0) {
//             // Tìm địa chỉ mặc định (ưu tiên isDefaultPickup, sau đó isDefault)
//             const defaultAddress =
//               shopAddresses.find(
//                 (addr: any) => addr.isDefaultPickup === true
//               ) ||
//               shopAddresses.find((addr: any) => addr.isDefault === true) ||
//               shopAddresses[0];

//             // Lưu shop addressId
//             if (defaultAddress.addressId) {
//               shopAddressIdMap[shopId] = defaultAddress.addressId;
//             }

//             // Lấy province, district từ địa chỉ shop (giống như buyer address)
//             const provinceName =
//               defaultAddress.province ||
//               defaultAddress.address?.provinceName ||
//               null;
//             const wardName =
//               defaultAddress.ward || defaultAddress.address?.wardName || null;

//             // Tìm province code từ vietnam-address-database (giống như buyer address)
//             let province: string | null = null;
//             let district: string | null = null;
//             let ward: string | null = null;
//             let provinceCode: string | null = null;

//             if (provinceName && provincesData.length > 0) {
//               // Tìm province từ vietnam-address-database
//               const foundProvince = provincesData.find(
//                 (p) =>
//                   p.name === provinceName ||
//                   p.name.includes(provinceName) ||
//                   provinceName.includes(p.name)
//               );

//               if (foundProvince) {
//                 province = foundProvince.name;
//                 provinceCode = foundProvince.province_code;
//                 district = wardName || null;

//                 if (wardName && allWardsData.length > 0) {
//                   const wardsInProvince = allWardsData.filter(
//                     (w) => w.province_code === provinceCode
//                   );

//                   const foundWard =
//                     wardsInProvince.find(
//                       (w) =>
//                         w.name.includes(wardName) ||
//                         wardName.includes(w.name) ||
//                         w.name.toLowerCase().includes(wardName.toLowerCase())
//                     ) || wardsInProvince[0];

//                   if (foundWard) {
//                     ward = foundWard.name;
//                   } else {
//                     console.warn(
//                       `   ⚠️ Shop ${shopName}: Không tìm thấy ward cho ${provinceName}, ${wardName}`
//                     );
//                   }
//                 } else if (allWardsData.length > 0 && provinceCode) {
//                   // Nếu không có district, lấy ward đầu tiên của province
//                   const firstWard = allWardsData.find(
//                     (w) => w.province_code === provinceCode
//                   );
//                   if (firstWard) {
//                     ward = firstWard.name;
//                   }
//                 }
//               } else {
//                 // Nếu không tìm thấy trong database, dùng giá trị từ response
//                 province = provinceName;
//                 district = wardName;
//                 ward =
//                   defaultAddress.ward ||
//                   defaultAddress.address?.wardName ||
//                   null;
//                 console.warn(
//                   `   ⚠️ Shop ${shopName}: Không tìm thấy province trong database, dùng giá trị từ response`
//                 );
//               }
//             } else {
//               // Fallback: dùng giá trị từ response
//               province = provinceName;
//               district = wardName;
//               ward =
//                 defaultAddress.ward || defaultAddress.address?.wardName || null;
//             }

//             if (province) {
//               addressesMap[shopId] = province;
//               if (province && district && ward) {
//                 fullAddressesMap[shopId] = { province, district, ward };
//                 console.log(
//                   `   ✅ Shop ${shopName}: ${province}, ${district}, ${ward}`
//                 );
//               } else if (province && district) {
//                 // Có province và district nhưng không có ward
//                 fullAddressesMap[shopId] = {
//                   province,
//                   district,
//                   ward: ward || "",
//                 };
//               } else {
//               }
//             } else {
//               addressesMap[shopId] = "Hồ Chí Minh";
//             }
//           } else {
//             console.warn(
//               `   ⚠️ Shop ${shopName}: Không có địa chỉ, dùng fallback`
//             );
//             addressesMap[shopId] = "Hồ Chí Minh";
//           }
//         } catch (error: any) {
//           console.error(
//             `   ❌ Lỗi khi lấy địa chỉ shop ${shopName}:`,
//             error?.message
//           );
//           addressesMap[shopId] = "Hồ Chí Minh"; // Fallback
//         }
//       });

//       // Đợi tất cả các shop load xong
//       await Promise.all(shopPromises);
//       setShopAddressesMap(addressesMap);
//       setShopFullAddressMap(fullAddressesMap);

//       // Sau khi load xong shop addresses, nếu đã có addressId (auto-selected) thì fetch shipping methods ngay
//       const currentAddressId =
//         addressId ||
//         selectedAddressIdState ||
//         formData.getFieldValue("addressId");
//       if (
//         currentAddressId &&
//         checkoutPreview?.shops &&
//         checkoutPreview.shops.length > 0
//       ) {
//         checkoutPreview.shops.forEach((shop: any) => {
//           const shopId = shop.shopId;
//           const shopAddressId = shopAddressIdMap[shopId];
//           if (shopId && shopAddressId && shop.items && shop.items.length > 0) {
//             fetchCostsShipmentsForShop(currentAddressId, shopId, shop.items);
//           }
//         });
//       }
//       const displayAddress = useNewAddress
//         ? {
//             recipientName: formData.getFieldValue("recipientName"),
//             phone: formData.getFieldValue("phoneNumber"),
//             detailAddress: formData.getFieldValue("addressLine1"),
//             ward: formData.getFieldValue("ward"),
//             district: formData.getFieldValue("district"),
//             province: formData.getFieldValue("province"),
//           }
//         : savedAddresses.find((addr) => addr.addressId === currentAddressId) ||
//           null;

//       let mainShop = shops[0];
//       let maxItems = mainShop.items?.length || 0;

//       for (const shop of shops) {
//         const itemCount = shop.items?.length || 0;
//         if (itemCount > maxItems) {
//           maxItems = itemCount;
//           mainShop = shop;
//         }
//       }

//       const mainShopId = mainShop.shopId;
//       const mainShopProvince = addressesMap[mainShopId] || "Hồ Chí Minh";
//       const mainShopFullAddress = fullAddressesMap[mainShopId];

//       if (mainShopFullAddress) {
//         setShopDistrict(mainShopFullAddress.district);
//         setShopWard(mainShopFullAddress.ward);
//       } else {
//         setShopDistrict(null);
//         setShopWard(null);
//       }
//     } catch (error: any) {
//       console.error("❌ ===== LỖI KHI LẤY ĐỊA CHỈ SHOP =====");
//       console.error("   Error status:", error?.response?.status);
//       console.error("   Error message:", error?.message);
//       console.error("   Error details:", error);
//       console.error("   Sử dụng fallback: 'Hồ Chí Minh'");

//       // Fallback to default province if loading fails
//       setShopDistrict(null);
//       setShopWard(null);
//       setShopAddressesMap({});
//       setShopFullAddressMap({});
//     } finally {
//     }
//   };

//   const calculateTotalWeight = useCallback((): number => {
//     if (!checkoutPreview) return 1; // Default 1kg
//     const items = checkoutPreview.shops.flatMap((shop: any) => shop.items);

//     // Tính tổng weight thực tế từ dimensions của sản phẩm
//     let totalWeight = 0;
//     items.forEach((item: any) => {
//       const dimensions = extractItemDimensions(item);
//       if (dimensions) {
//         totalWeight += dimensions.weight * dimensions.quantity;
//       } else {
//         // Fallback: estimate 0.5kg per item nếu không có dimensions
//         totalWeight += (item.quantity || 1) * 0.5;
//       }
//     });

//     return Math.max(totalWeight, 0.1); // Tối thiểu 0.1kg
//   }, [checkoutPreview]);

//   const calculateConkinShippingPrice = useCallback((data: any): number => {
//     const priceNet = data.priceNet || 0;
//     const priceOther = data.priceOther || 0;
//     const pricePeakSeason = data.pricePeakSeason || 0;
//     // overSize có thể là null hoặc object có field price
//     const overSizePrice = data.overSize?.price || 0;
//     const constVAT = data.constVAT || 0;
//     const constPPXD = data.constPPXD || 0;
//     const basePrice = priceNet + priceOther + overSizePrice + pricePeakSeason;
//     const priceWithVAT = basePrice * (1 + constVAT / 100);
//     const finalPrice = priceWithVAT * (1 + constPPXD / 100);

//     return Math.round(finalPrice); // Làm tròn về số nguyên
//   }, []);

//   const fetchConkinShipmentPrice = useCallback(
//     async (province: string) => {
//       if (!province || !checkoutPreview) {
//         setConkinShipmentPrice(null);
//         return;
//       }
//       const originCity = shopProvince || "Hồ Chí Minh";
//       setLoadingShipmentPrice(true);
//       try {
//         const allItems = checkoutPreview.shops.flatMap(
//           (shop: any) => shop.items || []
//         );

//         const packages: Array<{
//           weight: number;
//           width: number;
//           length: number;
//           height: number;
//           weightChargeMin: number;
//         }> = [];

//         allItems.forEach((item: any, itemIndex: number) => {
//           const dimensions = extractItemDimensions(item);
//           const quantity = item.quantity || 1;
//           if (!dimensions) {
//             const productName = item.productName || item.name || "Sản phẩm";
//             const errorMsg = `Sản phẩm "${productName}" không có đầy đủ thông tin kích thước (dài x rộng x cao) và trọng lượng. Vui lòng cập nhật thông tin sản phẩm trước khi đặt hàng.`;
//             console.error(`❌ ${errorMsg}`);
//             toast.error(errorMsg);
//             throw new Error(errorMsg);
//           }

//           if (
//             !dimensions.weight ||
//             dimensions.weight <= 0 ||
//             !dimensions.length ||
//             dimensions.length <= 0 ||
//             !dimensions.width ||
//             dimensions.width <= 0 ||
//             !dimensions.height ||
//             dimensions.height <= 0
//           ) {
//             const productName = item.productName || item.name || "Sản phẩm";
//             const errorMsg = `Sản phẩm "${productName}" có thông tin kích thước hoặc trọng lượng không hợp lệ. Vui lòng cập nhật thông tin sản phẩm trước khi đặt hàng.`;
//             console.error(`❌ ${errorMsg}`);
//             toast.error(errorMsg);
//             throw new Error(errorMsg);
//           }

//           for (let i = 0; i < quantity; i++) {
//             packages.push({
//               weight: dimensions.weight,
//               width: dimensions.width,
//               length: dimensions.length,
//               height: dimensions.height,
//               weightChargeMin: 0,
//             });
//           }
//         });

//         // ✅ Kiểm tra packages không được rỗng
//         if (packages.length === 0) {
//           const errorMsg =
//             "Không có sản phẩm nào trong giỏ hàng để tính phí vận chuyển.";
//           console.error(`❌ ${errorMsg}`);
//           toast.error(errorMsg);
//           throw new Error(errorMsg);
//         }

//         // ✅ PREPARE REQUEST DATA VỚI NHIỀU PACKAGES (MỖI SẢN PHẨM 1 PACKAGE)
//         const requestData = {
//           name_city_from: originCity, // ✅ LẤY TỪ ĐỊA CHỈ SHOP
//           name_city_to: province,
//           packages: packages,
//         };

//         const response = await getConkinShipmentPrice(requestData);

//         // Xử lý response: có thể là PackageConkinResponse (có data) hoặc PackageConkinData trực tiếp
//         let responseData: any;
//         if (response && "data" in response) {
//           // Response là PackageConkinResponse với structure { status, message, data }
//           responseData = response.data;
//         } else {
//           // Response là PackageConkinData trực tiếp
//           responseData = response;
//         }

//         // Tính toán priceTotal nếu chưa có hoặc null
//         const finalData = { ...responseData };

//         // Nếu priceTotal null hoặc undefined, tính lại bằng công thức
//         if (
//           finalData.priceTotal === null ||
//           finalData.priceTotal === undefined
//         ) {
//           const calculatedPrice = calculateConkinShippingPrice(finalData);
//           finalData.priceTotal = calculatedPrice;
//         } else {
//         }

//         // Wrap lại thành PackageConkinResponse format để giữ consistency
//         const finalResponse: PackageConkinResponse = {
//           status: (response as any)?.status || 200,
//           message: (response as any)?.message || "Success",
//           data: finalData,
//         };

//         setConkinShipmentPrice(finalResponse);
//       } catch (error: any) {
//         // Don't show error message to user, just log it
//         setConkinShipmentPrice(null);
//       } finally {
//         setLoadingShipmentPrice(false);
//       }
//     },
//     [checkoutPreview, calculateConkinShippingPrice, shopProvince]
//   );

//   // --- LOGIC HANDLERS ---

//   // 1. Calculate Shipping per Shop
//   const fetchCostsShipmentsForShop = useCallback(
//     async (buyerAddrId: string, shopId: string, items: any[]) => {
//       if (!buyerAddrId || !shopId || !items.length) return;

//       setLoadingShopShipmentMethods((prev) => ({ ...prev, [shopId]: true }));
//       try {
//         const shopAddrId = shopAddressIdMap[shopId];
//         if (!shopAddrId) return;

//         const costsItems = items.map((item: any) => {
//           const dims = extractItemDimensions(item);
//           return {
//             name: item.productName || "Sản phẩm",
//             code: item.sku || `SKU-${item.productId}`,
//             price: item.price || item.unitPrice || 0,
//             quantity: item.quantity || 1,
//             length: dims?.length || 10,
//             width: dims?.width || 10,
//             height: dims?.height || 10,
//             weight: dims?.weight || 0.5,
//             category: { level1: "Áo" },
//           };
//         });

//         const subtotal = items.reduce((sum, i) => sum + (i.lineTotal || 0), 0);
//         const res = await getCostsShipments({
//           items: costsItems,
//           id_buyer_address: buyerAddrId,
//           id_shop_address: shopAddrId,
//           cod_value: subtotal,
//           insurance_value: 0,
//         });

//         if (res?.length > 0) {
//           setShopShipmentMethods((prev) => ({ ...prev, [shopId]: res }));
//           // Auto select first method
//           const firstMethod =
//             res[0].serviceCompanyType?.toUpperCase() || "METHOD_0";
//           setShopSelectedShippingMethod((prev) => ({
//             ...prev,
//             [shopId]: firstMethod,
//           }));
//         } else {
//           setShopShipmentMethods((prev) => ({ ...prev, [shopId]: [] }));
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingShopShipmentMethods((prev) => ({ ...prev, [shopId]: false }));
//       }
//     },
//     [shopAddressIdMap]
//   );

//   useEffect(() => {
//     const currentAddrId = formData.addressId;
//     if (
//       currentAddrId &&
//       !useNewAddress &&
//       !loadingShopAddress &&
//       checkoutPreview?.shops
//     ) {
//       checkoutPreview.shops.forEach((shop: any) => {
//         if (shopAddressIdMap[shop.shopId]) {
//           fetchCostsShipmentsForShop(currentAddrId, shop.shopId, shop.items);
//         }
//       });
//     }
//   }, [
//     formData.addressId,
//     useNewAddress,
//     loadingShopAddress,
//     checkoutPreview,
//     shopAddressIdMap,
//   ]);

//   // Function to get costs for all shipment methods using new API (legacy - for backward compatibility)
//   const fetchCostsShipments = useCallback(
//     async (buyerAddressId: string, shopId: string) => {
//       if (!buyerAddressId || !shopId || !checkoutPreview) {
//         console.warn("⚠️ Missing required data for costs-shipments:", {
//           buyerAddressId,
//           shopId,
//           hasCheckoutPreview: !!checkoutPreview,
//         });
//         return;
//       }

//       // Tìm shop và items của shop đó
//       const shop = checkoutPreview.shops.find((s: any) => s.shopId === shopId);
//       if (shop && shop.items) {
//         await fetchCostsShipmentsForShop(buyerAddressId, shopId, shop.items);
//       }
//     },
//     [checkoutPreview, fetchCostsShipmentsForShop]
//   );

//   // Function to get GHN shipment price (legacy - kept for backward compatibility)
//   const fetchGHNShipmentPrice = useCallback(
//     async (provinceName: string, wardName: string, districtName?: string) => {
//       if (!provinceName || !wardName || !checkoutPreview) {
//         setGhnShipmentPrice(null);
//         return;
//       }

//       setLoadingGHNShipmentPrice(true);
//       try {
//         // Lấy địa chỉ shop (from address) - sử dụng province, district, ward đã load
//         const originProvince = shopProvince || "Hồ Chí Minh";
//         const originDistrict = shopDistrict || "";
//         const originWard = shopWard || "";
//         // Map địa chỉ từ format mới sang format cũ cho GHN API
//         const toOldAddress = mapAddressToOldFormat(wardName, provinceName);

//         // Map địa chỉ shop - nếu có ward thì map, nếu không thì chỉ dùng province và district
//         let fromOldAddress;
//         if (originWard) {
//           fromOldAddress = mapAddressToOldFormat(originWard, originProvince);
//         } else {
//           // Nếu không có ward, chỉ map province (district sẽ được set trực tiếp)
//           fromOldAddress = {
//             old_province_name: originProvince,
//             old_district_name: originDistrict || "",
//             old_ward_name: originWard || "",
//           };
//         }

//         // Lấy tất cả items từ checkout preview
//         const allItems = checkoutPreview.shops.flatMap(
//           (shop: any) => shop.items || []
//         );

//         // Tạo items array cho GHN API
//         const ghnItems = allItems.map((item: any) => {
//           const dimensions = extractItemDimensions(item);
//           const quantity = item.quantity || 1;

//           if (!dimensions) {
//             const productName = item.productName || item.name || "Sản phẩm";
//             const errorMsg = `Sản phẩm "${productName}" không có đầy đủ thông tin kích thước và trọng lượng.`;
//             console.error(`❌ ${errorMsg}`);
//             toast.error(errorMsg);
//             throw new Error(errorMsg);
//           }

//           // Lấy category từ sản phẩm (có thể từ item.category hoặc item.productCategory)
//           const category = item.category || item.productCategory || "Áo";

//           return {
//             name: item.productName || item.name || "Sản phẩm",
//             code:
//               item.sku ||
//               item.productCode ||
//               `SKU-${item.productId || Date.now()}`,
//             price: item.price || item.unitPrice || 0,
//             quantity: quantity,
//             length: dimensions.length,
//             width: dimensions.width,
//             height: dimensions.height,
//             weight: dimensions.weight,
//             category: {
//               level1: category,
//             },
//           };
//         });

//         // Tính COD value (tổng giá trị đơn hàng)
//         const codValue = checkoutPreview.grandTotal || 0;

//         // Tạo request data cho GHN API
//         const requestData = {
//           insurance_value: 0,
//           items: ghnItems,
//           to: {
//             province: toOldAddress.old_province_name,
//             district: toOldAddress.old_district_name || districtName || "",
//             ward: toOldAddress.old_ward_name,
//           },
//           from: {
//             province: fromOldAddress.old_province_name,
//             district: fromOldAddress.old_district_name || originDistrict,
//             ward: fromOldAddress.old_ward_name,
//           },
//           cod_value: codValue,
//         };

//         const response = await getGHNCosts(requestData);

//         if (
//           response &&
//           response.data &&
//           (response.code === 200 ||
//             response.code === 1000 ||
//             response.data.total !== undefined)
//         ) {
//           setGhnShipmentPrice(response);
//         } else {
//           console.error("❌ GHN response invalid or error:", response);
//           setGhnShipmentPrice(null);
//           if (response?.message) {
//             toast.warning(`GHN: ${response.message}`);
//           } else if (
//             response?.code &&
//             response.code !== 200 &&
//             response.code !== 1000
//           ) {
//             toast.warning(
//               `Không thể lấy giá vận chuyển GHN (Code: ${response.code})`
//             );
//           }
//         }
//       } catch (error: any) {
//         console.error("❌ Failed to get GHN costs:", error);
//         setGhnShipmentPrice(null);
//       } finally {
//         setLoadingGHNShipmentPrice(false);
//       }
//     },
//     [checkoutPreview, shopProvince, message]
//   );

 

 
//   const handleConfirmSavedAddress = (selectedId: string) => {
//     // 1. Cập nhật Form & UI
//     formData.setFieldsValue({ addressId: selectedId });
//     setSelectedAddressIdState(selectedId);
//     setUseNewAddress(false);
//     setAddressModalVisible(false);

//     // 2. Gọi lại API tính ship cho từng shop
//     if (checkoutPreview?.shops && checkoutPreview.shops.length > 0) {
//       checkoutPreview.shops.forEach((shop: any) => {
//         const shopId = shop.shopId;
//         // Lấy shopAddressId từ Context map
//         const shopAddressId = shopAddressIdMap[shopId];

//         if (shopId && shopAddressId && shop.items && shop.items.length > 0) {
//           fetchCostsShipmentsForShop(selectedId, shopId, shop.items);
//         }
//       });
//     }
//   };

//   const handleConfirmNewAddress = (newData: any) => {
//     formData.setFieldsValue({
//       recipientName: newData.recipientName,
//       phoneNumber: newData.phoneNumber,
//       addressLine1: newData.detailAddress,
//       ward: newData.ward,
//       district: newData.district,
//       province: newData.province,
//       email: newData.email,
//       addressId: undefined, // Xóa ID cũ
//     });

//     // 2. Cập nhật UI
//     setUseNewAddress(true);
//     setAddressModalVisible(false);

//     setShopShipmentMethods({});
//     setShopSelectedShippingMethod({});

//     // (useEffect sẽ tự bắt sự kiện province thay đổi và tính lại GHN/Conkin)
//   };

//   const getCurrentShippingFee = useCallback(() => {
//     if (!checkoutPreview?.shops) return 0;
//     return checkoutPreview.shops.reduce((total: number, shop: any) => {
//       const methods = shopShipmentMethods[shop.shopId] || [];
//       const selectedKey = shopSelectedShippingMethod[shop.shopId];
//       const method = methods.find(
//         (m) =>
//           (m.serviceCompanyType?.toUpperCase() || "") ===
//           selectedKey?.toUpperCase()
//       );
//       return total + (method ? getShipmentCost(method) : 0);
//     }, 0);
//   }, [checkoutPreview, shopShipmentMethods, shopSelectedShippingMethod]);

//   const calculateGrandTotal = useCallback(() => {
//     if (!checkoutPreview) return 0;
//     return (
//       (checkoutPreview.subtotal || 0) -
//       (checkoutPreview.totalDiscount || 0) +
//       getCurrentShippingFee() +
//       (checkoutPreview.totalTaxAmount || 0)
//     );
//   }, [checkoutPreview, getCurrentShippingFee]);

//   const selectedAddressCountry = useMemo(() => {
//     if (addressId && !useNewAddress && savedAddresses.length > 0) {
//       const selectedAddress = savedAddresses.find(
//         (addr) => addr.addressId === addressId
//       );
//       return selectedAddress?.country || null;
//     }
//     return null;
//   }, [addressId, useNewAddress, savedAddresses]);

//   const currentCountry = selectedAddressCountry || country || "Vietnam";
//   const isForeignCountry = useMemo(() => {
//     const countryLower = currentCountry?.toLowerCase() || "";
//     return (
//       countryLower !== "vietnam" &&
//       countryLower !== "vn" &&
//       countryLower !== "việt nam"
//     );
//   }, [currentCountry]);

//   const isShippingInfoComplete = useMemo(() => {
//     if (useNewAddress) {
//       return !!(
//         recipientName &&
//         phoneNumber &&
//         province &&
//         district &&
//         ward &&
//         addressLine1
//       );
//     } else {
//       return !!addressId;
//     }
//   }, [
//     useNewAddress,
//     addressId,
//     recipientName,
//     phoneNumber,
//     province,
//     district,
//     ward,
//     addressLine1,
//   ]);

//   const isPaymentInfoComplete = useMemo(() => {
//     return !!paymentMethod;
//   }, [paymentMethod]);

//   useEffect(() => {
//     if (orderSuccess || successModalVisible || payosModalVisible) {
//       setCurrentStep(3);
//     } else if (isPaymentInfoComplete && isShippingInfoComplete) {
//       setCurrentStep(2);
//     } else if (isShippingInfoComplete) {
//       setCurrentStep(1);
//     } else {
//       setCurrentStep(0);
//     }
//   }, [
//     isShippingInfoComplete,
//     isPaymentInfoComplete,
//     orderSuccess,
//     successModalVisible,
//     payosModalVisible,
//   ]);

//   // Track last fetched province to avoid duplicate calls
//   const lastFetchedProvinceRef = useRef<string | null>(null);

//   useEffect(() => {
//     if (loadingShopAddress) {
//       return;
//     }

//     let targetProvince: string | null = null;

//     // If using saved address, get province from saved address
//     if (addressId && !useNewAddress && savedAddresses.length > 0) {
//       const selectedAddress = savedAddresses.find(
//         (addr) => addr.addressId === addressId
//       );
//       if (selectedAddress?.province) {
//         targetProvince = selectedAddress.province;
//       }
//     }

//     // If using new address, get province from form
//     if (province && useNewAddress) {
//       targetProvince = province;
//     }

//     if (targetProvince && targetProvince !== lastFetchedProvinceRef.current) {
//       lastFetchedProvinceRef.current = targetProvince;
//       if (!isForeignCountry) {
//         setConkinShipmentPrice(null);
//       }
//       let targetWard: string | null = null;
//       let targetDistrict: string | null = null;

//       if (addressId && !useNewAddress && savedAddresses.length > 0) {
//         const selectedAddress = savedAddresses.find(
//           (addr) => addr.addressId === addressId
//         );
//         if (selectedAddress) {
//           targetWard = selectedAddress.ward || "";
//           targetDistrict = selectedAddress.district || "";
//         }
//       } else if (useNewAddress) {
//         targetWard = ward || "";
//         targetDistrict = district || "";
//       }

//       // Fetch costs-shipments cho tất cả shops nếu có đủ thông tin
//       if (
//         addressId &&
//         !useNewAddress &&
//         !loadingShopAddress &&
//         checkoutPreview?.shops &&
//         checkoutPreview.shops.length > 0
//       ) {
//         // Fetch shipping methods cho từng shop
//         checkoutPreview.shops.forEach((shop: any) => {
//           const shopId = shop.shopId;
//           const shopAddressId = shopAddressIdMap[shopId];
//           if (shopId && shopAddressId && shop.items && shop.items.length > 0) {
//             fetchCostsShipmentsForShop(addressId, shopId, shop.items);
//           } else if (shopId && !shopAddressId) {
//           }
//         });
//       } else if (targetWard && targetProvince) {
//         // Fallback to old method if using new address
//         fetchGHNShipmentPrice(
//           targetProvince,
//           targetWard,
//           targetDistrict || undefined
//         );
//       }
//     } else if (!targetProvince) {
//       // Reset if no address selected
//       if (lastFetchedProvinceRef.current !== null) {
//         setConkinShipmentPrice(null);
//         setGhnShipmentPrice(null);
//         lastFetchedProvinceRef.current = null;
//       }
//     } else {
//     }
//   }, [
//     addressId,
//     province,
//     ward,
//     district,
//     useNewAddress,
//     savedAddresses,
//     fetchGHNShipmentPrice,
//     fetchCostsShipments,
//     fetchCostsShipmentsForShop,
//     loadingShopAddress,
//     shopProvince,
//     shippingMethod,
//     isForeignCountry,
//     checkoutPreview,
//     shopAddressIdMap,
//   ]);

//   // Fetch CONKIN price khi người dùng chọn CONKIN và là người nước ngoài
//   useEffect(() => {
//     if (
//       shippingMethod === "CONKIN" &&
//       isForeignCountry &&
//       !loadingShopAddress
//     ) {
//       let targetProvince: string | null = null;

//       if (addressId && !useNewAddress && savedAddresses.length > 0) {
//         const selectedAddress = savedAddresses.find(
//           (addr) => addr.addressId === addressId
//         );
//         if (selectedAddress?.province) {
//           targetProvince = selectedAddress.province;
//         }
//       } else if (useNewAddress && province) {
//         targetProvince = province;
//       }

//       if (targetProvince && !conkinShipmentPrice) {
//         fetchConkinShipmentPrice(targetProvince);
//       }
//     } else if (shippingMethod !== "CONKIN") {
//       // Reset Conkin price khi chuyển sang phương thức khác
//       if (conkinShipmentPrice) {
//         setConkinShipmentPrice(null);
//       }
//     }
//   }, [
//     shippingMethod,
//     isForeignCountry,
//     addressId,
//     province,
//     useNewAddress,
//     savedAddresses,
//     loadingShopAddress,
//     conkinShipmentPrice,
//     fetchConkinShipmentPrice,
//   ]);

//   useEffect(() => {
//     if (shippingMethod === "GHN" && !loadingShopAddress) {
//       let targetProvince: string | null = null;
//       let targetWard: string | null = null;
//       let targetDistrict: string | null = null;

//       if (addressId && !useNewAddress && savedAddresses.length > 0) {
//         const selectedAddress = savedAddresses.find(
//           (addr) => addr.addressId === addressId
//         );
//         if (selectedAddress) {
//           targetProvince = selectedAddress.province || null;
//           targetWard = selectedAddress.ward || null;
//           targetDistrict = selectedAddress.district || null;
//         }
//       } else if (useNewAddress) {
//         targetProvince = province || null;
//         targetWard = ward || null;
//         targetDistrict = district || null;
//       }

//       if (
//         addressId &&
//         !useNewAddress &&
//         !loadingShopAddress &&
//         checkoutPreview?.shops &&
//         checkoutPreview.shops.length > 0
//       ) {
//         const firstShopId = checkoutPreview.shops[0].shopId;
//         const shopAddressId = shopAddressIdMap[firstShopId];
//         if (firstShopId && shopAddressId) {
//           fetchCostsShipments(addressId, firstShopId);
//         } else if (firstShopId && !shopAddressId) {
//         }
//       } else if (targetProvince && targetWard) {
//         // Fallback to old method if using new address

//         fetchGHNShipmentPrice(
//           targetProvince,
//           targetWard,
//           targetDistrict || undefined
//         );
//       } else {
//       }
//     }
//   }, [
//     shippingMethod,
//     addressId,
//     province,
//     ward,
//     district,
//     useNewAddress,
//     savedAddresses,
//     loadingShopAddress,
//     fetchGHNShipmentPrice,
//     fetchCostsShipments,
//     checkoutPreview,
//     shopAddressIdMap,
//   ]);

//   useEffect(() => {
//     if (
//       !shippingMethodModalVisible &&
//       (addressId || (useNewAddress && province && ward)) &&
//       !loadingShopAddress &&
//       (conkinShipmentPrice ||
//         ghnShipmentPrice ||
//         loadingShipmentPrice ||
//         loadingGHNShipmentPrice)
//     ) {
//       // Đợi một chút để giá vận chuyển load xong
//       const timer = setTimeout(() => {
//         if (!shippingMethod) {
//           setShippingMethodModalVisible(true);
//         }
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [
//     useNewAddress,
//     loadingShopAddress,
//     conkinShipmentPrice,
//     ghnShipmentPrice,
//     loadingShipmentPrice,
//     loadingGHNShipmentPrice,
//     shippingMethodModalVisible,
//   ]);

//   useEffect(() => {
//     if (
//       checkoutPreview &&
//       checkoutPreview.shops &&
//       checkoutPreview.shops.length > 0
//     ) {
//       // Create a unique key from shops data to detect actual changes
//       const shopsKey = JSON.stringify(
//         checkoutPreview.shops.map((s: any) => ({
//           shopId: s.shopId,
//           shopName: s.shopName,
//           itemCount: s.itemCount,
//         }))
//       );

//       // Only load if shops data actually changed (not just voucher updates)
//       if (previousShopsRef.current !== shopsKey) {
//         previousShopsRef.current = shopsKey;
//         loadShopAddress();
//       } else {
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [checkoutPreview]);

 

//   // Update checkout preview when address or shipping method changes (with proper debounce and duplicate prevention)
//   useEffect(() => {
//     if (!checkoutPreview || !checkoutRequestRef.current) return;
//     if (isUpdatingCheckoutPreview) return; // Prevent multiple simultaneous calls

//     // Only update if address is complete (to avoid unnecessary API calls while user is typing)
//     const isAddressComplete = useNewAddress
//       ? !!(province && district && ward && addressLine1)
//       : !!addressId;

//     if (!isAddressComplete) return;

//     // Use ref to get latest checkoutRequest (avoid stale closure)
//     const currentRequest = checkoutRequestRef.current;

//     // Build updated request with current values
//     const updatedRequest = {
//       ...currentRequest,
//       shippingMethod:
//         shippingMethod || currentRequest.shippingMethod || "CONKIN",
//     };

//     // Create a unique key for this request to avoid duplicate calls
//     const requestKey = JSON.stringify({
//       addressId: useNewAddress ? null : addressId,
//       province: useNewAddress ? province : null,
//       shippingMethod: updatedRequest.shippingMethod,
//       globalVouchers: updatedRequest.globalVouchers || [],
//     });

//     // Skip if this is the same request as last time
//     if (lastCheckoutRequestRef.current === requestKey) {
//       return;
//     }

//     // Debounce: only update after user stops changing for 1000ms
//     const timeoutId = setTimeout(async () => {
//       // Double check to avoid race conditions
//       if (isUpdatingCheckoutPreview) {
//         return;
//       }

//       // Get latest request again (may have changed during debounce)
//       const latestRequest = checkoutRequestRef.current;
//       if (!latestRequest) return;

//       // Check again if request is still the same
//       const currentRequestKey = JSON.stringify({
//         addressId: useNewAddress ? null : addressId,
//         province: useNewAddress ? province : null,
//         shippingMethod:
//           shippingMethod || latestRequest.shippingMethod || "CONKIN",
//         globalVouchers: latestRequest.globalVouchers || [],
//       });

//       if (lastCheckoutRequestRef.current === currentRequestKey) {
//         return;
//       }

//       try {
//         setIsUpdatingCheckoutPreview(true);
//         lastCheckoutRequestRef.current = currentRequestKey;

//         const finalRequest = {
//           ...latestRequest,
//           shippingMethod:
//             shippingMethod || latestRequest.shippingMethod || "CONKIN",
//         };

//         // Dispatch checkout preview action
//         const result = await dispatch(
//           checkoutPreviewAction(finalRequest)
//         ).unwrap();

//         // Update local state
//         setCheckoutPreview(result);
//         setCheckoutRequest(finalRequest);
//         checkoutRequestRef.current = finalRequest; // Update ref

//         // Save to sessionStorage
//         sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
//         sessionStorage.setItem("checkoutRequest", JSON.stringify(finalRequest));
//       } catch (error: any) {
//         console.error("❌ Error updating checkout preview:", error);
//         lastCheckoutRequestRef.current = null; // Reset on error to allow retry
//       } finally {
//         setIsUpdatingCheckoutPreview(false);
//       }
//     }, 1000); // Debounce 1000ms (increased from 500ms)

//     return () => clearTimeout(timeoutId);
//   }, [
//     addressId,
//     province,
//     district,
//     ward,
//     shippingMethod,
//     useNewAddress,
//     dispatch,
//   ]); // Removed checkoutPreview and checkoutRequest from deps to prevent infinite loop

 
//   // 3. Handle Submit Order
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Validate
//       const currentAddrId = formData.addressId;
//       if (!currentAddrId && !useNewAddress) {
//         toast.error("Vui lòng chọn địa chỉ giao hàng");
//         setLoading(false);
//         return;
//       }
//       if (!formData.paymentMethod) {
//         toast.error("Vui lòng chọn phương thức thanh toán");
//         setLoading(false);
//         return;
//       }

//       // Prepare Address
//       let finalShippingAddress: ShippingAddressInfo;
//       if (useNewAddress) {
//         // Validate new address fields here if needed
//         const oldAddr = mapAddressToOldFormat(formData.ward, formData.province);
//         finalShippingAddress = {
//           country: formData.country,
//           state: formData.province,
//           city: formData.district,
//           postalCode: formData.ward,
//           addressLine1: formData.addressLine1,
//           ...(oldAddr.old_ward_name && {
//             districtNameOld: oldAddr.old_district_name,
//             provinceNameOld: oldAddr.old_province_name,
//             wardNameOld: oldAddr.old_ward_name,
//           }),
//         };
//       } else {
//         const savedAddr = savedAddresses.find(
//           (a) => a.addressId === currentAddrId
//         );
//         if (!savedAddr) throw new Error("Địa chỉ không hợp lệ");
//         const oldAddr = mapAddressToOldFormat(
//           savedAddr.ward,
//           savedAddr.province
//         );
//         finalShippingAddress = {
//           addressId: currentAddrId,
//           ...(oldAddr.old_ward_name && {
//             districtNameOld: oldAddr.old_district_name,
//             provinceNameOld: oldAddr.old_province_name,
//             wardNameOld: oldAddr.old_ward_name,
//           }),
//         };
//       }

//       // Create Order Payload
//       const payload: OrderCreateRequest = {
//         shops: checkoutPreview.shops.map((shop: any) => ({
//           shopId: shop.shopId,
//           itemIds: shop.items.map((i: any) => i.itemId),
//           vouchers: [], // Add shop voucher logic if needed
//         })),
//         shippingMethod: formData.shippingMethod,
//         shippingAddress: finalShippingAddress,
//         globalVouchers: checkoutRequest?.globalVouchers || [],
//         paymentMethod: formData.paymentMethod,
//         customerNote: formData.customerNote,
//         buyerAddressId: currentAddrId,
//       };

//       const res: OrderCreationResponse = await orderService.createOrder(
//         payload
//       );

//       // Cleanup & Success
//       sessionStorage.removeItem("checkoutPreview");
//       sessionStorage.removeItem("checkoutRequest");

//       if (res.paymentInfo) {
//         // Online Payment
//         setPayosInfo({
//           ...res.paymentInfo,
//           expiredAt: res.paymentInfo.expiredAt
//             ? String(res.paymentInfo.expiredAt)
//             : undefined,
//           amount: res.paymentInfo.amount,
//         } as any);
//         setSelectedOrder(res.orders[0]);
//         setPayosModalVisible(true);
//       } else {
//         // COD
//         setOrderSuccess(res.orders);
//         setSuccessModalVisible(true);
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Đặt hàng thất bại");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Helpers for Modal Interactions ---
//   const handleAddressConfirm = (isNew: boolean, data: any) => {
//     if (isNew) {
//       setFormData((prev) => ({ ...prev, ...data, addressId: undefined }));
//       setUseNewAddress(true);
//     } else {
//       setFormData((prev) => ({ ...prev, addressId: data }));
//       setUseNewAddress(false);
//       // Trigger recalc shipping
//       if (checkoutPreview?.shops) {
//         checkoutPreview.shops.forEach((s: any) => {
//           const sAddr = shopAddressIdMap[s.shopId];
//           if (sAddr) fetchCostsShipmentsForShop(data, s.shopId, s.items);
//         });
//       }
//     }
//     setAddressModalVisible(false);
//   };

//   const handleCloseSuccessModal = () => {
//     setSuccessModalVisible(false);
//     // Redirect to orders page
//     router.push("/orders");
//   };

//   const handleVoucherSelect = async (vouchers: any) => {
//     // TODO: Implement Voucher logic here
//     toast.info("Tính năng voucher đang cập nhật...");
//   };

//   const stopPolling = useCallback(() => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//   }, []);

//   const handleClosePayosModal = () => {
//     stopPolling();
//     if (countdownTimerRef.current) {
//       clearInterval(countdownTimerRef.current);
//       countdownTimerRef.current = null;
//     }
//     setPayosModalVisible(false);
//     setPayosInfo(null);
//     setPaymentId(null);
//     setPaymentExpiresAt(null);
//     setRemainingSeconds(null);
//     // Redirect to orders page
//     router.push("/orders");
//   };

//   const handlePaymentSuccess = useCallback(() => {
//     stopPolling();
//     toast.success("Thanh toán thành công! Đang chuyển đến trang đơn hàng...");
//     setPayosModalVisible(false);
//     setPayosInfo(null);
//     // Redirect to order detail page after a short delay
//     setTimeout(() => {
//       if (selectedOrder?.orderId) {
//         router.push(`/orders/${selectedOrder.orderId}`);
//       } else {
//         router.push("/orders");
//       }
//     }, 1500);
//   }, [selectedOrder?.orderId, router, stopPolling]);

//   // Long polling for payment status - polls every 2 seconds
//   useEffect(() => {
//     if (!payosModalVisible || !selectedOrder?.orderId) {
//       // Stop polling if modal is closed or no order selected
//       stopPolling();
//       return;
//     }

//     const interval = setInterval(async () => {
//       try {
//         // Use paymentId if available, otherwise use orderId
//         let paymentStatus;
//         if (paymentId) {
//           paymentStatus = await paymentService.getPaymentStatus(paymentId);
//         } else {
//           paymentStatus = await paymentService.getPaymentStatusByOrder(
//             selectedOrder.orderId
//           );
//           // Update paymentId if we got it from the response
//           if (paymentStatus.paymentId && !paymentId) {
//             setPaymentId(paymentStatus.paymentId);
//           }
//         }

//         // Check payment status
//         const status = paymentStatus.status?.toUpperCase();

//         if (
//           status === "SUCCEEDED" ||
//           status === "SUCCESS" ||
//           status === "PAID"
//         ) {
//           clearInterval(interval);
//           pollingIntervalRef.current = null;
//           handlePaymentSuccess();
//         } else if (status === "FAILED" || status === "CANCELLED") {
//           clearInterval(interval);
//           pollingIntervalRef.current = null;
//           toast.error("Thanh toán thất bại hoặc đã bị hủy");
//         }
//         // If status is PENDING or other, continue polling
//       } catch (error: any) {
//         console.error("❌ Error polling payment status:", error);
//         if (error?.response?.status === 404) {
//           clearInterval(interval);
//           pollingIntervalRef.current = null;
//         }
//       }
//     }, 15000); // Poll every 15 seconds

//     pollingIntervalRef.current = interval;

//     // Cleanup on unmount or when dependencies change
//     return () => {
//       clearInterval(interval);
//       pollingIntervalRef.current = null;
//     };
//   }, [
//     payosModalVisible,
//     selectedOrder?.orderId,
//     paymentId,
//     handlePaymentSuccess,
//     stopPolling,
//   ]);

//   // Countdown for PayOS expiration (no extra API call needed)
//   useEffect(() => {
//     if (!payosModalVisible || !paymentExpiresAt) {
//       if (countdownTimerRef.current) {
//         clearInterval(countdownTimerRef.current);
//         countdownTimerRef.current = null;
//       }
//       setRemainingSeconds(null);
//       return;
//     }

//     const expiry = parseInt(paymentExpiresAt, 10);
//     if (Number.isNaN(expiry)) {
//       setRemainingSeconds(null);
//       return;
//     }

//     const tick = () => {
//       const now = Math.floor(Date.now() / 1000);
//       const remain = Math.max(0, expiry - now);
//       setRemainingSeconds(remain);
//       if (remain === 0) {
//         // auto stop timers and polling when expired
//         if (countdownTimerRef.current) {
//           clearInterval(countdownTimerRef.current);
//           countdownTimerRef.current = null;
//         }
//         stopPolling();
//         toast.warning("Liên kết thanh toán đã hết hạn. Vui lòng tạo lại.");
//         // Close QR modal and cleanup
//         handleClosePayosModal();
//       }
//     };

//     tick();
//     const t = setInterval(tick, 1000);
//     countdownTimerRef.current = t as unknown as NodeJS.Timeout;
//     return () => {
//       clearInterval(t);
//       countdownTimerRef.current = null;
//     };
//   }, [payosModalVisible, paymentExpiresAt, stopPolling, handleClosePayosModal]);

  
//   const currentDisplayAddr = useNewAddress
//     ? {
//         recipientName: formData.recipientName,
//         phone: formData.phoneNumber,
//         detailAddress: formData.addressLine1,
//         ward: formData.ward,
//         district: formData.district,
//         province: formData.province,
//       }
//     : savedAddresses.find((a) => a.addressId === formData.addressId);

//   if (!checkoutPreview) return <SectionLoading message="Đang tải..." />;

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-gray-50">
//       <PageContentTransition>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <CustomBreadcrumb
//             items={[
//               { title: "Giỏ hàng", href: "/cart" },
//               { title: "Thanh toán", href: "#" },
//             ]}
//           />
//           <CheckoutStepper currentStep={orderSuccess ? 3 : currentStep} />
//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//               <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//                 <ShippingAddressCard
//                   selectedAddress={currentDisplayAddr as any}
//                   hasAddress={!!currentDisplayAddr}
//                   onOpenModal={() => setAddressModalVisible(true)}
//                 />
//                 <div className="divide-y divide-gray-100">
//                   {checkoutPreview.shops.map((shop: any) => (
//                     <div key={shop.shopId} className="p-4 sm:p-6 space-y-4">
//                       {/* Shop Header */}
//                       <div className="flex items-center gap-2">
//                         <Store className="text-blue-600 w-5 h-5" />
//                         <span className="font-medium text-gray-900">
//                           {shop.shopName}
//                         </span>
//                         <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
//                           {shop.itemCount} SP
//                         </span>
//                       </div>

//                       {/* Items */}
//                       <div className="space-y-3">
//                         {shop.items.map((item: any) => (
//                           <div key={item.itemId} className="flex gap-4">
//                             <img
//                               src={
//                                 resolvePreviewItemImageUrl(
//                                   item.basePath,
//                                   item.extension,
//                                   "_thumb"
//                                 ) || "/placeholder.png"
//                               }
//                               alt={item.productName}
//                               className="w-16 h-16 rounded-lg border object-cover flex-shrink-0"
//                             />
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-gray-900 line-clamp-2">
//                                 {item.productName}
//                               </p>
//                               <p className="text-xs text-gray-500 mt-0.5">
//                                 {item.variantAttributes}
//                               </p>
//                               <div className="flex justify-between mt-2">
//                                 <span className="text-xs text-gray-500">
//                                   x{item.quantity}
//                                 </span>
//                                 <span className="text-sm font-medium text-gray-900">
//                                   {formatPrice(item.lineTotal)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Shipping Options */}
//                       <div className="bg-gray-50 p-4 rounded-xl space-y-3">
//                         <h4 className="text-sm font-medium text-gray-700">
//                           Phương thức vận chuyển
//                         </h4>
//                         {loadingShopShipmentMethods[shop.shopId] ? (
//                           <div className="flex gap-2 items-center text-sm text-gray-500">
//                             <Loader2 className="animate-spin w-4 h-4" /> Đang
//                             tính phí...
//                           </div>
//                         ) : (
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                             {shopShipmentMethods[shop.shopId]?.map(
//                               (method, idx) => {
//                                 const val =
//                                   method.serviceCompanyType?.toUpperCase() ||
//                                   `METHOD_${idx}`;
//                                 const isSelected =
//                                   shopSelectedShippingMethod[shop.shopId] ===
//                                   val;
//                                 return (
//                                   <div
//                                     key={val}
//                                     onClick={() =>
//                                       setShopSelectedShippingMethod((prev) => ({
//                                         ...prev,
//                                         [shop.shopId]: val,
//                                       }))
//                                     }
//                                     className={`p-3 border rounded-lg cursor-pointer transition-all ${
//                                       isSelected
//                                         ? "border-orange-500 bg-white shadow-sm ring-1 ring-orange-500"
//                                         : "border-gray-200 hover:border-gray-300"
//                                     }`}
//                                   >
//                                     <div className="flex justify-between items-center">
//                                       <span className="text-sm font-medium text-gray-700">
//                                         {getShipmentMethodName(
//                                           method.serviceCompanyType
//                                         )}
//                                       </span>
//                                       <span className="text-sm font-bold text-green-600">
//                                         {formatPrice(getShipmentCost(method))}
//                                       </span>
//                                     </div>
//                                     <p className="text-xs text-gray-400 mt-1">
//                                       Dự kiến giao: 3-5 ngày
//                                     </p>
//                                   </div>
//                                 );
//                               }
//                             )}
//                             {(!shopShipmentMethods[shop.shopId] ||
//                               shopShipmentMethods[shop.shopId].length ===
//                                 0) && (
//                               <p className="text-sm text-red-500 italic">
//                                 Chưa hỗ trợ vận chuyển đến địa chỉ này
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* Shop Subtotal */}
//                       <div className="flex justify-end pt-2 border-t border-gray-100 border-dashed">
//                         <div className="text-right">
//                           <span className="text-sm text-gray-500 mr-2">
//                             Tổng số tiền ({shop.itemCount} sản phẩm):
//                           </span>
//                           <span className="text-base font-bold text-orange-600">
//                             {formatPrice(
//                               (shop.subtotal || 0) +
//                                 (shopShipmentMethods[shop.shopId]?.find(
//                                   (m) =>
//                                     m.serviceCompanyType?.toUpperCase() ===
//                                     shopSelectedShippingMethod[shop.shopId]
//                                 )?.total || 0)
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* RIGHT COLUMN */}
//               <div className="lg:col-span-1 space-y-6">
//                 {/* Payment Method */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <CreditCard className="text-orange-500 w-5 h-5" /> Phương
//                     thức thanh toán
//                   </h3>
//                   <div className="space-y-3">
//                     <RadioOption
//                       label="Thanh toán khi nhận hàng (COD)"
//                       subLabel="Thanh toán tiền mặt khi giao hàng"
//                       value="COD"
//                       checked={formData.paymentMethod === "COD"}
//                       onChange={(v: string) =>
//                         setFormData((p) => ({ ...p, paymentMethod: v }))
//                       }
//                     />
//                     <RadioOption
//                       label="Chuyển khoản ngân hàng (QR)"
//                       subLabel="Quét mã VietQR (PayOS)"
//                       value="PAYOS"
//                       checked={formData.paymentMethod === "PAYOS"}
//                       onChange={(v: string) =>
//                         setFormData((p) => ({ ...p, paymentMethod: v }))
//                       }
//                     />
//                     <RadioOption
//                       label="Ví điện tử VNPAY"
//                       value="VNPAY"
//                       checked={formData.paymentMethod === "VNPAY"}
//                       onChange={(v: string) =>
//                         setFormData((p) => ({ ...p, paymentMethod: v }))
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* Voucher Input */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                   <VoucherInput
//                     compact
//                     onSelectVoucher={handleVoucherSelect as any}
//                     context={{ totalAmount: checkoutPreview.subtotal }}
//                   />
//                   {/* Error display */}
//                   {voucherErrors.length > 0 && (
//                     <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
//                       {voucherErrors.map((e) => (
//                         <p key={e.code} className="flex gap-1">
//                           <span className="font-bold">{e.code}:</span>{" "}
//                           {e.reason}
//                         </p>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Note Input */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                   <h3 className="text-sm font-bold text-gray-800 mb-2">
//                     Ghi chú đơn hàng
//                   </h3>
//                   <textarea
//                     className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
//                     rows={3}
//                     placeholder="Lưu ý cho người bán..."
//                     value={formData.customerNote}
//                     onChange={(e) =>
//                       setFormData((p) => ({
//                         ...p,
//                         customerNote: e.target.value,
//                       }))
//                     }
//                   />
//                 </div>

//                 {/* Total Summary */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
//                   <h3 className="text-lg font-bold text-gray-800 mb-4">
//                     Chi tiết thanh toán
//                   </h3>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between text-gray-600">
//                       <span>Tổng tiền hàng</span>
//                       <span>{formatPrice(checkoutPreview.subtotal)}</span>
//                     </div>
//                     <div className="flex justify-between text-gray-600">
//                       <span>Phí vận chuyển</span>
//                       <span>{formatPrice(getCurrentShippingFee())}</span>
//                     </div>
//                     {checkoutPreview.totalDiscount > 0 && (
//                       <div className="flex justify-between text-green-600 font-medium">
//                         <span>Giảm giá</span>
//                         <span>
//                           -{formatPrice(checkoutPreview.totalDiscount)}
//                         </span>
//                       </div>
//                     )}
//                     <div className="pt-4 border-t border-dashed flex justify-between items-center mt-2">
//                       <span className="font-bold text-gray-800 text-base">
//                         Tổng thanh toán
//                       </span>
//                       <span className="font-bold text-2xl text-orange-600">
//                         {formatPrice(calculateGrandTotal())}
//                       </span>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full mt-6 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 transform active:scale-95"
//                   >
//                     {loading ? (
//                       <Loader2 className="animate-spin" />
//                     ) : (
//                       <CheckCircle2 />
//                     )}
//                     Đặt Hàng Ngay
//                   </button>

//                   <p className="text-center text-xs text-gray-400 mt-3 px-2">
//                     Nhấn "Đặt Hàng Ngay" đồng nghĩa với việc bạn đồng ý tuân
//                     theo Điều khoản Shopee
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </PageContentTransition>

//       <CustomModal isOpen={successModalVisible} onClose={() => {}} title="">
//         <div className="text-center py-8">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <CheckCircle2 className="w-10 h-10 text-green-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Đặt hàng thành công!
//           </h2>
//           <p className="text-gray-500 mb-8">
//             Cảm ơn bạn đã mua sắm. Đơn hàng đang được xử lý.
//           </p>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={() => router.push("/orders")}
//               className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
//             >
//               Xem đơn hàng
//             </button>
//             <button
//               onClick={() => router.push("/")}
//               className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
//             >
//               Tiếp tục mua sắm
//             </button>
//           </div>
//         </div>
//       </CustomModal>

//       <CustomModal
//         isOpen={payosModalVisible}
//         onClose={() => router.push("/orders")}
//         title="Thanh toán đơn hàng"
//       >
//         {payosInfo ? (
//           <PayOSQRPayment
//             orderId={selectedOrder?.orderId}
//             orderNumber={selectedOrder?.orderNumber || ""}
//             amount={selectedOrder?.grandTotal}
//             // ... pass other props
//             onRefresh={() => {}}
//             onCancelPayment={() => setPayosModalVisible(false)}
//           />
//         ) : (
//           <div className="py-12 flex justify-center">
//             <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
//           </div>
//         )}
//       </CustomModal>

//       <AddressModal isOpen={addressModalVisible}
//         onClose={() => setAddressModalVisible(false)}
//         savedAddresses={savedAddresses} // Lấy từ Context
//         currentAddressId={formData.addressId}
//         onConfirmSaved={handleConfirmSavedAddress}
//         onConfirmNew={handleConfirmNewAddress}
//       />

//       <ShippingMethodModal isOpen={shippingMethodModalVisible}
//         onClose={() => setShippingMethodModalVisible(false)}
//         onConfirm={() => {
//           setFormData((p) => ({ ...p, shippingMethod: "GHN" }));
//           setShippingMethodModalVisible(false);
//         }}
//         loadingPrice={loadingGHNShipmentPrice}
//         priceData={ghnShipmentPrice}
//       />
//     </div>
//   );
// };
