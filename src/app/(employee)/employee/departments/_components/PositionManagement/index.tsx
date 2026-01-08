/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Briefcase, Info, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import _ from "lodash";

import {
  useAddPositionToDepartment,
  useRemovePositionFromDepartment,
} from "../../_hooks/useDepartment";
import { Position } from "../../_types/department.type";
import { useGetPositionStatistics } from "../../_hooks/usePosition";
import { cn } from "@/utils/cn";
import {
  DataTable,
  ActionBtn,
  InputField,
  SectionHeader,
  ButtonField,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/button/button";

interface PositionManagementProps {
  departmentId: string;
  positions: Position[];
  onUpdated: () => void;
}

export default function PositionManagement({
  departmentId,
  positions,
  onUpdated,
}: PositionManagementProps) {
  const { success, error: toastError } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { handleAddPositionToDepartment, loading: addLoading } =
    useAddPositionToDepartment();
  const { handleRemovePositionFromDepartment } =
    useRemovePositionFromDepartment();
  const { handleGetPositionStatistics } = useGetPositionStatistics();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [employeeCountMap, setEmployeeCountMap] = useState<
    Record<string, number>
  >({});
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoadingStats(true);
      try {
        const res = await handleGetPositionStatistics();
        if (res?.data) {
          setEmployeeCountMap(res.data.byEmployee);
        }
      } catch (err: any) {
        toastError("Không thể tải thống kê chức vụ!");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStatistics();
  }, [positions]);

  const onSubmit = async (data: any) => {
    const res = await handleAddPositionToDepartment(departmentId, data);
    if (res) {
      success("Thêm chức vụ thành công!");
      reset();
      setAddModalOpen(false);
      onUpdated();
    } else {
      toastError("Thêm chức vụ thất bại!");
    }
  };

  const handleRemovePosition = async (position: Position) => {
    if (
      confirm(`Bạn có chắc chắn muốn xóa chức vụ ${position.positionName}?`)
    ) {
      const res = await handleRemovePositionFromDepartment(
        departmentId,
        position.positionId
      );
      if (res) {
        success("Xóa chức vụ thành công!");
        onUpdated();
      } else {
        toastError("Xóa chức vụ thất bại!");
      }
    }
  };

  const columns = [
    {
      header: "Tên chức vụ",
      render: (record: Position) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
            <Briefcase size={16} />
          </div>
          <span className="font-semibold text-gray-800 tracking-tight">
            {record.positionName}
          </span>
        </div>
      ),
    },
    {
      header: "Mô tả",
      render: (record: Position) => (
        <span className="text-gray-500 text-xs italic">
          {record.description || "Không có mô tả"}
        </span>
      ),
    },
    {
      header: "Nhân sự",
      align: "center" as const,
      render: (record: Position) => {
        const count =
          employeeCountMap[record.positionName] ?? record.totalEmployees ?? 0;
        return (
          <div className="px-3 py-1 bg-gray-100 rounded-full inline-block">
            <span className="font-semibold text-blue-600 text-[10px] uppercase">
              {count} Thành viên
            </span>
          </div>
        );
      },
    },
    {
      header: "Ngày tạo",
      align: "center" as const,
      render: (record: Position) => (
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
          {record.createdDate
            ? dayjs(record.createdDate).format("DD/MM/YYYY")
            : "-"}
        </span>
      ),
    },
    {
      header: "Thao tác",
      align: "right" as const,
      render: (record: Position) => (
        <ActionBtn
          onClick={() => handleRemovePosition(record)}
          icon={<Trash2 size={14} />}
          color="hover:text-red-500 hover:bg-red-50"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/50">
        <SectionHeader icon={<Briefcase />} title="Danh sách chức vụ" />
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-orange-500 text-white rounded-2xl font-semibold uppercase text-[10px] tracking-widest transition-all duration-300 shadow-lg shadow-gray-200 active:scale-95"
        >
          <Plus size={14} strokeWidth={3} /> Thêm chức vụ
        </button>
      </div>

      <DataTable
        data={positions}
        rowKey="positionId"
        columns={columns}
        loading={loadingStats}
        page={0}
        size={positions.length || 10}
        totalElements={positions.length}
        onPageChange={() => {}}
        emptyMessage="Phòng ban này chưa được gán chức vụ nào."
      />

      <PortalModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          reset();
        }}
        title="Khởi tạo chức vụ mới"
        width="max-w-lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3 items-start">
            <Info className="text-orange-500 shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-orange-700 font-medium leading-relaxed">
              Chức vụ sẽ được thêm trực tiếp vào hệ thống quản lý của phòng ban
              hiện tại. Vui lòng kiểm tra kỹ tên chức vụ trước khi tạo.
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              label="Tên chức vụ"
              placeholder="Ví dụ: Senior Developer, Quản lý kho..."
              {...register("positionName", {
                required: "Tên chức vụ là bắt buộc",
              })}
              errorMessage={errors.positionName?.message as string}
            />

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase text-gray-600 ml-1 tracking-widest">
                Mô tả chức vụ
              </label>
              <textarea
                className={cn(
                  "w-full p-4 rounded-2xl border bg-white outline-none transition-all text-sm font-medium min-h-25",
                  "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5"
                )}
                placeholder="Mô tả quyền hạn và trách nhiệm..."
                {...register("description")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="edit" onClick={() => setAddModalOpen(false)}>
              Hủy bỏ
            </Button>
            <ButtonField
              form="address-form"
              htmlType="submit"
              type="login"
              disabled={addLoading}
              className="flex w-40 items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
            >
              <span className="flex items-center gap-2">
                {addLoading && <Loader2 size={14} className="animate-spin" />}
                Xác nhận thêm
              </span>
            </ButtonField>
          </div>
        </form>
      </PortalModal>
    </div>
  );
}
