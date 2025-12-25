import { formatPrice } from "@/hooks/useFormatPrice";
import { CheckCircle2, Loader2, Info } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  loading: boolean;
  canSubmit: boolean;
  onSubmit?: (e: any) => void; // Thêm onSubmit để handle click thủ công nếu cần
}

export const OrderSummary = ({
  subtotal,
  shippingFee,
  discount,
  tax,
  total,
  loading,
  canSubmit,
  onSubmit
}: OrderSummaryProps) => (
  <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 sticky top-6">
    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center gap-2">
      <Info size={16} className="text-orange-500" />
      Chi tiết thanh toán
    </h3>

    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng tiền hàng</span>
        <span className="text-sm font-black text-slate-900">{formatPrice(subtotal || 0)}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phí vận chuyển</span>
        <span className="text-sm font-black text-slate-900">{formatPrice(shippingFee || 0)}</span>
      </div>

      {/* ✅ SHOW DÒNG GIẢM GIÁ MÀU ĐỎ/XANH NỔI BẬT */}
      {discount > 0 && (
        <div className="flex justify-between items-center py-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase italic">Khuyến mãi voucher</span>
          <span className="text-sm font-black text-red-600 italic">-{formatPrice(discount)}</span>
        </div>
      )}

      {tax > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thuế (VAT)</span>
          <span className="text-sm font-black text-slate-900">{formatPrice(tax)}</span>
        </div>
      )}

      <div className="py-2">
        <div className="border-t-2 border-dashed border-slate-100" />
      </div>

      <div className="flex justify-between items-end pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.1em]">Tổng thanh toán</span>
          <span className="text-[10px] text-slate-400 font-bold italic lowercase italic opacity-70">Đã bao gồm phí & giảm giá</span>
        </div>
        <span className="text-3xl font-black text-orange-600 tracking-tighter italic leading-none">
          {formatPrice(total || 0)}
        </span>
      </div>
    </div>

    <button
      type="submit"
      onClick={onSubmit}
      disabled={loading || !canSubmit}
      className="w-full mt-8 group relative overflow-hidden bg-slate-950 disabled:bg-slate-200 text-white font-black py-5 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
    >
      <div className="relative z-10 flex justify-center items-center gap-3 uppercase tracking-widest text-xs">
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors" />
        )}
        <span>{loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}</span>
      </div>
      
      <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  </div>
);