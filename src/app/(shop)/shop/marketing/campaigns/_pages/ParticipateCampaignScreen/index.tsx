"use client";

import React from "react";
import Image from "next/image";
import { formatDateTime } from "@/hooks/format";
import {
  Calendar,
  ChevronRight,
  Zap,
  Package,
  Clock,
  Tag,
  LayoutGrid,
  Info,
  Plus,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useCampaignStore } from "../../../_stores/campaign.store";

interface ParticipateCampaignScreenProps {
  handleSelectCampaign: (campaign: any) => void;
  setSelectedSlot: (slot: any) => void;
  setShowRegisterModal: (v: boolean) => void;
  formatPrice: (price: number) => string;
}

export const ParticipateCampaignScreen = ({
  handleSelectCampaign,
  setSelectedSlot,
  setShowRegisterModal,
  formatPrice,
}: ParticipateCampaignScreenProps) => {
  const {
    availableCampaigns,
    selectedCampaign,
    selectedCampaignProducts,
    campaignSlots,
  } = useCampaignStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-1 space-y-6">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
          <h2 className="font-bold text-2xl text-gray-800 uppercase italic">
            Campaigns sẵn sàng
          </h2>
        </div>

        {availableCampaigns.length === 0 ? (
          <div className="bg-white rounded-4xl p-12 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Trống lịch đăng ký
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {availableCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => handleSelectCampaign(campaign)}
                className={cn(
                  "bg-white rounded-3xl p-4 cursor-pointer transition-all duration-300 border group",
                  selectedCampaign?.id === campaign.id
                    ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/50"
                    : "border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border border-gray-50 shadow-inner">
                    <Image
                      src={
                        campaign.thumbnailUrl || "https://picsum.photos/200/200"
                      }
                      alt={campaign.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-bold text-gray-800 truncate uppercase text-sm italic tracking-tight">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      <Calendar className="w-3 h-3 text-orange-400" />
                      {formatDateTime(campaign.startDate)}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2.5 py-1 bg-orange-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-widest shadow-sm shadow-orange-200">
                        {campaign.campaignType}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <LayoutGrid size={12} className="text-gray-300" />{" "}
                        {campaign.totalSlots} SLOTS
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={cn(
                      "transition-all",
                      selectedCampaign?.id === campaign.id
                        ? "text-orange-500 trangray-x-1"
                        : "text-gray-200",
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CỘT PHẢI: CHI TIẾT & SLOTS */}
      <div className="lg:col-span-2">
        {selectedCampaign ? (
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/60 transition-all">
            {/* Banner Area */}
            <div className="relative h-56 group/banner">
              <Image
                src={
                  (selectedCampaign as any).bannerUrl ||
                  (selectedCampaign as any).banner ||
                  "https://picsum.photos/800/400"
                }
                alt={selectedCampaign.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover/banner:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              <div className="absolute bottom-6 left-8 text-white max-w-[80%]">
                <h2 className="text-3xl font-bold italic uppercase tracking-tighter mb-2 leading-none">
                  {selectedCampaign.name}
                </h2>
                <p className="opacity-80 text-xs font-bold uppercase tracking-widest line-clamp-1 italic">
                  {selectedCampaign.description}
                </p>
              </div>
            </div>

            {/* Detail Body */}
            <div className="p-8">
              {selectedCampaign.campaignType === "SHOP_SALE" ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <h3 className="font-bold text-lg text-gray-800 uppercase tracking-tight italic flex items-center gap-2">
                      <Package className="text-orange-500" />
                      Sản phẩm tham gia ({selectedCampaignProducts.length})
                    </h3>
                  </div>

                  {selectedCampaignProducts.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-4xl border-2 border-dashed border-gray-100">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Chưa có sản phẩm nào
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-125 overflow-y-auto pr-1 custom-scrollbar">
                      {selectedCampaignProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-3xl hover:border-orange-200 transition-all hover:shadow-lg hover:shadow-orange-500/5 group"
                        >
                          <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-inner border border-gray-50">
                            <Image
                              src={
                                prod.productThumbnail ||
                                "https://picsum.photos/100/100"
                              }
                              alt={prod.productName}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight leading-none">
                              {prod.productName}
                            </h4>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-sm font-bold text-orange-500 italic">
                                {formatPrice(prod.salePrice)}
                              </span>
                              <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 uppercase tracking-widest">
                                {prod.status}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-2">
                              <div
                                className="h-full bg-orange-400"
                                style={{
                                  width: `${Math.min((prod.stockSold / prod.stockLimit) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter pt-1">
                              Đã bán:{" "}
                              <span className="text-orange-500">
                                {prod.stockSold}
                              </span>
                              /{prod.stockLimit}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <Info className="text-blue-500" size={20} />
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                      Vui lòng chọn 01 khung giờ phía dưới để tiến hành đăng ký
                      sản phẩm
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaignSlots.map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() =>
                          !slot.isFullyBooked &&
                          (setSelectedSlot(slot), setShowRegisterModal(true))
                        }
                        className={cn(
                          "p-5 rounded-4xl border-2 transition-all duration-300 relative group",
                          slot.isFullyBooked
                            ? "bg-gray-50 border-gray-100 opacity-60 grayscale cursor-not-allowed"
                            : "bg-white border-gray-100 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer",
                        )}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={cn(
                              "px-3 py-1 text-[9px] font-bold rounded-lg uppercase tracking-[0.15em] shadow-xs",
                              slot.status === "ACTIVE"
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-500",
                            )}
                          >
                            {slot.status}
                          </span>
                          {slot.isFullyBooked && (
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest italic">
                              Hết chỗ
                            </span>
                          )}
                        </div>

                        <p className="font-bold text-gray-800 uppercase italic tracking-tight text-base mb-1">
                          {slot.slotName || "Khung giờ vàng"}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                          <Clock size={14} className="text-orange-400" />
                          {new Date(slot.startTime).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                          {" — "}
                          {new Date(slot.endTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="text-orange-500">
                              {slot.approvedProducts}
                            </span>
                            /{slot.maxProducts} SP
                          </span>
                          {!slot.isFullyBooked && (
                            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                              <Plus size={16} strokeWidth={3} />
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
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100 flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-200" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 uppercase italic tracking-tighter">
                Khám phá Campaign
              </p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Chọn một chương trình bên trái để xem chi tiết
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
