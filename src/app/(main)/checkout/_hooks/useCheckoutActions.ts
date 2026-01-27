import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
import { useAppDispatch } from "@/store/store";
import { orderService } from "@/services/orders/order.service";
import { useToast } from "@/hooks/useToast";
import {
  preparePreviewCheckoutPayload,
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

  const lastRequestIdRef = useRef<number | null>(null);

  const previewMutation = useMutation({
    mutationFn: async (params: any) => {
      const updatedRequest = params?.payload ?? params;
      const finalPayload = preparePreviewCheckoutPayload(updatedRequest);
      try {
        const reqStr = JSON.stringify(updatedRequest);
        const payloadStr = JSON.stringify(finalPayload);
        console.debug("SYNC_PREVIEW_DEBUG", {
          updatedRequest: reqStr,
          finalPayload: payloadStr,
        });
      } catch (e) {}
      return await dispatch(
        checkoutPreviewAction({
          ...finalPayload,
          promotion: finalPayload.promotion || [],
        }),
      ).unwrap();
    },
    onMutate: () => setLoading(true),

    onSuccess: (result: any, variables: any) => {
      const respId = variables?._clientRequestId;
      if (
        respId &&
        lastRequestIdRef.current &&
        respId !== lastRequestIdRef.current
      ) {
        console.debug("IGNORED_STALE_PREVIEW", {
          respId,
          last: lastRequestIdRef.current,
        });
        setLoading(false);
        return;
      }

      const previewData = result?.data || result;
      setPreview(previewData);

      const shopDataFromBackend = _.get(previewData, "shops", []);
      const backendSummaryGlobals =
        _.get(previewData, "summary.globalVouchers", []) || [];

      const variablesReq = variables?.payload ?? variables;

      const updatedShops = (variablesReq?.shops || []).map((s: any) => {
        const freshShop = _.find(shopDataFromBackend, { shopId: s.shopId });

        const validDetails = _.get(
          freshShop,
          "voucherResult.discountDetails",
          [],
        ).filter((d: any) => d.valid);

        const validCodes = validDetails.map((d: any) => d.voucherCode);

        const shopSpecificGlobals = validCodes.filter(
          (c: string) =>
            backendSummaryGlobals.includes(c) ||
            validDetails.find(
              (d: any) => d.voucherCode === c && d.voucherType === "PLATFORM",
            ),
        );

        const shopSpecificVouchers = validCodes.filter(
          (c: string) => !shopSpecificGlobals.includes(c),
        );

        const finalVouchers =
          s.vouchers !== undefined ? s.vouchers : shopSpecificVouchers;
        const finalGlobalVouchers =
          s.globalVouchers !== undefined
            ? s.globalVouchers
            : shopSpecificGlobals;

        const serverSelectedMethod = _.get(freshShop, "selectedShippingMethod");
        const finalServiceCode = serverSelectedMethod
          ? Number(serverSelectedMethod)
          : s.serviceCode;

        return {
          ...s,
          serviceCode: finalServiceCode,
          shippingFee: _.get(freshShop, "summary.shippingFee", s.shippingFee),
          vouchers: finalVouchers,
          globalVouchers: finalGlobalVouchers,
        };
      });

      setRequest({
        ...variablesReq,
        shops: updatedShops,
        globalVouchers:
          backendSummaryGlobals.length > 0
            ? backendSummaryGlobals
            : variablesReq?.globalVouchers || [],
      });
    },
    onSettled: () => setLoading(false),
  });

  const updateShippingMethod = async (shopId: string, methodCode: string) => {
    if (!request || !request.shops) return;
    const updatedRequest = {
      ...request,
      shops: request.shops.map((s: any) =>
        s.shopId === shopId
          ? { ...s, serviceCode: methodCode ? Number(methodCode) : null }
          : s,
      ),
    };
    try {
      return await syncPreview(updatedRequest);
    } catch (error) {
      throw error;
    }
  };

  const syncPreview = async (req: any) => {
    const id = Date.now();
    lastRequestIdRef.current = id;
    return await previewMutation.mutateAsync({
      payload: req,
      _clientRequestId: id,
    });
  };

  const confirmOrder = (note: string, method: string) =>
    orderMutation.mutateAsync({ customerNote: note, paymentMethod: method });

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
          "Thông tin vận chuyển vừa cập nhật. Vui lòng nhấn Đặt hàng lần nữa.",
        );
      } else {
        toastError(_.get(err, "response.data.message") || "Đặt hàng thất bại");
      }
    },
    onSettled: () => setLoading(false),
  });

  return {
    syncPreview: (req: any) => syncPreview(req),
    updateShippingMethod,
    confirmOrder,
    isLoading: previewMutation.isPending || orderMutation.isPending,
  };
};
