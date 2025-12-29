import _ from "lodash";
import { useUserTableStore } from "../_store/userTableStore";
import { useGetAllUsers, useGetAllRoles, useGetUserStatistics, useLockUser, useUnLockUser } from "./useUser";
import { useToast } from "@/hooks/useToast";

export const useUserTableLogic = () => {
  const store = useUserTableStore();
  const toast = useToast();

  const { handleGetAllUsers, loading: usersLoading } = useGetAllUsers();
  const { handleGetAllRoles } = useGetAllRoles();
  const { handleGetUserStatistics } = useGetUserStatistics();
  const { handleLockUser, loading: lockLoading } = useLockUser();
  const { handleUnLockUser } = useUnLockUser();

  const fetchUsers = async () => {
    // Gộp chung username và email vào keyword, sử dụng lodash pickBy
    const payload = _.pickBy({
      username: store.searchKeyword,
      email: store.searchKeyword,
      statuses: store.activeTab !== "ALL" ? [store.activeTab] : undefined,
      roleNames: store.selectedRoles.length > 0 ? store.selectedRoles : undefined,
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
  };

  const fetchMetadata = async () => {
    try {
      const [resRoles, resStats] = await Promise.all([
        handleGetAllRoles(),
        handleGetUserStatistics()
      ]);
      store.updateState({
        roles: resRoles?.data?.roles || [],
        statistics: resStats?.data || null
      });
    } catch (err) {
      toast.error("Không thể tải dữ liệu thống kê");
    }
  };

  const lockUserAction = async () => {
    const { userId, reason } = store.lockModal;
    if (!userId || !_.trim(reason)) return toast.warning("Vui lòng nhập lý do");
    
    if (await handleLockUser(userId, reason)) {
      toast.success("Đã khóa tài khoản");
      store.updateState({ lockModal: { open: false, userId: null, reason: "" } });
      fetchUsers();
    }
  };

  const unlockUserAction = async (id: string) => {
    if (await handleUnLockUser(id)) {
      toast.success("Đã mở khóa");
      fetchUsers();
    }
  };

  return { ...store, usersLoading, lockLoading, fetchUsers, fetchMetadata, lockUserAction, unlockUserAction };
};