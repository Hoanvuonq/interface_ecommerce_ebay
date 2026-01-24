"use client";

import React, { useEffect, useMemo } from "react";
import { Edit3, Eye, Lock, Unlock } from "lucide-react";
import dayjs from "dayjs";
import { useUserTableLogic } from "../../_hooks/useUserTableLogic";
import { statusLabelMap, User } from "@/types/user/user.type"; 
import { cn } from "@/utils/cn";
import UserDetailModal from "../UserDetailModal";
import UserUpdateForm from "../UserUpdateForm";
import { UserTableFilter } from "../UserTableFilter";
import { UserLockModal } from "../UserLockModal";
import { ActionBtn, DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
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

  const getRoleColorClass = (role: string) => {
    const r = role?.toUpperCase();
    if (r === "ADMIN") return "bg-rose-100 text-rose-600 border-rose-200";
    if (r === "SHOP") return "bg-blue-100 text-blue-600 border-blue-200";
    return "bg-purple-100 text-purple-600 border-purple-200";
  };

  const columns = useMemo(() => getUserColumns(logic), [logic]);

  return (
    <div className="p-8 animate-in fade-in duration-500 font-sans space-y-6">
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
            pagination: { ...logic.pagination, current: newPage + 1 } 
          })
        }
      />

      <UserDetailModal
        open={logic.detailModal.open}
        userId={logic.detailModal.userId}
        onClose={() => logic.updateState({ detailModal: { open: false, userId: null } })}
      />
      <UserUpdateForm
        open={logic.updateModal.open}
        user={logic.updateModal.user}
        onClose={() => logic.updateState({ updateModal: { open: false, user: null } })}
        onUpdated={logic.fetchUsers}
      />
      <UserLockModal logic={logic} />
    </div>
  );
}