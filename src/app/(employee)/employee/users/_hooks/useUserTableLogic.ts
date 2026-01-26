"use client";

import { useToast } from "@/hooks/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useCallback, useEffect } from "react";
import { useUserTableStore } from "../_store/userTableStore";
import {
  useGetAllRoles,
  useGetAllUsers,
  useGetUserStatistics,
  useLockUser,
  useUnLockUser,
} from "./useUser";

export const useUserTableLogic = () => {
  const store = useUserTableStore();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { handleGetAllUsers } = useGetAllUsers();
  const { handleGetAllRoles } = useGetAllRoles();
  const { handleGetUserStatistics } = useGetUserStatistics();
  const { handleLockUser } = useLockUser();
  const { handleUnLockUser } = useUnLockUser();

  const usersQuery = useQuery({
    queryKey: [
      "users",
      store.searchKeyword,
      store.activeTab,
      store.selectedRoles,
      store.pagination.current,
      store.pagination.pageSize,
    ],
    // Sửa lại đoạn queryFn trong useUserTableLogic.ts
    queryFn: async () => {
      const params: any = {
        page: store.pagination.current - 1,
        size: store.pagination.pageSize,
        sort: "asc",
      };

      if (store.searchKeyword) params.username = store.searchKeyword;

      // Xử lý Status: Swagger không ghi cụ thể mảng hay đơn,
      // nhưng an toàn nhất là truyền đơn nếu chỉ chọn 1 tab
      if (store.activeTab !== "ALL") {
        params.statuses = store.activeTab;
      }

      if (!_.isEmpty(store.selectedRoles)) {
        params.roleNames = store.selectedRoles.join(",");
      }

      const res = await handleGetAllUsers(params);

      if (res?.data) {
        // Theo Swagger, kết quả trả về là ApiResponseObject
        // Bạn cần trỏ đúng vào content của Spring Boot Paging
        const userList = res.data.content || [];
        store.updateState({
          users: userList,
          pagination: {
            ...store.pagination,
            total: res.data.totalElements || 0,
          },
        });
      }
      return res?.data;
    },
  });

  // Đồng bộ hóa dữ liệu từ Query vào Store để Table hiển thị
  useEffect(() => {
    if (usersQuery.data) {
      const userList = usersQuery.data.content || usersQuery.data.users || [];
      store.updateState({
        users: userList,
        pagination: {
          ...store.pagination,
          total: usersQuery.data.totalElements || 0,
        },
      });
    }
  }, [usersQuery.data]);

  const metadataQuery = useQuery({
    queryKey: ["user-metadata"],
    queryFn: async () => {
      const [resRoles, resStats] = await Promise.all([
        handleGetAllRoles(),
        handleGetUserStatistics(),
      ]);

      const roles = resRoles?.data?.content || [];
      const stats = resStats?.data || null;

      store.updateState({
        roles: { data: { content: roles } },
        statistics: stats,
      });
      return { roles, stats };
    },
    staleTime: 1000 * 60 * 5,
  });

  // --- 2. Mutations ---
  const lockMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      handleLockUser(id, reason),
    onSuccess: () => {
      toast.success("Đã khóa tài khoản thành công");
      store.updateState({
        lockModal: { open: false, userId: null, reason: "" },
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Khóa tài khoản thất bại"),
  });

  const unlockMutation = useMutation({
    mutationFn: (id: string) => handleUnLockUser(id),
    onSuccess: () => {
      toast.success("Tài khoản đã được mở khóa");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Mở khóa thất bại"),
  });

  const debouncedSearch = useCallback(
    _.debounce((value: string) => {
      store.updateState({
        searchKeyword: value,
        pagination: { ...store.pagination, current: 1 },
      });
    }, 500),
    [],
  );

  const lockUserAction = async () => {
    const { userId, reason } = store.lockModal;
    if (!userId || _.isEmpty(_.trim(reason)))
      return toast.warning("Lý do không được để trống");
    lockMutation.mutate({ id: userId, reason });
  };

  return {
    ...store,
    usersLoading: usersQuery.isLoading,
    isProcessing: lockMutation.isPending || unlockMutation.isPending,
    isRefetching: usersQuery.isRefetching,
    fetchUsers: usersQuery.refetch,
    fetchMetadata: metadataQuery.refetch,
    lockUserAction,
    unlockUserAction: (id: string) => unlockMutation.mutate(id),
    debouncedSearch,
  };
};
