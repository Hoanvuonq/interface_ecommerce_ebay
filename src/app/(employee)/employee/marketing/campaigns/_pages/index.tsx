"use client";

import { StatusTabs } from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Calendar, Package } from "lucide-react";
import { useEffect, useMemo } from "react";
import { CreateCampaignAdminModal } from "../_components/CreateCampaignAdminModal";
import { useAdminCampaign } from "../_hooks/useAdminCampaigns";
import {
  CampaignRegistrationsTab,
  CreateCampaignSlotsModal,
  CampaignStatisticsTab,
  CampaignListTable,
  CampaignCancelModal,
} from "../_components";
import { formatPrice } from "@/hooks/useFormatPrice";

type AdminCampaignTabs = "campaigns" | "registrations" | "statistics";

export const AdminCampaignScreen = () => {
  const {
    authState,
    campaigns,
    loading,
    activeTab,
    statusFilter,
    page,
    size,
    totalElements,
    setPage,
    setActiveTab,
    onConfirmCancel,
    campaignStats,
    cancelModal,
    setCancelModal,
    isCancelling,
    setStatusFilter,
    pendingRegistrations,
    selectedRegistrations,
    handleBatchApprove,
    toggleRegistrationSelection,
    fetchData,
    handleApproveRegistration,
    handleScheduleCampaign,
    handleRejectRegistration,
    handleCancelCampaign,
    handleDeleteCampaign,

    selectedCampaign,
    handleViewStats,
    isCreateModalOpen,
    isSlotModalOpen,
    handleCreateSlots,
    isSlotProcessing,
    handleOpenSlotModal,
    setIsSlotModalOpen,
    setIsCreateModalOpen,
    creating,
    handleCreateCampaign,
  } = useAdminCampaign();

  const { uploadFile } = usePresignedUpload();

  useEffect(() => {
    if (authState.isLoggedIn && authState.role === "admin") {
      fetchData();
    }
  }, [authState.isLoggedIn, authState.role, fetchData]);

  const pageMeta = useMemo(() => {
    const metas: Record<AdminCampaignTabs, { title: string; desc: string }> = {
      campaigns: {
        title: "Platform Campaigns",
        desc: "Quản lý các chiến dịch trên nền tảng",
      },
      registrations: {
        title: "Duyệt đăng ký",
        desc: "Phê duyệt yêu cầu tham gia chiến dịch",
      },
      statistics: {
        title: "Thống kê hệ thống",
        desc: "Báo cáo hiệu quả kinh doanh",
      },
    };
    return metas[activeTab];
  }, [activeTab]);

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "campaigns":
        return (
          <CampaignListTable
            data={campaigns.filter(
              (c) => statusFilter === "ALL" || c.status === statusFilter,
            )}
            loading={loading}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onQuickCreate={() => setIsCreateModalOpen(true)}
            onViewStats={handleViewStats}
            onSchedule={handleScheduleCampaign}
            onCancel={handleCancelCampaign}
            onAddSlot={handleOpenSlotModal}
            onDelete={handleDeleteCampaign}
            page={page}
            size={size}
            totalElements={totalElements}
            onPageChange={(newPage) => setPage(newPage)}
          />
        );
      case "registrations":
        return (
          <CampaignRegistrationsTab
            pendingRegistrations={pendingRegistrations}
            selectedRegistrations={selectedRegistrations}
            onBatchApprove={handleBatchApprove}
            onApprove={handleApproveRegistration}
            onReject={handleRejectRegistration}
            onToggleSelection={toggleRegistrationSelection}
          />
        );
      case "statistics":
        return (
          <CampaignStatisticsTab
            selectedCampaign={selectedCampaign}
            campaignStats={campaignStats}
            formatPrice={formatPrice}
          />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    campaigns,
    statusFilter,
    loading,
    page,
    size,
    totalElements,
    setPage,
    setIsCreateModalOpen,
    handleViewStats,
    handleScheduleCampaign,
    handleCancelCampaign,
  ]);

  return (
    <div className="mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 px-4">
        <StatusTabs
          tabs={[
            { key: "campaigns", label: "Campaigns", icon: Calendar },
            { key: "registrations", label: "Duyệt đăng ký", icon: Package },
            { key: "statistics", label: "Thống kê", icon: BarChart3 },
          ]}
          current={activeTab}
          onChange={(key) => setActiveTab(key)}
          className="w-full md:w-auto"
        />

        <div className="text-right hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 italic uppercase">
                {pageMeta.title}
              </h1>
              <p className="text-[10px] font-bold uppercase text-orange-400 mt-2">
                {pageMeta.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative p-4">{renderTabContent}</div>

      <CreateCampaignAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateCampaign}
        isProcessing={creating}
        onUploadThumb={(file) =>
          uploadFile(file, UploadContext.PRODUCT_THUMBNAIL)
        }
        onUploadBanner={(file) => uploadFile(file, UploadContext.BANNER)}
      />
      <CampaignCancelModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ ...cancelModal, isOpen: false })}
        campaignName={cancelModal.name}
        onConfirm={onConfirmCancel}
        isProcessing={isCancelling}
      />

      <CreateCampaignSlotsModal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        onSave={handleCreateSlots}
        isProcessing={isSlotProcessing}
      />
    </div>
  );
};
