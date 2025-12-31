import { useState, useEffect, useTransition } from "react";
import { VoucherOption } from "@/services/voucher/voucher.service";
import { useToast } from "@/hooks/useToast";
import { GroupedVouchers,VoucherModalProps } from "@/components/voucherComponents/type";
import _ from "lodash";

export const useVoucherModalLogic = (props: VoucherModalProps) => {
  const { open, appliedVouchers, appliedVoucher, onFetchVouchers, onClose, onConfirm } = props;
  const { error } = useToast();
  
  const [voucherCode, setVoucherCode] = useState("");
  const [vouchers, setVouchers] = useState<VoucherOption[]>([]);
  const [groupedVouchers, setGroupedVouchers] = useState<GroupedVouchers>({
    productOrderVouchers: [],
    shippingVouchers: [],
  });
  const [isGrouped, setIsGrouped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [selectedOrderVoucherId, setSelectedOrderVoucherId] = useState<string | undefined>();
  const [selectedShippingVoucherId, setSelectedShippingVoucherId] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      const orderId = appliedVouchers?.order?.id || appliedVouchers?.order?.code || appliedVoucher?.id || appliedVoucher?.code;
      const shipId = appliedVouchers?.shipping?.id || appliedVouchers?.shipping?.code;
      setSelectedOrderVoucherId(orderId);
      setSelectedShippingVoucherId(shipId);
    }
  }, [open, appliedVouchers, appliedVoucher]);

  useEffect(() => {
    if (open && onFetchVouchers) {
      const timer = setTimeout(() => {
        setLoading(true);
        onFetchVouchers()
          .then((result) => {
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
          .catch(() => error("Không thể tải danh sách voucher"))
          .finally(() => setLoading(false));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, onFetchVouchers]);

  const handleConfirm = () => {
    const findV = (list: VoucherOption[], id?: string) => list.find(v => v.id === id || v.code === id);
    
    if (isGrouped) {
      onConfirm({
        order: findV(groupedVouchers.productOrderVouchers, selectedOrderVoucherId),
        shipping: findV(groupedVouchers.shippingVouchers, selectedShippingVoucherId),
      });
    } else {
      const selected = findV(vouchers, selectedOrderVoucherId);
      onConfirm(selected ? { order: selected } : undefined);
    }
    onClose();
  };

  return {
    state: { voucherCode, vouchers, groupedVouchers, isGrouped, loading, selectedOrderVoucherId, selectedShippingVoucherId },
    actions: { setVoucherCode, setSelectedOrderVoucherId, setSelectedShippingVoucherId, handleConfirm }
  };
};