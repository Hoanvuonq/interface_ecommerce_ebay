// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   useRef,
// } from "react";
// import { buyerService } from "@/services/buyer/buyer.service";
// import { getAllShopAddresses } from "@/services/shop/shop.service";
// import { getStoredUserDetail } from "@/utils/jwt";
// import addressData, { Province, Ward } from "vietnam-address-database";
// import { BuyerAddressResponse } from "@/types/buyer/buyer.types";

// // --- Types ---
// interface ShopAddressInfo {
//   province: string;
//   district: string;
//   ward: string;
// }

// interface CheckoutAddressContextType {
//   // --- Buyer Data ---
//   buyerInfo: any;
//   savedAddresses: BuyerAddressResponse[];
//   loadingBuyerInfo: boolean;
//   refreshBuyerInfo: () => Promise<void>; // Gọi hàm này khi thêm địa chỉ mới thành công

//   // --- Shop Data (Để tính ship) ---
//   shopAddressesMap: Record<string, string>; // shopId -> provinceName
//   shopFullAddressMap: Record<string, ShopAddressInfo>; // shopId -> { province, district, ward }
//   shopAddressIdMap: Record<string, string>; // shopId -> addressId (Quan trọng cho API tính ship)
//   shopProvince: string | null; // Province của Shop chính (cho Conkin)
//   loadingShopAddress: boolean;

//   // --- Master Data (Vietnam Address) ---
//   provincesData: Province[];
//   allWardsData: Ward[];
// }

// const CheckoutAddressContext = createContext<CheckoutAddressContextType | null>(
//   null
// );

// export const CheckoutAddressProvider = ({
//   children,
//   checkoutPreview,
//   form, // Truyền form vào để auto-fill nếu cần
// }: {
//   children: React.ReactNode;
//   checkoutPreview: any;
//   form?: any;
// }) => {
//   // 1. State: Master Data
//   const [provincesData, setProvincesData] = useState<Province[]>([]);
//   const [allWardsData, setAllWardsData] = useState<Ward[]>([]);

//   // 2. State: Buyer
//   const [buyerInfo, setBuyerInfo] = useState<any>(null);
//   const [savedAddresses, setSavedAddresses] = useState<BuyerAddressResponse[]>(
//     []
//   );
//   const [loadingBuyerInfo, setLoadingBuyerInfo] = useState(false);
//   const hasLoadedBuyerInfoRef = useRef(false);

//   // 3. State: Shop
//   const [shopAddressesMap, setShopAddressesMap] = useState<
//     Record<string, string>
//   >({});
//   const [shopFullAddressMap, setShopFullAddressMap] = useState<
//     Record<string, ShopAddressInfo>
//   >({});
//   const [shopAddressIdMap, setShopAddressIdMap] = useState<
//     Record<string, string>
//   >({});
//   const [shopProvince, setShopProvince] = useState<string | null>(null);
//   const [loadingShopAddress, setLoadingShopAddress] = useState(false);
//   const previousShopsRef = useRef<string | null>(null);

//   // --- INIT: Load Vietnam Address DB ---
//   useEffect(() => {
//     let provincesList: Province[] = [];
//     let wardsList: Ward[] = [];
//     addressData.forEach((item) => {
//       if (item.type === "table") {
//         if (item.name === "provinces" && item.data)
//           provincesList = item.data as Province[];
//         else if (item.name === "wards" && item.data)
//           wardsList = item.data as Ward[];
//       }
//     });
//     setProvincesData(provincesList);
//     setAllWardsData(wardsList);
//   }, []);

//   // --- LOGIC 1: Load Buyer Info ---
//   const loadBuyerInfo = useCallback(async () => {
//     // Prevent duplicate call in StrictMode
//     if (hasLoadedBuyerInfoRef.current) return;
//     hasLoadedBuyerInfoRef.current = true;

//     setLoadingBuyerInfo(true);
//     try {
//       const storedUser = getStoredUserDetail();
//       if (!storedUser?.buyerId) {
//         hasLoadedBuyerInfoRef.current = false;
//         return;
//       }

//       const buyerDetail = await buyerService.getBuyerDetail(storedUser.buyerId);
//       if (buyerDetail) {
//         setBuyerInfo(buyerDetail);

