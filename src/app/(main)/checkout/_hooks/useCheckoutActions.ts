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
      const payload = preparePreviewPayload(updatedRequest, preview);
      if (payload.shops && Array.isArray(payload.shops)) {
        payload.shops = payload.shops.map((shop: any) => ({
          ...shop,
          serviceCode: typeof shop.serviceCode === "string" ? Number(shop.serviceCode) : shop.serviceCode,
        }));
      }
      if (payload.shops && Array.isArray(payload.shops)) {
        payload.shops = payload.shops.map((shop: any) => ({
          ...shop,
          serviceCode: typeof shop.serviceCode === "string" ? Number(shop.serviceCode) : shop.serviceCode,
        }));
      }
      return await dispatch(checkoutPreviewAction(payload)).unwrap();
    },
    onMutate: () => setLoading(true),
    onSuccess: (result, variables) => {
      const invalidVouchers = [
        ..._.get(
          result,
          "voucherApplication.globalVouchers.invalidVouchers",
          []
        ),
        ..._.flatMap(
          _.get(result, "voucherApplication.shopResults"),
          "invalidVouchers"
        ),
      ].filter((v) => !!v);

      const isShippingError = invalidVouchers.some((v) =>
        v.reason?.includes("Shipping fee")
      );
      let finalRequest = _.cloneDeep(variables);

      if (invalidVouchers.length > 0) {
        const invalidCodes = invalidVouchers.map(
          (v) => v.voucherCode || v.code
        );
        const hasVoucherToClear =
          _.intersection(finalRequest.globalVouchers, invalidCodes).length >
            0 ||
          _.some(
            finalRequest.shops,
            (s) => _.intersection(s.vouchers, invalidCodes).length > 0
          );

        if (hasVoucherToClear) {
          toastError(invalidVouchers[0].reason || "Voucher không đủ điều kiện");
          finalRequest.globalVouchers = _.difference(
            finalRequest.globalVouchers || [],
            invalidCodes
          );
          finalRequest.shops = finalRequest.shops.map((shop: any) => ({
            ...shop,
            vouchers: _.difference(shop.vouchers || [], invalidCodes),
          }));
          previewMutation.mutate(finalRequest);
          return;
        }
      }

      if (isShippingError) {
        setPreview(result);
        setRequest(variables);
        return;
      }

      setPreview(result);
      setRequest(finalRequest);
      sessionStorage.setItem("checkoutPreview", JSON.stringify(result));
      sessionStorage.setItem("checkoutRequest", JSON.stringify(finalRequest));
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
        s.shopId === shopId ? { ...s, selectedShippingMethod: methodCode } : s
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
