"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { buyerService } from "@/services/buyer/buyer.service";
import { getAllShopAddresses } from "@/services/shop/shop.service";
import { orderService } from "@/services/orders/order.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { useAppDispatch } from "@/store/store";
import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
import { toast } from "sonner";
import addressData, { Province, Ward } from "vietnam-address-database";
import { BuyerAddressResponse } from "@/types/buyer/buyer.types";
import { OrderCreateRequest } from "@/types/orders/order.types";
import { extractItemDimensions } from "@/utils/packaging-optimizer";
import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
import { useToast } from "@/hooks/useToast";
interface CheckoutContextType {
  preview: any;
  request: any;
  loading: boolean;
  buyerInfo: any;
  savedAddresses: BuyerAddressResponse[];
  shopAddressIdMap: Record<string, string>;
  provincesData: Province[];
  allWardsData: Ward[];
  updateShippingMethod: (shopId: string, methodCode: string) => Promise<void>;
  updateGlobalVouchers: (codes: string[]) => Promise<boolean>;
  updateAddress: (addressId?: string, newAddressData?: any) => Promise<void>;
  confirmOrder: (customerNote: string, paymentMethod: string) => Promise<any>;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export const CheckoutProvider = ({
  children,
  initialPreview,
  initialRequest,
}: {
  children: React.ReactNode;
  initialPreview: any;
  initialRequest: any;
}) => {
  const dispatch = useAppDispatch();
  const [preview, setPreview] = useState(initialPreview);
  const [request, setRequest] = useState(initialRequest);
  const [loading, setLoading] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<BuyerAddressResponse[]>([]);
  const [shopAddressIdMap, setShopAddressIdMap] = useState<Record<string, string>>({});
  const [provincesData, setProvincesData] = useState<Province[]>([]);
  const [allWardsData, setAllWardsData] = useState<Ward[]>([]);
const { success, error } = useToast();
  useEffect(() => {
    let pList: Province[] = [];
    let wList: Ward[] = [];
    addressData.forEach((item) => {
      if (item.type === "table") {
        if (item.name === "provinces") pList = item.data as Province[];
        if (item.name === "wards") wList = item.data as Ward[];
      }
    });
    setProvincesData(pList);
    setAllWardsData(wList);

    if (initialPreview) {}
  }, []);

  useEffect(() => {
    const loadInitialInfo = async () => {
      const user = getStoredUserDetail();
      if (!user?.buyerId || !preview?.shops) return;

      setLoading(true);
      try {
        const [buyerDetail, ...shopAddrResponses] = await Promise.all([
          buyerService.getBuyerDetail(user.buyerId),
          ...preview.shops.map((s: any) => getAllShopAddresses(s.shopId)),
        ]);

        if (buyerDetail) {
          setBuyerInfo(buyerDetail);
          setSavedAddresses(buyerDetail.addresses || []);
        }

        const idMap: Record<string, string> = {};
        shopAddrResponses.forEach((res: any, idx: number) => {
          const shopId = preview.shops[idx].shopId;
          const addr =
            res.data?.find((a: any) => a.isDefaultPickup) || res.data?.[0];
          if (addr?.addressId) idMap[shopId] = addr.addressId;
        });
        setShopAddressIdMap(idMap);
      } catch (err) {
        console.error("Init Checkout Info Error", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialInfo();
  }, [preview?.shops]);

  const syncPreview = async (updatedRequest: any) => {
    setLoading(true);
    try {
      if (updatedRequest.shippingAddress) {
        const oldMap = mapAddressToOldFormat(
          updatedRequest.shippingAddress.ward ||
            updatedRequest.shippingAddress.postalCode,
          updatedRequest.shippingAddress.province ||
            updatedRequest.shippingAddress.state
        );
        updatedRequest.shippingAddress = {
          ...updatedRequest.shippingAddress,
          districtNameOld: oldMap.old_district_name,
          provinceNameOld: oldMap.old_province_name,
          wardNameOld: oldMap.old_ward_name,
        };
      }

      const result = await dispatch(
        checkoutPreviewAction(updatedRequest)
      ).unwrap();
      setPreview(result);
      setRequest(updatedRequest);
      sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
      sessionStorage.setItem("checkoutRequest", JSON.stringify(updatedRequest));
      return result;
    } catch (err: any) {
      error(err.message || "Lỗi cập nhật thông tin đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  };

const updateShippingMethod = async (shopId: string, methodCode: string) => {
    if (loading) return;

    const updatedRequest = {
        ...request, 
        shops: preview.shops.map((s: any) => ({
            shopId: s.shopId,
            itemIds: s.items.map((i: any) => i.itemId),
            selectedShippingMethod: s.shopId === shopId ? methodCode : s.selectedShippingMethod,
            vouchers: s.appliedVouchers?.map((v: any) => v.code) || []
        }))
    };

    console.log("📤 Sending updated shipping request:", updatedRequest);
    
    // 2. Gọi API để Backend tính lại shopTotal và grandTotal
    await syncPreview(updatedRequest);
};

  const updateAddress = async (addressId?: string, newAddressData?: any) => {
    const updatedRequest = {
      ...request,
      addressId,
      shippingAddress: newAddressData
        ? { ...newAddressData, country: "Vietnam" }
        : undefined,
    };
    await syncPreview(updatedRequest);
  };

  const updateGlobalVouchers = async (codes: string[], shopVoucherMap?: Record<string, string[]>) => {
  if (loading) return false;
  console.log("Gửi voucher codes lên API:", codes, shopVoucherMap);

  try {
    const updatedRequest = {
      ...request,
      globalVouchers: codes, 
      shops: preview.shops.map((s: any) => ({
        shopId: s.shopId,
        itemIds: s.items.map((i: any) => i.itemId),
        selectedShippingMethod: s.selectedShippingMethod,
        vouchers: shopVoucherMap?.[s.shopId] || [] 
      }))
    };

    console.log("[CHECKOUT] Request with vouchers:", updatedRequest);
    const result = await syncPreview(updatedRequest);
    console.log("Kết quả trả về từ API:", result);

    if (result?.voucherApplication?.success) {
      success("Đã áp dụng voucher thành công!");
      return true;
    } else {
      const errorMsg = result?.voucherApplication?.errors?.[0] || "Voucher không khả dụng";
      error(errorMsg);
      return false;
    }
  } catch (err) {
    console.error("Lỗi áp dụng voucher:", err);
    return false;
  }
};
const confirmOrder = async (customerNote: string, paymentMethod: string) => {
    setLoading(true);
    try {
        // Lấy địa chỉ đầy đủ từ database local hoặc từ request
        const fullAddressData = request.shippingAddress || 
            savedAddresses.find((a) => a.addressId === request.addressId);

        if (!fullAddressData) {
            error("Vui lòng chọn địa chỉ giao hàng");
            setLoading(false);
            return;
        }

      const buyerAddressData = preview.buyerAddressData && typeof preview.buyerAddressData === 'object'
        ? {
            addressId: String(preview.buyerAddressData.addressId || request.addressId || ""),
            buyerAddressId: String(preview.buyerAddressData.buyerAddressId || request.addressId || ""),
            addressType: Number(preview.buyerAddressData.addressType ?? 0),
            taxAddress: String(preview.buyerAddressData.taxAddress || "")
          }
        : {
            addressId: String(request.addressId || ""),
            buyerAddressId: String(request.addressId || ""),
            addressType: 0,
            taxAddress: ""
          };

      const finalRequest: OrderCreateRequest = {
        shops: preview.shops.map((s: any) => {
          const opt = s.availableShippingOptions?.find(
            (o: any) => o.code === s.selectedShippingMethod
          );
          return {
            shopId: s.shopId,
            itemIds: s.items.map((i: any) => i.itemId),
            shippingMethod: s.selectedShippingMethod,
            shippingFee: opt?.fee || 0,
            vouchers: s.appliedVouchers?.map((v: any) => v.code || v) || [],
          };
        }),
        shippingMethod: "STANDARD",
        buyerAddressId: request.addressId,
        buyerAddressData,
        shippingAddress: {
          addressId: request.addressId,
          recipientName: (fullAddressData as any).recipientName || (fullAddressData as any).fullName || "",
          phoneNumber: (fullAddressData as any).phone || (fullAddressData as any).phoneNumber || "",
          addressLine1: (fullAddressData as any).detailAddress || (fullAddressData as any).detail || "",
          city: (fullAddressData as any).district || "",
          state: (fullAddressData as any).province || "",
          postalCode: (fullAddressData as any).ward || "",
          country: "VN",
          districtNameOld: (fullAddressData as any).districtNameOld,
          provinceNameOld: (fullAddressData as any).provinceNameOld,
          wardNameOld: (fullAddressData as any).wardNameOld,
        } as any, 
        paymentMethod: paymentMethod as any,
        customerNote,
        globalVouchers: request.globalVouchers || [],
      };

        const response = await orderService.createOrder(finalRequest);
        sessionStorage.clear();
        return response;
    } catch (err: any) {
        // Hiện lỗi 3001 từ backend nếu có
        error(err.response?.data?.message || err.message || "Đặt hàng thất bại");
        throw err;
    } finally {
        setLoading(false);
    }
};
  return (
    <CheckoutContext.Provider
      value={{
        preview,
        request,
        loading,
        buyerInfo,
        savedAddresses,
        shopAddressIdMap,
        provincesData,
        allWardsData,
        updateShippingMethod,
        updateGlobalVouchers,
        updateAddress,
        confirmOrder,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context)
    throw new Error("useCheckout must be used within CheckoutProvider");
  return context;
};
