"use client";

import { ButtonField, FormInput, SectionHeader } from "@/components";
import { Button } from "@/components/button";
import { PortalModal } from "@/features/PortalModal";
import _ from "lodash";
import { Building2Icon, Info, Loader2, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDepartmentFormLogic } from "../../_hooks/useDepartmentFormLogic";
import { Department } from "../../_types/department.type";

interface DepartmentFormProps {
  open: boolean;
  department: Department | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DepartmentForm({
  open,
  department,
  onClose,
  onSuccess,
}: DepartmentFormProps) {
  const { isSubmitting, onSubmit, isEdit } = useDepartmentFormLogic(
    onClose,
    onSuccess,
    department,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departmentName: "",
      description: "",
    },
  });
  const handleManualSubmit = () => {
    handleSubmit((data) => onSubmit(data))();
  };

  useEffect(() => {
    if (open) {
      const initialValues =
        isEdit && department
          ? {
              departmentName: department.departmentName || "",
              description: department.description || "",
            }
          : { departmentName: "", description: "" };

      reset(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, reset]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl shadow-sm shadow-orange-100">
            <Building2Icon size={22} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-800 uppercase text-lg flex gap-1 items-center tracking-tight italic">
            {isEdit ? "Cập nhật" : "Khởi tạo"}
            <span className="text-orange-500">phòng ban</span>
          </span>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full border-t border-gray-100 pt-5 mt-2">
          <Button
            variant="edit"
            onClick={onClose}
            className="px-8 py-2.5 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-gray-500 hover:bg-gray-100 transition-all active:scale-95 border-gray-200"
          >
            Hủy bỏ
          </Button>
          <ButtonField
            htmlType="submit"
            type="login"
            disabled={isSubmitting}
            onClick={handleManualSubmit}
            form="department-form"
            className="w-48! flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={16} />
                {isEdit ? "LƯU THAY ĐỔI" : "KHỞI TẠO NGAY"}
              </span>
            )}
          </ButtonField>
        </div>
      }
    >
      <form
        id="department-form"
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="space-y-8 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl flex gap-4 items-center">
          <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500">
            <Info size={18} strokeWidth={2.5} />
          </div>
          <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase tracking-wider">
            Dữ liệu nhân sự và chức vụ liên quan sẽ được hệ thống tự động cập
            nhật đồng bộ sau khi xác nhận lưu thông tin.
          </p>
        </div>

        <div className="space-y-8">
          <SectionHeader icon={Building2Icon} title="Thông tin định danh" />

          <div className="p-6 rounded-4xl bg-orange-50/40 border border-orange-100/50 space-y-6">
            <FormInput
              label="Tên phòng ban"
              placeholder="Ví dụ: Phòng Kỹ Thuật, Ban Điều Hành..."
              {...register("departmentName", {
                required: "Tên phòng ban là bắt buộc",
                maxLength: { value: 200, message: "Tối đa 200 ký tự" },
              })}
              error={errors.departmentName?.message as string}
              required
            />

            <FormInput
              isTextArea
              label="Mô tả chức năng & Nhiệm vụ"
              placeholder="Ghi chú chi tiết về vai trò của phòng ban trong hệ thống..."
              {...register("description", {
                maxLength: { value: 500, message: "Tối đa 500 ký tự" },
              })}
              error={errors.description?.message as string}
              className="min-h-32"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl border border-gray-100">
          <div className="mt-1">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
          </div>
          <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-wide">
            Đảm bảo tên phòng ban không trùng lặp để tối ưu hóa việc truy vấn và
            báo cáo dữ liệu nhân sự.
          </p>
        </div>
      </form>
    </PortalModal>
  );
}
