import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
import { useAppDispatch } from "@/store/store";
import { orderService } from "@/services/orders/order.service";
import { useToast } from "@/hooks/useToast";
import {
  preparePreviewPayload,
  prepareOrderRequest,
} from "../_utils/checkout.mapper";

export const useCheckoutActions = () => {
  const dispatch = useAppDispatch();
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    request,
    preview,
    savedAddresses,
    setPreview,
    setRequest,
    setLoading,
  } = useCheckoutStore();

  const previewMutation = useMutation({
    mutationFn: async (updatedRequest: any) => {
      const basePayload = preparePreviewPayload(updatedRequest, preview);

      const finalPayload = {
        addressId: basePayload.addressId || updatedRequest.addressId,
        globalVouchers: updatedRequest.globalVouchers || [],
        shops: (updatedRequest.shops || basePayload.shops).map((shop: any) => {
          const shopPreview = preview?.data?.shops?.find(
            (s: any) => s.shopId === shop.shopId
          );
          const selectedOption = shopPreview?.availableShippingOptions?.find(
            (opt: any) =>
              opt.serviceCode ===
              Number(shop.serviceCode || shop.selectedShippingMethod)
          );

          return {
            shopId: shop.shopId,
            itemIds: shop.itemIds,
            serviceCode: Number(
              shop.serviceCode || shop.selectedShippingMethod || 400021
            ),
            shippingFee: selectedOption?.fee || shop.shippingFee || 0,
          };
        }),
      };

      return await dispatch(checkoutPreviewAction(finalPayload)).unwrap();
    },
    onMutate: () => setLoading(true),
   onSuccess: (result, variables) => {
      // Backend mới trả về data nằm trong result.data
      const shopData = _.get(result, "data.shops", []);
      
      // Thu thập voucher lỗi từ cấu trúc mới
      const invalidVouchers = _.flatMap(shopData, (s) => 
        _.get(s, "voucherResult.invalidVouchers", [])
      );

      if (invalidVouchers.length > 0) {
          // Nếu có voucher lỗi, xóa nó khỏi request và gọi lại
          let finalRequest = _.cloneDeep(variables);
          // Logic lọc voucher code ở đây...
          // previewMutation.mutate(finalRequest); 
          // return;
      }

      setPreview(result);
      setRequest(variables);
      // Lưu vào session thì nên lưu result (đã bao gồm result.data)
      sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
      sessionStorage.setItem("checkoutRequest", JSON.stringify(variables));
    },
    onError: (err: any) => toastError(err.message || "Lỗi cập nhật thông tin"),
    onSettled: () => setLoading(false),
  });

  const orderMutation = useMutation({
    mutationFn: async ({
      customerNote,
      paymentMethod,
    }: {
      customerNote: string;
      paymentMethod: string;
    }) => {
      if (!request || !preview)
        throw new Error("Thông tin đơn hàng không hợp lệ");
      const finalRequest = prepareOrderRequest({
        preview,
        request,
        savedAddresses,
        customerNote,
        paymentMethod,
      });
      return await orderService.createOrder(finalRequest);
    },
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      sessionStorage.removeItem("checkoutPreview");
      sessionStorage.removeItem("checkoutRequest");
      toastSuccess("Đặt hàng thành công!");
      return response;
    },
    onError: (err: any) =>
      toastError(
        _.get(err, "response.data.message") ||
          err.message ||
          "Đặt hàng thất bại"
      ),
    onSettled: () => setLoading(false),
  });

  const updateShippingMethod = async (shopId: string, methodCode: string) => {
    if (!request) return;
    const updatedRequest = {
      ...request,
      shops: request.shops.map((s: any) =>
        s.shopId === shopId 
          ? { ...s, serviceCode: Number(methodCode) }
          : s
      ),
    };
    return previewMutation.mutateAsync(updatedRequest);
  };

  return {
    syncPreview: (req: any) => previewMutation.mutateAsync(req),
    updateShippingMethod,
    confirmOrder: (note: string, method: string) =>
      orderMutation.mutateAsync({ customerNote: note, paymentMethod: method }),
    isLoading: previewMutation.isPending || orderMutation.isPending,
  };
};
