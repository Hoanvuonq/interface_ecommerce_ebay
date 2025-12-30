"use client";

import { ButtonField, InputField, SectionHeader } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import _ from "lodash";
import { Building2Icon, Info, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDepartmentFormLogic } from "../../_hooks/useDepartmentFormLogic";
import { Department } from "../../_types/department.type";
import { Button } from "@/components/button/button";

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
    department
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

  useEffect(() => {
    if (open) {
      const initialValues = isEdit
        ? _.pick(department, ["departmentName", "description"])
        : { departmentName: "", description: "" };
      reset(initialValues);
    }
  }, [open, department, reset, isEdit]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={isEdit ? "Cập nhật phòng ban" : "Khởi tạo phòng ban mới"}
      width="max-w-xl"
    >
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="space-y-6 pb-4"
      >
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
          <p className="text-[11px] text-blue-700 font-medium leading-relaxed uppercase tracking-tight">
            Hệ thống sẽ tự động đồng bộ hóa chức vụ và nhân sự thuộc phòng ban
            này sau khi dữ liệu được lưu.
          </p>
        </div>

        <div className="space-y-6">
          <SectionHeader
            icon={<Building2Icon size={16} />}
            title="Thông tin cơ bản"
          />

          <InputField
            label="Tên phòng ban"
            placeholder="Ví dụ: Phòng Kỹ Thuật, Ban Điều Hành..."
            {...register("departmentName", {
              required: "Tên phòng ban là bắt buộc",
              maxLength: { value: 200, message: "Tối đa 200 ký tự" },
            })}
            errorMessage={errors.departmentName?.message as string}
            rules={[{ required: true }]}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-black mb-1">
              Mô tả chi tiết
            </label>
            <div className="relative">
              <textarea
                {...register("description", {
                  maxLength: { value: 500, message: "Tối đa 500 ký tự" },
                })}
                rows={4}
                placeholder="Mô tả chức năng, nhiệm vụ của phòng ban..."
                className={cn(
                  "w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200 outline-none min-h-30",
                  "bg-white border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5",
                  errors.description && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600 font-medium italic">
                  {errors.description?.message as string}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
          <Button
            variant="edit"
            onClick={onClose}
            className="px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
          >
            Hủy bỏ
          </Button>
          <ButtonField htmlType="submit" type="login" disabled={isSubmitting}>
            <span className="flex items-center gap-2">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Lưu thay đổi" : "Khởi tạo ngay"}
            </span>
          </ButtonField>
        </div>
      </form>
    </PortalModal>
  );
}
