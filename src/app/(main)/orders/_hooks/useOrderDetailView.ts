import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orders/order.service";
import { OrderResponse, OrderItemResponse } from "@/types/orders/order.types";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";

export const useOrderDetailView = (order: OrderResponse) => {
  const { success, warning, error, info } = useToast();
  const queryClient = useQueryClient();

  const [refreshKey, setRefreshKey] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItemResponse | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const reviewed = new Set<string>();
    order.items?.forEach((item) => {
      if (item.reviewed && item.productId) {
        reviewed.add(item.productId);
      }
    });
    setReviewedProductIds(reviewed);
  }, [order]);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    success("Đã sao chép mã đơn hàng");
  };

  const handleRefresh = () => {
  setRefreshKey((prev) => prev + 1);
  queryClient.invalidateQueries({ queryKey: ["orders"] }); 
  queryClient.invalidateQueries({ queryKey: ["order", order.orderId] });
};

  const handleReviewClick = (item: OrderItemResponse) => {
    if (item.productId && reviewedProductIds.has(item.productId)) {
      info("Bạn đã đánh giá sản phẩm này rồi.");
      return;
    }
    setSelectedItem(item);
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    if (selectedItem?.productId) {
      setReviewedProductIds((prev) => new Set(prev).add(selectedItem.productId!));
    }
     success("Đánh giá thành công!");
  queryClient.invalidateQueries({ queryKey: ["orders", "detail", order.orderId] });
    handleRefresh();
  };
  

const handleCancelOrder = async (reason: string) => {
  if (!_.trim(reason)) {
    warning("Vui lòng nhập hoặc chọn lý do hủy đơn hàng");
    return;
  }

  setCancelling(true);
  try {
    // Truyền tham số 'reason' vào service
    await orderService.cancelOrder(order.orderId, reason.trim());
    success("Hủy đơn hàng thành công");
    setCancelModalVisible(false);
    
    await handleRefresh(); 
  } catch (err: any) {
    error(_.get(err, "response.data.message", "Không thể hủy đơn hàng"));
  } finally {
    setCancelling(false);
  }
};

  return {
    state: {
      refreshKey,
      reviewModalOpen,
      selectedItem,
      cancelModalVisible,
      cancelReason,
      cancelling,
      reviewedProductIds,
    },
    actions: {
      setReviewModalOpen,
      setSelectedItem,
      setCancelModalVisible,
      setCancelReason,
      handleCopyOrderNumber,
      handleRefresh,
      handleReviewClick,
      handleReviewSuccess,
      handleCancelOrder,
      handleCancelPayment: () => setRefreshKey(prev => prev + 1),
    }
  };
};