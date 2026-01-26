"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetUserPermissionDetail } from "../../../_hooks/useRBAC";
import type {
  Permission,
  UserPermissionDetailResponse,
} from "../../../_types/dto/rbac.dto";
import dayjs from "dayjs";
import {
  DataTable,
  SelectComponent,
  FormInput,
  StatCardComponents,
} from "@/components";
import { StatusTabs } from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { Button } from "@/components/button/button";
import {
  ArrowLeft,
  RotateCw,
  ShieldCheck,
  User as UserIcon,
  Key,
  Mail,
  Activity,
  Fingerprint,
  ShieldAlert,
  Search,
} from "lucide-react";
import { getUserPermissionDetailColumns } from "./colum";
import { cn } from "@/utils/cn";

export const UserPermissionsDetailScreen = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  const { handleGetUserPermissionDetail, loading, error } =
    useGetUserPermissionDetail();

  const [userDetail, setUserDetail] =
    useState<UserPermissionDetailResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"role" | "user">("role");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<string>("permissionName,asc");

  useEffect(() => {
    if (userId) {
      handleGetUserPermissionDetail(userId).then((res) => {
        if (res?.success && res.data) setUserDetail(res.data);
      });
    }
  }, [userId]);

  const handleRefresh = () => {
    if (userId) {
      handleGetUserPermissionDetail(userId).then((res) => {
        if (res?.success && res.data) setUserDetail(res.data);
      });
    }
  };

  const currentPermissions = useMemo(() => {
    if (!userDetail) return [];
    return activeTab === "role"
      ? userDetail.rolePermissions
      : userDetail.userPermissions;
  }, [userDetail, activeTab]);

  const filteredPermissions = useMemo(() => {
    return currentPermissions.filter(
      (p) =>
        p.permissionName.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [currentPermissions, searchText]);

  const sortedPermissions = useMemo(() => {
    const data = [...filteredPermissions];
    return data.sort((a, b) => {
      if (sort === "permissionName,asc")
        return a.permissionName.localeCompare(b.permissionName);
      if (sort === "permissionName,desc")
        return b.permissionName.localeCompare(a.permissionName);
      if (sort === "createdDate,desc")
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      if (sort === "createdDate,asc")
        return (
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        );
      return 0;
    });
  }, [filteredPermissions, sort]);

  const paginatedPermissions = useMemo(() => {
    return sortedPermissions.slice(page * size, (page + 1) * size);
  }, [sortedPermissions, page, size]);

  const columns = useMemo(
    () => getUserPermissionDetailColumns(page, size, activeTab),
    [page, size, activeTab],
  );

  if (!userDetail && !loading)
    return (
      <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">
        {error || "User data not found"}
      </div>
    );

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="edit"
            onClick={() => router.push("/employee/permissions/users")}
            className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:text-orange-500"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl shadow-sm">
              <Fingerprint size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 uppercase text-xs tracking-[0.2em] leading-none">
                Permission Context
              </h3>
              <p className="text-sm font-bold text-orange-600 mt-1 italic uppercase tracking-tight">
                {userDetail?.username}
              </p>
            </div>
          </div>
        </div>

        <StatusTabs
          tabs={[
            {
              key: "role",
              label: `Từ vai trò (${userDetail?.rolePermissions.length})`,
              icon: Key,
            },
            {
              key: "user",
              label: `Quyền riêng (${userDetail?.userPermissions.length})`,
              icon: UserIcon,
            },
          ]}
          current={activeTab}
          onChange={(key) => {
            setActiveTab(key as any);
            setPage(0);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
            size={18}
          />
          <FormInput
            placeholder="Tìm kiếm mã quyền hạn hoặc mô tả..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
            className="pl-12 h-12 bg-gray-50/80 rounded-2xl border-transparent focus:bg-white transition-all shadow-sm font-bold"
          />
        </div>
        <div className="md:col-span-5 flex gap-2">
          <SelectComponent
            options={[10, 20, 50].map((v) => ({
              label: `Hiện ${v} dòng`,
              value: String(v),
            }))}
            value={String(size)}
            onChange={(v) => {
              setSize(Number(v));
              setPage(0);
            }}
            className="flex-1 rounded-2xl h-12 shadow-sm"
          />
          <SelectComponent
            options={[
              { label: "Tên A-Z", value: "permissionName,asc" },
              { label: "Tên Z-A", value: "permissionName,desc" },
              { label: "Mới nhất", value: "createdDate,desc" },
            ]}
            value={sort}
            onChange={setSort}
            className="flex-1 rounded-2xl h-12 shadow-sm"
          />
          <button
            onClick={handleRefresh}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90"
          >
            <RotateCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700 p-2">
      <div className="relative p-6 rounded-[2.5rem] bg-linear-to-br from-gray-900 via-gray-800 to-orange-950 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-4xl bg-orange-500/20 border-4 border-white/10 flex items-center justify-center text-orange-500 shadow-2xl">
            <UserIcon size={40} strokeWidth={1.5} />
          </div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[9px] font-bold uppercase tracking-widest">
                {userDetail?.roleName}
              </span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                  userDetail?.status === "ACTIVE"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white",
                )}
              >
                {userDetail?.status}
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic leading-none">
              {userDetail?.username}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-orange-500" />{" "}
                {userDetail?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-orange-500" /> Created{" "}
                {dayjs(userDetail?.createdDate).format("DD MMM, YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Quyền từ vai trò"
          value={userDetail?.rolePermissions.length || 0}
          icon={<Key />}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Quyền hạn riêng"
          value={userDetail?.userPermissions.length || 0}
          icon={<UserIcon />}
          color="text-emerald-500"
        />
        <StatCardComponents
          label="Tổng năng lực"
          value={
            (userDetail?.rolePermissions.length || 0) +
            (userDetail?.userPermissions.length || 0)
          }
          icon={<Activity />}
          color="text-orange-600"
        />
      </div>

      <div className="bg-white rounded-4xl p-4 border border-gray-100 shadow-custom overflow-hidden">
        <DataTable
          data={paginatedPermissions}
          columns={columns}
          loading={loading}
          rowKey="permissionId"
          page={page}
          size={size}
          totalElements={filteredPermissions.length}
          onPageChange={setPage}
          headerContent={tableHeader}
        />
      </div>
    </div>
  );
};
