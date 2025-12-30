"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "../_hooks/useDepartment";
import { useToast } from "@/hooks/useToast";
import { Department } from "../_types/department.type";
import { UpdateDepartmentRequest } from "../_types/dto/department.dto";

export const useDepartmentFormLogic = (
  onClose: () => void,
  onSuccess: () => void,
  department: Department | null
) => {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();
  const { handleCreateDepartment } = useCreateDepartment();
  const { handleUpdateDepartment } = useUpdateDepartment();

  const isEdit = !!department;

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = _.mapValues(values, (val) =>
        _.isString(val) ? _.trim(val) : val
      ) as UpdateDepartmentRequest;

      if (isEdit && department) {
        return await handleUpdateDepartment(department.departmentId, payload);
      }
      return await handleCreateDepartment(payload as any);
    },
    onSuccess: (res) => {
      if (res) {
        toastSuccess(isEdit ? "Cập nhật thành công!" : "Khởi tạo thành công!");
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        onSuccess();
        onClose();
      }
    },
    onError: (err: any) => {
      toastError(err?.message || "Đã có lỗi xảy ra, vui lòng thử lại.");
    },
  });

  return {
    isSubmitting: mutation.isPending,
    onSubmit: mutation.mutate,
    isEdit,
  };
};
