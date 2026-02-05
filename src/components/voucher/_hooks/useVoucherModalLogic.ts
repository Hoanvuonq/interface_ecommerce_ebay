"use client";
import { useState, useEffect, useTransition, useCallback } from "react";
import {
  GroupedVouchers,
  VoucherOption,
  VoucherModalProps,
  VoucherSelection,
} from "@/components/voucher/_types/voucher";
import _ from "lodash";
import { useCheckoutStore } from "@/app/(main)/checkout/_store/useCheckoutStore";

export const useVoucherModalLogic = (props: VoucherModalProps) => {
  const {
    open,
    appliedVouchers,
    onFetchVouchers,
    onClose,
    onConfirm,
    previewData,
    shopId,
    isPlatform,
  } = props;

  const { request } = useCheckoutStore();
  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [vouchers, setVouchers] = useState<VoucherOption[]>([]);

  const [isGrouped, setIsGrouped] = useState(false);
  const [groupedVouchers, setGroupedVouchers] = useState<GroupedVouchers>({
    productOrderVouchers: [],
    shippingVouchers: [],
  });

  const [tempSelection, setTempSelection] = useState<{
    order?: string;
    shipping?: string;
  }>({});

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open && request && previewData) {
      let savedOrderCode: string | undefined;
      let savedShipCode: string | undefined;

      const shopsArray = previewData?.shops || [];
      const shopPreview = _.find(shopsArray, { shopId });

      const validVouchers = _.get(shopPreview, "voucher.valid", []) as any[];

      const targetType = isPlatform ? "PLATFORM" : "SHOP";
      const filteredVouchers = validVouchers.filter(
        (v) => v.type === targetType,
      );

      const shipVoucher = _.find(filteredVouchers, (v) =>
        ["SHIP", "SHIPPING"].includes(v.target),
      );
      savedShipCode = shipVoucher?.code;

      const orderVoucher = _.find(filteredVouchers, (v) =>
        ["ORDER", "PRODUCT"].includes(v.target),
      );
      savedOrderCode = orderVoucher?.code;

      if (!savedOrderCode && appliedVouchers?.order) {
        savedOrderCode =
          (appliedVouchers.order as any).code ||
          (appliedVouchers.order as any).voucherCode;
      }
      if (!savedShipCode && appliedVouchers?.shipping) {
        savedShipCode =
          (appliedVouchers.shipping as any).code ||
          (appliedVouchers.shipping as any).voucherCode;
      }

      setTempSelection({
        order: savedOrderCode,
        shipping: savedShipCode,
      });
    }
  }, [open, previewData, shopId, isPlatform]);

  // 🟢 2. Fetch danh sách Voucher khả dụng (Dùng cho Modal List)
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

  const toggleOrderVoucher = useCallback((code?: string) => {
    setTempSelection((prev) => ({
      ...prev,
      order: prev.order === code ? undefined : code,
    }));
  }, []);

  const toggleShipVoucher = useCallback((code?: string) => {
    setTempSelection((prev) => ({
      ...prev,
      shipping: prev.shipping === code ? undefined : code,
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    const findV = (list: VoucherOption[], code?: string) =>
      list.find((v) => v.code === code || v.id === code);

    const selection: VoucherSelection = {};
    const allOrder = isGrouped
      ? groupedVouchers.productOrderVouchers
      : vouchers.filter((v) => v.voucherScope !== "SHIPPING");
    const allShip = isGrouped
      ? groupedVouchers.shippingVouchers
      : vouchers.filter((v) => v.voucherScope === "SHIPPING");

    selection.order = findV(allOrder, tempSelection.order);
    selection.shipping = findV(allShip, tempSelection.shipping);

    onConfirm(selection);
    onClose();
  }, [isGrouped, groupedVouchers, vouchers, tempSelection, onConfirm, onClose]);

  return {
    state: {
      voucherCode,
      vouchers,
      groupedVouchers,
      isGrouped,
      loading,
      selectedOrderVoucherId: tempSelection.order,
      selectedShippingVoucherId: tempSelection.shipping,
      isPending,
    },
    actions: {
      setVoucherCode,
      setSelectedOrderVoucherId: toggleOrderVoucher,
      setSelectedShippingVoucherId: toggleShipVoucher,
      handleConfirm,
    },
  };
};
