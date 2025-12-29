"use client";

import React, { useEffect } from "react";
import {
  Edit3,
  Unlock,
  Eye,
  Lock,
  RotateCw,
  XCircle,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useUserTableLogic } from "../../_hooks/useUserTableLogic";
import { statusLabelMap } from "@/types/user/user.type";
import dayjs from "dayjs";
import { cn } from "@/utils/cn";
import UserDetailModal from "../UserDetailModal";
import UserUpdateForm from "../UserUpdateForm";
import { PortalModal } from "@/features/PortalModal";
import _ from "lodash";
import { UserTableFilter } from "../UserTableFilter";
import { UserLockModal } from "../UserLockModal";

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

  return (
    <div className="p-8 animate-in fade-in duration-500 font-sans">
      <UserTableFilter logic={logic} />
      {/* 2. Table Section */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 overflow-hidden relative">
        {logic.usersLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-16 text-center">STT</th>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logic.users.map((user, idx) => (
                <tr
                  key={user.userId}
                  className="hover:bg-orange-50/20 transition-colors group"
                >
                  <td className="px-6 py-5 text-xs font-bold text-slate-300 text-center">
                    {(logic.pagination.current - 1) *
                      logic.pagination.pageSize +
                      idx +
                      1}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm">
                        {user.username}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {(user.roles?.length
                        ? user.roles
                        : user.roleName
                        ? [user.roleName]
                        : ["Member"]
                      ).map((r, i) => (
                        <span
                          key={i}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase",
                            getRoleColorClass(r)
                          )}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black border uppercase",
                        user.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      )}
                    >
                      {statusLabelMap[user.status]}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[11px] font-black text-slate-400 text-center uppercase tracking-tighter">
                    {dayjs(user.createdDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          logic.updateState({
                            updateModal: { open: true, user },
                          })
                        }
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() =>
                          user.status === "LOCKED"
                            ? logic.unlockUserAction(user.userId)
                            : logic.updateState({
                                lockModal: {
                                  open: true,
                                  userId: user.userId,
                                  reason: "",
                                },
                              })
                        }
                        className={cn(
                          "p-2 rounded-xl transition-all shadow-sm border border-transparent",
                          user.status === "LOCKED"
                            ? "text-emerald-500 hover:bg-emerald-50"
                            : "text-rose-500 hover:bg-rose-50"
                        )}
                      >
                        <Lock size={16} />
                      </button>
                      <button
                        onClick={() =>
                          logic.updateState({
                            detailModal: { open: true, userId: user.userId },
                          })
                        }
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {logic.pagination.total} Accounts
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Limit
              </span>
              <select
                value={logic.pagination.pageSize}
                onChange={(e) =>
                  logic.updateState({
                    pagination: {
                      ...logic.pagination,
                      pageSize: Number(e.target.value),
                      current: 1,
                    },
                  })
                }
                className="text-xs font-black text-slate-800 outline-none border-none bg-transparent"
              >
                {[10, 20, 30, 50].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-1">
              <button
                disabled={logic.pagination.current === 1}
                onClick={() =>
                  logic.updateState({
                    pagination: {
                      ...logic.pagination,
                      current: logic.pagination.current - 1,
                    },
                  })
                }
                className="p-2 text-slate-400 hover:text-orange-500 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center px-4 font-black text-xs text-orange-500 bg-orange-50 rounded-lg">
                {logic.pagination.current}
              </div>
              <button
                disabled={
                  logic.pagination.current * logic.pagination.pageSize >=
                  logic.pagination.total
                }
                onClick={() =>
                  logic.updateState({
                    pagination: {
                      ...logic.pagination,
                      current: logic.pagination.current + 1,
                    },
                  })
                }
                className="p-2 text-slate-400 hover:text-orange-500 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

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
