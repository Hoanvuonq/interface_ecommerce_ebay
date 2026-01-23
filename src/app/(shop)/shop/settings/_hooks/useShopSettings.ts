"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shopSettingsService } from "../_service/settings.shipping.service";
import { useToast } from "@/hooks/useToast";

export function useShopSettings() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const { data: shippingChannels = [], isLoading: isLoadingShipping } =
    useQuery({
      queryKey: ["shop-shipping-settings"],
      queryFn: () => shopSettingsService.getShippingSettings(),
    });

  const { data: paymentMethods = [], isLoading: isLoadingPayment } = useQuery({
    queryKey: ["shop-payment-settings"],
    queryFn: () => shopSettingsService.getPaymentSettings(),
  });

  const toggleShippingMutation = useMutation({
    mutationFn: (channelCode: string) =>
      shopSettingsService.toggleShippingChannel(channelCode),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shop-shipping-settings"] });
      toastSuccess(
        `Đã ${data.enabled ? "bật" : "tắt"} kênh ${data.channelName}`,
      );
    },
    onError: () => {
      toastError("Không thể thay đổi cấu hình vận chuyển");
    },
  });

  const togglePaymentMutation = useMutation({
    mutationFn: (methodCode: string) =>
      shopSettingsService.togglePaymentMethod(methodCode),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shop-payment-settings"] });
      toastSuccess(
        `Đã ${data.enabled ? "bật" : "tắt"} phương thức ${data.methodName}`,
      );
    },
    onError: () => {
      toastError("Không thể thay đổi cấu hình thanh toán");
    },
  });

  return {
    shippingChannels,
    paymentMethods,
    isLoading: isLoadingShipping || isLoadingPayment,
    isUpdating:
      toggleShippingMutation.isPending || togglePaymentMutation.isPending,

    toggleShipping: toggleShippingMutation.mutate,
    togglePayment: togglePaymentMutation.mutate,
  };
}
