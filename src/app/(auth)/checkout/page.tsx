// "use client";
// import PageContentTransition from "@/features/PageContentTransition";
// import { buyerService } from "@/services/buyer/buyer.service";
// import { BuyerAddressResponse } from "@/types/buyer/buyer.types";
// import { VoucherInput } from "@/app/cart/_components/VoucherInput";
// import { orderService } from "@/services/orders/order.service";
// import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
// import { OrderCreationResponse } from "@/types/orders/order-creation.types";
// import { toast } from "sonner";
// import {
//   OrderCreateRequest,
//   ShippingAddressInfo,
// } from "@/types/orders/order.types";
// import { PayOSQRPayment } from "@/app/orders/_components/PayOSQRPayment";
// import { paymentService } from "@/services/payment/payment.service";
// import { PayOSPaymentResponse } from "@/types/payment/payment.types";
// import {
//   getConkinShipmentPrice,
//   getCostsShipments,
//   getGHNCosts,
// } from "@/features/Shipment";
// import { getAllShopAddresses } from "@/services/shop/shop.service";
// import { useAppDispatch, useAppSelector } from "@/store/store";
// import type {
//   CostsShipmentResponse,
//   GHNCostsResponse,
//   PackageConkinResponse,
// } from "@/features/Shipment/types/shipment.types";
// import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
// import { resolvePreviewItemImageUrl } from "@/utils/cart/image.utils";
// import { getStoredUserDetail } from "@/utils/jwt";
// import { extractItemDimensions } from "@/utils/packaging-optimizer";
// import {
//   CheckCircle2,
//   CreditCard,
//   MapPin,
//   Home,
//   Store,
//   ShoppingCart,
//   Tag,
// } from "lucide-react";
// import {
//   Alert,
//   App,
//   Button,
//   Card,
//   Divider,
//   Form,
//   Input,
//   Layout,
//   Modal,
//   Radio,
//   Space,
//   Spin,
//   Steps,
//   Tabs,
// } from "antd";
// import { CustomBreadcrumb } from "@/components";
// import { useRouter, useSearchParams } from "next/navigation";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import addressData, { Province, Ward } from "vietnam-address-database";

// const { Content } = Layout;

// const getShipmentMethodName = (serviceCompanyType?: string): string => {
//   const type = serviceCompanyType?.toUpperCase() || "";
//   switch (type) {
//     case "GHN":
//       return "Giao hàng nhanh GHN";
//     case "CONKIN":
//       return "Giao hàng Conkin";
//     default:
//       return serviceCompanyType || "Phương thức vận chuyển";
//   }
// };

// const getShipmentCost = (response: CostsShipmentResponse): number => {
//   return response.costs || response.total || 0;
// };

// export default function CheckoutPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const dispatch = useAppDispatch();
//   const { cart, checkoutPreview: reduxPreview } = useAppSelector(
//     (state) => state.cart
//   );
//   const { message } = App.useApp();

//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0); // Start at step 0 (shipping info)
//   const [savedAddresses, setSavedAddresses] = useState<BuyerAddressResponse[]>(
//     []
//   );
//   const [useNewAddress, setUseNewAddress] = useState(false);
//   const [addressModalVisible, setAddressModalVisible] = useState(false);
//   const [selectedAddressIdState, setSelectedAddressIdState] = useState<
//     string | undefined
//   >(undefined);
//   const [shippingMethodModalVisible, setShippingMethodModalVisible] =
//     useState(false);
//   const [checkoutPreview, setCheckoutPreview] = useState<any>(null);
//   const [checkoutRequest, setCheckoutRequest] = useState<any>(null);
//   const [buyerInfo, setBuyerInfo] = useState<any>(null);
//   const [loadingBuyerInfo, setLoadingBuyerInfo] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState<any>(null);
//   const [successModalVisible, setSuccessModalVisible] = useState(false);
//   const [payosModalVisible, setPayosModalVisible] = useState(false);
//   const [payosInfo, setPayosInfo] = useState<PayOSPaymentResponse | null>(null);
//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const [paymentExpiresAt, setPaymentExpiresAt] = useState<string | null>(null);
//   const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
//   const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const [conkinShipmentPrice, setConkinShipmentPrice] =
//     useState<PackageConkinResponse | null>(null);
//   const [ghnShipmentPrice, setGhnShipmentPrice] =
//     useState<GHNCostsResponse | null>(null);
//   const [loadingShipmentPrice, setLoadingShipmentPrice] = useState(false);
//   const [loadingGHNShipmentPrice, setLoadingGHNShipmentPrice] = useState(false);
//   const [availableShipmentMethods, setAvailableShipmentMethods] = useState<
//     CostsShipmentResponse[]
//   >([]); // Danh sách các phương thức vận chuyển từ API (legacy)
//   const [shopShipmentMethods, setShopShipmentMethods] = useState<
//     Record<string, CostsShipmentResponse[]>
//   >({}); // Map shopId -> available shipment methods
//   const [shopSelectedShippingMethod, setShopSelectedShippingMethod] = useState<
//     Record<string, string>
//   >({}); // Map shopId -> selected shipping method
//   const [loadingShopShipmentMethods, setLoadingShopShipmentMethods] = useState<
//     Record<string, boolean>
//   >({}); // Map shopId -> loading state
//   const [shopProvince, setShopProvince] = useState<string | null>(null);
//   const [shopDistrict, setShopDistrict] = useState<string | null>(null);
//   const [shopWard, setShopWard] = useState<string | null>(null);
//   const [loadingShopAddress, setLoadingShopAddress] = useState(false);
//   const [shopAddressesMap, setShopAddressesMap] = useState<
//     Record<string, string>
//   >({}); // Map shopId -> province
//   const [shopFullAddressMap, setShopFullAddressMap] = useState<
//     Record<string, { province: string; district: string; ward: string }>
//   >({}); // Map shopId -> full address
//   const [shopAddressIdMap, setShopAddressIdMap] = useState<
//     Record<string, string>
//   >({}); // Map shopId -> shop addressId

//   // Parse vietnam-address-database để lấy provinces và wards (giống như buyer address)
//   const [provincesData, setProvincesData] = useState<Province[]>([]);
//   const [allWardsData, setAllWardsData] = useState<Ward[]>([]);

//   // Parse dữ liệu từ addressData khi component mount
//   useEffect(() => {
//     let provincesList: Province[] = [];
//     let wardsList: Ward[] = [];

//     addressData.forEach((item) => {
//       if (item.type === "table") {
//         if (item.name === "provinces" && item.data) {
//           provincesList = item.data as Province[];
//         } else if (item.name === "wards" && item.data) {
//           wardsList = item.data as Ward[];
//         }
//       }
//     });

//     setProvincesData(provincesList);
//     setAllWardsData(wardsList);
//   }, []);
//   const [showShippingDetail, setShowShippingDetail] = useState(false); // Ẩn/hiện chi tiết giá vận chuyển
//   const [hasShownInitialVoucherErrors, setHasShownInitialVoucherErrors] =
//     useState(false); // Flag to prevent showing errors multiple times
//   const [isUpdatingCheckoutPreview, setIsUpdatingCheckoutPreview] =
//     useState(false); // Flag to prevent multiple simultaneous API calls
//   const [voucherErrors, setVoucherErrors] = useState<
//     Array<{ code: string; reason: string }>
//   >([]); // Store voucher errors to display on UI
//   const lastCheckoutRequestRef = useRef<string | null>(null); // Track last request to avoid duplicate calls
//   const checkoutRequestRef = useRef<any>(null); // Store latest checkoutRequest to avoid stale closure
//   const previousShopsRef = useRef<string | null>(null); // Track previous shops data to avoid unnecessary shop address loads
//   const hasLoadedBuyerInfoRef = useRef(false); // Track if buyer info has been loaded to prevent duplicate calls
//   const isInitialMountRef = useRef(true); // Track if this is the initial mount

//   // ✅ Define loadBuyerInfo with useCallback BEFORE useEffect to ensure it's available
//   // Note: form and useNewAddress are accessed but not included in deps to avoid infinite loop
//   // They are stable references and don't need to trigger re-creation of this function
//   const loadBuyerInfo = useCallback(async () => {
//     // Prevent duplicate calls
//     if (hasLoadedBuyerInfoRef.current) {
//       console.log("⏭️ Skipping loadBuyerInfo - already loaded");
//       return;
//     }

//     console.log("🚀 loadBuyerInfo function called");
//     hasLoadedBuyerInfoRef.current = true; // Set flag immediately to prevent duplicate calls
//     setLoadingBuyerInfo(true);
//     try {
//       // Get buyerId from localStorage
//       const storedUser = getStoredUserDetail();
//       console.log("📋 Stored user:", storedUser);
//       const buyerId = storedUser?.buyerId;
//       console.log("📋 BuyerId:", buyerId);

//       if (!buyerId) {
//         console.log("⚠️ No buyerId found in localStorage");
//         console.log("⚠️ Stored user detail:", storedUser);
//         hasLoadedBuyerInfoRef.current = false; // Reset flag on error
//         setLoadingBuyerInfo(false);
//         return;
//       }

//       console.log(
//         "🔍 Loading buyer info (includes addresses) for buyerId:",
//         buyerId
//       );
//       const buyerDetail = await buyerService.getBuyerDetail(buyerId);
//       console.log("✅ Loaded buyer info:", buyerDetail);
//       console.log(
//         "✅ Buyer addresses from API:",
//         buyerDetail?.addresses?.length || 0
//       );
//       console.log(
//         "📦 Addresses data:",
//         JSON.stringify(buyerDetail?.addresses, null, 2)
//       );

//       if (!buyerDetail) {
//         console.error("❌ buyerDetail is null or undefined");
//         setLoadingBuyerInfo(false);
//         return;
//       }

//       setBuyerInfo(buyerDetail);

//       // ✅ Use addresses from buyerDetail instead of calling separate API
//       if (buyerDetail.addresses && buyerDetail.addresses.length > 0) {
//         // Sort by createdDate descending (newest first)
//         const sortedAddresses = [...buyerDetail.addresses].sort((a, b) => {
//           const dateA = new Date(a.createdDate || 0).getTime();
//           const dateB = new Date(b.createdDate || 0).getTime();
//           return dateB - dateA; // Descending order (newest first)
//         });

//         console.log(
//           "📦 Sorted addresses:",
//           sortedAddresses.map((addr) => ({
//             addressId: addr.addressId,
//             recipientName: addr.recipientName,
//             phone: addr.phone,
//             detailAddress: addr.detailAddress,
//             province: addr.province,
//             district: addr.district,
//             ward: addr.ward,
//             hasRecipientName: !!addr.recipientName,
//             hasPhone: !!addr.phone,
//           }))
//         );

//         setSavedAddresses(sortedAddresses);

//         // Auto-select newest address (first in sorted array)
//         const newestAddress = sortedAddresses[0];
//         console.log(
//           "✅ Auto-selected newest address:",
//           newestAddress.addressId
//         );
//         console.log(
//           "   Recipient Name:",
//           newestAddress.recipientName || "NULL"
//         );
//         console.log("   Phone:", newestAddress.phone || "NULL");
//         console.log(
//           "   Detail Address:",
//           newestAddress.detailAddress || "NULL"
//         );

//         // ✅ Use form.setFieldsValue to set addressId
//         form.setFieldsValue({
//           addressId: newestAddress.addressId,
//         });
//         setSelectedAddressIdState(newestAddress.addressId);
//         console.log("✅ Set form addressId to:", newestAddress.addressId);

//         // Nếu shop addresses đã load xong, fetch shipping methods ngay với địa chỉ mới nhất
//         if (
//           Object.keys(shopAddressIdMap).length > 0 &&
//           checkoutPreview?.shops &&
//           checkoutPreview.shops.length > 0
//         ) {
//           console.log(
//             "🚀 Address auto-selected, shop addresses already loaded, fetching shipment methods..."
//           );
//           checkoutPreview.shops.forEach((shop: any) => {
//             const shopId = shop.shopId;
//             const shopAddressId = shopAddressIdMap[shopId];
//             if (
//               shopId &&
//               shopAddressId &&
//               shop.items &&
//               shop.items.length > 0
//             ) {
//               console.log(
//                 `✅ Auto-fetching costs-shipments for shop ${shopId} (address auto-selected: ${newestAddress.addressId})`
//               );
//               fetchCostsShipmentsForShop(
//                 newestAddress.addressId,
//                 shopId,
//                 shop.items
//               );
//             }
//           });
//         } else {
//           console.log(
//             "⏳ Address auto-selected, waiting for shop addresses to load..."
//           );
//         }

//         // Note: useEffect will automatically fetch shipment methods when both addressId and shopAddressIdMap are ready
//         // Steps will automatically update when addressId is set (via isShippingInfoComplete)
//       } else {
//         console.log(
//           "⚠️ No addresses found in buyerDetail, user will need to enter new address"
//         );
//         setSavedAddresses([]);
//       }

//       // Fill form with buyer info if no addresses (user will enter new address)
//       // Note: useNewAddress state will be checked in a separate useEffect
//       if (!buyerDetail.addresses || buyerDetail.addresses.length === 0) {
//         form.setFieldsValue({
//           recipientName: buyerDetail.fullName,
//           phoneNumber: buyerDetail.phone,
//         });
//         console.log("✅ Pre-filled form with buyer info (no addresses):", {
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

//       // Reset flag on error to allow retry
//       hasLoadedBuyerInfoRef.current = false;

