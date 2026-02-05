"use client";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { voucherService } from "@/components/voucher/_service/voucher.service";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";
import {
  VoucherOption,
  GroupedVouchers,
  VoucherInputProps,
  VoucherSelection,
  VoucherShopRequest,
  VoucherPlatformRequest
} from "../_types/voucher";

export const useVoucherLogic = (props: VoucherInputProps) => {
  const {
    shopId, // Dùng số ít
    context,
    forcePlatform,
    onSelectVoucher,
    onApplyVoucher,
    appliedVouchers,
  } = props;

  const { success: SuccessToast, error: ErrorToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");

  // 1. Chuẩn hóa Params gửi lên Server
  const fetchParams = useMemo(() => {
    const base: any = {
      totalAmount: Number(context?.totalAmount || 0),
      items: context?.items || [],
      shippingFee: Number(context?.shippingFee || 0),
      shippingProvince: context?.shippingProvince || "",
      preferences: { scopes: ["SHOP_ORDER", "SHIPPING", "ORDER"], limit: 20 },
    };

    if (forcePlatform) {
      return {
        ...base,
        shopIds: context?.shopIds || (shopId ? [shopId] : []),
        productIds: context?.productIds || [],
      } as VoucherPlatformRequest;
    }

    return {
      ...base,
      shopId: shopId || context?.shopId,
    } as VoucherShopRequest;
  }, [shopId, context, forcePlatform]);

  // 2. Fetch dữ liệu
  const {
    data: vouchersData,
    isLoading,
    refetch,
  } = useQuery<GroupedVouchers | VoucherOption[]>({
    queryKey: ["vouchers-list", forcePlatform ? "platform" : "shop", shopId, fetchParams],
    queryFn: async () => {
      if (forcePlatform) {
        return await voucherService.getPlatformVouchersWithContext(fetchParams as VoucherPlatformRequest);
      }
      return await voucherService.getShopVouchersWithContext(fetchParams as VoucherShopRequest);
    },
    enabled: modalOpen,
    staleTime: 1000 * 60 * 5,
  });

  const currentOrderVoucherId = _.get(appliedVouchers, "order.code");
  const currentShipVoucherId = _.get(appliedVouchers, "shipping.code");

  // 3. Xử lý Apply mã thủ công
  const applyMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!onApplyVoucher) throw new Error("Tính năng chưa khả dụng");
      return await onApplyVoucher(shopId || "platform", code);
    },
    onSuccess: (success) => {
      if (success) {
        SuccessToast("Áp dụng mã thành công!");
        setVoucherCode("");
        if (modalOpen) refetch();
      } else {
        ErrorToast("Mã không hợp lệ hoặc không đủ điều kiện");
      }
    },
    onError: (err: any) => ErrorToast(_.get(err, "message", "Lỗi hệ thống")),
  });

  return {
    state: {
      modalOpen,
      voucherCode,
      vouchersData,
      isLoading,
      isApplying: applyMutation.isPending,
      currentOrderVoucherId,
      currentShipVoucherId,
    },
    actions: {
      setModalOpen,
      setVoucherCode,
      applyVoucher: (code: string) => applyMutation.mutate(code),
      handleConfirm: async (selected: VoucherSelection) => {
        setModalOpen(false);
        if (onSelectVoucher) await onSelectVoucher(selected);
      },
    },
  };
};