//         // Sort addresses: Newest first
//         if (buyerDetail.addresses?.length > 0) {
//           const sorted = [...buyerDetail.addresses].sort(
//             (a, b) =>
//               new Date(b.createdDate || 0).getTime() -
//               new Date(a.createdDate || 0).getTime()
//           );
//           setSavedAddresses(sorted);
//         } else {
//           setSavedAddresses([]);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Failed to load buyer info", error);
//       hasLoadedBuyerInfoRef.current = false;
//     } finally {
//       setLoadingBuyerInfo(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadBuyerInfo();
//   }, [loadBuyerInfo]);

//   // --- LOGIC 2: Load Shop Addresses ---
//   const loadShopAddress = useCallback(async () => {
//     if (!checkoutPreview?.shops || checkoutPreview.shops.length === 0) return;

//     setLoadingShopAddress(true);
//     try {
//       const shops = checkoutPreview.shops;
//       const addrMap: Record<string, string> = {};
//       const fullAddrMap: Record<string, ShopAddressInfo> = {};
//       const idMap: Record<string, string> = {};

//       const promises = shops.map(async (shop: any) => {
//         const shopId = shop.shopId;
//         try {
//           const res = await getAllShopAddresses(shopId);
//           const addresses = res.data || [];

//           if (addresses.length > 0) {
//             // Find default address
//             const defaultAddr =
//               addresses.find((a: any) => a.isDefaultPickup) ||
//               addresses.find((a: any) => a.isDefault) ||
//               addresses[0];

//             if (defaultAddr) {
//               if (defaultAddr.addressId) idMap[shopId] = defaultAddr.addressId;

//               // Basic mapping (Giản lược logic so khớp DB để tối ưu)
//               const pName =
//                 defaultAddr.province || defaultAddr.address?.provinceName;
//               const wName = defaultAddr.ward || defaultAddr.address?.wardName;
//               const dName = defaultAddr.district || "";

//               // Fallback nếu không có tên tỉnh
//               const finalProvince = pName || "Hồ Chí Minh";
//               addrMap[shopId] = finalProvince;

//               if (pName) {
//                 fullAddrMap[shopId] = {
//                   province: pName,
//                   district: dName,
//                   ward: wName || "",
//                 };
//               }
//             }
//           } else {
//             // Fallback no address
//             addrMap[shopId] = "Hồ Chí Minh";
//           }
//         } catch (e) {
//           console.error(`Error loading shop ${shopId} address`, e);
//           addrMap[shopId] = "Hồ Chí Minh";
//         }
//       });

//       await Promise.all(promises);

//       setShopAddressesMap(addrMap);
//       setShopFullAddressMap(fullAddrMap);
//       setShopAddressIdMap(idMap);

//       // Determine Main Shop (shop with max items) for Conkin calc
//       let mainShop = shops[0];
//       let max = 0;
//       shops.forEach((s: any) => {
//         if ((s.items?.length || 0) > max) {
//           max = s.items.length;
//           mainShop = s;
//         }
//       });

//       const mainFull = fullAddrMap[mainShop.shopId];
//       if (mainFull) setShopProvince(mainFull.province);
//       else setShopProvince(addrMap[mainShop.shopId] || "Hồ Chí Minh");
//     } catch (err) {
//       console.error("Global shop address error", err);
//     } finally {
//       setLoadingShopAddress(false);
//     }
//   }, [checkoutPreview]);

//   useEffect(() => {
//     if (checkoutPreview?.shops) {
//       // Check if shops changed to prevent re-fetching
//       const shopsKey = JSON.stringify(
//         checkoutPreview.shops.map((s: any) => s.shopId)
//       );
//       if (previousShopsRef.current !== shopsKey) {
//         previousShopsRef.current = shopsKey;
//         loadShopAddress();
//       }
//     }
//   }, [checkoutPreview, loadShopAddress]);

//   return (
//     <CheckoutAddressContext.Provider
//       value={{
//         buyerInfo,
//         savedAddresses,
//         loadingBuyerInfo,
//         refreshBuyerInfo: async () => {
//           hasLoadedBuyerInfoRef.current = false;
//           await loadBuyerInfo();
//         },
//         shopAddressesMap,
//         shopFullAddressMap,
//         shopAddressIdMap,
//         shopProvince,
//         loadingShopAddress,
//         provincesData,
//         allWardsData,
//       }}
//     >
//       {children}
//     </CheckoutAddressContext.Provider>
//   );
// };

// export const useCheckoutAddress = () => {
//   const context = useContext(CheckoutAddressContext);
//   if (!context)
//     throw new Error(
//       "useCheckoutAddress must be used within CheckoutAddressProvider"
//     );
//   return context;
// };