//       // Don't block checkout if buyer info loading fails
//       // User can still enter new address
//     } finally {
//       setLoadingBuyerInfo(false);
//     }
//   }, [form]); // Only form is in deps - it's stable from Form.useForm()

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
//       console.log("⏭️ Skipping useEffect - preview unchanged");
//       return;
//     }

//     if (currentPreviewKey) {
//       lastPreviewKeyRef.current = currentPreviewKey;
//     }

//     // Mark initial mount as done
//     if (isInitialMountRef.current) {
//       isInitialMountRef.current = false;
//     }

//     console.log("🔍 Checkout Page - useEffect triggered");
//     console.log("🔍 reduxPreview:", reduxPreview ? "Found" : "Not found");

//     // Try to get preview from Redux or sessionStorage
//     let preview = reduxPreview;
//     let request = null;

//     if (!preview) {
//       // Try sessionStorage
//       const savedPreview = sessionStorage.getItem("checkoutPreview");
//       const savedRequest = sessionStorage.getItem("checkoutRequest");

//       console.log(
//         "🔍 SessionStorage preview:",
//         savedPreview ? "Found" : "Not found"
//       );

//       if (savedPreview && savedRequest) {
//         try {
//           preview = JSON.parse(savedPreview);
//           request = JSON.parse(savedRequest);
//           console.log("✅ Loaded checkout preview from sessionStorage");
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

//     console.log("✅ Preview found, setting state");
//     setCheckoutPreview(preview);
//     setCheckoutRequest(request);
//     checkoutRequestRef.current = request; // Update ref

//     // Check for voucher errors and warnings when loading preview (only once)
//     if (!hasShownInitialVoucherErrors && preview.voucherApplication) {
//       const voucherApp = preview.voucherApplication;
//       let hasShownAnyMessage = false;

//       // ALWAYS check globalVouchers for errors, regardless of success flag
//       if (voucherApp.globalVouchers) {
//         const invalidVouchers = voucherApp.globalVouchers.invalidVouchers || [];
//         const discountDetails = voucherApp.globalVouchers.discountDetails || [];

//         console.log("🔍 Checking voucher errors on preview load...");
//         console.log("🔍 Invalid vouchers:", invalidVouchers);
//         console.log("🔍 Discount details:", discountDetails);

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
//             console.log("❌ Showing error on preview load:", errorMsg);
//             toast.error(errorMsg);

//             // Store error for UI display
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

//               // Store error for UI display
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
//           console.log("⚠️ Showing warning on preview load:", warning);
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
//           console.log("❌ Showing general error on preview load:", errorMsg);
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
//       console.log("🔍 Calling loadBuyerInfo...");
//       loadBuyerInfo();
//     } else {
//       console.log("⏭️ Skipping loadBuyerInfo - already loaded");
//     }
//     // Shop address will be loaded in separate useEffect when checkoutPreview is set
//   }, [reduxPreview, router, loadBuyerInfo]);

//   // Auto-fill form when switching to new address or when buyer info is loaded
//   useEffect(() => {
//     if (buyerInfo && useNewAddress) {
//       console.log("🔍 Auto-filling form with buyer info");
//       form.setFieldsValue({
//         recipientName: buyerInfo.fullName,
//         phoneNumber: buyerInfo.phone,
//       });
//     }
//   }, [useNewAddress, buyerInfo, form]);

//   const loadShopAddress = async () => {
//     if (
//       !checkoutPreview ||
//       !checkoutPreview.shops ||
//       checkoutPreview.shops.length === 0
//     ) {
//       console.log("⚠️ No shops found in checkout preview");
//       return;
//     }

//     setLoadingShopAddress(true);
//     try {
//       const shops = checkoutPreview.shops;
//       console.log("🏪 ===== BẮT ĐẦU LẤY ĐỊA CHỈ CỦA TẤT CẢ CÁC SHOP =====");
//       console.log("   Tổng số shop:", shops.length);

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
//           console.log(
//             `   📍 Đang lấy địa chỉ shop: ${shopName} (${itemCount} items)`
//           );
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
//               console.log(
//                 `   ✅ Shop ${shopName}: addressId = ${defaultAddress.addressId}`
//               );
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

//                 // Nếu có district, tìm ward từ vietnam-address-database (giống như buyer address)
//                 if (wardName && allWardsData.length > 0) {
//                   // Tìm ward có cùng province_code
//                   // Có thể tìm ward có tên chứa district name hoặc lấy ward đầu tiên
//                   const wardsInProvince = allWardsData.filter(
//                     (w) => w.province_code === provinceCode
//                   );

//                   // Tìm ward có tên liên quan đến district hoặc lấy ward đầu tiên
//                   const foundWard =
//                     wardsInProvince.find(
//                       (w) =>
//                         w.name.includes(wardName) ||
//                         wardName.includes(w.name) ||
//                         w.name.toLowerCase().includes(wardName.toLowerCase())
//                     ) || wardsInProvince[0];

//                   if (foundWard) {
//                     ward = foundWard.name;
//                     console.log(
//                       `   ✅ Shop ${shopName}: Tìm thấy ward từ vietnam-address-database: ${ward}`
//                     );
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
//                     console.log(
//                       `   ✅ Shop ${shopName}: Lấy ward đầu tiên của province: ${ward}`
//                     );
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
//                 console.log(
//                   `   ✅ Shop ${shopName}: ${province}, ${district} (ward: ${
//                     ward || "không có"
//                   })`
//                 );
//               } else {
//                 console.log(
//                   `   ✅ Shop ${shopName}: ${province} (thiếu district/ward)`
//                 );
//               }
//             } else {
//               console.warn(
//                 `   ⚠️ Shop ${shopName}: Không tìm thấy province, dùng fallback`
//               );
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

//       console.log("✅ ===== ĐÃ LẤY ĐƯỢC ĐỊA CHỈ CỦA TẤT CẢ CÁC SHOP =====");
//       console.log("   Shop addresses map:", addressesMap);

//       // Lưu map địa chỉ của tất cả shop
//       setShopAddressesMap(addressesMap);
//       setShopFullAddressMap(fullAddressesMap);
//       setShopAddressIdMap(shopAddressIdMap);

//       // Sau khi load xong shop addresses, nếu đã có addressId (auto-selected) thì fetch shipping methods ngay
//       const currentAddressId =
//         form.getFieldValue("addressId") || selectedAddressIdState;
//       if (
//         currentAddressId &&
//         checkoutPreview?.shops &&
//         checkoutPreview.shops.length > 0
//       ) {
//         console.log(
//           "🚀 Shop addresses loaded, auto-fetching shipment methods for all shops with address:",
//           currentAddressId
//         );
//         checkoutPreview.shops.forEach((shop: any) => {
//           const shopId = shop.shopId;
//           const shopAddressId = shopAddressIdMap[shopId];
//           if (shopId && shopAddressId && shop.items && shop.items.length > 0) {
//             console.log(
//               `✅ Auto-fetching costs-shipments for shop ${shopId} (address: ${currentAddressId}, shopAddressId: ${shopAddressId})`
//             );
//             fetchCostsShipmentsForShop(currentAddressId, shopId, shop.items);
//           }
//         });
//       }

//       // Chọn shop chính để làm điểm gửi:
//       // 1. Shop có nhiều items nhất
//       // 2. Hoặc shop đầu tiên nếu bằng nhau
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

//       console.log("🎯 ===== CHỌN SHOP CHÍNH LÀM ĐIỂM GỬI =====");
//       console.log("   Shop ID:", mainShopId);
//       console.log("   Shop Name:", mainShop.shopName || mainShopId);
//       console.log("   Số items:", maxItems);
//       console.log("   🏙️  Province:", mainShopProvince);
//       if (mainShopFullAddress) {
//         console.log("   📍 Full Address:", mainShopFullAddress);
//         setShopProvince(mainShopFullAddress.province);
//         setShopDistrict(mainShopFullAddress.district);
//         setShopWard(mainShopFullAddress.ward);
//       } else {
//         console.log("   📍 Sẽ sử dụng làm name_city_from trong API Conkin");
//         setShopProvince(mainShopProvince);
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
//       setShopProvince("Hồ Chí Minh");
//       setShopDistrict(null);
//       setShopWard(null);
//       setShopAddressesMap({});
//       setShopFullAddressMap({});
//     } finally {
//       setLoadingShopAddress(false);
//       console.log("🏪 ===== HOÀN THÀNH LẤY ĐỊA CHỈ SHOP =====");
//     }
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Function to calculate total weight from cart items (actual weight from products)
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

//   // Function to calculate shipping price from Conkin response data
//   // Formula: (priceNet + priceOther + overSize?.price + pricePeakSeason) * (1 + constVAT/100) * (1 + constPPXD/100)
//   const calculateConkinShippingPrice = useCallback((data: any): number => {
//     // Lấy các giá trị từ response, mặc định là 0 nếu null/undefined
//     const priceNet = data.priceNet || 0;
//     const priceOther = data.priceOther || 0;
//     const pricePeakSeason = data.pricePeakSeason || 0;
//     // overSize có thể là null hoặc object có field price
//     const overSizePrice = data.overSize?.price || 0;
//     const constVAT = data.constVAT || 0;
//     const constPPXD = data.constPPXD || 0;

//     console.log("💰 ===== TÍNH TOÁN CƯỚC VẬN CHUYỂN CONKIN =====");
//     console.log("   priceNet:", priceNet);
//     console.log("   priceOther:", priceOther || 0);
//     console.log("   pricePeakSeason:", pricePeakSeason || 0);
//     console.log("   overSize?.price:", overSizePrice || 0);
//     console.log("   constVAT:", constVAT, "%");
//     console.log("   constPPXD:", constPPXD, "%");

//     // Tính tổng cước theo công thức:
//     // (priceNet + priceOther + overSize?.price + pricePeakSeason) * (1 + constVAT/100) * (1 + constPPXD/100)
//     const basePrice = priceNet + priceOther + overSizePrice + pricePeakSeason;
//     const priceWithVAT = basePrice * (1 + constVAT / 100);
//     const finalPrice = priceWithVAT * (1 + constPPXD / 100);

//     console.log("   ─────────────────────────");
//     console.log(
//       "   Base price (priceNet + priceOther + overSize?.price + pricePeakSeason):",
//       basePrice
//     );
//     console.log(
//       "   Price with VAT (basePrice * (1 + constVAT/100)):",
//       priceWithVAT
//     );
//     console.log(
//       "   Final price (priceWithVAT * (1 + constPPXD/100)):",
//       finalPrice
//     );
//     console.log("   ✅ priceTotal (rounded):", Math.round(finalPrice));

//     return Math.round(finalPrice); // Làm tròn về số nguyên
//   }, []);

//   // Function to get shipment price from Conkin API
//   const fetchConkinShipmentPrice = useCallback(
//     async (province: string) => {
//       if (!province || !checkoutPreview) {
//         setConkinShipmentPrice(null);
//         return;
//       }

//       // Sử dụng địa chỉ shop nếu đã load được, nếu không thì dùng fallback
//       // ✅ ĐÂY LÀ NƠI LẤY ĐỊA CHỈ SHOP ĐỂ GẮN VÀO name_city_from
//       const originCity = shopProvince || "Hồ Chí Minh";

//       setLoadingShipmentPrice(true);
//       try {
//         // ✅ LẤY TẤT CẢ ITEMS TỪ CHECKOUT PREVIEW
//         const allItems = checkoutPreview.shops.flatMap(
//           (shop: any) => shop.items || []
//         );

//         console.log("📦 Total items for packaging:", allItems.length);

//         // ✅ MỖI SẢN PHẨM LÀ 1 PACKAGE RIÊNG
//         // Nếu quantity > 1, tạo quantity packages riêng biệt (mỗi package = 1 sản phẩm)
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

//           // ✅ KHÔNG DÙNG GIÁ TRỊ MẶC ĐỊNH - PHẢI CÓ DIMENSIONS TỪ SẢN PHẨM
//           if (!dimensions) {
//             const productName = item.productName || item.name || "Sản phẩm";
//             const errorMsg = `Sản phẩm "${productName}" không có đầy đủ thông tin kích thước (dài x rộng x cao) và trọng lượng. Vui lòng cập nhật thông tin sản phẩm trước khi đặt hàng.`;
//             console.error(`❌ ${errorMsg}`);
//             toast.error(errorMsg);
//             throw new Error(errorMsg);
//           }

//           // Kiểm tra dimensions hợp lệ
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

//           // ✅ Có dimensions từ sản phẩm - Tạo quantity packages riêng biệt (mỗi package = 1 sản phẩm)
//           for (let i = 0; i < quantity; i++) {
//             packages.push({
//               weight: dimensions.weight, // Weight của 1 sản phẩm (không nhân quantity)
//               width: dimensions.width,
//               length: dimensions.length,
//               height: dimensions.height,
//               weightChargeMin: 0,
//             });
//           }
//           console.log(
//             `📦 Created ${quantity} packages for item ${itemIndex + 1} (${
//               item.productName || "Item"
//             }):`,
//             {
//               weightPerPackage: dimensions.weight,
//               dimensions: `${dimensions.length}x${dimensions.width}x${dimensions.height} cm`,
//               totalQuantity: quantity,
//               totalPackages: quantity,
//             }
//           );
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

//         console.log("📦 Final request data for Conkin:", {
//           ...requestData,
//           totalPackages: packages.length,
//         });

//         const response = await getConkinShipmentPrice(requestData);

