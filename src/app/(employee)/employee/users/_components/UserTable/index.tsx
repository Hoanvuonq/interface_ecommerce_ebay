"use client";

import { DataTable } from "@/components";
import { useEffect, useMemo } from "react";
import { useUserTableLogic } from "../../_hooks/useUserTableLogic";
import UserDetailModal from "../UserDetailModal";
import { UserLockModal } from "../UserLockModal";
import { UserTableFilter } from "../UserTableFilter";
import UserUpdateForm from "../UserUpdateForm";
import { getUserColumns } from "./colum";

export default function UserTable() {
  const logic = useUserTableLogic();

  useEffect(() => {
    logic.fetchMetadata();
    logic.fetchUsers();
  }, [
    logic.activeTab,
    logic.selectedRoles,
    logic.pagination.current,
    logic.pagination.pageSize,
  ]);

  const columns = useMemo(() => getUserColumns(logic), [logic]);

  return (
    <div className="animate-in fade-in duration-500 font-sans space-y-4">
      <UserTableFilter logic={logic} />
      <DataTable
        data={logic.users as any}
        columns={columns as any}
        loading={logic.usersLoading}
        page={logic.pagination.current - 1}
        size={logic.pagination.pageSize}
        totalElements={logic.pagination.total}
        onPageChange={(newPage) =>
          logic.updateState({
            pagination: { ...logic.pagination, current: newPage + 1 },
          })
        }
      />

      <UserDetailModal
        open={logic.detailModal.open}
        userId={logic.detailModal.userId}
        onClose={() =>
          logic.updateState({ detailModal: { open: false, userId: null } })
        }
      />
      <UserUpdateForm
        open={logic.updateModal.open}
        user={logic.updateModal.user}
        onClose={() =>
          logic.updateState({ updateModal: { open: false, user: null } })
        }
        onUpdated={logic.fetchUsers}
      />
      <UserLockModal logic={logic} />
    </div>
  );
}
