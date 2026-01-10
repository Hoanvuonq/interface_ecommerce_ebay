"use client";

import { useCheckoutActions } from "@/app/(main)/checkout/_hooks/useCheckoutActions";
import { useCheckoutStore } from "@/app/(main)/checkout/_store/useCheckoutStore";
import { useVoucherModalLogic } from "@/components/voucher/_hooks/useVoucherModalLogic";
import { VoucherModalProps } from "@/components/voucher/_types/voucher";
import { PortalModal } from "@/features/PortalModal";
import _ from "lodash";
import React from "react";
import { FaSave } from "react-icons/fa";
import { ButtonField } from "../../../buttonField";
import { VoucherModalContent } from "../voucherModalContent";

export const VoucherModal: React.FC<VoucherModalProps> = (props) => {
  const { open, onClose, title, shopName, isPlatform, shopId } = props;
  const { preview, updateShopVouchers, request } = useCheckoutStore();
  const { syncPreview } = useCheckoutActions();
  const { state, actions } = useVoucherModalLogic({
    ...props,
    previewData: preview,
  });
 const handleConfirmVouchers = async () => {
  if (!request) return;

  const orderCode = state.selectedOrderVoucherId;
  const shipCode = state.selectedShippingVoucherId;
  const selectedCodes = [orderCode, shipCode].filter(Boolean) as string[];

  const updatedRequest = _.cloneDeep(request);
  const shopIndex = updatedRequest.shops.findIndex((s: any) => s.shopId === shopId);

  if (shopIndex > -1) {
    const shopsArray = preview?.data?.shops || preview?.shops || [];
    const shopPreview = shopsArray.find((s: any) => s.shopId === shopId);
    const details = shopPreview?.voucherResult?.discountDetails || [];

    // Phân loại: Mã nào của Sàn (PLATFORM) thì vào globalVouchers của shop
    const shopOnlyVouchers = selectedCodes.filter(c => 
      details.find((d: any) => d.voucherCode === c && d.voucherType === 'SHOP')
    );
    
    const platformVouchersForShop = selectedCodes.filter(c => 
      details.find((d: any) => d.voucherCode === c && d.voucherType === 'PLATFORM')
    );

    if (isPlatform) {
       updatedRequest.globalVouchers = selectedCodes; // Mã sàn dùng chung
    } else {
       updatedRequest.shops[shopIndex].vouchers = shopOnlyVouchers;
       updatedRequest.shops[shopIndex].globalVouchers = platformVouchersForShop;
    }
  }

  onClose();
  await syncPreview(updatedRequest);
};
  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <span className="font-bold uppercase text-sm tracking-tight text-gray-800">
          {title || (isPlatform ? "Ưu đãi hệ thống" : `Voucher ${shopName}`)}
        </span>
      }
      footer={
        <div className="flex w-full gap-3 p-2 bg-white ">
          <ButtonField
            type="secondary"
            className="flex-1 h-12! rounded-full font-bold text-[12px] "
            onClick={onClose}
          >
            TRỞ LẠI
          </ButtonField>
          <ButtonField
            type="login"
            onClick={handleConfirmVouchers}
            className="flex-1 h-12! rounded-full font-bold text-[12px] shadow-lg shadow-orange-100"
          >
            <span className="flex items-center gap-2">
              <FaSave size={18} className="mr-2" /> SỬ DỤNG NGAY
            </span>
          </ButtonField>
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
