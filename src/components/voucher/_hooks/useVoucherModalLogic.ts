"use client";
import { useState, useEffect, useTransition, useCallback } from "react";
import {
  GroupedVouchers,
  VoucherOption,
  VoucherModalProps,
  VoucherSelection,
} from "@/components/voucher/_types/voucher";
import _ from "lodash";

export const useVoucherModalLogic = (props: VoucherModalProps) => {
  const { open, appliedVouchers, onFetchVouchers, onClose, onConfirm, previewData, shopId } = props;

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
    if (open) {
      const shopPreview = previewData?.data?.shops?.find((s: any) => s.shopId === shopId);
      if (shopPreview?.voucherResult?.discountDetails) {
        const validDetails = shopPreview.voucherResult.discountDetails;
        const orderV = validDetails.find((v: any) => v.valid && v.discountTarget === "ORDER");
        const shipV = validDetails.find((v: any) => v.valid && v.discountTarget === "SHIP");

        setTempSelection({
          order: orderV?.voucherCode,
          shipping: shipV?.voucherCode,
        });
      } else {
        setTempSelection({
          order: _.get(appliedVouchers, "order.code") || _.get(appliedVouchers, "order.id"),
          shipping: _.get(appliedVouchers, "shipping.code") || _.get(appliedVouchers, "shipping.id"),
        });
      }
    }
  }, [open, previewData, shopId, appliedVouchers]);

  // Fetch danh sách voucher
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
    setTempSelection(prev => ({
      ...prev,
      order: prev.order === code ? undefined : code 
    }));
  }, []);

  const toggleShipVoucher = useCallback((code?: string) => {
    setTempSelection(prev => ({
      ...prev,
      shipping: prev.shipping === code ? undefined : code
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    const findV = (list: VoucherOption[], code?: string) =>
      list.find((v) => v.code === code || v.id === code);

    const selection: VoucherSelection = {};
    const allOrder = isGrouped ? groupedVouchers.productOrderVouchers : vouchers.filter(v => v.voucherScope !== 'SHIPPING');
    const allShip = isGrouped ? groupedVouchers.shippingVouchers : vouchers.filter(v => v.voucherScope === 'SHIPPING');

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