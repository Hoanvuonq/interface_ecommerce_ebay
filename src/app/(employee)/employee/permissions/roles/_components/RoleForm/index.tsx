"use client";

import { ButtonField, FormInput, SectionHeader } from "@/components";
import { Button } from "@/components/button";
import { PortalModal } from "@/features/PortalModal";
import { useToast } from "@/hooks/useToast";
import { Info, Loader2, Save, ShieldCheck, UserCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRBAC } from "../../../_hooks/useRBAC";
import type {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
} from "../../../_types/dto/rbac.dto";

interface RoleFormProps {
  isOpen: boolean;
  role?: Role | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RoleForm = ({
  isOpen,
  role,
  onSuccess,
  onCancel,
}: RoleFormProps) => {
  const { loading, createRole, updateRole } = useRBAC();
  const { success: toastSuccess } = useToast();

  const isEditMode = !!(role && role.roleId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleRequest | UpdateRoleRequest>({
    defaultValues: {
      roleName: "",
      description: "",
    },
  });

  // Đồng bộ dữ liệu khi mở modal hoặc thay đổi role
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        reset({
          roleName: role?.roleName,
          description: role?.description,
        });
      } else {
        reset({ roleName: "", description: "" });
      }
    }
  }, [role, reset, isOpen, isEditMode]);

  const onProcessSubmit = async (
    values: CreateRoleRequest | UpdateRoleRequest,
  ) => {
    try {
      let success = false;

      if (isEditMode && role?.roleId) {
        success = await updateRole(role.roleId, values as UpdateRoleRequest);
      } else {
        success = await createRole(values as CreateRoleRequest);
      }

      if (success) {
        toastSuccess(
          isEditMode
            ? "Cập nhật vai trò hệ thống thành công!"
            : "Khởi tạo vai trò mới thành công!",
        );
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting role form:", error);
    }
  };

  const renderHeader = (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
        <UserCircle2 size={20} strokeWidth={2.5} />
      </div>
      <span className="font-bold tracking-tight text-lg text-gray-800 uppercase italic">
        {isEditMode ? "Cập nhật" : "Khởi tạo"}{" "}
        <span className="text-orange-500">vai trò</span>
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
        form="role-form-internal" // Link tới ID của thẻ form
        disabled={loading}
        className="w-44! flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            <Save size={16} />
            {isEditMode ? "LƯU THAY ĐỔI" : "XÁC NHẬN TẠO"}
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
        id="role-form-internal"
        onSubmit={handleSubmit(onProcessSubmit)}
        className="space-y-6 py-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        {/* Banner hướng dẫn */}
        <div className="p-4 bg-linear-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl flex gap-3 items-start">
          <Info className="text-orange-500 shrink-0 mt-0.5" size={16} />
          <p className="text-[11px] text-orange-800 font-bold leading-relaxed uppercase tracking-tight">
            Vai trò (Role) giúp nhóm các quyền hạn lại với nhau để cấp phát cho
            người dùng một cách có hệ thống và an toàn.
          </p>
        </div>

        <div className="space-y-6">
          <SectionHeader icon={ShieldCheck} title="Thông tin vai trò" />

          <div className="p-6 rounded-4xl bg-gray-50/50 border border-gray-100 space-y-6 shadow-inner">
            <FormInput
              label="Tên vai trò hệ thống"
              placeholder="VD: ADMIN, MANAGER, EDITOR..."
              required
              {...register("roleName", {
                required: "Vui lòng nhập tên vai trò!",
                pattern: {
                  value: /^[A-Z_]+$/,
                  message: "Chỉ được chứa chữ HOA và dấu gạch dưới (_)",
                },
                maxLength: {
                  value: 50,
                  message: "Tên vai trò tối đa 50 ký tự",
                },
              })}
              error={errors.roleName?.message as string}
            />

            <FormInput
              isTextArea
              label="Mô tả chức năng"
              placeholder="Giải thích nhiệm vụ chính của vai trò này..."
              required
              {...register("description", {
                required: "Vui lòng nhập mô tả vai trò!",
                maxLength: { value: 255, message: "Mô tả tối đa 255 ký tự" },
              })}
              error={errors.description?.message as string}
              className="min-h-32"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 text-gray-400">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
            System Role Registry ready
          </span>
        </div>
      </form>
    </PortalModal>
  );
};
