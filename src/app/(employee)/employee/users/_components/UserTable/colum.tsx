"use client";

import React from "react";
import { Edit3, Eye, Lock, Unlock } from "lucide-react";
import dayjs from "dayjs";
import { statusLabelMap, User } from "@/types/user/user.type";
import { cn } from "@/utils/cn";
import { ActionBtn } from "@/components";
import { Column } from "@/components/DataTable/type";

const getRoleColorClass = (role: string) => {
  const r = role?.toUpperCase();
  if (r === "ADMIN") return "bg-rose-100 text-rose-600 border-rose-200";
  if (r === "SHOP") return "bg-blue-100 text-blue-600 border-blue-200";
  return "bg-purple-100 text-purple-600 border-purple-200";
};

export const getUserColumns = (logic: any): Column<User>[] => [
  {
    header: "Người dùng",
    render: (user) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-bold  text-gray-800 text-[14px] tracking-tight ">
          {user.username}
        </span>
        <span className="text-[11px]  text-gray-500 font-medium italic">
          {user.email}
        </span>
      </div>
    ),
  },
  {
    header: "Vai trò",
    render: (user) => (
      <div className="flex flex-wrap gap-1.5">
        {(user.roles?.length ? user.roles : [user.roleName || "Member"]).map(
          (r, i) => (
            <span
              key={i}
              className={cn(
                "px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider shadow-sm",
                getRoleColorClass(r),
              )}
            >
              {r}
            </span>
          ),
        )}
      </div>
    ),
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (user) => (
      <span
        className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tighter",
          user.status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-rose-50 text-rose-600 border-rose-100",
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
      <span className="text-[11px] font-bold  text-gray-500 font-mono">
        {dayjs(user.createdDate).format("DD/MM/YYYY")}
      </span>
    ),
  },
  {
    header: "Thao tác",
    align: "right",
    render: (user) => (
      <div className="flex justify-end gap-2">
        <ActionBtn
          onClick={() =>
            logic.updateState({ updateModal: { open: true, user } })
          }
          icon={<Edit3 size={14} />}
          color="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-100"
          tooltip="Chỉnh sửa"
        />
        <ActionBtn
          onClick={() =>
            user.status === "LOCKED"
              ? logic.unlockUserAction(user.userId)
              : logic.updateState({
                  lockModal: { open: true, userId: user.userId, reason: "" },
                })
          }
          icon={
            user.status === "LOCKED" ? <Unlock size={14} /> : <Lock size={14} />
          }
          color={
            user.status === "LOCKED"
              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-100"
              : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-100"
          }
          tooltip={user.status === "LOCKED" ? "Mở khóa" : "Khóa tài khoản"}
        />
        <ActionBtn
          onClick={() =>
            logic.updateState({
              detailModal: { open: true, userId: user.userId },
            })
          }
          icon={<Eye size={14} />}
          color="bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border-orange-100"
          tooltip="Xem chi tiết"
        />
      </div>
    ),
  },
];
