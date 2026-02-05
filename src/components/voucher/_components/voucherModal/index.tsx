"use client";
import React from "react";
import { PortalModal } from "@/features/PortalModal";
import { CustomButtonActions } from "@/components/custom";
import { useCheckoutActions } from "@/app/(main)/checkout/_hooks/useCheckoutActions";
import { useCheckoutStore } from "@/app/(main)/checkout/_store/useCheckoutStore";
import { useVoucherModalLogic } from "@/components/voucher/_hooks/useVoucherModalLogic";
import { VoucherModalProps } from "@/components/voucher/_types/voucher";
import { VoucherModalContent } from "../voucherModalContent";
import { Save } from "lucide-react";

export const VoucherModal: React.FC<VoucherModalProps> = (props) => {
  // 1. Đổi shopIds thành shopId để đúng logic "một shop"
  const { open, onClose, title, shopName, isPlatform, shopId } = props;
  const { preview } = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();

  const { state, actions } = useVoucherModalLogic({
    ...props,
    previewData: preview,
  });

  const handleConfirmVouchers = async () => {
    const { updateShopVouchers } = useCheckoutStore.getState();

    // 2. Kiểm tra nếu không có shopId và không phải platform thì không cho submit
    if (!shopId && !isPlatform) {
      console.error("Missing shopId for shop voucher update");
      return;
    }

    // 3. Cập nhật Store (Sử dụng shopId hoặc định danh 'platform')
    const targetId = isPlatform ? "platform" : shopId!;

    updateShopVouchers(targetId, {
      ...(isPlatform
        ? {
            platformOrder: state.selectedOrderVoucherId,
            platformShipping: state.selectedShippingVoucherId,
          }
        : {
            order: state.selectedOrderVoucherId,
            shipping: state.selectedShippingVoucherId,
          }),
    });

    onClose();
    // 4. Đồng bộ lại preview sau khi chọn mã
    await syncPreview();
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      className="max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
          <span className="font-black uppercase text-sm tracking-widest text-gray-800">
            {title ||
              (isPlatform ? "Đặc quyền hệ thống" : `Voucher từ ${shopName}`)}
          </span>
        </div>
      }
      footer={
        <div className="w-full bg-white p-4 border-t border-gray-50">
          <CustomButtonActions
            onCancel={onClose}
            onSubmit={handleConfirmVouchers}
            cancelText="ĐÓNG"
            submitText="XÁC NHẬN"
            submitIcon={Save}
            containerClassName="w-full flex gap-3 justify-end pt-0"
            className="w-48! rounded-full h-12 shadow-xl shadow-orange-100 font-black text-[11px] tracking-widest"
          />
        </div>
      }
    >
      <VoucherModalContent
        loading={state.loading}
        isGrouped={state.isGrouped}
        vouchers={state.vouchers}
        groupedVouchers={state.groupedVouchers}
        selectedOrderId={state.selectedOrderVoucherId}
        selectedShipId={state.selectedShippingVoucherId}
        onSelectOrder={actions.setSelectedOrderVoucherId}
        onSelectShip={actions.setSelectedShippingVoucherId}
        voucherCode={state.voucherCode}
        onCodeChange={actions.setVoucherCode}
        previewData={preview}
      />
    </PortalModal>
  );
};
