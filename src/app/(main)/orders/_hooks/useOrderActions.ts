import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orders/order.service";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";

export const useOrderActions = (
  orderId: string, 
  currentStatus: string, 
  onOrderCancelled?: () => void
) => {
  const queryClient = useQueryClient();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const {
    error: toastError,
    success: toastSuccess,
  } = useToast();
  const { mutate: cancelOrder, isPending: cancelling } = useMutation({
    mutationFn: (reason: string) => orderService.cancelOrder(orderId, reason),
    onSuccess: () => {
      toastSuccess("Đã hủy đơn hàng thành công");
      setCancelModalVisible(false);
      setCancelReason("");
      
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      
      onOrderCancelled?.();
    },
    onError: (error: any) => {
      toastError(error?.response?.data?.message || "Không thể hủy đơn hàng.");
    },
  });

  const handleConfirmCancel = () => {
    const trimmedReason = cancelReason.trim();
    if (!trimmedReason) {
      toastError("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }
    cancelOrder(trimmedReason);
  };

  const statusLogic = useMemo(() => ({
    canCancel: ["CREATED", "PENDING_PAYMENT"].includes(currentStatus),
    isPendingPayment: currentStatus === "PENDING_PAYMENT",
    isDelivered: currentStatus === "DELIVERED",
  }), [currentStatus]);

  return {
    state: { 
      cancelModalVisible, 
      cancelReason, 
      cancelling, 
      ...statusLogic 
    },
    actions: { 
      setCancelModalVisible, 
      setCancelReason, 
      handleConfirmCancel,
      openCancelModal: () => setCancelModalVisible(true),
      closeCancelModal: () => {
        setCancelModalVisible(false);
        setCancelReason("");
      }
    },
  };
};

export const useOrderCancelMutation = (orderId: string) => {
  const queryClient = useQueryClient();
  const {
    error: toastError,
    success: toastSuccess,
  } = useToast();
  return useMutation({
    mutationFn: (reason: string) => orderService.cancelOrder(orderId, reason),
    onSuccess: () => {
      toastSuccess("Hủy đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "detail", orderId] });
    },
    onError: (error: any) => {
      toastError(_.get(error, "response.data.message", "Không thể hủy đơn hàng"));
    }
  });
};