//         console.log("✅ Conkin shipment price received:", response);

//         // Xử lý response: có thể là PackageConkinResponse (có data) hoặc PackageConkinData trực tiếp
//         let responseData: any;
//         if (response && "data" in response) {
//           // Response là PackageConkinResponse với structure { status, message, data }
//           responseData = response.data;
//         } else {
//           // Response là PackageConkinData trực tiếp
//           responseData = response;
//         }

//         console.log("📦 Response data:", responseData);

//         // Tính toán priceTotal nếu chưa có hoặc null
//         const finalData = { ...responseData };

//         // Nếu priceTotal null hoặc undefined, tính lại bằng công thức
//         if (
//           finalData.priceTotal === null ||
//           finalData.priceTotal === undefined
//         ) {
//           const calculatedPrice = calculateConkinShippingPrice(finalData);
//           finalData.priceTotal = calculatedPrice;
//           console.log("✅ Đã tính lại priceTotal:", calculatedPrice);
//         } else {
//           console.log("✅ Sử dụng priceTotal từ API:", finalData.priceTotal);
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

//   // Function to get costs for all shipment methods for a specific shop
//   const fetchCostsShipmentsForShop = useCallback(
//     async (buyerAddressId: string, shopId: string, shopItems: any[]) => {
//       if (!buyerAddressId || !shopId || !shopItems || shopItems.length === 0) {
//         console.warn("⚠️ Missing required data for costs-shipments:", {
//           buyerAddressId,
//           shopId,
//           itemsCount: shopItems?.length,
//         });
//         return;
//       }

//       setLoadingShopShipmentMethods((prev) => ({ ...prev, [shopId]: true }));
//       try {
//         // Lấy shop addressId từ map (bắt buộc phải có)
//         const shopAddressId = shopAddressIdMap[shopId];

//         if (!shopAddressId) {
//           console.warn("⚠️ Shop addressId not found for shopId:", shopId);
//           return;
//         }

//         console.log(`📦 Fetching costs-shipments for shop ${shopId}:`, {
//           buyerAddressId,
//           shopId,
//           shopAddressId,
//           itemsCount: shopItems.length,
//         });

//         // Tạo items array cho CostsRequest (chỉ items của shop này)
//         const costsItems = shopItems.map((item: any) => {
//           const dimensions = extractItemDimensions(item);
//           const quantity = item.quantity || 1;

//           if (!dimensions) {
//             const productName = item.productName || item.name || "Sản phẩm";
//             const errorMsg = `Sản phẩm "${productName}" không có đầy đủ thông tin kích thước và trọng lượng.`;
//             console.error(`❌ ${errorMsg}`);
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

//         // Tính COD value (tổng giá trị đơn hàng của shop này)
//         const shopSubtotal = shopItems.reduce(
//           (sum, item) =>
//             sum + (item.lineTotal || item.price * (item.quantity || 1)),
//           0
//         );
//         const codValue = shopSubtotal || 0;

//         // Tạo request data cho costs-shipments API
//         const requestData = {
//           items: costsItems,
//           id_buyer_address: buyerAddressId,
//           id_shop_address: shopAddressId, // shop addressId (không phải shopId)
//           cod_value: codValue,
//           insurance_value: 0,
//         };

//         console.log(
//           `📤 Costs-shipments request data for shop ${shopId}:`,
//           requestData
//         );

//         const responses = await getCostsShipments(requestData);

//         console.log(
//           `✅ Costs-shipments response received for shop ${shopId}:`,
//           responses
//         );

//         // Lưu shipping methods cho shop này
//         if (responses && responses.length > 0) {
//           setShopShipmentMethods((prev) => ({ ...prev, [shopId]: responses }));
//           console.log(
//             `✅ Available shipment methods for shop ${shopId}:`,
//             responses
//           );

//           // Tự động chọn phương thức vận chuyển đầu tiên cho shop này
//           const firstMethod = responses[0];
//           const firstMethodType =
//             firstMethod.serviceCompanyType?.toUpperCase() || "METHOD_0";
//           const firstMethodValue = firstMethodType || `METHOD_0`;
//           setShopSelectedShippingMethod((prev) => ({
//             ...prev,
//             [shopId]: firstMethodValue,
//           }));
//           console.log(
//             `✅ Auto-selected first shipment method for shop ${shopId}:`,
//             firstMethodValue
//           );
//         } else {
//           console.warn(
//             `⚠️ Empty response from costs-shipments for shop ${shopId}`
//           );
//           setShopShipmentMethods((prev) => ({ ...prev, [shopId]: [] }));
//         }
//       } catch (error: any) {
//         console.error(
//           `❌ Failed to get costs-shipments for shop ${shopId}:`,
//           error
//         );
//         setShopShipmentMethods((prev) => ({ ...prev, [shopId]: [] }));
//       } finally {
//         setLoadingShopShipmentMethods((prev) => ({ ...prev, [shopId]: false }));
//       }
//     },
//     [shopAddressIdMap, message]
//   );

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

//         console.log("🏪 Shop address for GHN:", {
//           originProvince,
//           originDistrict,
//           originWard,
//         });

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

//         console.log("📦 GHN request data:", requestData);

//         const response = await getGHNCosts(requestData);

//         console.log("✅ GHN costs received:", response);
//         console.log("📊 GHN response structure:", {
//           code: response.code,
//           message: response.message,
//           hasData: !!response.data,
//           dataKeys: response.data ? Object.keys(response.data) : [],
//           total: response.data?.total,
//         });

//         // Kiểm tra response có hợp lệ không
//         // Backend có thể trả về code 200 hoặc 1000 (success) hoặc format khác
//         if (
//           response &&
//           response.data &&
//           (response.code === 200 ||
//             response.code === 1000 ||
//             response.data.total !== undefined)
//         ) {
//           setGhnShipmentPrice(response);
//           console.log("✅ GHN price set successfully:", response);
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
//         // Không hiển thị error message để tránh làm phiền user
//       } finally {
//         setLoadingGHNShipmentPrice(false);
//       }
//     },
//     [checkoutPreview, shopProvince, message]
//   );

//   // Watch for address changes and fetch shipment price
//   const addressId = Form.useWatch("addressId", form);
//   const province = Form.useWatch("province", form);
//   const recipientName = Form.useWatch("recipientName", form);
//   const phoneNumber = Form.useWatch("phoneNumber", form);
//   const addressLine1 = Form.useWatch("addressLine1", form);
//   const district = Form.useWatch("district", form);
//   const ward = Form.useWatch("ward", form);
//   const paymentMethod = Form.useWatch("paymentMethod", form);
//   const shippingMethod = Form.useWatch("shippingMethod", form);
//   const country = Form.useWatch("country", form);

//   // Kiểm tra country của địa chỉ đã chọn
//   const selectedAddressCountry = useMemo(() => {
//     if (addressId && !useNewAddress && savedAddresses.length > 0) {
//       const selectedAddress = savedAddresses.find(
//         (addr) => addr.addressId === addressId
//       );
//       return selectedAddress?.country || null;
//     }
//     return null;
//   }, [addressId, useNewAddress, savedAddresses]);

//   // Xác định country hiện tại (từ địa chỉ đã chọn hoặc form)
//   const currentCountry = selectedAddressCountry || country || "Vietnam";

//   // Kiểm tra có phải nước ngoài không (không phải Việt Nam)
//   const isForeignCountry = useMemo(() => {
//     const countryLower = currentCountry?.toLowerCase() || "";
//     return (
//       countryLower !== "vietnam" &&
//       countryLower !== "vn" &&
//       countryLower !== "việt nam"
//     );
//   }, [currentCountry]);

//   // Calculate step status based on form data
//   const isShippingInfoComplete = useMemo(() => {
//     if (useNewAddress) {
//       // New address: check if all required fields are filled
//       return !!(
//         recipientName &&
//         phoneNumber &&
//         province &&
//         district &&
//         ward &&
//         addressLine1
//       );
//     } else {
//       // Saved address: check if addressId is selected
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

//   // Update currentStep based on form completion
//   useEffect(() => {
//     console.log("🔄 Updating currentStep:", {
//       isShippingInfoComplete,
//       isPaymentInfoComplete,
//       orderSuccess: !!orderSuccess,
//       successModalVisible,
//       payosModalVisible,
//     });

//     if (orderSuccess || successModalVisible || payosModalVisible) {
//       // Step 3: Order completed
//       console.log("✅ Setting step to 3 (completed)");
//       setCurrentStep(3);
//     } else if (isPaymentInfoComplete && isShippingInfoComplete) {
//       // Step 2: Payment (ready to submit)
//       console.log("✅ Setting step to 2 (payment)");
//       setCurrentStep(2);
//     } else if (isShippingInfoComplete) {
//       // Step 1: Shipping info completed, move to payment
//       console.log("✅ Setting step to 1 (shipping complete, payment next)");
//       setCurrentStep(1);
//     } else {
//       // Step 0: Still filling shipping info
//       console.log("⏳ Setting step to 0 (filling shipping info)");
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
//     // Chỉ fetch khi đã có shopProvince (hoặc đang dùng fallback)
//     // Đợi shop address load xong trước khi gọi API Conkin
//     if (loadingShopAddress) {
//       console.log(
//         "⏳ Đang đợi shop address load xong trước khi fetch Conkin price..."
//       );
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

//     // Only fetch if province changed and is not null
//     if (targetProvince && targetProvince !== lastFetchedProvinceRef.current) {
//       console.log("📍 Fetching shipment price for province:", targetProvince);
//       lastFetchedProvinceRef.current = targetProvince;

//       // Reset Conkin price nếu country là Việt Nam
//       if (!isForeignCountry) {
//         setConkinShipmentPrice(null);
//       }
//       // Không fetch Conkin tự động, chỉ fetch khi người dùng chọn CONKIN làm shipping method

//       // Tự động fetch GHN price khi có địa chỉ (không cần chờ chọn shipping method)
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
//             console.log(`✅ Fetching costs-shipments for shop ${shopId}:`, {
//               buyerAddressId: addressId,
//               shopId,
//               shopAddressId,
//             });
//             fetchCostsShipmentsForShop(addressId, shopId, shop.items);
//           } else if (shopId && !shopAddressId) {
//             console.log(
//               `⏳ Waiting for shop addressId to be loaded for shop ${shopId}...`
//             );
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
//       console.log(
//         "⏭️ Skipping shipment price fetch - province unchanged:",
//         targetProvince
//       );
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
//         console.log(
//           "✅ Fetching CONKIN price for foreign country:",
//           targetProvince
//         );
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

//   // Fetch GHN price when shipping method changes to GHN or when address changes (if GHN is selected)
//   useEffect(() => {
//     // Chỉ fetch GHN khi đã chọn GHN và có đủ thông tin địa chỉ
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

//       console.log("🔍 GHN fetch check:", {
//         shippingMethod,
//         targetProvince,
//         targetWard,
//         targetDistrict,
//         hasAddress: !!(targetProvince && targetWard),
//       });

//       // Sử dụng API mới costs-shipments nếu có buyer addressId và shop addressId đã load
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
//           console.log("✅ Fetching costs-shipments with:", {
//             buyerAddressId: addressId,
//             shopId: firstShopId,
//             shopAddressId,
//           });
//           fetchCostsShipments(addressId, firstShopId);
//         } else if (firstShopId && !shopAddressId) {
//           console.log("⏳ Waiting for shop addressId to be loaded...");
//         }
//       } else if (targetProvince && targetWard) {
//         // Fallback to old method if using new address
//         console.log("✅ Fetching GHN price with:", {
//           targetProvince,
//           targetWard,
//           targetDistrict,
//         });
//         fetchGHNShipmentPrice(
//           targetProvince,
//           targetWard,
//           targetDistrict || undefined
//         );
//       } else {
//         console.log("⚠️ Cannot fetch shipment costs - missing address info:", {
//           hasAddressId: !!addressId,
//           hasProvince: !!targetProvince,
//           hasWard: !!targetWard,
//         });
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

//   // Tự động mở modal chọn phương thức vận chuyển khi đã có địa chỉ và giá vận chuyển
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
//     addressId,
//     useNewAddress,
//     province,
//     ward,
//     loadingShopAddress,
//     conkinShipmentPrice,
//     ghnShipmentPrice,
//     loadingShipmentPrice,
//     loadingGHNShipmentPrice,
//     shippingMethod,
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

//   useEffect(() => {
//     if (conkinShipmentPrice && conkinShipmentPrice.data) {
//       form.setFieldsValue({ shippingMethod: "CONKIN" });
//     }
//   }, [conkinShipmentPrice, form]);

//   // Update checkout request ref when it changes
//   useEffect(() => {
//     checkoutRequestRef.current = checkoutRequest;
//   }, [checkoutRequest]);

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

//   // Handle platform voucher selection
//   const handleSelectPlatformVoucher = async (vouchers: {
//     order?: any;
//     shipping?: any;
//   }) => {
//     if (!checkoutPreview || !checkoutRequest) {
//       toast.error("Không thể cập nhật voucher");
//       return false;
//     }

//     try {
//       // Build globalVouchers array from selected vouchers
//       const globalVouchers: string[] = [];
//       if (vouchers.order?.code) {
//         globalVouchers.push(vouchers.order.code);
//       }
//       if (vouchers.shipping?.code) {
//         globalVouchers.push(vouchers.shipping.code);
//       }

//       if (globalVouchers.length === 0) {
//         return false;
//       }

