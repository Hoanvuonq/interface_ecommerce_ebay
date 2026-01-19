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
import { MyRegistrationsScreen } from "../MyRegistrationsScreen";
import { MyShopSaleScreen } from "../MyShopSaleScreen";
import { getDisplayStatus } from "../../_constants/getDisplayStatus";

type CampaignTabs =
  | "participate-campaign"
  | "register-campaign"
  | "discount-campaign";

export const ShopCamPaignScreen = () => {
  const [activeTab, setActiveTab] = useState<CampaignTabs>(
    "participate-campaign",
  );

  const {
    handleSelectCampaign,
    formatPrice,
    handleCancelRegistration,
    handleToggleCampaign,
    fetchMyProducts,
  } = useShopCampaign();
  const setCreateStep = useCampaignStore((s) => s.setCreateStep);
  const setShowCreateModal = useCampaignStore((s) => s.setShowCreateModal);
  const [targetCampaignId, setTargetCampaignId] = useState<string | null>(null);
  const myCampaigns = useCampaignStore((s) => s.myCampaigns);
  const selectedCampaign = useCampaignStore((s) => s.selectedCampaign);
  const selectedCampaignProducts = useCampaignStore(
    (s) => s.selectedCampaignProducts,
  );
  const myRegistrations = useCampaignStore((s) => s.myRegistrations);
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
          <MyRegistrationsScreen
            registrations={myRegistrations}
            onCancel={handleCancelRegistration}
            formatPrice={formatPrice}
          />
        );
      case "discount-campaign":
        return (
          <MyShopSaleScreen
            myCampaigns={myCampaigns}
            selectedCampaign={selectedCampaign}
            selectedCampaignProducts={selectedCampaignProducts}
            onSelectCampaign={handleSelectCampaign}
            onToggleStatus={handleToggleCampaign}
            onAddNew={() => {
              setShowCreateModal("simple");
              setCreateStep("INFO");
              // ... reset form khác
            }}
            onAddProducts={(id) => {
              setTargetCampaignId(id);
              setShowCreateModal("addProduct");
              setCreateStep("PRODUCTS");
              fetchMyProducts();
            }}
            formatPrice={formatPrice}
            getDisplayStatus={getDisplayStatus}
          />
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

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
