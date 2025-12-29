"use client";

import { formatPrice } from "@/hooks/useFormatPrice"; 
import { CheckCircle2, Loader2, X } from "lucide-react";
import React from "react";

interface ShippingMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loadingPrice: boolean;
  priceData: any; 
}

export const ShippingMethodModal: React.FC<ShippingMethodModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loadingPrice,
  priceData,
}) => {
  if (!isOpen) return null;

  const totalFee = priceData?.data?.total ? Number(priceData.data.total) : 0;
  const hasError = !loadingPrice && !totalFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all scale-100">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-bold text-gray-800">Phương thức vận chuyển</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div 
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
              ${hasError ? "border-red-200 bg-red-50" : "border-blue-500 bg-blue-50/50"}
            `}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-gray-900 font-bold text-lg mb-1">
                  Giao hàng nhanh GHN
                </p>
                
                {loadingPrice ? (
                   <div className="flex items-center gap-2 text-blue-600 text-sm mt-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>Đang tính giá vận chuyển...</span>
                   </div>
                ) : totalFee > 0 ? (
                  <div className="mt-1">
                    <p className="text-green-600 text-2xl font-bold">
                      {formatPrice(totalFee)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Nhận hàng trong 2-4 ngày</p>
                  </div>
                ) : (
                  <div className="mt-2 text-red-500 text-sm flex items-center gap-2">
                    <span>⚠️ Không thể tính giá vận chuyển cho địa chỉ này</span>
                  </div>
                )}
              </div>
              
              <div className="ml-4">
                 <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center bg-white">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={onConfirm}
            disabled={loadingPrice || totalFee === 0}
            className={`
              px-6 py-2.5 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg transition-all
              ${loadingPrice || totalFee === 0 
                ? "bg-gray-300 cursor-not-allowed shadow-none" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"}
            `}
          >
            <CheckCircle2 size={18} />
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
