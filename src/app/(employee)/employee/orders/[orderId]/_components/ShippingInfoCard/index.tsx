import React from "react";
import {
  Truck,
  Copy,
  MapPin,
  Navigation,
  PackageCheck,
  Box,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

interface ShippingInfoCardProps {
  carrier: string;
  trackingNumber?: string;
  shippingAddress: string;
}

export const ShippingInfoCard: React.FC<ShippingInfoCardProps> = ({
  carrier,
  trackingNumber,
  shippingAddress,
}) => {
  const { success } = useToast();

  const handleCopyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      success("Đã sao chép mã vận đơn");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-custom p-4 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="absolute -bottom-6 -right-6 p-4 opacity-10 pointer-events-none rotate-12">
        <Truck size={100} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-900 text-white rounded-2xl shadow-lg shadow-gray-200">
              <PackageCheck size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800 leading-none">
                Lộ trình <span className="text-orange-500">Vận chuyển</span>
              </h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1.5 tracking-widest italic">
                Logistics Control Unit
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Carrier Info Block */}
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-gray-100 shadow-custom border border-gray-200 group/carrier">
            <div className="p-2.5 rounded-xl bg-white border border-gray-100 text-orange-500 shadow-sm group-hover/carrier:scale-110 transition-transform">
              <Box size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                Đơn vị đảm nhiệm
              </p>
              <p className="text-sm font-black text-gray-800 uppercase italic tracking-tight">
                {carrier}
              </p>
            </div>
          </div>

          {trackingNumber && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-1">
                <Navigation size={12} className="text-orange-500" />
                <span className="text-[11px] font-black uppercase  text-gray-600">
                  Vận đơn số (AWB)
                </span>
              </div>
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-white border-2 border-dashed border-gray-200 hover:border-orange-200 transition-colors group/tracking">
                <p className="text-sm font-mono font-black text-blue-600 flex-1 tracking-tighter uppercase italic leading-none">
                  {trackingNumber}
                </p>
                <button
                  onClick={handleCopyTracking}
                  className="p-1.5 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-lg transition-all active:scale-90"
                >
                  <Copy size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* Shipping Address Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 ml-1">
              <MapPin size={12} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Tọa độ giao nhận
              </span>
            </div>
            <div className="relative p-5 rounded-[1.8rem] bg-gray-900 shadow-2xl shadow-gray-200 group/address overflow-hidden">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]" />

              <p className="relative z-10 text-xs font-semibold text-white leading-relaxed tracking-tight  first-letter:text-lg first-letter:text-orange-500 first-letter:font-black">
                {shippingAddress}
              </p>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
                  Final Destination Verified
                </span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
