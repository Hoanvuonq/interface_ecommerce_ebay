import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { voucherService } from "@/components/voucher/_service/voucher.service";
import { toast } from "sonner";
import _ from "lodash";

export const useVoucherLogic = (props: any) => {
  const { shopId, context, forcePlatform, onSelectVoucher, onApplyVoucher } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");

  const fetchParams = useMemo(() => {
    const totalAmount = Number(_.get(context, "totalAmount", 0));
    const shippingFee = Number(_.get(context, "shippingFee", 0));
    const defaultPreferences = { scopes: ["SHOP_ORDER", "SHIPPING"], limit: 10 };
    const payload: any = {
      totalAmount,
      shippingFee,
      shopIds: _.get(context, "shopIds", shopId ? [shopId] : []),
      productIds: _.get(context, "productIds", []),
      failedVoucherCodes: _.get(context, "failedVoucherCodes", []),
      preferences: _.merge(defaultPreferences, _.get(context, "preferences", {}))
    };
    if (shopId) payload.shopId = shopId;
    return payload;
  }, [JSON.stringify(context), shopId]);

  const { data: vouchersData, isLoading, refetch } = useQuery({
    queryKey: ["vouchers", forcePlatform ? "platform" : "shop", shopId, fetchParams],
    queryFn: async () => {
      if (forcePlatform || !shopId) {
        return await voucherService.getPlatformVouchersWithContext(fetchParams);
      }
      return await voucherService.getShopVouchersWithContext(fetchParams);
    },
    enabled: modalOpen,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

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
    onError: (err: any) => toast.error(_.get(err, 'message', "Không thể áp dụng")),
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
      }
    }
  };
};