//       // Update checkout request with new vouchers
//       const updatedRequest = {
//         ...checkoutRequest,
//         globalVouchers,
//       };

//       // Check if this is a duplicate request BEFORE making API call
//       const requestKey = JSON.stringify({
//         addressId: null,
//         province: null,
//         shippingMethod: updatedRequest.shippingMethod,
//         globalVouchers: updatedRequest.globalVouchers || [],
//       });

//       if (lastCheckoutRequestRef.current === requestKey) {
//         return false;
//       }

//       // Prevent duplicate calls
//       if (isUpdatingCheckoutPreview) {
//         return false;
//       }

//       setIsUpdatingCheckoutPreview(true);
//       lastCheckoutRequestRef.current = requestKey; // Set immediately to prevent duplicate

//       // Dispatch checkout preview action
//       const result = await dispatch(
//         checkoutPreviewAction(updatedRequest)
//       ).unwrap();

//       setCheckoutPreview(result);
//       setCheckoutRequest(updatedRequest);
//       checkoutRequestRef.current = updatedRequest; // Update ref

//       setHasShownInitialVoucherErrors(false);

//       // Save to sessionStorage
//       sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
//       sessionStorage.setItem("checkoutRequest", JSON.stringify(updatedRequest));

//       // Check for voucher application errors
//       let hasErrors = false;
//       const cleanedGlobalVouchers = [...globalVouchers];
//       let hasShownError = false;

//       if (result.voucherApplication) {
//         const voucherApp = result.voucherApplication;

//         // Check global vouchers errors - ALWAYS check, regardless of success flag
//         if (voucherApp.globalVouchers) {
//           const invalidVouchers =
//             voucherApp.globalVouchers.invalidVouchers || [];
//           const discountDetails =
//             voucherApp.globalVouchers.discountDetails || [];
//           const collectedErrors: Array<{ code: string; reason: string }> = [];

//           discountDetails.forEach((detail: any) => {
//             if (detail.valid === false || detail.valid === "false") {
//               let errorMsg = "";
//               if (detail.reason) {
//                 errorMsg = `${detail.voucherCode} không áp dụng được: ${detail.reason}`;
//               } else {
//                 errorMsg = `Voucher ${detail.voucherCode} không áp dụng được`;
//               }

//               // Store error for UI display
//               collectedErrors.push({
//                 code: detail.voucherCode,
//                 reason: detail.reason || "Không áp dụng được",
//               });

//               // Also show toast message
//               toast.error(errorMsg);
//               hasShownError = true;
//             }
//           });

//           // Update voucher errors state for UI display
//           if (collectedErrors.length > 0) {
//             setVoucherErrors(collectedErrors);
//           }

//           // STEP 2: If there are invalid vouchers in the list but not in discountDetails
//           if (invalidVouchers.length > 0) {
//             const coveredCodes = new Set(
//               discountDetails.map((d: any) => d.voucherCode)
//             );

//             invalidVouchers.forEach((code: string) => {
//               if (!coveredCodes.has(code)) {
//                 const errorMsg = `Voucher ${code} không áp dụng được`;
//                 toast.error(errorMsg);
//                 hasShownError = true;
//               }
//             });
//           }

//           // STEP 3: Fallback - if no errors shown but we have invalid vouchers
//           if (!hasShownError && invalidVouchers.length > 0) {
//             const errorMsg = `Voucher ${invalidVouchers[0]} không áp dụng được`;
//             toast.error(errorMsg);

//             // Store error for UI display
//             setVoucherErrors([
//               {
//                 code: invalidVouchers[0],
//                 reason: "Không áp dụng được",
//               },
//             ]);

//             hasShownError = true;
//           }

//           // STEP 4: Mark as error but DO NOT remove voucher or re-fetch
//           if (
//             invalidVouchers.length > 0 ||
//             discountDetails.some(
//               (d: any) => d.valid === false || d.valid === "false"
//             )
//           ) {
//             hasErrors = true;
//             setIsUpdatingCheckoutPreview(false);
//           } else {
//             // Clear errors if no invalid vouchers
//             setVoucherErrors([]);
//           }
//         }

//         if (voucherApp.success === false) {
//           if (voucherApp.shopResults) {
//             voucherApp.shopResults.forEach((shopResult: any) => {
//               if (
//                 shopResult.invalidVouchers &&
//                 shopResult.invalidVouchers.length > 0
//               ) {
//                 shopResult.invalidVouchers.forEach((code: string) => {
//                   const errorMsg = `Voucher shop ${code} không áp dụng được`;
//                   toast.error(errorMsg);
//                   hasShownError = true;
//                 });
//                 hasErrors = true;
//               }
//             });
//           }

//           // Check general errors
//           if (voucherApp.errors && voucherApp.errors.length > 0) {
//             voucherApp.errors.forEach((error: any) => {
//               const errorMsg =
//                 typeof error === "string"
//                   ? error
//                   : error.message || "Lỗi áp dụng voucher";

//               toast.error(errorMsg);
//               hasShownError = true;
//             });
//             hasErrors = true;
//           }

//           // ALWAYS show warnings if they exist (regardless of errors)
//           if (voucherApp.warnings && voucherApp.warnings.length > 0) {
//             voucherApp.warnings.forEach((warning: string) => {
//               toast.warning(warning);
//             });
//           }
//         } else {
//           const validVouchers = voucherApp.globalVouchers?.validVouchers || [];
//           const discountDetails =
//             voucherApp.globalVouchers?.discountDetails || [];
//           const hasValidDiscount = discountDetails.some(
//             (d: any) => d.valid === true && d.discountAmount > 0
//           );
//           if (validVouchers.length > 0 || hasValidDiscount) {
//             toast.success("Áp dụng voucher thành công!");
//           }
//         }
//       } else {
//       }

//       // Check if there are any valid vouchers applied successfully
//       const hasValidVouchers =
//         result.voucherApplication?.success === true ||
//         result.voucherApplication?.globalVouchers?.validVouchers?.length > 0 ||
//         result.voucherApplication?.globalVouchers?.discountDetails?.some(
//           (d: any) => d.valid === true && d.discountAmount > 0
//         );

//       return !hasErrors && hasValidVouchers;
//     } catch (error: any) {
//       console.error("❌ Error applying platform voucher:", error);
//       toast.error("Không thể áp dụng voucher");
//       lastCheckoutRequestRef.current = null;
//       return false;
//     } finally {
//       setIsUpdatingCheckoutPreview(false);
//     }
//   };

//   const calculateFinalGrandTotal = useCallback(() => {
//     if (!checkoutPreview) return 0;

//     const previewShippingFee = checkoutPreview.totalShippingFee || 0;
//     let currentShippingFee = previewShippingFee;

//     // Use shipping fee based on selected shipping method
//     if (shippingMethod === "GHN" && ghnShipmentPrice?.data?.total) {
//       currentShippingFee = Number(ghnShipmentPrice.data.total);
//     } else if (
//       shippingMethod === "CONKIN" &&
//       conkinShipmentPrice?.data?.priceTotal
//     ) {
//       currentShippingFee = conkinShipmentPrice.data.priceTotal;
//     } else if (conkinShipmentPrice?.data?.priceTotal) {
//       currentShippingFee = conkinShipmentPrice.data.priceTotal;
//     }

//     // Calculate: grandTotal - preview shipping fee + current shipping fee
//     const finalTotal =
//       checkoutPreview.grandTotal - previewShippingFee + currentShippingFee;

//     return finalTotal;
//   }, [checkoutPreview, conkinShipmentPrice, ghnShipmentPrice, shippingMethod]);

//   const getCurrentShippingFee = useCallback(() => {
//     if (!checkoutPreview?.shops) return 0;

//     return checkoutPreview.shops.reduce((total: number, shop: any) => {
//       const shopId = shop.shopId;
//       const selectedMethod = shopShipmentMethods[shopId]?.find(
//         (m: CostsShipmentResponse) =>
//           (m.serviceCompanyType?.toUpperCase() || "") ===
//           shopSelectedShippingMethod[shopId]?.toUpperCase()
//       );
//       const shopShippingFee = selectedMethod
//         ? getShipmentCost(selectedMethod)
//         : 0;
//       return total + shopShippingFee;
//     }, 0);
//   }, [checkoutPreview, shopShipmentMethods, shopSelectedShippingMethod]);

//   const handleSubmit = async (values: any) => {
//     setLoading(true);

//     try {
//       let shippingAddress: ShippingAddressInfo;
//       const buyerAddressId =
//         values.addressId ||
//         selectedAddressIdState ||
//         form.getFieldValue("addressId");

//       if (!buyerAddressId && !useNewAddress) {
//         toast.error("Vui lòng chọn địa chỉ giao hàng");
//         setLoading(false);
//         return;
//       }

//       if (!buyerAddressId && useNewAddress) {
//         toast.error("Vui lòng lưu địa chỉ mới trước khi đặt hàng");
//         setLoading(false);
//         return;
//       }

//       console.log(
//         "✅ Buyer Address ID:",
//         buyerAddressId,
//         "(addressId của địa chỉ người dùng đã chọn hoặc mới nhất)"
//       );

//       if (buyerAddressId && !useNewAddress) {
//         const selectedAddress = savedAddresses.find(
//           (addr) => addr.addressId === buyerAddressId
//         );

//         if (selectedAddress) {
//           const oldAddress = mapAddressToOldFormat(
//             selectedAddress.ward,
//             selectedAddress.province
//           );

//           console.log("🔍 Saved Address Mapping:", {
//             ward: selectedAddress.ward,
//             province: selectedAddress.province,
//             oldAddress,
//             found: !!oldAddress.old_ward_name,
//           });

//           shippingAddress = {
//             addressId: buyerAddressId,
//             ...(oldAddress.old_ward_name && {
//               districtNameOld: oldAddress.old_district_name,
//               provinceNameOld: oldAddress.old_province_name,
//               wardNameOld: oldAddress.old_ward_name,
//             }),
//           };
//         } else {
//           shippingAddress = {
//             addressId: buyerAddressId,
//           };
//         }
//       } else {
//         const oldAddress = mapAddressToOldFormat(values.ward, values.province);

//         console.log("🔍 New Address Mapping:", {
//           ward: values.ward,
//           province: values.province,
//           oldAddress,
//           found: !!oldAddress.old_ward_name,
//         });

//         shippingAddress = {
//           country: values.country || "VN",
//           state: values.province,
//           city: values.district,
//           postalCode: values.ward,
//           addressLine1: values.addressLine1,
//           addressLine2: values.addressLine2,
//           // Lưu old values từ ward_mappings (chỉ khi tìm thấy mapping)
//           ...(oldAddress.old_ward_name && {
//             districtNameOld: oldAddress.old_district_name,
//             provinceNameOld: oldAddress.old_province_name,
//             wardNameOld: oldAddress.old_ward_name,
//           }),
//         };
//       }

//       const orderRequest: OrderCreateRequest = {
//         shops:
//           checkoutRequest?.shops ||
//           checkoutPreview.shops.map((shop: any) => ({
//             shopId: shop.shopId,
//             itemIds: shop.items.map((item: any) => item.itemId),
//             vouchers: [],
//           })),
//         shippingMethod: values.shippingMethod || "CONKIN",
//         shippingAddress,
//         globalVouchers: values.globalVouchers || [],
//         paymentMethod: values.paymentMethod,
//         customerNote: values.customerNote,
//         buyerAddressId: buyerAddressId, // ✅ addressId của địa chỉ người dùng đã chọn (BuyerAddressEntity.addressId)
//       };

//       // Create order - returns OrderCreationResponse with orders + payment info
//       const response: OrderCreationResponse = await orderService.createOrder(
//         orderRequest
//       );
//       sessionStorage.removeItem("checkoutPreview");
//       sessionStorage.removeItem("checkoutRequest");
//       if (response.paymentInfo) {
//         const firstOrder = response.orders[0];
//         let initialPaymentId: string | null = null;

//         // Try to get paymentId by calling getPaymentStatusByOrder
//         try {
//           const initialPaymentStatus =
//             await paymentService.getPaymentStatusByOrder(firstOrder.orderId);
//           initialPaymentId = initialPaymentStatus.paymentId;
//         } catch (error) {}

//         // Convert to PayOSPaymentResponse format (for compatibility with existing component)
//         const paymentData: PayOSPaymentResponse = {
//           depositId: response.paymentInfo.depositId || "",
//           paymentLink: response.paymentInfo.paymentLink || "",
//           qrCode: response.paymentInfo.qrCode || "",
//           accountNumber: response.paymentInfo.accountNumber || "",
//           accountName: response.paymentInfo.accountName || "",
//           orderCode: response.paymentInfo.orderCode || "",
//           amount: response.paymentInfo.amount, // Backend already returns VND integer
//           currency: response.paymentInfo.currency || "VND",
//           description: response.paymentInfo.description || "",
//           expiredAt: response.paymentInfo.expiredAt
//             ? String(response.paymentInfo.expiredAt)
//             : undefined, // Pass expiration time as string
//         };

//         setPayosInfo(paymentData);
//         setSelectedOrder(firstOrder);
//         setPaymentId(initialPaymentId);
//         setPaymentExpiresAt(
//           response.paymentInfo.expiredAt
//             ? String(response.paymentInfo.expiredAt)
//             : null
//         );
//         setPayosModalVisible(true);
//       } else {
//         // For COD or other payment methods, show success modal
//         setOrderSuccess(response.orders);
//         setSuccessModalVisible(true);
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Không thể tạo đơn hàng");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseSuccessModal = () => {
//     setSuccessModalVisible(false);
//     // Redirect to orders page
//     router.push("/orders");
//   };

