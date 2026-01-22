"use client";

import React from "react";
import Image from "next/image";
import { Package, Info, Clock, Plus, Zap } from "lucide-react";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";

interface CampaignDetailCardProps {
  selectedCampaign: any;
  selectedCampaignProducts: any[];
  campaignSlots: any[];
  formatPrice: (price: number) => string;
  setSelectedSlot: (slot: any) => void;
  setShowRegisterModal: (v: boolean) => void;
}

export const CampaignDetailCard: React.FC<CampaignDetailCardProps> = ({
  selectedCampaign,
  selectedCampaignProducts,
  campaignSlots,
  formatPrice,
  setSelectedSlot,
  setShowRegisterModal,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-custom transition-all animate-in fade-in zoom-in-95 duration-500">
      <div className="relative h-64 group/banner overflow-hidden">
        <Image
          src={
            selectedCampaign.bannerUrl
              ? toPublicUrl(selectedCampaign.bannerUrl)
              : "https://picsum.photos/800/400"
          }
          alt={selectedCampaign.name}
          fill
          priority
          className="object-cover transition-transform duration-1000 group-hover/banner:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/30">
              Live Campaign
            </span>
          </div>
          <h2 className="text-4xl font-bold italic uppercase tracking-tighter leading-none mb-2 drop-shadow-md">
            {selectedCampaign.name}
          </h2>
          <p className="opacity-80 text-sm font-medium tracking-wide line-clamp-1 italic max-w-[90%]">
            {selectedCampaign.description}
          </p>
        </div>
      </div>

      <div className="p-8">
        {selectedCampaign.campaignType === "SHOP_SALE" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-5">
              <h3 className="font-bold text-xl text-slate-800 uppercase tracking-tight italic flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl">
                  <Package className="text-orange-500 w-5 h-5" />
                </div>
                Sản phẩm tham gia
                <span className="text-slate-300 ml-1">
                  ({selectedCampaignProducts.length})
                </span>
              </h3>
            </div>

            {selectedCampaignProducts.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-4xl border-2 border-dashed border-slate-200">
                <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Chưa có sản phẩm được kích hoạt
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                {selectedCampaignProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl hover:border-orange-200 transition-all hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] group"
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-inner border border-slate-50">
                      <Image
                        src={
                          selectedCampaign.bannerUrl &&
                          selectedCampaign.bannerUrl !== ""
                            ? selectedCampaign.bannerUrl
                            : "https://picsum.photos/800/400"
                        }
                        alt={selectedCampaign.name}
                        fill
                        priority
                        className="object-cover transition-transform duration-1000 group-hover/banner:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate uppercase tracking-tight mb-1">
                        {prod.productName}
                      </h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[15px] font-bold text-orange-500 italic">
                          {formatPrice(prod.salePrice)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 uppercase">
                          {prod.status}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-orange-400 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min((prod.stockSold / prod.stockLimit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          Đã bán:{" "}
                          <span className="text-slate-900">
                            {prod.stockSold}
                          </span>
                          /{prod.stockLimit}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-blue-50/50 p-5 rounded-3xl border border-blue-100/50">
              <div className="bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Info className="text-white w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold text-blue-700 uppercase leading-relaxed">
                Vui lòng lựa chọn 01 khung giờ vàng phía dưới để tiến hành đăng
                ký sản phẩm tham gia chiến dịch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {campaignSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() =>
                    !slot.isFullyBooked &&
                    (setSelectedSlot(slot), setShowRegisterModal(true))
                  }
                  className={cn(
                    "p-6 rounded-4xl border-2 transition-all duration-300 relative group overflow-hidden",
                    slot.isFullyBooked
                      ? "bg-slate-50 border-slate-100 opacity-60 grayscale cursor-not-allowed"
                      : "bg-white border-slate-50 hover:border-orange-500 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)] cursor-pointer translate-y-0 hover:-translate-y-1",
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={cn(
                        "px-3 py-1 text-[9px] font-bold rounded-lg uppercase tracking-widest transition-colors",
                        slot.status === "ACTIVE"
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {slot.status}
                    </span>
                    {slot.isFullyBooked && (
                      <span className="text-[9px] font-bold text-red-500 uppercase italic">
                        FULL SLOTS
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-slate-800 uppercase italic tracking-tighter text-lg mb-1 group-hover:text-orange-600 transition-colors">
                    {slot.slotName || "Khung giờ vàng"}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    <Clock size={14} className="text-orange-400" />
                    {new Date(slot.startTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <span className="mx-1 opacity-30">—</span>
                    {new Date(slot.endTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                        Dung lượng
                      </span>
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        {slot.approvedProducts}
                        <span className="text-slate-300 mx-1">/</span>
                        {slot.maxProducts}{" "}
                        <span className="text-[10px] text-slate-400">
                          Items
                        </span>
                      </span>
                    </div>
                    {!slot.isFullyBooked && (
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all shadow-xl shadow-slate-900/10">
                        <Plus size={18} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
