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

  const hasAutoApplied = useRef<Record<string, boolean>>({});

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
    enabled:
      (!!fetchParams.totalAmount && (!!shopId || forcePlatform)) || modalOpen,
    staleTime: 1000 * 60 * 5,
  });

  const currentOrderVoucherCode =
    _.get(appliedVouchers, "order.code") || _.get(appliedVouchers, "order");
  const currentShipVoucherCode =
    _.get(appliedVouchers, "shipping.code") ||
    _.get(appliedVouchers, "shipping");

  useEffect(() => {
    const shopKey = `${shopId || "platform"}-${forcePlatform ? "p" : "s"}`;

    if (!isLoading && vouchersData && !hasAutoApplied.current[shopKey]) {
      if (!currentOrderVoucherCode && !currentShipVoucherCode) {
        let bestOrder: any = null;
        let bestShipping: any = null;

        if (Array.isArray(vouchersData)) {
          const applicableVouchers = vouchersData.filter(
            (v: any) => v.canSelect !== false && !v.disabled
          );
          bestOrder = _.maxBy(applicableVouchers, "discountAmount");
        } else {
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
          hasAutoApplied.current[shopKey] = true; 
          onSelectVoucher?.({
            order: bestOrder || undefined,
            shipping: bestShipping || undefined,
          });
        }
      }
    }
  }, [
    vouchersData,
    isLoading,
    shopId,
    currentOrderVoucherCode,
    currentShipVoucherCode,
  ]);

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
