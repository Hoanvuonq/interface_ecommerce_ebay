"use client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useCheckoutStore } from "../_store/useCheckoutStore";
import { checkoutPreview as checkoutPreviewAction } from "@/store/theme/cartSlice";
import { useAppDispatch } from "@/store/store";
import { orderService } from "@/services/orders/order.service";
import { useToast } from "@/hooks/useToast";
import {
  preparePreviewCheckoutPayload,
  prepareOrderRequest,
} from "../_utils/checkout.mapper";

let globalSyncTimer: NodeJS.Timeout | null = null;

export const useCheckoutActions = () => {
  const dispatch = useAppDispatch();
  const { success: toastSuccess, error: toastError } = useToast();
  const store = useCheckoutStore();

  const previewMutation = useMutation({
    mutationFn: async (req: any) => {
      const payload = preparePreviewCheckoutPayload(req);
      return await dispatch(checkoutPreviewAction(payload)).unwrap();
    },
    onMutate: () => store.setIsSyncing(true),
    onSuccess: (result: any) => {
      const previewData = result?.data || result;
      store.setPreview(previewData);
      store.syncRequestFromPreview(result);
    },
    onError: (err: any) => {
      console.error("Preview Sync Error:", err);
    },
    onSettled: () => {
      store.setIsSyncing(false);
    },
  });

  const syncPreview = useCallback(
    (req?: any) => {
      if (globalSyncTimer) clearTimeout(globalSyncTimer);

      if (req) store.setRequest(req);

      store.setIsSyncing(true);

      return new Promise((resolve, reject) => {
        globalSyncTimer = setTimeout(async () => {
          try {
            const latestRequest = useCheckoutStore.getState().request;
            if (!latestRequest) return;

            const result = await previewMutation.mutateAsync(latestRequest);
            resolve(result);
          } catch (err) {
            reject(err);
          } finally {
            globalSyncTimer = null;
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
      const msg =
        err?.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại";
      toastError(msg);
    },
    onSettled: () => store.setLoading(false),
  });

  const confirmOrder = (customerNote: string, paymentMethod: string) =>
    orderMutation.mutateAsync({ customerNote, paymentMethod });

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