//   const stopPolling = useCallback(() => {
//     if (pollingIntervalRef.current) {
//       console.log("🛑 Stopping payment status polling");
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

//     console.log(
//       "🔄 Starting payment status polling for orderId:",
//       selectedOrder.orderId
//     );

//     // Poll payment status every 2 seconds
//     const interval = setInterval(async () => {
//       try {
//         console.log("🔍 Polling payment status...");

//         // Use paymentId if available, otherwise use orderId
//         let paymentStatus;
//         if (paymentId) {
//           console.log("📞 Using paymentId:", paymentId);
//           paymentStatus = await paymentService.getPaymentStatus(paymentId);
//         } else {
//           console.log("📞 Using orderId:", selectedOrder.orderId);
//           paymentStatus = await paymentService.getPaymentStatusByOrder(
//             selectedOrder.orderId
//           );
//           // Update paymentId if we got it from the response
//           if (paymentStatus.paymentId && !paymentId) {
//             console.log(
//               "✅ Got paymentId from response:",
//               paymentStatus.paymentId
//             );
//             setPaymentId(paymentStatus.paymentId);
//           }
//         }

//         console.log("📨 Payment status received:", paymentStatus);

//         // Check payment status
//         const status = paymentStatus.status?.toUpperCase();

//         if (
//           status === "SUCCEEDED" ||
//           status === "SUCCESS" ||
//           status === "PAID"
//         ) {
//           console.log("✅ Payment successful!");
//           clearInterval(interval);
//           pollingIntervalRef.current = null;
//           handlePaymentSuccess();
//         } else if (status === "FAILED" || status === "CANCELLED") {
//           console.log("❌ Payment failed or cancelled");
//           clearInterval(interval);
//           pollingIntervalRef.current = null;
//           toast.error("Thanh toán thất bại hoặc đã bị hủy");
//         }
//         // If status is PENDING or other, continue polling
//       } catch (error: any) {
//         console.error("❌ Error polling payment status:", error);
//         // Don't stop polling on error, continue trying
//         // Only stop if it's a permanent error (e.g., order not found)
//         if (error?.response?.status === 404) {
//           console.log("❌ Payment/Order not found, stopping polling");
//           clearInterval(interval);
//           pollingIntervalRef.current = null;
//         }
//       }
//     }, 15000); // Poll every 15 seconds

//     pollingIntervalRef.current = interval;

//     // Cleanup on unmount or when dependencies change
//     return () => {
//       console.log("🛑 Cleaning up payment status polling");
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

//   const formatRemain = (sec: number | null) => {
//     if (sec === null) return "";
//     const m = Math.floor(sec / 60);
//     const s = sec % 60;
//     const mm = m.toString().padStart(2, "0");
//     const ss = s.toString().padStart(2, "0");
//     return `${mm}:${ss}`;
//   };

//   if (!checkoutPreview) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Spin size="large" tip="Đang tải thông tin checkout..." />
//       </div>
//     );
//   }

//   const selectedItems = checkoutPreview.shops.flatMap(
//     (shop: any) => shop.items
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
//       <PageContentTransition>
//         <Content className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <CustomBreadcrumb
//             items={[
//               { title: "Trang chủ", href: "/" },
//               { title: "Giỏ hàng", href: "" },
//             ]}
//           />

//           <div className="mb-6 rounded-[12px] border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white">
//             <Steps
//               current={currentStep}
//               size="default"
//               responsive={false}
//               className="py-2"
//               items={[
//                 {
//                   title: <span className="hidden sm:inline">Giỏ hàng</span>,
//                   icon: <ShoppingCart />,
//                   status: "finish" as const,
//                 },
//                 {
//                   title: (
//                     <span className="hidden sm:inline">
//                       Thông tin giao hàng
//                     </span>
//                   ),
//                   icon: <MapPin />,
//                   status: isShippingInfoComplete
//                     ? ("finish" as const)
//                     : currentStep === 0
//                     ? ("process" as const)
//                     : ("wait" as const),
//                 },
//                 {
//                   title: <span className="hidden sm:inline">Thanh toán</span>,
//                   icon: <CreditCard />,
//                   status:
//                     isPaymentInfoComplete && isShippingInfoComplete
//                       ? currentStep === 2
//                         ? ("process" as const)
//                         : ("finish" as const)
//                       : isShippingInfoComplete
//                       ? ("process" as const)
//                       : ("wait" as const),
//                 },
//                 {
//                   title: <span className="hidden sm:inline">Hoàn tất</span>,
//                   icon: <CheckCircle2 />,
//                   status:
//                     orderSuccess || successModalVisible || payosModalVisible
//                       ? ("finish" as const)
//                       : currentStep === 3
//                       ? ("process" as const)
//                       : ("wait" as const),
//                 },
//               ]}
//             />
//           </div>

//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={handleSubmit}
//             initialValues={{
//               shippingMethod: "CONKIN",
//               paymentMethod: "COD",
//               country: "Vietnam",
//             }}
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//               {/* Left Column - Form */}
//               <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//                 {/* Shipping Address Display - Compact */}
//                 <div className="rounded-[12px] border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-2">
//                         <MapPin className="text-blue-600 text-base" />
//                         <p className="text-gray-900 text-sm">
//                           Địa chỉ giao hàng
//                         </p>
//                       </div>
//                       {(() => {
//                         // Lấy addressId từ form (có thể từ watch, state hoặc getFieldValue)
//                         const currentAddressId =
//                           addressId ||
//                           selectedAddressIdState ||
//                           form.getFieldValue("addressId");
//                         const selectedAddress = currentAddressId
//                           ? savedAddresses.find(
//                               (addr) => addr.addressId === currentAddressId
//                             )
//                           : null;

//                         if (selectedAddress) {
//                           return (
//                             <div className="space-y-1">
//                               <p className="text-gray-900 text-sm block">
//                                 {selectedAddress.recipientName || "Chưa có tên"}{" "}
//                                 |{" "}
//                                 {selectedAddress.phone ||
//                                   "Chưa có số điện thoại"}
//                               </p>
//                               <p className="text-gray-600 text-xs block line-clamp-2">
//                                 {selectedAddress.detailAddress ||
//                                   "Chưa có địa chỉ chi tiết"}
//                                 ,{" "}
//                                 {[
//                                   selectedAddress.ward,
//                                   selectedAddress.district,
//                                   selectedAddress.province,
//                                 ]
//                                   .filter(Boolean)
//                                   .join(", ") || "Chưa có địa chỉ"}
//                               </p>
//                             </div>
//                           );
//                         } else if (
//                           useNewAddress &&
//                           form.getFieldValue("recipientName")
//                         ) {
//                           const recipientName =
//                             form.getFieldValue("recipientName");
//                           const phone = form.getFieldValue("phoneNumber");
//                           const addressLine1 =
//                             form.getFieldValue("addressLine1");
//                           const ward = form.getFieldValue("ward");
//                           const district = form.getFieldValue("district");
//                           const province = form.getFieldValue("province");
//                           return (
//                             <div className="space-y-1">
//                               <p className="text-gray-900 text-sm block">
//                                 {recipientName || "Chưa có tên"} |{" "}
//                                 {phone || "Chưa có số điện thoại"}
//                               </p>
//                               <p className="text-gray-600 text-xs block line-clamp-2">
//                                 {addressLine1 || "Chưa có địa chỉ chi tiết"},{" "}
//                                 {[ward, district, province]
//                                   .filter(Boolean)
//                                   .join(", ") || "Chưa có địa chỉ"}
//                               </p>
//                             </div>
//                           );
//                         } else {
//                           return (
//                             <p className="text-gray-500 text-sm">
//                               Chưa chọn địa chỉ giao hàng
//                             </p>
//                           );
//                         }
//                       })()}
//                     </div>
//                     <Button
//                       type="link"
//                       onClick={() => setAddressModalVisible(true)}
//                       className="flex-shrink-0"
//                     >
//                       {addressId ||
//                       selectedAddressIdState ||
//                       form.getFieldValue("addressId") ||
//                       useNewAddress
//                         ? "Thay đổi"
//                         : "Chọn địa chỉ"}
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Order Summary - Moved to left column, below shipping address */}
//                 {checkoutPreview && (
//                   <Card
//                     title={
//                       <p className="text-gray-900 text-xl">
//                         2. Tóm tắt đơn hàng
//                       </p>
//                     }
//                     className="rounded-[12px] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.12)] bg-white"
//                   >
//                     <Space direction="vertical" size="large" className="w-full">
//                       <div className="space-y-6">
//                         {checkoutPreview.shops.map((shop: any) => (
//                           <div
//                             key={shop.shopId}
//                             className="space-y-4 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
//                           >
//                             <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
//                               <Store className="text-blue-600 text-base" />
//                               <p className="text-base text-gray-900">
//                                 {shop.shopName}
//                               </p>
//                               <Tag color="blue" className="text-xs ml-auto">
//                                 {shop.itemCount} SP
//                               </Tag>
//                             </div>

//                             <div className="space-y-2 pl-4">
//                               {shop.items.map((item: any) => (
//                                 <div
//                                   key={item.itemId}
//                                   className="flex gap-2 sm:gap-3 pb-2 border-b border-gray-100 last:border-0"
//                                 >
//                                   <img
//                                     src={
//                                       resolvePreviewItemImageUrl(
//                                         item.basePath,
//                                         item.extension,
//                                         "_thumb"
//                                       ) || "/placeholder-product.png"
//                                     }
//                                     alt={item.productName}
//                                     className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border flex-shrink-0"
//                                   />
//                                   <div className="flex-1 min-w-0">
//                                     <p className="text-gray-900 text-xs sm:text-sm font-medium block line-clamp-2 mb-1">
//                                       {item.productName}
//                                     </p>
//                                     {item.variantAttributes && (
//                                       <p className="text-[9px] sm:text-[11px] text-gray-500/80 italic block mb-0.5 leading-tight">
//                                         {item.variantAttributes}
//                                       </p>
//                                     )}
//                                     <div className="flex justify-between items-center">
//                                       <p className="text-gray-600 text-xs">
//                                         x{item.quantity}
//                                       </p>
//                                       <p className="text-gray-900 text-xs sm:text-sm">
//                                         {formatPrice(item.lineTotal)}
//                                       </p>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>

//                             {/* Shop Voucher */}
//                             <div className="pl-4">
//                               <div className="bg-blue-50/50 rounded-[10px] p-2.5 border border-blue-100">
//                                 <VoucherInput
//                                   compact
//                                   shopId={shop.shopId}
//                                   shopName={shop.shopName}
//                                   appliedVoucher={
//                                     shop.appliedVouchers &&
//                                     shop.appliedVouchers.length > 0
//                                       ? {
//                                           code: shop.appliedVouchers[0].code,
//                                           discount:
//                                             shop.appliedVouchers[0]
//                                               .discountAmount || 0,
//                                           description:
//                                             shop.appliedVouchers[0].description,
//                                         }
//                                       : undefined
//                                   }
//                                   context={
//                                     checkoutPreview
//                                       ? {
//                                           totalAmount:
//                                             shop.subtotal ||
//                                             checkoutPreview.subtotal,
//                                           shopIds: [shop.shopId],
//                                           productIds: shop.items
//                                             ?.map((item: any) => item.productId)
//                                             .filter(Boolean),
//                                           shippingFee:
//                                             shop.shippingFee ||
//                                             checkoutPreview.totalShippingFee,
//                                           shippingMethod:
//                                             shopSelectedShippingMethod[
//                                               shop.shopId
//                                             ],
//                                           shippingProvince: province,
//                                           shippingDistrict: district,
//                                           shippingWard: ward,
//                                           failedVoucherCodes: voucherErrors.map(
//                                             (e) => e.code
//                                           ),
//                                           preferences: {
//                                             scopes: ["SHOP_ORDER", "SHIPPING"],
//                                             limit: 6,
//                                           },
//                                         }
//                                       : undefined
//                                   }
//                                 />
//                               </div>
//                             </div>

//                             {/* Shop Shipping Method */}
//                             <div className="pl-4">
//                               <div className="bg-purple-50/50 rounded-[10px] p-2.5 border border-purple-100">
//                                 <p className="text-sm text-gray-900 block mb-2">
//                                   Phương thức vận chuyển
//                                 </p>
//                                 {loadingShopShipmentMethods[shop.shopId] ? (
//                                   <div className="flex items-center justify-center py-2">
//                                     <Spin size="small" className="mr-2" />
//                                     <p className="text-gray-500 text-xs">
//                                       Đang tải...
//                                     </p>
//                                   </div>
//                                 ) : shopShipmentMethods[shop.shopId] &&
//                                   shopShipmentMethods[shop.shopId].length >
//                                     0 ? (
//                                   <Radio.Group
//                                     value={
//                                       shopSelectedShippingMethod[shop.shopId]
//                                     }
//                                     onChange={(e: any) => {
//                                       setShopSelectedShippingMethod((prev) => ({
//                                         ...prev,
//                                         [shop.shopId]: e.target.value,
//                                       }));
//                                     }}
//                                     className="w-full"
//                                   >
//                                     <Space
//                                       direction="vertical"
//                                       className="w-full"
//                                     >
//                                       {shopShipmentMethods[shop.shopId].map(
//                                         (method, index) => {
//                                           const methodType =
//                                             method.serviceCompanyType?.toUpperCase() ||
//                                             "";
//                                           const methodValue =
//                                             methodType || `METHOD_${index}`;
//                                           const methodName =
//                                             getShipmentMethodName(
//                                               method.serviceCompanyType
//                                             );
//                                           const methodCost =
//                                             getShipmentCost(method);
//                                           const isConkin =
//                                             methodType === "CONKIN";
//                                           const isDisabled =
//                                             isConkin && !isForeignCountry;

