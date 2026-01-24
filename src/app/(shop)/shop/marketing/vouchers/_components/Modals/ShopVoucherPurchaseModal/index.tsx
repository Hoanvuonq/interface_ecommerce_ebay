"use client";

import React from "react";
import { 
  X, 
  ShoppingCart, 
  Info, 
  Tag as TagIcon, 
  DollarSign, 
  Calendar, 
  Trophy, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { VoucherTemplate } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { usePurchaseVoucher } from "../../../_hooks/useShopVoucher";
import { formatCurrency, formatDate } from "@/hooks/format";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";

interface ShopVoucherPurchaseModalProps {
  open: boolean;
  voucher: VoucherTemplate;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ShopVoucherPurchaseModal({
  open,
  voucher,
  onClose,
  onSuccess,
}: ShopVoucherPurchaseModalProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const { handlePurchase, loading } = usePurchaseVoucher();

  const handleConfirmPurchase = async () => {
    const res = await handlePurchase({ templateId: voucher.id });
    if (res?.code === 1000) {
      toastSuccess("Khởi tạo đơn hàng thành công!");
      if (res.data?.paymentUrl) {
        // Chuyển hướng ngay lập tức hoặc xử lý qua một lớp trung gian
        window.location.href = res.data.paymentUrl;
      }
      onSuccess();
    } else {
      toastError(res?.message || "Không thể khởi tạo thanh toán!");
    }
  };

  return (
    <PortalModal 
      isOpen={open} 
      onClose={onClose} 
      width="max-w-2xl"
      className="rounded-[2.5rem] p-0 overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-900 rounded-2xl text-white shadow-lg shadow-gray-200">
            <ShoppingCart size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Xác nhận thanh toán</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <X size={20} />
        </button>
      </div>

      <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Info Banner */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex items-start gap-4">
          <ShieldCheck className="text-emerald-500 mt-0.5" size={24} />
          <div className="space-y-1">
            <p className="text-sm font-bold text-emerald-900 uppercase tracking-tight">Giao dịch an toàn</p>
            <p className="text-xs font-bold text-emerald-800/70 leading-relaxed uppercase tracking-tight">
              Voucher sẽ được kích hoạt ngay sau khi thanh toán thành công. Bạn có thể quản lý trong tab "Voucher đã mua".
            </p>
          </div>
        </div>

        {/* Voucher Detail Summary */}
        <div className="bg-white rounded-4xl border border-gray-100 p-6 shadow-sm space-y-5">
           <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-xl font-mono font-bold text-xs tracking-widest uppercase">
                  {voucher.code}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{voucher.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Loại Voucher</p>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase">Platform</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Trophy size={12}/> Quyền lợi
                </p>
                <p className="text-sm font-bold text-gray-800 tabular-nums">
                  {voucher.discountMethod === "FIXED_AMOUNT" 
                    ? formatCurrency(voucher.discountValue)
                    : `${voucher.discountValue}% OFF`}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Clock size={12}/> Hạn dùng
                </p>
                <p className="text-sm font-bold text-gray-800 tabular-nums">
                  {voucher.validityDays ? `${voucher.validityDays} ngày` : "30 ngày"}
                </p>
              </div>
           </div>
        </div>

        {/* Checkout Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase  ml-2">
            <Info size={14} /> Chi tiết thanh toán
          </div>
          
          <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-4 border border-gray-100/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">Giá Voucher</span>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(voucher.price || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">Phí dịch vụ</span>
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">Miễn phí</span>
            </div>
            
            <div className="h-px bg-gray-200 w-full my-2 border-dashed border-t" />
            
            <div className="flex justify-between items-end">
              <span className="text-base font-bold text-gray-900 uppercase tracking-tight">Tổng thanh toán</span>
              <span className="text-3xl font-bold text-orange-600 tracking-tighter">
                {formatCurrency(voucher.price || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Note Area */}
        <div className="flex gap-3 px-4">
          <AlertTriangle className="text-amber-500 shrink-0" size={18} />
          <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
            Bằng việc nhấn "Xác nhận & Thanh toán", bạn đồng ý với các chính sách sử dụng Voucher của Platform. Voucher không thể quy đổi thành tiền mặt hoặc hoàn trả sau khi mua.
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex-1 py-4 rounded-2xl text-[11px] font-bold uppercase  text-gray-500 hover:bg-gray-100 transition-all active:scale-95 border border-transparent"
        >
          Để sau
        </button>
        <button
          onClick={handleConfirmPurchase}
          disabled={loading}
          className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-bold uppercase  hover:bg-orange-600 shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              Xác nhận & Thanh toán
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </PortalModal>
  );
}

// Giả định có Loader2 component cho trạng thái loading
const Loader2 = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);