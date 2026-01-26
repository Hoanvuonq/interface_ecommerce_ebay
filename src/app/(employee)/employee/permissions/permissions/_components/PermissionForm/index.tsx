"use client";

import { ButtonField, FormInput, SectionHeader } from "@/components";
import { Button } from "@/components/button/button";
import { useToast } from "@/hooks/useToast";
import {
  CheckCircle2,
  Info,
  KeyRound,
  Loader2,
  ShieldPlus,
  Settings2,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreatePermission,
  useUpdatePermission,
} from "../../../_hooks/useRBAC";
import type {
  CreatePermissionRequest,
  Permission,
  UpdatePermissionRequest,
} from "../../../_types/dto/rbac.dto";
import { PortalModal } from "@/features/PortalModal";

interface PermissionFormProps {
  isOpen: boolean;
  permission?: Permission | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PermissionForm = ({
  isOpen,
  permission,
  onSuccess,
  onCancel,
}: PermissionFormProps) => {
  const { success: toastSuccess, error: toastError } = useToast();
  const { handleCreatePermission, loading: createLoading } =
    useCreatePermission();
  const { handleUpdatePermission, loading: updateLoading } =
    useUpdatePermission();

  const loading = createLoading || updateLoading;
  const isEditMode = !!(permission && permission.permissionId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePermissionRequest | UpdatePermissionRequest>({
    defaultValues: {
      permissionName: "",
      description: "",
    },
  });

  // Reset dữ liệu mỗi khi permission thay đổi hoặc mở modal
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        reset({
          permissionName: permission?.permissionName,
          description: permission?.description,
        });
      } else {
        reset({ permissionName: "", description: "" });
      }
    }
  }, [permission, reset, isEditMode, isOpen]);

  const onSubmit = async (
    values: CreatePermissionRequest | UpdatePermissionRequest,
  ) => {
    try {
      let res;
      if (isEditMode && permission?.permissionId) {
        res = await handleUpdatePermission(
          permission.permissionId,
          values as UpdatePermissionRequest,
        );
      } else {
        res = await handleCreatePermission(values as CreatePermissionRequest);
      }

      if (res?.success) {
        toastSuccess(
          isEditMode
            ? "Cập nhật định danh quyền hạn thành công!"
            : "Khởi tạo quyền hạn mới thành công!",
        );
        onSuccess();
      } else {
        toastError(res?.message || "Thao tác thực thi thất bại!");
      }
    } catch (error) {
      toastError("Lỗi kết nối hệ thống!");
    }
  };

  const renderHeader = (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
        {isEditMode ? (
          <Settings2 size={20} strokeWidth={2.5} />
        ) : (
          <ShieldPlus size={20} strokeWidth={2.5} />
        )}
      </div>
      <span className="font-bold tracking-tight text-lg text-gray-800 uppercase italic">
        {isEditMode ? "Cấu hình" : "Khởi tạo"}
        <span className="text-orange-500">quyền hạn</span>
      </span>
    </div>
  );

  const renderFooter = (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button
        variant="edit"
        type="button"
        onClick={onCancel}
        className="px-8 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest text-gray-500 hover:bg-gray-100 transition-all border-gray-200"
      >
        Hủy bỏ
      </Button>
      <ButtonField
        htmlType="submit"
        type="login"
        form="permission-form-internal" // Link tới id của form
        disabled={loading}
        className="w-44! flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            {isEditMode ? "LƯU THAY ĐỔI" : "TẠO MỚI"}
          </span>
        )}
      </ButtonField>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onCancel}
      title={renderHeader}
      footer={renderFooter}
      width="max-w-2xl"
    >
      <form
        id="permission-form-internal"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 py-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <div className="p-4 bg-linear-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl flex gap-3 items-start">
          <Info className="text-orange-500 shrink-0 mt-0.5" size={16} />
          <p className="text-[11px] text-orange-800 font-bold leading-relaxed uppercase tracking-tight">
            Gợi ý: Định dạng{" "}
            <span className="underline italic">MODULE_ACTION</span> (Ví dụ:
            USER_CREATE) giúp hệ thống quản lý tập trung và an toàn hơn.
          </p>
        </div>

        <div className="space-y-6">
          <SectionHeader icon={KeyRound} title="Định cấu hình chi tiết" />

          <div className="p-6 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 space-y-6 shadow-inner">
            <FormInput
              label="Mã định danh (Key)"
              placeholder="VD: PRODUCT_EXPORT, ORDER_CANCEL..."
              required
              {...register("permissionName", {
                required: "Vui lòng nhập mã định danh quyền!",
                pattern: {
                  value: /^[A-Z_]+$/,
                  message: "Chỉ được chứa chữ HOA và dấu gạch dưới (_)",
                },
                maxLength: { value: 100, message: "Tối đa 100 ký tự" },
              })}
              error={errors.permissionName?.message as string}
            />

            <FormInput
              isTextArea
              label="Mô tả phạm vi"
              placeholder="Mô tả quyền hạn này cho phép làm gì..."
              required
              {...register("description", {
                required: "Vui lòng nhập mô tả chức năng!",
                maxLength: { value: 255, message: "Tối đa 255 ký tự" },
              })}
              error={errors.description?.message as string}
              className="min-h-32"
            />
          </div>
        </div>

        {/* Trạng thái hệ thống mờ */}
        <div className="flex items-center gap-2 px-2 text-gray-400">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
            RBAC Synchronized
          </span>
        </div>
      </form>
    </PortalModal>
  );
};
