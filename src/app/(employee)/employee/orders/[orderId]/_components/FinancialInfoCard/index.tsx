import React from "react";
import { Receipt, CreditCard, Tag, Truck, Calculator } from "lucide-react";
import { cn } from "@/utils/cn";

interface FinancialInfoCardProps {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  currency?: string;
}

export const FinancialInfoCard: React.FC<FinancialInfoCardProps> = ({
  subtotal = 0,
  discount = 0,
  shippingFee = 0,
  total = 0,
  currency = "₫",
}) => {
  const formatValue = (val: number) => val.toLocaleString("vi-VN");

  const Row = ({
    label,
    value,
    icon: Icon,
    color = "text-gray-600",
    valColor = "text-gray-900",
    isNegative = false,
  }: any) => (
    <div className="flex justify-between items-center py-1 group/row">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-gray-50 group-hover/row:bg-white group-hover/row:shadow-sm transition-all duration-300">
          <Icon
            size={16}
            className="text-gray-600 group-hover/row:text-orange-500"
          />
        </div>
        <span
          className={cn(
            "text-[11px] font-bold uppercase tracking-wider leading-none",
            color,
          )}
        >
          {label}
        </span>
      </div>
      <span
        className={cn(
          "text-sm font-bold font-mono tracking-tighter italic",
          valColor,
        )}
      >
        {isNegative && "-"}
        {formatValue(value)}
        <span className="ml-1 opacity-60 not-italic">{currency}</span>
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-custom p-4 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Receipt size={100} strokeWidth={1} />
        
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl shadow-sm shadow-orange-100">
              <Calculator size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase -tracking-wide text-gray-800 leading-none">
                Chi tiết <span className="text-orange-500">Tài chính</span>
              </h3>
              <p className="text-[10px] font-bold text-gray-600 uppercase mt-1.5 tracking-widest italic">
                Billing Registry Protocol
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Row label="Tạm tính" value={subtotal} icon={CreditCard} />

          {discount > 0 && (
            <Row
              label="Chiết khấu"
              value={discount}
              icon={Tag}
              valColor="text-emerald-600"
              isNegative={true}
            />
          )}

          <Row label="Vận chuyển" value={shippingFee} icon={Truck} />

          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase  text-gray-600 leading-none">
                  Tổng thanh toán
                </span>
                <span className="text-[9px] font-bold text-orange-500 italic">
                  Net Amount (VAT Inc.)
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold text-gray-900 tracking-tighter italic leading-none flex items-start gap-1">
                  {formatValue(total)}
                  <span className="text-2xl font-bold text-orange-600 mt-1 not-italic">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
