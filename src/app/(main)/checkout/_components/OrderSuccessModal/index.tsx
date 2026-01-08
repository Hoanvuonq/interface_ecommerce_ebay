"use client";

import React from "react";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
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

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const modalFooter = (
    <div className="flex flex-col sm:flex-row gap-3 justify-center w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
      <button
        type="button"
        onClick={() => handleNavigate("/orders")}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all uppercase text-[10px] tracking-widest group"
      >
        <ShoppingBag size={14} className="group-hover:-rotate-12 transition-transform" />
        Xem đơn hàng
      </button>
      <button
        type="button"
        onClick={() => handleNavigate("/")}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 uppercase text-[10px] tracking-widest active:scale-95 group"
      >
        Tiếp tục mua sắm
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      footer={modalFooter}
      width="max-w-md"
      className="rounded-[2.5rem] overflow-hidden"
      preventCloseOnClickOverlay={true}
    >
      <div className="text-center py-6 px-4">
        <div className="relative w-24 h-24 mx-auto mb-8 animate-in zoom-in-50 duration-500">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20 duration-1000" />
          <div className="relative w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner border border-green-100">
            <CheckCircle2 
              className="w-12 h-12 text-green-500 animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-700 delay-200 fill-mode-both" 
              strokeWidth={2.5} 
            />
          </div>
        </div>

        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150 fill-mode-both">
          <h2 className="text-3xl font-bold text-gray-900 uppercase italic tracking-tighter">
            Đặt hàng <span className="text-green-500">thành công!</span>
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed px-6 text-sm">
            Cảm ơn bạn đã tin tưởng mua sắm. <br />
            Đơn hàng của bạn đang được xử lý chớp nhoáng!
          </p>
        </div>
        
        <div className="mt-6 animate-in fade-in zoom-in-90 duration-1000 delay-500 fill-mode-both">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-[9px] font-bold uppercase tracking-widest text-gray-600 border border-gray-100 hover:bg-white hover:border-orange-200 transition-colors cursor-default">
             <span className="animate-bounce">🎉</span> Welcome to the community
          </div>
        </div>
      </div>
    </PortalModal>
  );
};