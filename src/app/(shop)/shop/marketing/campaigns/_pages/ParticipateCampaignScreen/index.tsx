"use client";

import { EmptyProductState } from "@/app/(main)/products/_components/EmptyProductState";
import {
  Zap
} from "lucide-react";
import { useCampaignStore } from "../../../_stores/campaign.store";
import { CampaignCard, CampaignDetailCard } from "../../_components";
import { ParticipateCampaignScreenProps } from "./type";

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
          <EmptyProductState
            isShop={true}
            message=" Chọn một chương trình từ danh sách để kích hoạt module"
          />
        )}
      </div>
    </div>
  );
};
