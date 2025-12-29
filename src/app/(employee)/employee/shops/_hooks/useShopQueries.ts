import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    getAllShops, 
    getShopStatistics, 
    verifyShop, 
    getShopDetail, 
    verifyShopLegal, 
    verifyShopTax 
} from "../_services/manager.shop.service";

// Hook lấy danh sách shop (Server State)
export const useShopsData = (params: any) => {
  return useQuery({
    queryKey: ['shops', params],
    queryFn: () => getAllShops(params),
    placeholderData: (prev) => prev,
  });
};

// Hook lấy chi tiết 1 shop
export const useShopDetailData = (shopId: string | undefined) => {
  return useQuery({
    queryKey: ['shop-detail', shopId],
    queryFn: () => getShopDetail(shopId!),
    enabled: !!shopId,
  });
};

// Hook lấy thống kê
export const useShopStats = () => {
  return useQuery({
    queryKey: ['shop-statistics'],
    queryFn: getShopStatistics,
  });
};

// Hook xử lý các hành động Duyệt/Từ chối
export const useVerifyShopMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ shopId, payload }: any) => verifyShop(shopId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop-statistics'] });
    },
  });
};

export const useVerifyLegalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ shopId, legalId, payload }: any) => verifyShopLegal(shopId, legalId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shop-detail', variables.shopId] });
    },
  });
};

export const useVerifyTaxMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ shopId, taxId, payload }: any) => verifyShopTax(shopId, taxId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shop-detail', variables.shopId] });
    },
  });
};