//                                           return (
//                                             <Radio
//                                               key={methodValue}
//                                               value={methodValue}
//                                               disabled={isDisabled}
//                                             >
//                                               <Space>
//                                                 <p
//                                                   className={
//                                                     isDisabled
//                                                       ? "text-gray-400 text-xs"
//                                                       : "text-xs"
//                                                   }
//                                                 >
//                                                   {methodName}
//                                                 </p>
//                                                 {isConkin &&
//                                                   !isForeignCountry && (
//                                                     <Tag
//                                                       color="orange"
//                                                       className="ml-2 text-xs"
//                                                     >
//                                                       Chỉ dành cho người sống
//                                                       ngoài nước
//                                                     </Tag>
//                                                   )}
//                                                 {methodCost > 0 && (
//                                                   <p
//                                                     className={
//                                                       isDisabled
//                                                         ? "text-gray-400 text-xs"
//                                                         : "text-green-600 text-xs"
//                                                     }
//                                                   >
//                                                     - {formatPrice(methodCost)}
//                                                   </p>
//                                                 )}
//                                               </Space>
//                                             </Radio>
//                                           );
//                                         }
//                                       )}
//                                     </Space>
//                                   </Radio.Group>
//                                 ) : (
//                                   <p className="text-gray-500 text-xs">
//                                     Chưa có phương thức vận chuyển
//                                   </p>
//                                 )}
//                               </div>
//                             </div>

//                             {/* Shop Total */}
//                             <div className="pl-4 pt-2 border-t border-gray-100">
//                               <div className="flex justify-between items-center">
//                                 <p className="text-gray-700 text-sm">
//                                   Tạm tính:
//                                 </p>
//                                 <p className="text-gray-900 text-base font-semibold">
//                                   {formatPrice(shop.subtotal || 0)}
//                                 </p>
//                               </div>
//                               {shop.discountAmount > 0 && (
//                                 <div className="flex justify-between items-center mt-1">
//                                   <p className="text-gray-600 text-xs">
//                                     Giảm giá:
//                                   </p>
//                                   <p className="text-red-600 text-sm font-semibold">
//                                     -{formatPrice(shop.discountAmount)}
//                                   </p>
//                                 </div>
//                               )}
//                               <div className="flex justify-between items-center mt-1">
//                                 <p className="text-gray-600 text-xs">
//                                   Phí vận chuyển:
//                                 </p>
//                                 <p className="text-gray-700 text-sm">
//                                   {(() => {
//                                     const selectedMethod = shopShipmentMethods[
//                                       shop.shopId
//                                     ]?.find(
//                                       (m: CostsShipmentResponse) =>
//                                         (m.serviceCompanyType?.toUpperCase() ||
//                                           "") ===
//                                         shopSelectedShippingMethod[
//                                           shop.shopId
//                                         ]?.toUpperCase()
//                                     );
//                                     return selectedMethod
//                                       ? formatPrice(
//                                           getShipmentCost(selectedMethod)
//                                         )
//                                       : formatPrice(0);
//                                   })()}
//                                 </p>
//                               </div>
//                               <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
//                                 <p className="text-gray-900 text-base">Tổng:</p>
//                                 <p className="text-red-600 text-lg font-bold">
//                                   {formatPrice(
//                                     (shop.subtotal || 0) -
//                                       (shop.discountAmount || 0) +
//                                       (() => {
//                                         const selectedMethod =
//                                           shopShipmentMethods[
//                                             shop.shopId
//                                           ]?.find(
//                                             (m: CostsShipmentResponse) =>
//                                               (m.serviceCompanyType?.toUpperCase() ||
//                                                 "") ===
//                                               shopSelectedShippingMethod[
//                                                 shop.shopId
//                                               ]?.toUpperCase()
//                                           );
//                                         return selectedMethod
//                                           ? getShipmentCost(selectedMethod)
//                                           : 0;
//                                       })()
//                                   )}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </Space>
//                   </Card>
//                 )}
//               </div>

//               {/* Right Column - Payment Method, Platform Voucher, Total - Improved Sticky */}
//               <div className="lg:col-span-1">
//                 <div className="lg:sticky lg:top-6 lg:z-10 space-y-4 sm:space-y-6">
//                   {/* Payment Method */}
//                   <Card
//                     title={
//                       <Space>
//                         <div className="bg-green-50 rounded-lg p-2">
//                           <CreditCard className="text-green-600 text-lg" />
//                         </div>
//                         <p className="text-gray-900 text-lg">
//                           Hình thức thanh toán
//                         </p>
//                       </Space>
//                     }
//                     className="rounded-[12px] border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white"
//                   >
//                     <Form.Item
//                       name="paymentMethod"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng chọn phương thức thanh toán",
//                         },
//                       ]}
//                     >
//                       <Radio.Group className="w-full">
//                         <Space
//                           direction="vertical"
//                           className="w-full"
//                           size="middle"
//                         >
//                           <Radio value="COD">
//                             <div className="flex items-center gap-3">
//                               <div className="bg-green-100 rounded-lg p-2">
//                                 <svg
//                                   className="w-6 h-6 text-green-600"
//                                   fill="currentColor"
//                                   viewBox="0 0 20 20"
//                                 >
//                                   <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
//                                   />
//                                 </svg>
//                               </div>
//                               <div>
//                                 <p className="text-gray-900 block">
//                                   Thanh toán khi nhận hàng (COD)
//                                 </p>
//                                 <p className="text-gray-600 text-sm">
//                                   Thanh toán bằng tiền mặt khi nhận hàng
//                                 </p>
//                               </div>
//                             </div>
//                           </Radio>
//                           <Radio value="VNPAY">
//                             <div className="flex items-center gap-3">
//                               <div className="bg-blue-100 rounded-lg p-2">
//                                 <CreditCard className="text-2xl text-blue-600" />
//                               </div>
//                               <div>
//                                 <p className="text-gray-900 block">VNPay</p>
//                                 <p className="text-gray-600 text-sm">
//                                   Thanh toán qua VNPay
//                                 </p>
//                               </div>
//                             </div>
//                           </Radio>
//                           <Radio value="MOMO">
//                             <div className="flex items-center gap-3">
//                               <div className="bg-pink-100 rounded-lg p-2">
//                                 <svg
//                                   className="w-6 h-6 text-pink-600"
//                                   fill="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <circle cx="12" cy="12" r="10" />
//                                 </svg>
//                               </div>
//                               <div>
//                                 <p className="text-gray-900 block">MoMo</p>
//                                 <p className="text-gray-600 text-sm">
//                                   Thanh toán qua ví MoMo
//                                 </p>
//                               </div>
//                             </div>
//                           </Radio>
//                           <Radio value="PAYOS">
//                             <div className="flex items-center gap-3">
//                               <div className="bg-indigo-100 rounded-lg p-2">
//                                 <svg
//                                   className="w-6 h-6 text-indigo-600"
//                                   fill="currentColor"
//                                   viewBox="0 0 20 20"
//                                 >
//                                   <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                               </div>
//                               <div>
//                                 <p className="text-gray-900 block">
//                                   Chuyển khoản ngân hàng
//                                 </p>
//                                 <p className="text-gray-600 text-sm">
//                                   Thanh toán qua QR Code hoặc chuyển khoản
//                                 </p>
//                               </div>
//                             </div>
//                           </Radio>
//                         </Space>
//                       </Radio.Group>
//                     </Form.Item>
//                   </Card>

//                   {/* Note */}
//                   <div
//                     title={
//                       <Space>
//                         <div className="bg-gray-50 rounded-lg p-2">
//                           <svg
//                             className="w-5 h-5 text-gray-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                             />
//                           </svg>
//                         </div>
//                         <p className="text-gray-900 text-lg">
//                           Ghi chú đơn hàng (Tùy chọn)
//                         </p>
//                       </Space>
//                     }
//                     className="rounded-[12px] border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white"
//                   >
//                     <Form.Item name="customerNote">
//                       <p
//                         aria-describedby="note-description"
//                         className="text-gray-600 text-sm mb-2"
//                         id="note-description"
//                       >
//                         Bạn có thể để lại ghi chú cho người bán về đơn hàng này.
//                       </p>
//                       <Input.TextArea
//                         rows={4}
//                         placeholder="Ghi chú cho người bán..."
//                         maxLength={1000}
//                         showCount
//                       />
//                     </Form.Item>
//                   </div>

//                   {/* Platform Voucher Section */}
//                   {checkoutPreview && (
//                     <div
//                       title={
//                         <p className="text-gray-900 text-xl">
//                           Voucher toàn sàn
//                         </p>
//                       }
//                       className="rounded-[12px] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.12)] bg-white"
//                     >
//                       <Space
//                         direction="vertical"
//                         size="large"
//                         className="w-full"
//                       >
//                         <div className="bg-orange-50/50 rounded-[10px] p-2.5 border border-orange-100">
//                           {voucherErrors.length > 0 && (
//                             <Alert
//                               type="error"
//                               message="Voucher không áp dụng được"
//                               description={
//                                 <div className="space-y-1 mt-2">
//                                   {voucherErrors.map((error, index) => (
//                                     <div key={index} className="text-sm">
//                                       <p className="text-red-600">
//                                         {error.code}:
//                                       </p>{" "}
//                                       <p className="text-red-600">
//                                         {error.reason}
//                                       </p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               }
//                               closable
//                               onClose={() => setVoucherErrors([])}
//                               className="mb-3"
//                               showIcon
//                             />
//                           )}
//                           <VoucherInput
//                             compact
//                             onSelectVoucher={handleSelectPlatformVoucher as any}
//                             context={
//                               checkoutPreview
//                                 ? {
//                                     totalAmount: checkoutPreview.subtotal,
//                                     shopIds: checkoutPreview.shops
//                                       ?.map((s: any) => s.shopId)
//                                       .filter(Boolean),
//                                     productIds: checkoutPreview.shops?.flatMap(
//                                       (s: any) =>
//                                         s.items
//                                           ?.map((item: any) => item.productId)
//                                           .filter(Boolean) || []
//                                     ),
//                                     shippingFee:
//                                       checkoutPreview.totalShippingFee,
//                                     shippingMethod:
//                                       checkoutRequest?.shippingMethod,
//                                     shippingProvince: province,
//                                     shippingDistrict: district,
//                                     shippingWard: ward,
//                                     failedVoucherCodes: voucherErrors.map(
//                                       (e) => e.code
//                                     ),
//                                     preferences: {
//                                       scopes: ["SHOP_ORDER", "SHIPPING"],
//                                       limit: 6,
//                                     },
//                                   }
//                                 : undefined
//                             }
//                             appliedVouchers={(() => {
//                               if (!checkoutPreview) {
//                                 return undefined;
//                               }

//                               // Check voucherApplication for applied vouchers
//                               const voucherApp =
//                                 checkoutPreview.voucherApplication;
//                               const result: any = {
//                                 order: undefined,
//                                 shipping: undefined,
//                               };

//                               // Method 1: Check globalVouchers array (if it's an array of objects)
//                               if (
//                                 checkoutPreview.globalVouchers &&
//                                 Array.isArray(checkoutPreview.globalVouchers)
//                               ) {
//                                 const globalVouchers =
//                                   checkoutPreview.globalVouchers;

//                                 // Check if it's array of objects or strings
//                                 if (
//                                   globalVouchers.length > 0 &&
//                                   typeof globalVouchers[0] === "object"
//                                 ) {
//                                   const orderVoucher = globalVouchers.find(
//                                     (v: any) =>
//                                       v.voucherScope === "PRODUCT" ||
//                                       v.voucherScope === "SHOP_ORDER" ||
//                                       v.voucherScope === "ORDER"
//                                   );
//                                   const shippingVoucher = globalVouchers.find(
//                                     (v: any) => v.voucherScope === "SHIPPING"
//                                   );

//                                   result.order = orderVoucher
//                                     ? {
//                                         code:
//                                           orderVoucher.code ||
//                                           orderVoucher.voucherCode,
//                                         discount:
//                                           orderVoucher.discountAmount ||
//                                           orderVoucher.discountValue ||
//                                           orderVoucher.discount ||
//                                           0,
//                                         description:
//                                           orderVoucher.description ||
//                                           orderVoucher.name,
//                                       }
//                                     : undefined;

//                                   result.shipping = shippingVoucher
//                                     ? {
//                                         code:
//                                           shippingVoucher.code ||
//                                           shippingVoucher.voucherCode,
//                                         discount:
//                                           shippingVoucher.discountAmount ||
//                                           shippingVoucher.discountValue ||
//                                           shippingVoucher.discount ||
//                                           0,
//                                         description:
//                                           shippingVoucher.description ||
//                                           shippingVoucher.name,
//                                       }
//                                     : undefined;
//                                 }
//                               }

//                               // Method 2: Check voucherApplication.globalVouchers.discountDetails
//                               if (voucherApp && voucherApp.globalVouchers) {
//                                 const discountDetails =
//                                   voucherApp.globalVouchers.discountDetails ||
//                                   [];
//                                 const validVouchers =
//                                   voucherApp.globalVouchers.validVouchers || [];
//                                 const invalidVouchers =
//                                   voucherApp.globalVouchers.invalidVouchers ||
//                                   [];

