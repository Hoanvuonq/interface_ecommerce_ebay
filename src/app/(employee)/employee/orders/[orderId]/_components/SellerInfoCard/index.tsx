import {
  BadgeCheck,
  Building2,
  MapPin,
  Store,
  Verified
} from "lucide-react";
import React from "react";

interface SellerInfoCardProps {
  shopName: string;
  shopAddress: string;
  shopLogo?: string;
}

export const SellerInfoCard: React.FC<SellerInfoCardProps> = ({
  shopName,
  shopAddress,
  shopLogo,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-custom p-4 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="absolute -top-1 -right-1 p-4 opacity-10 pointer-events-none rotate-12">
        <Building2 size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-900 text-white rounded-2xl shadow-lg shadow-gray-200">
              <Store size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-800 leading-none">
                Thương hiệu <span className="text-orange-500">Đối tác</span>
              </h3>
              <p className="text-[9px] font-bold text-gray-600 uppercase mt-1.5 tracking-widest italic">
                Authorized Merchant Record
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm animate-pulse">
            <Verified size={12} strokeWidth={3} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">
              Official
            </span>
          </div>
        </div>

        {/* Shop Presentation - Centered Focus */}
        <div className="mb-8 flex flex-col items-center justify-center p-6 bg-gray-100 rounded-4xl border border-gray-200 shadow-custom group">
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-4xl bg-white border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105">
              {shopLogo ? (
                <img
                  src={shopLogo}
                  alt={shopName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                  <Store size={32} className="text-orange-500 opacity-40" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-blue-600 text-white rounded-xl border-2 border-white shadow-md">
              <BadgeCheck size={14} strokeWidth={3} />
            </div>
          </div>

          <h4 className="text-lg font-bold text-gray-900 uppercase tracking-tighter italic text-center leading-tight">
            {shopName}
          </h4>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
              Active Merchant Status
            </span>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-3 px-1">
          <div className="flex items-center gap-2 ml-1 text-gray-700">
            <MapPin size={12} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
              Cơ sở đăng ký
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm group/loc transition-all">
            <p className="text-xs font-bold text-gray-700 leading-relaxed italic tracking-tight group-hover/loc:text-gray-900">
              {shopAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
