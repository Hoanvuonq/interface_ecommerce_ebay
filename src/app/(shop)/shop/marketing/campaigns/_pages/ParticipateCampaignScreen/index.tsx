"use client";

import { formatDateTime } from "@/hooks/format";
import { cn } from "@/utils/cn";
import {
  Calendar,
  ChevronRight,
  Clock,
  Info,
  LayoutGrid,
  Package,
  Plus,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useCampaignStore } from "../../../_stores/campaign.store";
import { ParticipateCampaignScreenProps } from "./type";
import { CampaignCard, CampaignDetailCard } from "../../_components";

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
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar p-1">
            {availableCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                isSelected={selectedCampaign?.id === campaign.id}
                onSelect={handleSelectCampaign}
              />
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        {selectedCampaign ? (
          <CampaignDetailCard
            selectedCampaign={selectedCampaign}
            selectedCampaignProducts={selectedCampaignProducts}
            campaignSlots={campaignSlots}
            formatPrice={formatPrice}
            setSelectedSlot={setSelectedSlot}
            setShowRegisterModal={setShowRegisterModal}
          />
        ) : (
          <div className="h-full min-h-125 bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100 flex flex-col items-center justify-center group transition-colors hover:bg-slate-50/50">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ring-8 ring-slate-50/50">
              <Package className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-xl font-bold text-slate-800 uppercase italic tracking-tighter mb-2">
              Khám phá Campaign
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              Chọn một chương trình từ danh sách để kích hoạt module
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