//                                 // Only show vouchers that are valid (not in invalidVouchers list)
//                                 // Map valid vouchers from discountDetails (valid: true)
//                                 discountDetails.forEach((detail: any) => {
//                                   // Check if voucher is valid AND not in invalidVouchers list
//                                   const isInvalid = invalidVouchers.includes(
//                                     detail.voucherCode
//                                   );
//                                   const isValid =
//                                     detail.valid === true &&
//                                     !isInvalid &&
//                                     detail.discountAmount > 0;

//                                   if (isValid) {
//                                     // Check discountTarget to determine type
//                                     if (
//                                       detail.discountTarget === "ORDER" ||
//                                       detail.discountTarget === "PRODUCT"
//                                     ) {
//                                       result.order = {
//                                         code: detail.voucherCode,
//                                         discount: detail.discountAmount || 0,
//                                         description: `Giảm ${formatPrice(
//                                           detail.discountAmount || 0
//                                         )}`,
//                                       };
//                                     } else if (
//                                       detail.discountTarget === "SHIPPING"
//                                     ) {
//                                       result.shipping = {
//                                         code: detail.voucherCode,
//                                         discount: detail.discountAmount || 0,
//                                         description: `Giảm ${formatPrice(
//                                           detail.discountAmount || 0
//                                         )}`,
//                                       };
//                                     }
//                                   }
//                                 });

//                                 // If we have validVouchers array and voucherApplication.success === true
//                                 // but no details with valid: true, try to get from checkoutRequest
//                                 if (
//                                   voucherApp.success === true &&
//                                   validVouchers.length > 0 &&
//                                   !result.order &&
//                                   !result.shipping
//                                 ) {
//                                   const requestVouchers =
//                                     checkoutRequest?.globalVouchers || [];

//                                   // Match valid vouchers with request vouchers
//                                   validVouchers.forEach((code: string) => {
//                                     if (
//                                       requestVouchers.includes(code) &&
//                                       !invalidVouchers.includes(code)
//                                     ) {
//                                       // Try to find in discountDetails
//                                       const detail = discountDetails.find(
//                                         (d: any) => d.voucherCode === code
//                                       );
//                                       if (detail) {
//                                         // Only use if not invalid
//                                         if (
//                                           detail.discountTarget === "ORDER" ||
//                                           detail.discountTarget === "PRODUCT"
//                                         ) {
//                                           result.order = {
//                                             code: detail.voucherCode,
//                                             discount:
//                                               detail.discountAmount || 0,
//                                             description: `Voucher ${detail.voucherCode}`,
//                                           };
//                                         } else if (
//                                           detail.discountTarget === "SHIPPING"
//                                         ) {
//                                           result.shipping = {
//                                             code: detail.voucherCode,
//                                             discount:
//                                               detail.discountAmount || 0,
//                                             description: `Voucher ${detail.voucherCode}`,
//                                           };
//                                         }
//                                       }
//                                     }
//                                   });
//                                 }
//                               }

//                               // Method 2c: If voucherApplication.success === true and we have validVouchers,
//                               // but still no result, check checkoutRequest.globalVouchers
//                               if (voucherApp && voucherApp.success === true) {
//                                 const validVouchers =
//                                   voucherApp.globalVouchers?.validVouchers ||
//                                   [];
//                                 const invalidVouchers =
//                                   voucherApp.globalVouchers?.invalidVouchers ||
//                                   [];

//                                 if (
//                                   validVouchers.length > 0 &&
//                                   !result.order &&
//                                   !result.shipping
//                                 ) {
//                                   const requestVouchers =
//                                     checkoutRequest?.globalVouchers || [];

//                                   // Show valid vouchers from request (even without full details)
//                                   validVouchers.forEach((code: string) => {
//                                     if (
//                                       requestVouchers.includes(code) &&
//                                       !invalidVouchers.includes(code)
//                                     ) {
//                                       // Default to order type if we don't know
//                                       if (!result.order) {
//                                         result.order = {
//                                           code: code,
//                                           discount: 0, // Will be updated when we have details
//                                           description: `Voucher ${code}`,
//                                         };
//                                       }
//                                     }
//                                   });
//                                 }
//                               }

//                               // Method 2b: If still no result, check checkoutRequest.globalVouchers
//                               if (
//                                 !result.order &&
//                                 !result.shipping &&
//                                 checkoutRequest &&
//                                 checkoutRequest.globalVouchers
//                               ) {
//                                 const requestVouchers =
//                                   checkoutRequest.globalVouchers;
//                                 // If we have voucher codes in request, show them (even if we don't have full details)
//                                 // This ensures user sees that vouchers were selected
//                                 if (requestVouchers.length > 0) {
//                                   // Try to get voucher info from the last selected vouchers
//                                   // This is a fallback - ideally we should have details from voucherApplication
//                                   console.log(
//                                     "⚠️ Vouchers in request but no details found:",
//                                     requestVouchers
//                                   );
//                                 }
//                               }

//                               // Method 3: Check from price summary section (if vouchers are applied, they show in discount breakdown)
//                               // This is already handled in the price summary section below

//                               console.log(
//                                 "✅ Mapped Applied Vouchers:",
//                                 result
//                               );
//                               return result.order || result.shipping
//                                 ? result
//                                 : undefined;
//                             })()}
//                           />
//                         </div>

//                         <Divider className="my-0" />

//                         {/* Price Summary - Detailed Breakdown */}
//                         <div className="space-y-2">
//                           <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
//                             <p className="text-gray-700 text-sm font-medium">
//                               Tạm tính ({checkoutPreview.totalItems} SP)
//                             </p>
//                             <p className="text-gray-900 text-base font-semibold">
//                               {formatPrice(checkoutPreview.subtotal)}
//                             </p>
//                           </div>

//                           {/* Product Discount */}
//                           {checkoutPreview.totalDiscount > 0 && (
//                             <div className="flex justify-between items-center py-1.5">
//                               <Space size="small">
//                                 <Tag className="text-red-500 text-xs" />
//                                 <p className="text-gray-600 text-xs">
//                                   Giảm giá sản phẩm
//                                 </p>
//                               </Space>
//                               <p className="text-red-600 text-sm font-semibold">
//                                 -{formatPrice(checkoutPreview.totalDiscount)}
//                               </p>
//                             </div>
//                           )}

//                           <div className="flex justify-between">
//                             <p className="text-gray-700">Phí vận chuyển</p>
//                             <p className="text-gray-900 font-medium">
//                               {formatPrice(getCurrentShippingFee())}
//                             </p>
//                           </div>

//                           {/* Tax */}
//                           {checkoutPreview.totalTaxAmount &&
//                             checkoutPreview.totalTaxAmount > 0 && (
//                               <div className="flex justify-between items-center py-1.5">
//                                 <p className="text-gray-600 text-xs">VAT</p>
//                                 <p className="text-gray-700 text-sm">
//                                   {formatPrice(checkoutPreview.totalTaxAmount)}
//                                 </p>
//                               </div>
//                             )}
//                         </div>

//                         <Divider className="my-0 border-dashed" />

//                         {/* Total - Improved */}
//                         <div className="bg-gradient-to-r from-orange-50 to-red-50 -mx-6 px-6 py-4 rounded-[10px] border border-orange-100">
//                           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
//                             <p
//                               strong
//                               className="text-lg sm:text-xl text-gray-900 font-semibold"
//                             >
//                               Tổng thanh toán
//                             </p>
//                             <h1
//                               level={2}
//                               className="mb-0 text-red-600 text-2xl sm:text-3xl font-bold"
//                             >
//                               {formatPrice(calculateFinalGrandTotal())}
//                             </h1>
//                           </div>
//                         </div>

//                         {/* Submit Button */}
//                         <Button
//                           type="primary"
//                           size="large"
//                           block
//                           htmlType="submit"
//                           loading={loading}
//                           icon={<CheckCircle2 />}
//                           className="h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 border-0"
//                         >
//                           Đặt hàng
//                         </Button>

//                         <p className="text-gray-600 text-xs text-center block px-2">
//                           Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng
//                           của chúng tôi
//                         </p>
//                       </Space>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </Form>
//         </Content>
//       </PageContentTransition>

//       {/* Success Modal */}
//       <Modal
//         open={successModalVisible}
//         onCancel={handleCloseSuccessModal}
//         footer={null}
//         width={800}
//         centered
//         closable={false}
//       >
//         <div className="text-center py-6">
//           {/* Success Icon */}
//           <div className="mb-6">
//             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
//               <CheckCircle2 className="text-5xl text-green-600" />
//             </div>
//             <h1 className="mb-2 text-green-600">Đặt hàng thành công!</h1>
//             <p className="text-gray-600 text-base">
//               Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
//             </p>
//           </div>

//           {/* Order List */}
//           {orderSuccess && orderSuccess.length > 0 && (
//             <div className="space-y-4 mb-6">
//               {orderSuccess.map((order: any) => (
//                 <div
//                   key={order.orderId}
//                   className="text-left shadow-sm border border-gray-200"
//                 >
//                   <Space direction="vertical" className="w-full" size="middle">
//                     {/* Order Header */}
//                     <div className="flex justify-between items-center pb-3 border-b">
//                       <div>
//                         <p className="text-base text-gray-900 block">
//                           Mã đơn hàng:{" "}
//                           <span className="text-blue-600">
//                             {order.orderNumber}
//                           </span>
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {new Date(order.createdAt).toLocaleString("vi-VN")}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-xs text-gray-600 mb-1">
//                           Trạng thái
//                         </div>
//                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                           {order.status === "CREATED" ? "Đã tạo" : order.status}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Order Items */}
//                     <div className="space-y-2">
//                       <p className="text-sm text-gray-700">Sản phẩm đã đặt:</p>
//                       {order.items?.map((item: any) => (
//                         <div
//                           key={item.itemId}
//                           className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
//                         >
//                           <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
//                             {resolvePreviewItemImageUrl(
//                               item.basePath,
//                               item.extension,
//                               "_thumb"
//                             ) ? (
//                               <img
//                                 src={resolvePreviewItemImageUrl(
//                                   item.basePath,
//                                   item.extension,
//                                   "_thumb"
//                                 )}
//                                 alt={item.productName}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <ShoppingCart className="text-2xl text-gray-400" />
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p
//                               strong
//                               className="text-sm text-gray-900 block truncate"
//                             >
//                               {item.productName}
//                             </p>
//                             {item.variantAttributes && (
//                               <p className="text-xs text-gray-500/80 italic block leading-tight">
//                                 {item.variantAttributes}
//                               </p>
//                             )}
//                             <p className="text-xs text-gray-600">
//                               SKU: {item.sku}
//                             </p>
//                             <div className="flex items-center gap-3 mt-1">
//                               <p className="text-xs text-gray-600">
//                                 {formatPrice(item.unitPrice)} x {item.quantity}
//                               </p>
//                               <p className="text-sm text-blue-600">
//                                 = {formatPrice(item.lineTotal)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Order Summary */}
//                     <div className="pt-3 border-t space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <p className="text-gray-600">
//                           Tạm tính ({order.itemCount} SP)
//                         </p>
//                         <p className="text-gray-900">
//                           {formatPrice(order.subtotal)}
//                         </p>
//                       </div>
//                       {order.totalDiscount > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <p className="text-gray-600">Giảm giá</p>
//                           <p className="text-red-600">
//                             -{formatPrice(order.totalDiscount)}
//                           </p>
//                         </div>
//                       )}
//                       <div className="flex justify-between text-sm">
//                         <p className="text-gray-600">Phí vận chuyển</p>
//                         <p className="text-gray-900">
//                           {formatPrice(order.shippingFee)}
//                         </p>
//                       </div>
//                       <Divider className="my-2" />
//                       <div className="flex justify-between items-center">
//                         <h4 className="text-base text-gray-900 font-semibold">
//                           Tổng thanh toán
//                         </h4>
//                         <h4 className="mb-0 text-red-600">
//                           {formatPrice(order.grandTotal)}
//                         </h4>
//                       </div>
//                     </div>

//                     {/* Payment Method */}
//                     {order.paymentMethod && (
//                       <div className="pt-2 border-t">
//                         <p className="text-sm text-gray-600">
//                           Phương thức thanh toán:{" "}
//                           <p className="text-gray-900">{order.paymentMethod}</p>
//                         </p>
//                       </div>
//                     )}

