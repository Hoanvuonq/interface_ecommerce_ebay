"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PortalModal } from "@/features/PortalModal";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const modalFooter = (
    <div className="flex gap-3 justify-center w-full">
      <button
        type="button"
        onClick={() => {
          onClose();
          router.push("/orders");
        }}
        className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors uppercase text-xs tracking-widest"
      >
        Xem đơn hàng
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          router.push("/");
        }}
        className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 uppercase text-xs tracking-widest active:scale-95"
      >
        Tiếp tục mua sắm
      </button>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      footer={modalFooter}
      width="max-w-md"
      className="rounded-[2.5rem]"
      preventCloseOnClickOverlay={true} 
    >
      <div className="text-center py-4">
        <div className="w-24 h-24 bg-green-50 rounded-4xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2.5} />
        </div>

        <h2 className="text-3xl font-semibold text-slate-900 mb-3 uppercase italic tracking-tighter">
          Đặt hàng <span className="text-green-500">thành công!</span>
        </h2>
        <p className="text-slate-500 mb-4 font-medium leading-relaxed px-4">
          Cảm ơn bạn đã tin tưởng mua sắm tại cửa hàng. <br />
          Đơn hàng của bạn đang được xử lý.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-semibold uppercase tracking-widest text-slate-400 border border-slate-100">
           🎉 Welcome to the community
        </div>
      </div>
    </PortalModal>
  );
};