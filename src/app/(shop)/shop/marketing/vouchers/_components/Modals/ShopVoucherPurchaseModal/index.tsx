"use client";

import { VoucherTemplate } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { PortalModal } from "@/features/PortalModal";
import { formatCurrency } from "@/hooks/format";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Info,
  ShieldCheck,
  ShoppingCart,
  Trophy,
  X,
} from "lucide-react";
import { usePurchaseVoucher } from "../../../_hooks/useShopVoucher";
import { CustomButtonActions } from "@/components";

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
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-900 rounded-2xl text-white shadow-lg shadow-gray-200">
            <ShoppingCart size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
            Xác nhận thanh toán
          </h2>
        </div>
      }
      footer={
        <CustomButtonActions
          isLoading={loading}
          cancelText="HỦY BỎ"
          submitText="Xác nhận & Thanh toán"
          submitIcon={ArrowRight}
          onCancel={onClose}
          onSubmit={handleConfirmPurchase}
          containerClassName="w-full flex gap-3 border-t-0"
          className="w-50! rounded-4xl"
        />
      }
      width="max-w-2xl"
      className="rounded-4xl p-0 overflow-hidden"
    >
      <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex items-start gap-4">
          <ShieldCheck className="text-emerald-500 mt-0.5" size={24} />
          <div className="space-y-1">
            <p className="text-sm font-bold text-emerald-900 uppercase tracking-tight">
              Giao dịch an toàn
            </p>
            <p className="text-xs font-bold text-emerald-800/70 leading-relaxed uppercase tracking-tight">
              Voucher sẽ được kích hoạt ngay sau khi thanh toán thành công. Bạn
              có thể quản lý trong tab "Voucher đã mua".
            </p>
          </div>
        </div>

        <div className="bg-white rounded-4xl border border-gray-100 p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-xl font-mono font-bold text-xs tracking-widest uppercase">
                {voucher.code}
              </span>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {voucher.name}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Loại Voucher
              </p>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase">
                Platform
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Trophy size={12} /> Quyền lợi
              </p>
              <p className="text-sm font-bold text-gray-800 tabular-nums">
                {voucher.discountMethod === "FIXED_AMOUNT"
                  ? formatCurrency(voucher.discountValue)
                  : `${voucher.discountValue}% OFF`}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Clock size={12} /> Hạn dùng
              </p>
              <p className="text-sm font-bold text-gray-800 tabular-nums">
                {voucher.validityDays
                  ? `${voucher.validityDays} ngày`
                  : "30 ngày"}
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase  ml-2">
            <Info size={14} /> Chi tiết thanh toán
          </div>

          <div className="bg-gray-50 rounded-4xl p-8 space-y-4 border border-gray-100/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">
                Giá Voucher
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(voucher.price || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">
                Phí dịch vụ
              </span>
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">
                Miễn phí
              </span>
            </div>

            <div className="h-px bg-gray-200 w-full my-2 border-dashed border-t" />

            <div className="flex justify-between items-end">
              <span className="text-base font-bold text-gray-900 uppercase tracking-tight">
                Tổng thanh toán
              </span>
              <span className="text-3xl font-bold text-orange-600 tracking-tighter">
                {formatCurrency(voucher.price || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-4">
          <AlertTriangle className="text-amber-500 shrink-0" size={18} />
          <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
            Bằng việc nhấn "Xác nhận & Thanh toán", bạn đồng ý với các chính
            sách sử dụng Voucher của Platform. Voucher không thể quy đổi thành
            tiền mặt hoặc hoàn trả sau khi mua.
          </p>
        </div>
      </div>
    </PortalModal>
  );
}
