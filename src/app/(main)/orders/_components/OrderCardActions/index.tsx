import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { Button } from "@/components/button/button";
import { formatPrice } from "@/hooks/useFormatPrice";
import { ActionsProps } from "./type";

export const OrderCardActions: React.FC<ActionsProps> = ({
  grandTotal,
  paymentMethod,
  isPendingPayment,
  paymentUrl,
  canCancel,
  isDelivered,
  firstProductId,
  onViewDetail,
  onCancelClick,
}) => (
  <div className="lg:col-span-4 flex flex-col items-end border-t lg:border-t-0 lg:border-l border-gray-50 pt-5 lg:pt-0 ">
    <div className="text-right mb-5 w-full">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        Tổng thanh toán
      </span>
      <p className="text-2xl font-black text-orange-600 mt-1">{formatPrice(grandTotal)}</p>
      <p className="text-[11px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">
        {paymentMethod}
      </p>
    </div>

    <div className="flex flex-col justify-end items-end gap-2 w-auto" onClick={(e) => e.stopPropagation()}>
      {isPendingPayment && paymentUrl ? (
        <>
          <Link
            href={paymentUrl}
            target="_blank"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest rounded-xl text-center shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            Thanh toán ngay
          </Link>
          {canCancel && (
            <button
              onClick={onCancelClick}
              className="w-full py-2 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Hủy đơn hàng
            </button>
          )}
        </>
      ) : isDelivered ? (
        <div className="flex gap-2 w-full">
          {firstProductId && (
            <Link href={`/products/${firstProductId}`} className="flex-1">
              <button className="w-30 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md">
                Mua lại
              </button>
            </Link>
          )}
          <button
            onClick={onViewDetail}
            className="px-4 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <Eye size={18} />
          </button>
        </div>
      ) : (
        <Button
          variant="edit"
          onClick={onViewDetail}
          icon={<FaEdit />}
          className="w-50 py-3 text-xs"
        >
          Xem chi tiết
        </Button>
      )}
    </div>
  </div>
);