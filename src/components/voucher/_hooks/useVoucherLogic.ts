import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { voucherService } from "@/components/voucher/_service/voucher.service";
import { toast } from "sonner";
import _ from "lodash";
import { VoucherOption, GroupedVouchers } from "../_types/voucher";

export const useVoucherLogic = (props: any) => {
  const {
    shopId,
    context,
    forcePlatform,
    onSelectVoucher,
    onApplyVoucher,
    appliedVouchers,
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");

  // Dùng ref để tránh việc auto-apply chạy lại quá nhiều lần trong 1 phiên làm việc
  const hasAutoApplied = useRef<Record<string, boolean>>({});

  // Memoize fetchParams để tránh trigger refetch rác
  const fetchParams = useMemo(() => {
    const totalAmount = Number(_.get(context, "totalAmount", 0));
    const shippingFee = Number(_.get(context, "shippingFee", 0));

    const defaultPreferences = {
      scopes: ["SHOP_ORDER", "SHIPPING"],
      limit: 10,
    };

    return {
      totalAmount,
      shippingFee,
      shopIds: _.get(context, "shopIds", shopId ? [shopId] : []),
      productIds: _.get(context, "productIds", []),
      failedVoucherCodes: _.get(context, "failedVoucherCodes", []),
      preferences: _.merge(
        defaultPreferences,
        _.get(context, "preferences", {})
      ),
    };
    // Sử dụng ?. để an toàn tuyệt đối khi context chưa load
  }, [
    context?.totalAmount,
    context?.shippingFee,
    shopId,
    context?.shopIds?.length,
  ]);

  const {
    data: vouchersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "vouchers",
      forcePlatform ? "platform" : "shop",
      shopId,
      fetchParams,
    ],
    queryFn: async () => {
      if (forcePlatform || !shopId) {
        return await voucherService.getPlatformVouchersWithContext(fetchParams);
      }
      return await voucherService.getShopVouchersWithContext(fetchParams);
    },
    // Query chỉ chạy khi có đủ context hoặc người dùng chủ động mở modal
    enabled:
      (!!fetchParams.totalAmount && (!!shopId || forcePlatform)) || modalOpen,
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  // Lấy mã code hiện tại để so sánh trong useEffect
  const currentOrderVoucherCode =
    _.get(appliedVouchers, "order.code") || _.get(appliedVouchers, "order");
  const currentShipVoucherCode =
    _.get(appliedVouchers, "shipping.code") ||
    _.get(appliedVouchers, "shipping");

  // LOGIC TỰ ĐỘNG CHỌN VOUCHER TỐI ƯU NHẤT
  useEffect(() => {
    const shopKey = `${shopId || "platform"}-${forcePlatform ? "p" : "s"}`;

    if (!isLoading && vouchersData && !hasAutoApplied.current[shopKey]) {
      // Chỉ tự động chọn nếu người dùng chưa chọn mã nào cho mục này
      if (!currentOrderVoucherCode && !currentShipVoucherCode) {
        let bestOrder: any = null;
        let bestShipping: any = null;

        if (Array.isArray(vouchersData)) {
          // Shop Vouchers: Lọc ra các mã dùng được và tìm mã giảm cao nhất
          const applicableVouchers = vouchersData.filter(
            (v: any) => v.canSelect !== false && !v.disabled
          );
          bestOrder = _.maxBy(applicableVouchers, "discountAmount");
        } else {
          // Platform Vouchers: Tìm mã tốt nhất cho Đơn hàng và Vận chuyển riêng biệt
          const appOrderVouchers = (
            vouchersData.productOrderVouchers || []
          ).filter((v: any) => v.canSelect !== false);
          const appShipVouchers = (vouchersData.shippingVouchers || []).filter(
            (v: any) => v.canSelect !== false
          );

          bestOrder = _.maxBy(appOrderVouchers, "discountAmount");
          bestShipping = _.maxBy(appShipVouchers, "discountAmount");
        }

        if (bestOrder || bestShipping) {
          hasAutoApplied.current[shopKey] = true; // Đánh dấu đã auto-apply thành công

          // Trì hoãn một chút để tránh xung đột render nếu có nhiều Shop component cùng chạy
          onSelectVoucher?.({
            order: bestOrder || undefined,
            shipping: bestShipping || undefined,
          });
        }
      }
    }
    // Dependency chuẩn để không bị loop
  }, [
    vouchersData,
    isLoading,
    shopId,
    currentOrderVoucherCode,
    currentShipVoucherCode,
  ]);

  // Reset cờ auto-apply khi số tiền thay đổi đáng kể (khách thay đổi giỏ hàng)
  useEffect(() => {
    hasAutoApplied.current = {};
  }, [context?.totalAmount]);

  const applyMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!onApplyVoucher || !shopId) throw new Error("Cấu hình không hợp lệ");
      return await onApplyVoucher(shopId, code);
    },
    onSuccess: (success) => {
      if (success) {
        toast.success("Áp dụng voucher thành công!");
        setVoucherCode("");
        refetch();
      } else {
        toast.error("Mã voucher không hợp lệ");
      }
    },
    onError: (err: any) =>
      toast.error(_.get(err, "message", "Không thể áp dụng")),
  });

  return {
    state: {
      modalOpen,
      voucherCode,
      vouchersData,
      isLoading,
      isApplying: applyMutation.isPending,
    },
    actions: {
      setModalOpen,
      setVoucherCode,
      applyVoucher: (code: string) => applyMutation.mutate(code),
      handleConfirm: async (selected: any) => {
        setModalOpen(false);
        if (onSelectVoucher) await onSelectVoucher(selected || {});
      },
    },
  };
};
