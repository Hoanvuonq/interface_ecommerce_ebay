"use client";

import { useVoucherModalLogic } from "@/components/voucher/_hooks/useVoucherModalLogic";
import { VoucherModalProps } from "@/components/voucher/_types/voucher";
import { PortalModal } from "@/features/PortalModal";
import React from "react";
import { FaSave } from "react-icons/fa";
import { ButtonField } from "../../../buttonField";
import { VoucherModalContent } from "../voucherModalContent";

export const VoucherModal: React.FC<VoucherModalProps> = (props) => {
  const { open, onClose, title, shopName, isPlatform } = props;
  const { state, actions } = useVoucherModalLogic(props);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <span className="font-black uppercase text-sm tracking-tight text-slate-800">
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
            onClick={actions.handleConfirm}
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
      />
    </PortalModal>
  );
};
