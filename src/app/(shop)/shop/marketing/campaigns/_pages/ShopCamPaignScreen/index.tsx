"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Package, Tag } from "lucide-react";
import { getAuthState } from "../../../_shared";
import { useCampaignStore } from "../../../_stores/campaign.store";
import { useShopCampaign } from "../../../_hooks/useShopCampaign";
import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { AnimatePresence, motion } from "framer-motion";
import { ParticipateCampaignScreen } from "../ParticipateCampaignScreen";

type CampaignTabs =
  | "participate-campaign"
  | "register-campaign"
  | "discount-campaign";

export const ShopCamPaignScreen = () => {
  const [activeTab, setActiveTab] = useState<CampaignTabs>(
    "participate-campaign",
  );

  const { handleSelectCampaign, formatPrice } = useShopCampaign();

  const setAuthState = useCampaignStore((s) => s.setAuthState);
  const setSelectedSlot = useCampaignStore((s) => s.setSelectedSlot);
  const setShowRegisterModal = useCampaignStore((s) => s.setShowRegisterModal);

  useEffect(() => {
    setAuthState(getAuthState());
  }, [setAuthState]);

  const campaignRenderTabs: StatusTabItem<CampaignTabs>[] = [
    { key: "participate-campaign", label: "Tham gia Campaign", icon: Plus },
    { key: "register-campaign", label: "Đăng ký của tôi", icon: Package },
    { key: "discount-campaign", label: "Giảm giá tại cửa hàng", icon: Tag },
  ];

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "participate-campaign":
        return (
          <ParticipateCampaignScreen
            handleSelectCampaign={handleSelectCampaign}
            setSelectedSlot={setSelectedSlot}
            setShowRegisterModal={setShowRegisterModal}
            formatPrice={formatPrice}
          />
        );
      case "register-campaign":
        return (
          <div className="bg-white rounded-4xl p-20 text-center border-2 border-dashed border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">
              Tính năng "Đăng ký của tôi" đang đồng bộ dữ liệu...
            </p>
          </div>
        );
      case "discount-campaign":
        return (
          <div className="bg-white rounded-4xl p-20 text-center border-2 border-dashed border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">
              Tính năng "Giảm giá tại cửa hàng" đang được cập nhật
            </p>
          </div>
        );
      default:
        return null;
    }
  }, [
    activeTab,
    handleSelectCampaign,
    setSelectedSlot,
    setShowRegisterModal,
    formatPrice,
  ]);

  return (
    <div className="mx-auto p-4 space-y-8 animate-in fade-in duration-700">
      <StatusTabs
        tabs={campaignRenderTabs}
        current={activeTab}
        onChange={(key) => setActiveTab(key)}
        className="w-full md:w-auto"
      />

      {/* Content Area với Motion mượt mà */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }} // Trượt nhẹ từ dưới lên
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Cubic Bezier chuẩn mượt
          >
            {renderTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
