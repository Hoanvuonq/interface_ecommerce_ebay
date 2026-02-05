"use client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import _ from "lodash";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { checkoutPreviewMain as checkoutPreviewAction } from "../../checkout/_store/checkoutSlice";
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
  const store = useCheckoutStore();

  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  const previewMutation = useMutation({
    mutationFn: async (req: any) => {
      const payload = preparePreviewCheckoutPayload(req);
      return await dispatch(checkoutPreviewAction(payload)).unwrap();
    },
    onMutate: () => store.setIsSyncing(true),
    onSuccess: (result: any) => {
      const previewData = result?.data || result;
      store.setPreview(previewData);

      store.syncRequestFromPreview(previewData);
    },
    onError: (err: any) => {
      console.error("Preview Sync Error:", err);
    },
    onSettled: () => store.setIsSyncing(false),
  });

  const syncPreview = useCallback(
    (req?: any) => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

      if (req) store.setRequest(req);
      store.setIsSyncing(true);

      return new Promise((resolve, reject) => {
        syncTimerRef.current = setTimeout(async () => {
          try {
            const latestRequest = useCheckoutStore.getState().request;
            if (!latestRequest) return resolve(null);

            const result = await previewMutation.mutateAsync(latestRequest);
            resolve(result);
          } catch (err) {
            reject(err);
          } finally {
            syncTimerRef.current = null;
          }
        }, 400); 
      });
    },
    [previewMutation, store],
  );

  const orderMutation = useMutation({
    mutationFn: async (params: any) => {
      const { request, preview, savedAddresses } = useCheckoutStore.getState();
      if (!request || !preview) throw new Error("Dữ liệu không hợp lệ");

      const finalRequest = prepareOrderRequest({
        ...params,
        preview,
        request,
        savedAddresses,
      });
      return await orderService.createOrder(finalRequest);
    },
    onMutate: () => store.setLoading(true),
    onSuccess: (res) => {
      sessionStorage.removeItem("checkout-storage");
      toastSuccess("Đặt hàng thành công!");
      return res;
    },
    onError: (err: any) => {
      const msg = _.get(err, "response.data.message", "Đặt hàng thất bại");
      toastError(msg);
    },
    onSettled: () => store.setLoading(false),
  });

  const confirmOrder = (customerNote: string, paymentMethod: string) =>
    orderMutation.mutateAsync({ customerNote, paymentMethod });

  // Cập nhật phương thức vận chuyển
  const updateShippingMethod = async (shopId: string, methodCode: string) => {
    const current = useCheckoutStore.getState().request;
    if (!current) return;

    const next = {
      ...current,
      shops: current.shops.map((s: any) =>
        s.shopId === shopId
          ? { ...s, serviceCode: Number(methodCode), shippingFee: 0 }
          : s,
      ),
    };
    return await syncPreview(next);
  };

  return {
    syncPreview,
    confirmOrder,
    updateShippingMethod,
    isLoading:
      store.isSyncing || previewMutation.isPending || orderMutation.isPending,
  };
};
