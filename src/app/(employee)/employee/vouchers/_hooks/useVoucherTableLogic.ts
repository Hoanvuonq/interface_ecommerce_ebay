import { useVoucherStore } from "../_store/useVoucherStore";
import { useVoucherQueries } from "./useVoucherQueries";
import { useToast } from "@/hooks/useToast";
import * as service from "../_services/voucher-v2.service";
import { useQuery } from "@tanstack/react-query";

export const useVoucherTableLogic = () => {
  const store = useVoucherStore();
  const { success, error: toastError } = useToast();

  const {
    templatesQuery,
    createMutation,
    toggleStatusMutation,
    deleteMutation,
    useInstanceMutation,
    usePlatformMutation,
  } = useVoucherQueries(store.filters, store.pagination);

  // Query cho Voucher Info (Detail Modal)
  const detailData = useQuery({
    queryKey: ["vouchers", "info", store.detailModal.selectedId],
    queryFn: () => service.getVoucherInfo(store.detailModal.selectedId!),
    enabled: !!store.detailModal.selectedId && store.detailModal.open,
  });

  // Computed Statistics
  const templates = templatesQuery.data?.content || [];
  const statistics = {
    platformCount: templates.filter((t) => t.creatorType === "PLATFORM").length,
    shopCount: templates.filter((t) => t.creatorType === "SHOP").length,
    activeCount: templates.filter((t) => t.active).length,
    total: templatesQuery.data?.totalElements || 0,
  };

  // === HANDLERS ===
  const handleCreate = async (values: any) => {
    try {
      await createMutation.mutateAsync(values);
      success("Protocol: Khởi tạo Voucher thành công!");
      store.setCreateModal(false);
    } catch (e: any) {
      toastError(e.message || "Lỗi khởi tạo");
    }
  };

  const handleToggleStatus = async (template: any) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: template.id,
        active: !template.active,
      });
      success(
        `Protocol: ${!template.active ? "Kích hoạt" : "Vô hiệu hóa"} thành công`,
      );
    } catch (e: any) {
      toastError("Lỗi cập nhật trạng thái");
    }
  };

  const handleUseInstance = async (instanceId: string) => {
    try {
      await useInstanceMutation.mutateAsync(instanceId);
      success("Đã thực thi sử dụng Instance");
    } catch (e: any) {
      toastError("Thực thi thất bại");
    }
  };

  const handleUsePlatform = async (template: any) => {
    try {
      await usePlatformMutation.mutateAsync(template.id);
      success("Đã kích hoạt Platform Voucher");
    } catch (e: any) {
      toastError("Thực thi thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      success("Đã xóa bản ghi Protocol");
    } catch (e: any) {
      toastError("Xóa thất bại");
    }
  };

  return {
    ...store,
    ...statistics,
    templates,
    isLoading: templatesQuery.isLoading,
    isRefetching: templatesQuery.isRefetching,
    voucherInfo: detailData.data?.data,
    isLoadingInfo: detailData.isLoading,
    handleCreate,
    handleToggleStatus,
    handleUseInstance,
    handleUsePlatform,
    handleDelete,
    handleValidate: (codes: string[]) =>
      service.validateVouchers({ voucherCodes: codes }),
    handleCheckUsage: (id: string) => service.checkVoucherUsage(id),
    handleGetInfo: (id: string) =>
      service.getVoucherInfo(id).then((r) => r.data),
    refresh: () => templatesQuery.refetch(),
  };
};
