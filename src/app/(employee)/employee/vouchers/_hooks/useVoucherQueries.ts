import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as service from "../_services/voucher-v2.service";
import dayjs from "dayjs";

export const voucherKeys = {
  all: ["vouchers"] as const,
  list: (filters: any, pagination: any) =>
    [...voucherKeys.all, "list", filters, pagination] as const,
  detail: (id: string) => [...voucherKeys.all, "detail", id] as const,
};

export const useVoucherQueries = (filters: any, pagination: any) => {
  const queryClient = useQueryClient();

  const templatesQuery = useQuery({
    queryKey: voucherKeys.list(filters, pagination),
    queryFn: async () => {
      const res = await service.searchTemplates({
        scope: filters.scope,
        q: filters.q || undefined,
        page: pagination.page,
        size: pagination.size,
        sort: pagination.sort,
      });

      let content = res.data?.content || [];
      if (filters.active !== null)
        content = content.filter((t) => t.active === filters.active);
      if (filters.purchasable !== null)
        content = content.filter((t) => t.purchasable === filters.purchasable);
      if (filters.creatorType)
        content = content.filter((t) => t.creatorType === filters.creatorType);
      if (filters.voucherScope)
        content = content.filter(
          (t) => t.voucherScope === filters.voucherScope,
        );
      if (filters.discountType)
        content = content.filter(
          (t) => t.discountType === filters.discountType,
        );
      if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
        content = content.filter((t) => {
          const start = dayjs(t.startDate);
          const end = t.endDate ? dayjs(t.endDate) : null;
          return (
            (start.isAfter(filters.dateRange[0]) ||
              start.isSame(filters.dateRange[0])) &&
            (!end ||
              end.isBefore(filters.dateRange[1]) ||
              end.isSame(filters.dateRange[1]))
          );
        });
      }
      if (filters.minPrice !== null)
        content = content.filter((t) => (t.price || 0) >= filters.minPrice!);
      if (filters.maxPrice !== null)
        content = content.filter((t) => (t.price || 0) <= filters.maxPrice!);

      return { ...res.data, content };
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: voucherKeys.all });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      data.purchasable
        ? service.createPlatformTemplate(data)
        : service.createPlatformDirectVoucher(data),
    onSuccess: invalidate,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      service.toggleTemplateStatus(id, active),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: service.deleteTemplate,
    onSuccess: invalidate,
  });

  const useInstanceMutation = useMutation({
    mutationFn: service.useVoucherInstance,
    onSuccess: invalidate,
  });

  const usePlatformMutation = useMutation({
    mutationFn: service.usePlatformVoucher,
    onSuccess: invalidate,
  });

  return {
    templatesQuery,
    createMutation,
    toggleStatusMutation,
    deleteMutation,
    useInstanceMutation,
    usePlatformMutation,
  };
};
