import React from "react";
import {
  User,
  Mail,
  Phone,
  Fingerprint,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface BuyerInfoCardProps {
  name: string;
  email: string;
  phone: string;
}

export const BuyerInfoCard: React.FC<BuyerInfoCardProps> = ({
  name,
  email,
  phone,
}) => {
  const DetailRow = ({ icon: Icon, label, value, isBold = false }: any) => (
    <div className="flex items-start gap-4 group/row">
      <div className="p-2.5 rounded-xl bg-gray-100 border border-gray-200 group-hover/row:bg-orange-50 group-hover/row:border-orange-100 transition-colors duration-300">
        <Icon
          size={16}
          className="text-gray-700 group-hover/row:text-orange-500"
          strokeWidth={2.5}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-gray-700 mb-1 leading-none">
          {label}
        </p>
        <p
          className={cn(
            "text-sm truncate tracking-tight ",
            isBold
              ? "font-black text-gray-900 uppercase"
              : "font-medium text-gray-900",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-custom p-4 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Fingerprint size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-900 text-white rounded-2xl shadow-lg shadow-gray-200">
              <User size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800 leading-none">
                Hồ sơ <span className="text-orange-500">Người mua</span>
              </h3>
              <p className="text-[9px] font-bold text-gray-600 uppercase mt-1.5 tracking-widest italic">
                Verified Identity Protocol
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
            <BadgeCheck size={12} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-tighter">
              Hợp lệ
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center justify-center p-3 bg-gray-100 rounded-4xl border border-gray-200 shadow-custom group">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl bg-orange-100 border-4 border-white shadow-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              <span className="text-3xl font-black text-orange-500 italic uppercase">
                {name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 text-white rounded-xl border-2 border-white shadow-md">
              <ShieldCheck size={12} strokeWidth={3} />
            </div>
          </div>
          <h4 className="text-base font-black text-gray-900 uppercase tracking-tighter italic text-center leading-tight">
            {name}
          </h4>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-2">
            Buyer Authentication OK
          </span>
        </div>

        <div className="space-y-5 px-1">
          <DetailRow icon={Mail} label="Hòm thư điện tử" value={email} />
          <DetailRow icon={Phone} label="Đường dây liên lạc" value={phone} />
        </div>
      </div>
    </div>
  );
};
