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
  const setTargetCampaignId = useCampaignStore((s) => s.setTargetCampaignId);
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

  useEffect(() => {
    setShowCreateModal(null);
  }, [activeTab, setShowCreateModal]);

  const campaignRenderTabs: StatusTabItem<CampaignTabs>[] = [
    { key: "participate-campaign", label: "Tham gia Campaign", icon: Plus },
    { key: "register-campaign", label: "Đăng ký của tôi", icon: Package },
    { key: "discount-campaign", label: "Tạo giảm giá tại cửa hàng", icon: Tag },
  ];
  const pageMeta = useMemo(() => {
    const metas: Record<CampaignTabs, { title: string; desc: string }> = {
      "participate-campaign": {
        title: "Tham Gia Chiến Dịch",
        desc: "Hệ thống chiến dịch toàn sàn",
      },
      "register-campaign": {
        title: "Chiến dịch đã tham gia",
        desc: "Theo dõi tiến độ duyệt và doanh thu biến thể",
      },
      "discount-campaign": {
        title: "Shop Discounts",
        desc: "Chương trình khuyến mãi riêng của shop",
      },
    };
    return metas[activeTab];
  }, [activeTab]);
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
            }}
            onAddProducts={(id: string) => {
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
    myRegistrations,
    handleCancelRegistration,
    myCampaigns,
    selectedCampaign,
    selectedCampaignProducts,
    handleToggleCampaign,
    setShowCreateModal,
    setCreateStep,
    fetchMyProducts,
  ]);

  return (
    <div className="mx-auto p-4  animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
        <div className="flex w-full justify-between items-center gap-4">
          <StatusTabs
            tabs={campaignRenderTabs}
            current={activeTab}
            onChange={(key) => setActiveTab(key)}
            className="w-full md:w-auto"
          />
          <div className="text-right pr-10 py-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight italic uppercase leading-none">
                  {pageMeta.title}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mt-2">
                  {pageMeta.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

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
