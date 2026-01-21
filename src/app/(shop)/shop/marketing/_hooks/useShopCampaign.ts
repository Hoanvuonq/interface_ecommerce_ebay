"use client";

import { useCampaignStore } from "../_stores/campaign.store";
import { shopCampaignService } from "@/app/(shop)/shop/marketing/campaigns/_services/shop-campaign.service";
import { campaignService } from "@/app/(shop)/shop/marketing/campaigns/_services/campaign.service";
import { useToast } from "@/hooks/useToast";
import { getAuthState } from "../_shared";
import { useCallback, useEffect } from "react";
import _ from "lodash";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CampaignResponse } from "../campaigns/_types/campaign.type";

export function useShopCampaign() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const store = useCampaignStore();
  const setAuthState = useCampaignStore((s) => s.setAuthState);

  useEffect(() => {
    setAuthState(getAuthState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { authState } = store;

  // 1. Trích xuất productsLoading từ isLoading của query shop-products
  const {
    refetch: refetchProducts,
    data: productsData,
    isError: productsError,
    isLoading: productsLoading, // Đảm bảo biến này tồn tại ở đây
  } = useQuery({
    queryKey: ["shop-products"],
    queryFn: () => shopCampaignService.getMyProducts({ page: 0, size: 50 }),
    enabled: Boolean(authState?.isLoggedIn && authState?.role === "shop"),
  });

  useEffect(() => {
    if (productsData) {
      store.setMyProducts(productsData.content);
    }
  }, [productsData, store]);

  useEffect(() => {
    if (productsError) {
      toast.error("Không thể tải danh sách sản phẩm");
    }
  }, [productsError, toast]);

  const {
    refetch: refreshAllData,
    isLoading: isDataLoading,
    data: overviewData,
  } = useQuery({
    queryKey: ["campaigns-overview"],
    queryFn: async () => {
      const [campaigns, registrations, shopCampaigns] = await Promise.all([
        shopCampaignService.getAvailablePlatformCampaigns().catch(() => []),
        shopCampaignService.getMyRegistrations().catch(() => ({ content: [] })),
        shopCampaignService.getMyCampaigns().catch(() => ({ content: [] })),
      ]);
      return { campaigns, registrations, shopCampaigns };
    },
    enabled: Boolean(authState?.isLoggedIn && authState?.role === "shop"),
  });

  useEffect(() => {
    if (overviewData) {
      store.setAvailableCampaigns(overviewData.campaigns);
      store.setMyRegistrations(overviewData.registrations.content || []);
      store.setMyCampaigns(overviewData.shopCampaigns.content || []);
    }
  }, [overviewData, store]);

  const prepareProductsPayload = useCallback(() => {
    return _(store.selectedVariants)
      .toPairs()
      .filter(([_, config]) => config.selected)
      .map(([variantId, config]) => ({
        variantId,
        salePrice: config.salePrice || 0,
        stockLimit: config.stockLimit,
      }))
      .value();
  }, [store.selectedVariants]);

  const handleCreateCampaign = useCallback(async () => {
    const { createForm, showCreateModal } = store;

    if (!createForm.name || !createForm.startDate || !createForm.endDate) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    store.setLoading(true);
    try {
      const products = prepareProductsPayload();

      if (showCreateModal === "simple") {
        await shopCampaignService.createShopCampaign({
          name: createForm.name,
          description: createForm.description,
          startDate: new Date(createForm.startDate).toISOString(),
          endDate: new Date(createForm.endDate).toISOString(),
          bannerAssetId: createForm.bannerAssetId,
          thumbnailAssetId: createForm.thumbnailAssetId,
          displayPriority: createForm.displayPriority,
          products: !_.isEmpty(products) ? products : undefined,
        });
        toast.success("Tạo chiến dịch thành công!");
        store.setShowCreateModal(null);
        store.resetCreateForm();
        refreshAllData();
      } else {
        toast.info("Tính năng Flash Sale nâng cao đang được cập nhật");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi tạo chiến dịch");
    } finally {
      store.setLoading(false);
    }
  }, [store, prepareProductsPayload, refreshAllData, toast]);

  const handleAddProducts = useCallback(async () => {
    if (!store.targetCampaignId) return;

    store.setLoading(true);
    try {
      const products = prepareProductsPayload();

      if (_.isEmpty(products)) {
        toast.error("Vui lòng chọn ít nhất 1 sản phẩm");
        return;
      }

      await shopCampaignService.addProductsToShopCampaign(
        store.targetCampaignId,
        products,
      );

      toast.success("Thêm sản phẩm thành công!");
      store.setShowCreateModal(null);
      store.setTargetCampaignId(null);
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi thêm sản phẩm");
    } finally {
      store.setLoading(false);
    }
  }, [store.targetCampaignId, prepareProductsPayload, refreshAllData, toast]);

  const handleSelectCampaign = useCallback(
    async (campaign: CampaignResponse) => {
      store.setSelectedCampaign(campaign);
      store.setSelectedCampaignProducts([]);
      store.setCampaignSlots([]);

      try {
        if (campaign.campaignType === "SHOP_SALE") {
          const detail = await shopCampaignService.getMyCampaignDetail(
            campaign.id,
          );
          store.setSelectedCampaign(detail);
          if (detail.products)
            store.setSelectedCampaignProducts(detail.products);
        } else {
          const slots = await campaignService.getCampaignProducts(campaign.id);
          store.setCampaignSlots(slots);
        }
      } catch (err) {
        console.error("Detail fetch error:", err);
      }
    },
    [store],
  );

  const handleToggleCampaign = useCallback(
    async (e: React.MouseEvent, campaignId: string, currentStatus: string) => {
      e.stopPropagation();
      const isPaused = currentStatus === "PAUSED";

      try {
        await shopCampaignService.toggleShopCampaign(campaignId);
        toast.success(`Đã ${isPaused ? "tiếp tục" : "tạm dừng"} chiến dịch`);
        refreshAllData();
      } catch (err: any) {
        toast.error(err.message || "Lỗi khi thay đổi trạng thái");
      }
    },
    [refreshAllData, toast],
  );

  const handleCancelRegistration = useCallback(
    async (regId: string) => {
      if (!window.confirm("Bạn có chắc muốn hủy đăng ký này?")) return;

      try {
        await shopCampaignService.cancelRegistration(regId);
        toast.success("Đã hủy đăng ký thành công");
        refreshAllData();
      } catch (err: any) {
        toast.error(err.message || "Không thể hủy đăng ký");
      }
    },
    [refreshAllData, toast],
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return {
    isLoading: isDataLoading || store.loading,
    productsLoading, 
    fetchMyProducts: refetchProducts,
    fetchData: refreshAllData,
    handleCreateCampaign,
    handleAddProducts,
    handleSelectCampaign,
    handleToggleCampaign,
    handleCancelRegistration,
    formatPrice,
  };
}
