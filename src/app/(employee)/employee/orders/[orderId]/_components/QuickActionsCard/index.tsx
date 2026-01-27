import React from "react";
import {
  Phone,
  Mail,
  Copy,
  Store,
  Zap,
  User,
  ArrowUpRight,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

interface QuickActionsCardProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shopId?: string;
  shopName?: string;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  customerName,
  customerPhone,
  customerEmail,
  shippingAddress,
  shopId,
  shopName,
}) => {
  const { success } = useToast();

  const handleAction = (type: "tel" | "mailto", value: string) => {
    window.location.href = `${type}:${value}`;
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(shippingAddress);
    success("Đã sao chép địa chỉ giao hàng");
  };

  const ActionButton = ({ onClick, icon: Icon, label, colorClass }: any) => (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300",
        "bg-white border border-gray-100 shadow-custom active:scale-95",
      )}
    >
      <div
        className={cn(
          "p-2.5 rounded-xl transition-colors bg-gray-50 group-hover:bg-orange-50",
          colorClass,
        )}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <span className="text-[12px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </button>
  );

  return (
    <div className="bg-white rounded-3xl shadow-custom p-4 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-900 text-white rounded-xl shadow-lg shadow-gray-200">
            <Zap size={18} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-800 leading-none">
              Thao tác <span className="text-orange-500">Nhanh</span>
            </h3>
            <p className="text-[9px] font-bold text-gray-600 uppercase mt-1.5 tracking-widest italic">
              Quick Response Protocol
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionButton
          onClick={() => handleAction("tel", customerPhone)}
          icon={Phone}
          label="Gọi điện"
          colorClass="text-emerald-500"
        />
        <ActionButton
          onClick={() => handleAction("mailto", customerEmail)}
          icon={Mail}
          label="Gửi Email"
          colorClass="text-blue-500"
        />
        <ActionButton
          onClick={handleCopyAddress}
          icon={Copy}
          label="Địa chỉ"
          colorClass="text-amber-500"
        />
        {shopId && (
          <ActionButton
            onClick={() => window.open(`/employee/shops/${shopId}`, "_blank")}
            icon={Store}
            label="Cửa hàng"
            colorClass="text-purple-500"
          />
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <User size={14} className="text-orange-500" />
          <span className="text-[12px] font-bold uppercase tracking-widest text-gray-600">
            Nhân dạng liên hệ
          </span>
        </div>

        <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-inner">
          <div className="flex justify-between items-center group/item cursor-default">
            <span className="text-[12px] font-bold text-gray-600 uppercase italic">
              Họ tên
            </span>
            <span className="text-xs font-medium text-gray-800 tracking-tight">
              {customerName}
            </span>
          </div>

          <div className="flex justify-between items-center group/item cursor-default">
            <span className="text-[12px] font-bold text-gray-600 uppercase italic">
              Liên lạc
            </span>
            <span className="text-xs font-medium text-gray-700 underline decoration-gray-200 underline-offset-4">
              {customerPhone}
            </span>
          </div>

          <div className="flex justify-between items-start group/item cursor-default gap-4">
            <span className="text-[12px] font-bold text-gray-600 uppercase italic shrink-0">
              Hòm thư
            </span>
            <span className="text-xs font-medium text-gray-700 break-all text-right leading-relaxed">
              {customerEmail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
