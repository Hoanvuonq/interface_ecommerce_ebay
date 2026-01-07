"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { voucherService } from "@/components/voucher/_service/voucher.service";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";
import {
  VoucherOption,
  GroupedVouchers,
  VoucherInputProps,
  VoucherSelection,
} from "../_types/voucher";

export const useVoucherLogic = (props: VoucherInputProps) => {
  const {
    shopId,
    context,
    forcePlatform,
    onSelectVoucher,
    onApplyVoucher,
    appliedVouchers,
  } = props;
  const { success: SuccessToast, error: ErrorToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const hasAutoApplied = useRef<Record<string, boolean>>({});

  const fetchParams = useMemo(
    () => ({
      shopId: shopId,
      totalAmount: Number(context?.totalAmount || 0),
      items: context?.items || [],
      shippingFee: Number(context?.shippingFee || 0),
      shippingMethod: context?.shippingMethod || "",
      shippingProvince: context?.shippingProvince || "",
      shippingDistrict: context?.shippingDistrict || "",
      shippingWard: context?.shippingWard || "",
      shopIds: context?.shopIds || (shopId ? [shopId] : []),
      productIds: context?.productIds || [],
      failedVoucherCodes: context?.failedVoucherCodes || [],
      preferences: {
        scopes: ["SHOP_ORDER", "SHIPPING"],
        limit: 20,
      },
    }),
    [shopId, context]
  );

  const {
    data: vouchersData,
    isLoading,
    refetch,
  } = useQuery<GroupedVouchers | VoucherOption[]>({
    queryKey: [
      "vouchers",
      forcePlatform ? "platform" : "shop",
      shopId,
      fetchParams,
    ],
    queryFn: async () => {
      if (forcePlatform || !shopId) {
        const data = await voucherService.getPlatformVouchersWithContext(
          fetchParams
        );
        return data as unknown as GroupedVouchers;
      }
      const data = await voucherService.getShopVouchersWithContext(fetchParams);
      return data as unknown as VoucherOption[];
    },
    enabled:
      modalOpen || (!!fetchParams.totalAmount && (!!shopId || forcePlatform)),
    staleTime: 1000 * 60 * 5,
  });

  const isGrouped = (data: any): data is GroupedVouchers => {
    return (
      data &&
      !Array.isArray(data) &&
      ("productOrderVouchers" in data || "shippingVouchers" in data)
    );
  };

  const currentOrderVoucherId =
    _.get(appliedVouchers, "order.id") || _.get(appliedVouchers, "order.code");
  const currentShipVoucherId =
    _.get(appliedVouchers, "shipping.id") ||
    _.get(appliedVouchers, "shipping.code");

  useEffect(() => {
    const shopKey = `${shopId || "platform"}-${forcePlatform ? "p" : "s"}`;

    if (!isLoading && vouchersData && !hasAutoApplied.current[shopKey]) {
      if (!currentOrderVoucherId && !currentShipVoucherId) {
        let bestOrder: VoucherOption | undefined;
        let bestShipping: VoucherOption | undefined;

        if (isGrouped(vouchersData)) {
          const appOrder = (vouchersData.productOrderVouchers || []).filter(
            (v) => v.applicable
          );
          const appShip = (vouchersData.shippingVouchers || []).filter(
            (v) => v.applicable
          );

          bestOrder = _.maxBy(appOrder, "calculatedDiscount");
          bestShipping = _.maxBy(appShip, "calculatedDiscount");
        } else if (Array.isArray(vouchersData)) {
          const applicable = vouchersData.filter((v) => v.applicable);
          bestOrder = _.maxBy(
            applicable.filter((v) => v.voucherScope !== "SHIPPING"),
            "discountAmount"
          );
          bestShipping = _.maxBy(
            applicable.filter((v) => v.voucherScope === "SHIPPING"),
            "discountAmount"
          );
        }

        if (bestOrder || bestShipping) {
          hasAutoApplied.current[shopKey] = true;
          onSelectVoucher?.({
            order: bestOrder,
            shipping: bestShipping,
          });
        }
      }
    }
  }, [
    vouchersData,
    isLoading,
    shopId,
    currentOrderVoucherId,
    currentShipVoucherId,
    forcePlatform,
    onSelectVoucher,
  ]);

  useEffect(() => {
    hasAutoApplied.current = {};
  }, [context?.totalAmount]);

  const applyMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!onApplyVoucher) throw new Error("Tính năng chưa khả dụng");
      return await onApplyVoucher(shopId || "platform", code);
    },
    onSuccess: (success) => {
      if (success) {
        SuccessToast("Áp dụng mã thành công!");
        setVoucherCode("");
        refetch();
      } else {
        ErrorToast("Mã không khả dụng");
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
