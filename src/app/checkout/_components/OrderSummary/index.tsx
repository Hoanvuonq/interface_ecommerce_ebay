import { formatPrice } from "@/hooks/useFormatPrice";
import { CheckCircle2, Loader2 } from "lucide-react";

export const OrderSummary = ({
  subtotal,
  shippingFee,
  discount,
  tax,
  total,
  loading,
  canSubmit,
}: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">
      Chi tiết thanh toán
    </h3>

    <div className="space-y-3 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Tổng tiền hàng</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Phí vận chuyển</span>
        <span>{formatPrice(shippingFee)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-green-600 font-medium">
          <span>Giảm giá</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}

      {tax > 0 && (
        <div className="flex justify-between text-gray-600">
          <span>Thuế</span>
          <span>{formatPrice(tax)}</span>
        </div>
      )}

      <div className="pt-4 border-t border-dashed flex justify-between items-center mt-2">
        <span className="font-bold text-gray-800 text-base">
          Tổng thanh toán
        </span>
        <span className="font-bold text-2xl text-orange-600">
          {formatPrice(total)}
        </span>
      </div>
    </div>

    <button
      type="submit"
      disabled={loading || !canSubmit}
      className="w-full mt-6 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 transform active:scale-[0.98]"
    >
      {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
      Đặt Hàng Ngay
    </button>
  </div>
);
