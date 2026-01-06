import { useState, useEffect, useTransition, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import {
  GroupedVouchers,
  VoucherOption,
  VoucherModalProps,
} from "@/components/voucher/_types/voucher";
import _ from "lodash";

export const useVoucherModalLogic = (props: VoucherModalProps) => {
  const {
    open,
    appliedVouchers,
    appliedVoucher,
    onFetchVouchers,
    onClose,
    onConfirm,
  } = props;
  const [voucherCode, setVoucherCode] = useState("");
  const [vouchers, setVouchers] = useState<VoucherOption[]>([]);
  const [groupedVouchers, setGroupedVouchers] = useState<GroupedVouchers>({
    productOrderVouchers: [],
    shippingVouchers: [],
  });
  const [isGrouped, setIsGrouped] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedVoucher, setSelectedVoucher] = useState<{
    order?: string;
    shipping?: string;
  }>({});

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      const orderCode =
        _.get(appliedVouchers, "order.code") || _.get(appliedVouchers, "order");
      const shipCode =
        _.get(appliedVouchers, "shipping.code") ||
        _.get(appliedVouchers, "shipping");

      setSelectedVoucher({
      order: orderCode as string,
      shipping: shipCode as string,
    });
  }
}, [open, appliedVouchers]);

  // Fetch dữ liệu vouchers
  useEffect(() => {
    if (open && onFetchVouchers) {
      setLoading(true);
      onFetchVouchers()
        .then((result) => {
          if (!result) return;
          startTransition(() => {
            if (Array.isArray(result)) {
              setVouchers(result);
              setIsGrouped(false);
            } else {
              setGroupedVouchers(result);
              setIsGrouped(true);
            }
          });
        })
        .finally(() => setLoading(false));
    }
  }, [open, onFetchVouchers]);

  // Setters for selecting voucher
  const setSelectedOrderVoucherId = (id?: string) => {
    setSelectedVoucher((prev) => ({ ...prev, order: id }));
  };
  const setSelectedShippingVoucherId = (id?: string) => {
    setSelectedVoucher((prev) => ({ ...prev, shipping: id }));
  };

  const handleConfirm = useCallback(() => {
    const findV = (list: VoucherOption[], idOrCode?: string) =>
      list.find((v) => v.id === idOrCode || v.code === idOrCode);

    const result: any = {};
    if (isGrouped) {
      result.order = findV(
        groupedVouchers.productOrderVouchers,
        selectedVoucher.order
      );
      result.shipping = findV(
        groupedVouchers.shippingVouchers,
        selectedVoucher.shipping
      );
    } else {
      result.order = findV(vouchers, selectedVoucher.order);
      result.shipping = findV(vouchers, selectedVoucher.shipping);
    }

    onConfirm(result);
    onClose();
  }, [
    isGrouped,
    groupedVouchers,
    vouchers,
    selectedVoucher,
    onConfirm,
    onClose,
  ]);

  return {
    state: {
      voucherCode,
      vouchers,
      groupedVouchers,
      isGrouped,
      loading,
      selectedOrderVoucherId: selectedVoucher.order,
      selectedShippingVoucherId: selectedVoucher.shipping,
      isPending,
    },
    actions: {
      setVoucherCode,
      setSelectedOrderVoucherId,
      setSelectedShippingVoucherId,
      handleConfirm,
    },
  };
};
