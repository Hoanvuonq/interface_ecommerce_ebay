import { useCheckoutStore } from "../_store/useCheckoutStore";
import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
import { useAppDispatch } from "@/store/store";
import { mapAddressToOldFormat } from "@/utils/address/ward-mapping.util";
import { orderService } from "@/services/orders/order.service";
import { useToast } from "@/hooks/useToast";
import { OrderCreateRequest } from "@/types/orders/order.types";

export const useCheckoutActions = () => {
  const dispatch = useAppDispatch();
  const { success, error } = useToast();

  const request = useCheckoutStore((state) => state.request);
  const preview = useCheckoutStore((state) => state.preview);
  const savedAddresses = useCheckoutStore((state) => state.savedAddresses);
  const setLoading = useCheckoutStore((state) => state.setLoading);
  const setPreview = useCheckoutStore((state) => state.setPreview);
  const setRequest = useCheckoutStore((state) => state.setRequest);

  /**
   * 1. Priview Order
   */
  const syncPreview = async (updatedRequest: any) => {
    const requestPayload = JSON.parse(JSON.stringify(updatedRequest));

    setLoading(true);
    try {
      if (requestPayload.shippingAddress) {
        const oldMap = mapAddressToOldFormat(
          requestPayload.shippingAddress.ward ||
            requestPayload.shippingAddress.postalCode,
          requestPayload.shippingAddress.province ||
            requestPayload.shippingAddress.state
        );
        requestPayload.shippingAddress = {
          ...requestPayload.shippingAddress,
          districtNameOld: oldMap.old_district_name,
          provinceNameOld: oldMap.old_province_name,
          wardNameOld: oldMap.old_ward_name,
        };
      }
      console.log("Payload gửi đi:", updatedRequest);
      const result = await dispatch(
        checkoutPreviewAction(requestPayload)
      ).unwrap();

      const hasSentVoucher = updatedRequest.globalVouchers?.length > 0;
      const hasAcceptedVoucher =
        (Array.isArray(result.voucherApplication?.globalVouchers?.validVouchers) && result.voucherApplication.globalVouchers.validVouchers.length > 0) ||
        result.voucherApplication?.shopResults?.some(
          (s: any) => s.validVouchers?.length > 0
        );

      if (hasSentVoucher && !hasAcceptedVoucher) {
        const backendError = result.voucherApplication?.errors?.[0];
        error(
          backendError ||
            "Mã voucher không đủ điều kiện áp dụng cho đơn hàng này"
        );
      }
      // Cập nhật Store
      setPreview(result);
      setRequest(requestPayload);

      // Đồng bộ Session
      sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
      sessionStorage.setItem("checkoutRequest", JSON.stringify(requestPayload));

      return result;
    } catch (err: any) {
      error(err.message || "Lỗi cập nhật thông tin đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 2. Cập nhật phương thức vận chuyển cho từng shop
   */
  const updateShippingMethod = async (shopId: string, methodCode: string) => {
    if (!preview?.shops) return;

    const updatedRequest = {
      ...request,
      shops: preview.shops.map((s: any) => ({
        shopId: s.shopId,
        itemIds: s.items.map((i: any) => i.itemId),
        selectedShippingMethod:
          s.shopId === shopId ? methodCode : s.selectedShippingMethod,
        // Đảm bảo lấy voucher đã áp dụng từ preview
        vouchers: s.appliedVouchers?.map((v: any) => v.code || v) || [],
      })),
    };
    await syncPreview(updatedRequest);
  };

  /**
   * 3. Xác nhận và tạo đơn hàng
   */
  const confirmOrder = async (customerNote: string, paymentMethod: string) => {
    if (!request || !preview) return;

    setLoading(true);
    try {
      // Tìm địa chỉ: Ưu tiên địa chỉ đang nhập, sau đó mới tìm trong danh sách đã lưu
      const fullAddressData =
        request.shippingAddress ||
        savedAddresses.find((a: any) => a.addressId === request.addressId);

      if (!fullAddressData) {
        error("Vui lòng chọn hoặc nhập địa chỉ giao hàng");
        return;
      }

      // Chuẩn hóa dữ liệu Buyer Address
      const buyerAddressData =
        preview.buyerAddressData && typeof preview.buyerAddressData === "object"
          ? {
              addressId: String(
                preview.buyerAddressData.addressId || request.addressId || ""
              ),
              buyerAddressId: String(
                preview.buyerAddressData.buyerAddressId ||
                  request.addressId ||
                  ""
              ),
              addressType: Number(preview.buyerAddressData.addressType ?? 0),
              taxAddress: String(preview.buyerAddressData.taxAddress || ""),
            }
          : {
              addressId: String(request.addressId || ""),
              buyerAddressId: String(request.addressId || ""),
              addressType: 0,
              taxAddress: "",
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
          recipientName:
            (fullAddressData as any).recipientName ||
            (fullAddressData as any).fullName ||
            "",
          phoneNumber:
            (fullAddressData as any).phone ||
            (fullAddressData as any).phoneNumber ||
            "",
          addressLine1:
            (fullAddressData as any).detailAddress ||
            (fullAddressData as any).detail ||
            "",
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

      // Dọn dẹp sau khi đặt hàng thành công
      sessionStorage.removeItem("checkoutPreview");
      sessionStorage.removeItem("checkoutRequest");
      success("Đặt hàng thành công!");
      return response;
    } catch (err: any) {
      error(err.response?.data?.message || err.message || "Đặt hàng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { syncPreview, updateShippingMethod, confirmOrder };
};
