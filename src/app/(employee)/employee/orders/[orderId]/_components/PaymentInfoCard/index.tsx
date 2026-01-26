import React from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Copy,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface PaymentInfoCardProps {
  paymentMethod: string;
  paymentIntentId?: string;
  isPaid: boolean;
}

export const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({
  paymentMethod,
  paymentIntentId,
  isPaid,
}) => {
  const getMethodLabel = (method: string) => {
    const maps: Record<string, string> = {
      BANK_TRANSFER: "Chuyển khoản ngân hàng",
      COD: "Thanh toán khi nhận hàng (COD)",
      VNPAY: "Cổng thanh toán VNPay",
      MOMO: "Ví điện tử MoMo",
    };
    return maps[method] || method;
  };

  return (
    <div className="bg-white rounded-2xl shadow-custom p-4 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
      <div className="absolute -bottom-5 -left-5 p-4 opacity-10 pointer-events-none">
        <ShieldCheck size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
              <CreditCard size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-800 leading-none">
                Cổng <span className="text-blue-600">Thanh toán</span>
              </h3>
              <p className="text-[9px] font-bold text-gray-600 uppercase mt-1.5 tracking-widest italic">
                Secure Transaction Record
              </p>
            </div>
          </div>

          {/* Status Badge cực đại */}
          <div
            className={cn(
              "px-4 py-1.5 rounded-full flex items-center gap-2 border shadow-xs animate-in zoom-in duration-500",
              isPaid
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-amber-50 text-amber-600 border-amber-100",
            )}
          >
            {isPaid ? (
              <CheckCircle2 size={14} strokeWidth={3} />
            ) : (
              <Clock size={14} strokeWidth={3} />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {isPaid ? "Đã xác thực" : "Chờ khớp lệnh"}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Payment Method Details */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 mt-1">
              <Zap
                size={18}
                className={cn(isPaid ? "text-emerald-500" : "text-amber-500")}
                fill="currentColor"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                Phương thức giao dịch
              </p>
              <p className="text-sm font-bold text-gray-800 uppercase tracking-tight italic">
                {getMethodLabel(paymentMethod)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    isPaid ? "bg-emerald-500" : "bg-amber-500",
                  )}
                />
                <span className="text-[10px] font-bold text-gray-500 italic lowercase">
                  {isPaid
                    ? "Giao dịch đã được ghi nhận vào hệ thống"
                    : "Hệ thống đang chờ tín hiệu thanh toán"}
                </span>
              </div>
            </div>
          </div>

          {paymentIntentId && (
            <div className="mt-6 p-4 rounded-3xl bg-gray-50/50 border border-dashed border-gray-200 group/id">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                  Mã định danh giao dịch (TID)
                </span>
                <button className="opacity-0 group-hover/id:opacity-100 transition-opacity p-1 hover:bg-white rounded-lg shadow-sm border border-gray-100">
                  <Copy size={12} className="text-gray-600" />
                </button>
              </div>
              <p className="text-xs font-mono font-bold text-gray-600 break-all leading-relaxed tracking-tighter uppercase italic">
                {paymentIntentId}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
