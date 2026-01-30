"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { getAuthState } from "@/app/(shop)/shop/marketing/_shared";
import { adminCampaignService } from "../_services/admin-campaign.service";
import type { CampaignStatus } from "@/app/(shop)/shop/marketing/campaigns/_types/campaign.type";
import type {
  CampaignResponse,
  CampaignSlotProductResponse,
  CampaignStatisticsResponse,
} from "../_types/types";

export const useAdminCampaign = () => {
  const [authState, setAuthState] = useState(getAuthState());
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<
    CampaignSlotProductResponse[]
  >([]);
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignResponse | null>(null);
  const [campaignStats, setCampaignStats] =
    useState<CampaignStatisticsResponse | null>(null);
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>(
    [],
  );

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotTargetId, setSlotTargetId] = useState<string | null>(null);
  const [isSlotProcessing, setIsSlotProcessing] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "campaigns" | "registrations" | "statistics"
  >("campaigns");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">(
    "ALL",
  );

  const { success: toastSuccess, error: toastError } = useToast();

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    id: "",
    name: "",
  });
  const [isCancelling, setIsCancelling] = useState(false);

  const handleOpenCancel = (campaign: CampaignResponse) => {
    setCancelModal({ isOpen: true, id: campaign.id, name: campaign.name });
  };

  const onConfirmCancel = async (reason: string) => {
    setIsCancelling(true);
    try {
      await adminCampaignService.cancelCampaign(cancelModal.id, reason);
      toastSuccess("Đã dừng chiến dịch thành công");
      setCancelModal((prev) => ({ ...prev, isOpen: false }));
      fetchData();
    } catch (err: any) {
      toastError(err.message || "Không thể dừng chiến dịch");
    } finally {
      setIsCancelling(false);
    }
  };

  const fetchData = useCallback(
    async (targetPage: number = page) => {
      setLoading(true);
      try {
        const [campaignsRes, registrationsRes] = await Promise.all([
          adminCampaignService
            .getAllCampaigns(targetPage, size)
            .catch(() => ({ content: [], totalElements: 0 })),
          adminCampaignService
            .getPendingRegistrations(0, 50)
            .catch(() => ({ content: [] })),
        ]);

        setCampaigns(campaignsRes.content || []);
        setTotalElements(campaignsRes.totalElements || 0);
        setPendingRegistrations(registrationsRes.content || []);
      } catch (err: any) {
        toastError(err.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    },
    [page, size],
  );
  useEffect(() => {
    setAuthState(getAuthState());
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (authState.isLoggedIn && authState.role === "admin" && isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [authState.isLoggedIn, authState.role, fetchData]);


  const handleOpenSlotModal = (campaignId: string) => {
    setSlotTargetId(campaignId);
    setIsSlotModalOpen(true);
  };

  const handleCreateSlots = async (slots: any[]) => {
    if (!slotTargetId) return;
    setIsSlotProcessing(true);
    try {
      await adminCampaignService.createSlots(slotTargetId, slots);
      toastSuccess("Đã khởi tạo các khung giờ thành công!");
      setIsSlotModalOpen(false);
      fetchData();
    } catch (err: any) {
      toastError(err.message || "Lỗi khi tạo Slot");
    } finally {
      setIsSlotProcessing(false);
    }
  };

  const handleCreateCampaign = async (formData: any) => {
    setCreating(true);
    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const res = await adminCampaignService.createCampaign(payload);

      if (res && res.id) {
        toastSuccess("Đã tạo chiến dịch mới thành công!");
        setIsCreateModalOpen(false);
        fetchData(0);
        setPage(0);
      }
    } catch (err: any) {
      toastError(err.message || "Tạo chiến dịch thất bại");
    } finally {
      setCreating(false);
    }
  };

  const handleScheduleCampaign = async (campaignId: string) => {
    try {
      await adminCampaignService.scheduleCampaign(campaignId);
      toastSuccess("Đã lên lịch campaign");
      fetchData();
    } catch (err: any) {
      toastError(err.message || "Không thể lên lịch");
    }
  };

  const handleCancelCampaign = useCallback(
    (campaignId: string) => {
      const target = campaigns.find((c) => c.id === campaignId);
      if (target) {
        setCancelModal({
          isOpen: true,
          id: target.id,
          name: target.name,
        });
      }
    },
    [campaigns],
  );

  const handleViewStats = async (campaign: CampaignResponse) => {
    setSelectedCampaign(campaign);
    try {
      const stats = await adminCampaignService.getCampaignStatistics(
        campaign.id,
      );
      setCampaignStats(stats);
    } catch (err) {
      setCampaignStats(null);
    }
    setActiveTab("statistics");
  };

  const handleBatchApprove = async () => {
  if (selectedRegistrations.length === 0) return;

  try {
    setLoading(true);
    await Promise.all(
      selectedRegistrations.map((id) => adminCampaignService.approveRegistration(id))
    );
    
    toastSuccess(`Đã duyệt thành công ${selectedRegistrations.length} yêu cầu`);
    setSelectedRegistrations([]);
    fetchData();
  } catch (err: any) {
    toastError(err.message || "Lỗi khi duyệt hàng loạt");
  } finally {
    setLoading(false);
  }
};
const handleApproveRegistration = async (regId: string) => {
    try {
      setLoading(true);
      await adminCampaignService.approveRegistration(regId);
      toastSuccess("Đã duyệt đăng ký thành công");
      fetchData();
    } catch (err: any) {
      toastError(err.message || "Không thể duyệt đăng ký");
    } finally {
      setLoading(false);
    }
  };

 
  const handleRejectRegistration = async (regId: string) => {
    const reason = prompt("Lý do từ chối:");
    if (!reason) return;

    try {
      await adminCampaignService.rejectRegistration(regId, reason);
      toastSuccess("Đã từ chối đăng ký");
      fetchData();
    } catch (err: any) {
      toastError(err.message || "Không thể từ chối");
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa chiến dịch này? Thao tác này không thể hoàn tác.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await adminCampaignService.deleteCampaign(campaignId);
      toastSuccess("Xóa chiến dịch thành công!");
      fetchData();
    } catch (err: any) {
      toastError(err.message || "Không thể xóa chiến dịch");
    } finally {
      setLoading(false);
    }
  };

  const toggleRegistrationSelection = (regId: string) => {
    setSelectedRegistrations((prev) =>
      prev.includes(regId)
        ? prev.filter((id) => id !== regId)
        : [...prev, regId],
    );
  };

  return {
    authState,
    campaigns,
    pendingRegistrations,
    selectedCampaign,
    campaignStats,
    selectedRegistrations,
    loading,
    creating,
    activeTab,
    statusFilter,
    isCreateModalOpen,
    page,
    size,
    totalElements,
    setPage,
    setSize,
    setActiveTab,
    setStatusFilter,
    setCancelModal,
    setIsCreateModalOpen,
    onConfirmCancel,
    cancelModal,
    handleDeleteCampaign,
    isCancelling,
    handleOpenCancel,
    fetchData,
    handleCreateCampaign,
    handleBatchApprove,
    handleScheduleCampaign,
    handleCancelCampaign,
    handleRejectRegistration,
    handleApproveRegistration,
    isSlotModalOpen,
    setIsSlotModalOpen,
    handleOpenSlotModal,
    handleCreateSlots,
    isSlotProcessing,
    handleViewStats,
    toggleRegistrationSelection,
  };
};
