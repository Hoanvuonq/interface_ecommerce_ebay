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
      const finalPayload = preparePreviewPayload(updatedRequest, preview);
      return await dispatch(checkoutPreviewAction(finalPayload)).unwrap();
    },
    onMutate: () => setLoading(true),

    onSuccess: (result: any, variables: any) => {
      setPreview(result);
      const shopData = _.get(result, "data.shops", []);

      const updatedShops = variables.shops.map((s: any) => {
        const freshShop = _.find(shopData, { shopId: s.shopId });

        const services =
          _.get(freshShop, "availableShippingOptions") ||
          _.get(freshShop, "shipping.services") ||
          [];

        let finalServiceCode = s.serviceCode;
        let finalFee = _.get(freshShop, "summary.shippingFee", s.shippingFee);

        const isCurrentCodeValid = _.some(
          services,
          (srv) => Number(srv.serviceCode) === Number(finalServiceCode)
        );

        if (!isCurrentCodeValid && services.length > 0) {
          const sortedServices = _.sortBy(services, [(o) => Number(o.fee)]);
          const cheapestService = sortedServices[0];

          if (cheapestService) {
            finalServiceCode = cheapestService.serviceCode;
            finalFee = cheapestService.fee;
          }
        } else if (isCurrentCodeValid) {
          const currentService = _.find(
            services,
            (srv) => Number(srv.serviceCode) === Number(finalServiceCode)
          );
          if (currentService) {
            finalFee = currentService.fee;
          }
        }

        return {
          ...s,
          serviceCode: Number(finalServiceCode),
          shippingFee: finalFee,
          vouchers: _.get(freshShop, "voucherResult.validVouchers", s.vouchers),
        };
      });

      setRequest({ ...variables, shops: updatedShops });
    },

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
    onError: (err: any) => {
      const errCode = _.get(err, "response.data.code");
      if (errCode === 3001) {
        previewMutation.mutate(request);
        toastError(
          "Thông tin vận chuyển vừa cập nhật. Vui lòng nhấn Đặt hàng lần nữa."
        );
      } else {
        toastError(_.get(err, "response.data.message") || "Đặt hàng thất bại");
      }
    },
    onSettled: () => setLoading(false),
  });

  const updateShippingMethod = async (shopId: string, methodCode: string) => {
    if (!request) return;
    const updatedRequest = {
      ...request,
      shops: request.shops.map((s: any) =>
        s.shopId === shopId ? { ...s, serviceCode: Number(methodCode) } : s
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