//                     {/* Customer Note */}
//                     {order.customerNote && (
//                       <div className="pt-2 border-t">
//                         <p className="text-sm text-gray-600 block mb-1">
//                           Ghi chú:
//                         </p>
//                         <p className="text-sm text-gray-900">
//                           {order.customerNote}
//                         </p>
//                       </div>
//                     )}
//                   </Space>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Summary Stats */}
//           {orderSuccess && orderSuccess.length > 0 && (
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <div className="bg-blue-50 rounded-lg p-4">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {orderSuccess.reduce(
//                     (sum: number, order: any) => sum + order.itemCount,
//                     0
//                   )}
//                 </div>
//                 <div className="text-xs text-gray-600 mt-1">Tổng sản phẩm</div>
//               </div>
//               <div className="bg-green-50 rounded-lg p-4">
//                 <div className="text-2xl font-bold text-green-600">
//                   {orderSuccess.length}
//                 </div>
//                 <div className="text-xs text-gray-600 mt-1">Đơn hàng</div>
//               </div>
//               <div className="bg-orange-50 rounded-lg p-4">
//                 <div className="text-xl font-bold text-orange-600">
//                   {formatPrice(
//                     orderSuccess.reduce(
//                       (sum: number, order: any) => sum + order.grandTotal,
//                       0
//                     )
//                   )}
//                 </div>
//                 <div className="text-xs text-gray-600 mt-1">Tổng tiền</div>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-3 justify-center">
//             <Button
//               size="large"
//               onClick={handleCloseSuccessModal}
//               className="min-w-[150px]"
//             >
//               Xem đơn hàng
//             </Button>
//             <Button
//               type="primary"
//               size="large"
//               onClick={() => router.push("/")}
//               className="min-w-[150px]"
//             >
//               Tiếp tục mua sắm
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* PayOS QR Code Modal */}
//       <Modal
//         open={payosModalVisible}
//         onCancel={handleClosePayosModal}
//         footer={null}
//         width={600}
//         centered
//         closable={!!payosInfo} // Only allow close after QR is loaded
//         title={
//           <div className="text-center pb-4 border-b">
//             <CheckCircle2 className="text-4xl text-green-600 mb-2" />
//             <h3 className="mb-1">
//               {payosInfo ? "Thanh toán đơn hàng" : "Đang xử lý đơn hàng..."}
//             </h3>
//             <p className="text-gray-600">
//               {payosInfo
//                 ? "Vui lòng quét mã QR để hoàn tất thanh toán"
//                 : "Vui lòng chờ trong giây lát"}
//             </p>
//           </div>
//         }
//       >
//         {selectedOrder ? (
//           <div className="py-4">
//             {/* Order Info */}
//             <div className="mb-4 p-4 bg-blue-50 rounded-lg">
//               <div className="flex justify-between items-center mb-2">
//                 <p className="text-gray-700">Mã đơn hàng:</p>
//                 <p className="text-blue-600">{selectedOrder.orderNumber}</p>
//               </div>
//               <div className="flex justify-between items-center">
//                 <p className="text-gray-700">Số tiền:</p>
//                 <p className="text-red-600 text-lg">
//                   {new Intl.NumberFormat("vi-VN", {
//                     style: "currency",
//                     currency: "VND",
//                     minimumFractionDigits: 0,
//                     maximumFractionDigits: 0,
//                   }).format(selectedOrder.grandTotal)}
//                 </p>
//               </div>
//               {remainingSeconds !== null && (
//                 <div className="flex justify-between items-center mt-2">
//                   <p className="text-gray-700">Hết hạn sau:</p>
//                   <p
//                     className={
//                       remainingSeconds <= 30 ? "text-red-600" : "text-gray-900"
//                     }
//                   >
//                     {formatRemain(remainingSeconds)}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* QR Code Payment Component or Loading */}
//             {payosInfo ? (
//               <PayOSQRPayment
//                 orderId={selectedOrder.orderId}
//                 orderNumber={selectedOrder.orderNumber}
//                 amount={selectedOrder.grandTotal}
//                 onCancelPayment={handleClosePayosModal}
//                 onRefresh={handlePaymentSuccess}
//               />
//             ) : (
//               <div className="text-center py-12">
//                 <Spin size="large" />
//                 <div className="mt-4">
//                   <p className="text-gray-600 block">
//                     Đang tạo mã QR thanh toán...
//                   </p>
//                   <p className="text-gray-500 text-sm block mt-2">
//                     Quá trình này có thể mất vài giây
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
//           </div>
//         )}
//       </Modal>

//       {/* Modal chọn địa chỉ đã lưu */}
//       <Modal
//         title="Địa chỉ giao hàng"
//         open={addressModalVisible}
//         onCancel={() => {
//           setAddressModalVisible(false);
//           setUseNewAddress(false);
//         }}
//         footer={null}
//         width={700}
//         afterOpenChange={(open: any) => {
//           if (open) {
//             const currentAddressId =
//               addressId ||
//               selectedAddressIdState ||
//               form.getFieldValue("addressId");
//             if (currentAddressId && !useNewAddress) {
//               form.setFieldValue("addressId", currentAddressId);
//             }
//           }
//         }}
//       >
//         <Tabs
//           defaultActiveKey={useNewAddress ? "new" : "saved"}
//           onChange={(key: any) => {
//             setUseNewAddress(key === "new");
//             if (key === "new") {
//               // Clear addressId khi chuyển sang tab thêm mới
//               form.setFieldValue("addressId", undefined);
//             }
//           }}
//           items={[
//             {
//               key: "saved",
//               label: `Địa chỉ đã lưu (${savedAddresses.length})`,
//               children: (
//                 <div className="space-y-4">
//                   {savedAddresses.length > 0 ? (
//                     <>
//                       <Form.Item
//                         name="addressId"
//                         rules={[
//                           {
//                             required: !useNewAddress,
//                             message: "Vui lòng chọn địa chỉ",
//                           },
//                         ]}
//                       >
//                         <Radio.Group
//                           className="w-full"
//                           value={form.getFieldValue("addressId")}
//                           onChange={(e: any) => {
//                             form.setFieldValue("addressId", e.target.value);
//                           }}
//                         >
//                           <Space
//                             direction="vertical"
//                             className="w-full"
//                             size="middle"
//                           >
//                             {savedAddresses.map((addr, index) => (
//                               <Radio
//                                 key={addr.addressId}
//                                 value={addr.addressId}
//                                 className="w-full"
//                               >
//                                 <div className="w-full ml-6 hover:border-blue-400 transition-colors">
//                                   <div className="flex justify-between items-start">
//                                     <div className="flex-1">
//                                       <p className="text-gray-900 text-sm block mb-1">
//                                         {addr.recipientName || "Chưa có tên"} |{" "}
//                                         {addr.phone || "Chưa có số điện thoại"}
//                                       </p>
//                                       <p className="text-gray-600 text-xs block">
//                                         {addr.detailAddress ||
//                                           "Chưa có địa chỉ chi tiết"}
//                                         ,{" "}
//                                         {[
//                                           addr.ward,
//                                           addr.district,
//                                           addr.province,
//                                         ]
//                                           .filter(Boolean)
//                                           .join(", ") || "Chưa có địa chỉ"}
//                                       </p>
//                                     </div>
//                                     {index === 0 && (
//                                       <Tag color="green" className="ml-2">
//                                         Mới nhất
//                                       </Tag>
//                                     )}
//                                   </div>
//                                 </div>
//                               </Radio>
//                             ))}
//                           </Space>
//                         </Radio.Group>
//                       </Form.Item>
//                       <div className="flex justify-end gap-2">
//                         <Button onClick={() => setAddressModalVisible(false)}>
//                           Hủy
//                         </Button>
//                         <Button
//                           type="primary"
//                           onClick={async () => {
//                             const selectedAddressId =
//                               form.getFieldValue("addressId");
//                             console.log(
//                               "🔍 Selected addressId from form:",
//                               selectedAddressId
//                             );
//                             if (selectedAddressId) {
//                               // Set addressId vào form và state để đảm bảo UI cập nhật
//                               form.setFieldsValue({
//                                 addressId: selectedAddressId,
//                               });
//                               setSelectedAddressIdState(selectedAddressId);
//                               setUseNewAddress(false);
//                               setAddressModalVisible(false);

//                               // Gọi lại API để lấy giá vận chuyển mới cho tất cả shops
//                               if (
//                                 checkoutPreview?.shops &&
//                                 checkoutPreview.shops.length > 0
//                               ) {
//                                 checkoutPreview.shops.forEach((shop: any) => {
//                                   const shopId = shop.shopId;
//                                   const shopAddressId =
//                                     shopAddressIdMap[shopId];
//                                   if (
//                                     shopId &&
//                                     shopAddressId &&
//                                     shop.items &&
//                                     shop.items.length > 0
//                                   ) {
//                                     fetchCostsShipmentsForShop(
//                                       selectedAddressId,
//                                       shopId,
//                                       shop.items
//                                     );
//                                   }
//                                 });
//                               }
//                             } else {
//                               toast.warning("Vui lòng chọn một địa chỉ");
//                             }
//                           }}
//                         >
//                           Xác nhận
//                         </Button>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-500">Chưa có địa chỉ đã lưu</p>
//                     </div>
//                   )}
//                 </div>
//               ),
//             },
//             {
//               key: "new",
//               label: "Thêm địa chỉ mới",
//               children: (
//                 <div className="space-y-4">
//                   {loadingBuyerInfo && (
//                     <Alert
//                       message="Đang tải thông tin người mua..."
//                       type="info"
//                       showIcon
//                     />
//                   )}

//                   {buyerInfo && (
//                     <Alert
//                       message="Thông tin đã được điền tự động từ tài khoản của bạn"
//                       type="success"
//                       showIcon
//                       closable
//                     />
//                   )}

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Form.Item
//                       name="recipientName"
//                       label="Người nhận"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng nhập tên người nhận",
//                         },
//                       ]}
//                     >
//                       <Input placeholder="Nguyễn Văn A" />
//                     </Form.Item>

//                     <Form.Item
//                       name="phoneNumber"
//                       label="Số điện thoại"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng nhập số điện thoại",
//                         },
//                         {
//                           pattern: /^[0-9]{10}$/,
//                           message: "Số điện thoại không hợp lệ",
//                         },
//                       ]}
//                     >
//                       <Input placeholder="0912345678" />
//                     </Form.Item>
//                   </div>

//                   <Form.Item
//                     name="addressLine1"
//                     label="Địa chỉ chi tiết"
//                     rules={[
//                       { required: true, message: "Vui lòng nhập địa chỉ" },
//                     ]}
//                   >
//                     <Input placeholder="Số nhà, tên đường..." />
//                   </Form.Item>

//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <Form.Item
//                       name="ward"
//                       label="Phường/Xã"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng nhập phường/xã",
//                         },
//                       ]}
//                     >
//                       <Input placeholder="Phường 1" />
//                     </Form.Item>

//                     <Form.Item
//                       name="district"
//                       label="Quận/Huyện"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng nhập quận/huyện",
//                         },
//                       ]}
//                     >
//                       <Input placeholder="Quận 1" />
//                     </Form.Item>

//                     <Form.Item
//                       name="province"
//                       label="Tỉnh/Thành phố"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng nhập tỉnh/thành",
//                         },
//                       ]}
//                     >
//                       <Input placeholder="TP. Hồ Chí Minh" />
//                     </Form.Item>
//                   </div>

//                   <Form.Item name="email" label="Email (nhận thông báo)">
//                     <Input type="email" placeholder="email@example.com" />
//                   </Form.Item>

//                   <div className="flex justify-end gap-2">
//                     <Button onClick={() => setAddressModalVisible(false)}>
//                       Hủy
//                     </Button>
//                     <Button
//                       type="primary"
//                       onClick={async () => {
//                         const recipientName =
//                           form.getFieldValue("recipientName");
//                         const phoneNumber = form.getFieldValue("phoneNumber");
//                         const addressLine1 = form.getFieldValue("addressLine1");
//                         const ward = form.getFieldValue("ward");
//                         const district = form.getFieldValue("district");
//                         const province = form.getFieldValue("province");

//                         if (
//                           recipientName &&
//                           phoneNumber &&
//                           addressLine1 &&
//                           ward &&
//                           district &&
//                           province
//                         ) {
//                           form.setFieldValue("addressId", undefined);
//                           setUseNewAddress(true);
//                           setAddressModalVisible(false);
//                           setShopShipmentMethods({});
//                           setShopSelectedShippingMethod({});
//                         }
//                       }}
//                     >
//                       Xác nhận
//                     </Button>
//                   </div>
//                 </div>
//               ),
//             },
//           ]}
//         />
//       </Modal>

//       {/* Modal chọn phương thức vận chuyển - Chỉ GHN */}
//       <Modal
//         title="Phương thức vận chuyển"
//         open={shippingMethodModalVisible}
//         onCancel={() => {
//           // Tự động chọn GHN nếu chưa chọn
//           if (!form.getFieldValue("shippingMethod")) {
//             form.setFieldsValue({ shippingMethod: "GHN" });
//           }
//           setShippingMethodModalVisible(false);
//         }}
//         footer={null}
//         width={500}
//         closable={true}
//         maskClosable={false}
//       >
//         <div className="space-y-4">
//           <div className="hover:border-blue-400 transition-colors border-2 border-blue-200">
//             <div className="flex justify-between items-center">
//               <div className="flex-1">
//                 <p className="text-gray-900 text-lg block mb-2">
//                   Giao hàng nhanh GHN
//                 </p>
//                 {loadingGHNShipmentPrice ? (
//                   <div className="flex items-center">
//                     <Spin size="small" className="mr-2" />
//                     <p className="text-gray-600 text-sm">
//                       Đang tính giá vận chuyển...
//                     </p>
//                   </div>
//                 ) : ghnShipmentPrice?.data?.total ? (
//                   <p className="text-green-600 text-2xl font-bold">
//                     {formatPrice(Number(ghnShipmentPrice.data.total))}
//                   </p>
//                 ) : (
//                   <p className="text-gray-500 text-sm">
//                     Không thể tính giá vận chuyển
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <Button
//               type="primary"
//               size="large"
//               block
//               onClick={() => {
//                 form.setFieldsValue({ shippingMethod: "GHN" });
//                 setShippingMethodModalVisible(false);
//               }}
//             >
//               Xác nhận
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
