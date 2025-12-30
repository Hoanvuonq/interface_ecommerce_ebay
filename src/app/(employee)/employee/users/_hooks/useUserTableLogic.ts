"use client";

import _ from "lodash";
import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserTableStore } from "../_store/userTableStore";
import { 
  useGetAllUsers, 
  useGetAllRoles, 
  useGetUserStatistics, 
  useLockUser, 
  useUnLockUser 
} from "./useUser";
import { useToast } from "@/hooks/useToast";

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
    queryKey: ["users", store.searchKeyword, store.activeTab, store.selectedRoles, store.pagination.current, store.pagination.pageSize],
    queryFn: async () => {
      const payload = _.pickBy({
        username: store.searchKeyword,
        email: store.searchKeyword,
        statuses: store.activeTab !== "ALL" ? [store.activeTab] : undefined,
        roleNames: !_.isEmpty(store.selectedRoles) ? store.selectedRoles : undefined,
        page: store.pagination.current - 1,
        size: store.pagination.pageSize,
        sort: "asc",
      }, (val) => !_.isNil(val) && val !== "");

      const res = await handleGetAllUsers(payload as any);
      if (res?.data) {
        store.updateState({
          users: res.data.users,
          pagination: { ...store.pagination, total: res.data.totalElements || 0 }
        });
      }
      return res?.data;
    },
    placeholderData: (prev) => prev, 
  });

  // Lấy Metadata (Roles & Stats)
  const metadataQuery = useQuery({
    queryKey: ["user-metadata"],
    queryFn: async () => {
      const [resRoles, resStats] = await Promise.all([
        handleGetAllRoles(),
        handleGetUserStatistics()
      ]);
      const roles = resRoles?.data?.roles || [];
      const stats = resStats?.data || null;
      
      store.updateState({ roles, statistics: stats });
      return { roles, stats };
    },
    staleTime: 1000 * 60 * 5, // Cache dữ liệu thống kê 5 phút
  });

  // --- 2. Mutations (Thao tác dữ liệu) ---

  const lockMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => handleLockUser(id, reason),
    onSuccess: () => {
      toast.success("Đã khóa tài khoản thành công");
      store.updateState({ lockModal: { open: false, userId: null, reason: "" } });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-metadata"] });
    },
    onError: () => toast.error("Khóa tài khoản thất bại")
  });

  const unlockMutation = useMutation({
    mutationFn: (id: string) => handleUnLockUser(id),
    onSuccess: () => {
      toast.success("Tài khoản đã được mở khóa");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-metadata"] });
    },
    onError: () => toast.error("Mở khóa thất bại")
  });

  // --- 3. Handlers (Logic cho UI) ---

  const debouncedSearch = useCallback(
    _.debounce((value: string) => {
      store.updateState({ searchKeyword: value, pagination: { ...store.pagination, current: 1 } });
    }, 500),
    []
  );

  const lockUserAction = async () => {
    const { userId, reason } = store.lockModal;
    if (!userId || _.isEmpty(_.trim(reason))) return toast.warning("Vui lòng nhập lý do khóa");
    lockMutation.mutate({ id: userId, reason });
  };

  const unlockUserAction = (id: string) => unlockMutation.mutate(id);

  // --- 4. Trả về cho Component ---

  return {
    ...store,
    // Status
    usersLoading: usersQuery.isLoading,
    isProcessing: lockMutation.isPending || unlockMutation.isPending,
    isRefetching: usersQuery.isRefetching,
    
    // Actions
    fetchUsers: usersQuery.refetch,
    fetchMetadata: metadataQuery.refetch,
    lockUserAction,
    unlockUserAction,
    debouncedSearch
  };
};