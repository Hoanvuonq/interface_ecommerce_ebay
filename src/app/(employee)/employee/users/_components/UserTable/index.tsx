"use client";

import React, { useEffect, useMemo } from "react";
import { Edit3, Eye, Lock, Unlock } from "lucide-react";
import dayjs from "dayjs";
import { useUserTableLogic } from "../../_hooks/useUserTableLogic";
import { statusLabelMap, User } from "@/types/user/user.type"; // Import đúng type User
import { cn } from "@/utils/cn";
import UserDetailModal from "../UserDetailModal";
import UserUpdateForm from "../UserUpdateForm";
import { UserTableFilter } from "../UserTableFilter";
import { UserLockModal } from "../UserLockModal";
import { ActionBtn, DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";

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

  const columns: Column<User>[] = useMemo(() => [
    {
      header: "Người dùng",
      render: (user) => (
        <div className="flex flex-col">
          <span className="font-medium text-black/80 text-md! tracking-wider coiny-regular">
            {user.username}
          </span>
          <span className="text-[11px] text-slate-400 font-bold tracking-wider">
            {user.email}
          </span>
        </div>
      ),
    },
    {
      header: "Vai trò",
      render: (user) => (
        <div className="flex flex-wrap gap-1.5">
          {(user.roles?.length ? user.roles : [user.roleName || "Member"]).map((r, i) => (
            <span
              key={i}
              className={cn(
                "px-2.5 py-0.5 rounded-lg text-[9px] font-black border uppercase tracking-wider",
                getRoleColorClass(r)
              )}
            >
              {r}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      align: "center",
      render: (user) => (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter",
            user.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-rose-50 text-rose-600 border-rose-100"
          )}
        >
          {statusLabelMap[user.status]}
        </span>
      ),
    },
    {
      header: "Ngày tạo",
      align: "center",
      render: (user) => (
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
          {dayjs(user.createdDate).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      header: "Thao tác",
      align: "right",
      render: (user) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <ActionBtn
            onClick={() => logic.updateState({ updateModal: { open: true, user } })}
            icon={<Edit3 size={14} />}
            color="hover:text-blue-500"
          />
          <ActionBtn
            onClick={() => 
              user.status === "LOCKED"
                ? logic.unlockUserAction(user.userId)
                : logic.updateState({ lockModal: { open: true, userId: user.userId, reason: "" } })
            }
            icon={user.status === "LOCKED" ? <Unlock size={14} /> : <Lock size={14} />}
            color={user.status === "LOCKED" ? "hover:text-emerald-500" : "hover:text-rose-500"}
          />
          <ActionBtn
            onClick={() => logic.updateState({ detailModal: { open: true, userId: user.userId } })}
            icon={<Eye size={14} />}
            color="hover:text-orange-500"
          />
        </div>
      ),
    },
  ], [logic]);

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

      {/* 3. Modals quản lý trạng thái */}
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