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
  const { success, error } = useToast();

  const {
    request,
    preview,
    savedAddresses,
    setPreview,
    setRequest,
    setLoading,
  } = useCheckoutStore();

  // 1. Mutation cho Sync Preview
  const previewMutation = useMutation({
    mutationFn: async (updatedRequest: any) => {
      const payload = preparePreviewPayload(updatedRequest);
      return await dispatch(checkoutPreviewAction(payload)).unwrap();
    },
    onMutate: () => setLoading(true),
    onSuccess: (result, variables) => {
      // Logic kiểm tra voucher hợp lệ
      const hasSentVoucher = _.get(variables, "globalVouchers.length") > 0;
      const validGlobal =
        _.get(
          result,
          "voucherApplication.globalVouchers.validVouchers.length",
          0
        ) > 0;
      const validShop = _.some(
        _.get(result, "voucherApplication.shopResults"),
        (s) => Array.isArray(s.validVouchers) && s.validVouchers.length > 0
      );

      if (hasSentVoucher && !validGlobal && !validShop) {
        error(
          _.get(result, "voucherApplication.errors[0]") ||
            "Voucher không đủ điều kiện"
        );
      }

      setPreview(result);
      setRequest(variables);
      sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
      sessionStorage.setItem("checkoutRequest", JSON.stringify(variables));
    },
    onError: (err: any) =>
      error(err.message || "Lỗi cập nhật thông tin đơn hàng"),
    onSettled: () => setLoading(false),
  });

  // 2. Mutation cho Confirm Order
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
      success("Đặt hàng thành công!");
      return response;
    },
    onError: (err: any) => {
      error(
        _.get(err, "response.data.message") ||
          err.message ||
          "Đặt hàng thất bại"
      );
    },
    onSettled: () => setLoading(false),
  });

  const updateShippingMethod = async (shopId: string, methodCode: string) => {
    if (!preview?.shops) return;

    const updatedRequest = {
      ...request,
      shops: _.map(preview.shops, (s) => ({
        shopId: s.shopId,
        itemIds: _.map(s.items, "itemId"),
        selectedShippingMethod:
          s.shopId === shopId ? methodCode : s.selectedShippingMethod,
        vouchers: _.map(s.appliedVouchers, (v) => v.code || v),
      })),
    };
    return previewMutation.mutateAsync(updatedRequest);
  };
 

  return {
    syncPreview: previewMutation.mutateAsync,
    updateShippingMethod,
    confirmOrder: (note: string, method: string) =>
      orderMutation.mutateAsync({ customerNote: note, paymentMethod: method }),
    isLoading: previewMutation.isPending || orderMutation.isPending,
  };
};
