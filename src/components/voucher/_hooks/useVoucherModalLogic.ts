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
  // useVoucherModalLogic.ts
  // useVoucherModalLogic.ts
  useEffect(() => {
    if (open && request) {
      let savedOrderCode: string | undefined;
      let savedShipCode: string | undefined;

      // 1. Tìm đúng shop trong Store dựa trên shopId đang mở modal
      const shopReq = request.shops?.find((s: any) => s.shopId === shopId);

      // 2. Gộp TẤT CẢ các mã liên quan đến shop này từ Store (vouchers + globalVouchers)
      // Payload của bạn cho thấy mã "FREESHIP_MAX1" nằm trong globalVouchers của shop
      const allAppliedCodes = [
        ...(shopReq?.vouchers || []),
        ...(shopReq?.globalVouchers || []),
        ...(isPlatform ? request.globalVouchers || [] : []),
      ];

      // 3. Lấy thông tin chi tiết từ previewData (Backend) để biết mã nào là SHIP, mã nào là ORDER
      const shopsArray = previewData?.data?.shops || previewData?.shops || [];
      const shopPreview = shopsArray.find((s: any) => s.shopId === shopId);
      const discountDetails = shopPreview?.voucherResult?.discountDetails || [];

      // 4. Duyệt qua danh sách mã đã áp dụng trong Store và so khớp với loại (Target) của nó
      allAppliedCodes.forEach((code) => {
        const detail = discountDetails.find((d: any) => d.voucherCode === code);
        if (detail && detail.valid) {
          // Nếu Target là SHIP hoặc SHIPPING -> Gán vào ô chọn Shipping
          if (
            detail.discountTarget === "SHIP" ||
            detail.discountTarget === "SHIPPING"
          ) {
            savedShipCode = code;
          }
          // Nếu Target là ORDER hoặc PRODUCT -> Gán vào ô chọn Order
          if (
            detail.discountTarget === "ORDER" ||
            detail.discountTarget === "PRODUCT"
          ) {
            savedOrderCode = code;
          }
        }
      });

      // 5. Nếu Store hoàn toàn trống (lần đầu mở), mới dùng tới gợi ý mặc định của Server
      if (!savedOrderCode && !savedShipCode) {
        const recOrder = discountDetails.find(
          (v: any) =>
            v.valid &&
            (v.discountTarget === "ORDER" || v.discountTarget === "PRODUCT")
        );
        const recShip = discountDetails.find(
          (v: any) =>
            v.valid &&
            (v.discountTarget === "SHIP" || v.discountTarget === "SHIPPING")
        );
        savedOrderCode = recOrder?.voucherCode;
        savedShipCode = recShip?.voucherCode;
      }

      // 6. Cập nhật state để UI hiển thị dấu tích (Active)
      setTempSelection({
        order: savedOrderCode,
        shipping: savedShipCode,
      });
    }
  }, [open, previewData, shopId, request, isPlatform]);
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
