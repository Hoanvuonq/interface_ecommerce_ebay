"use client";

import { useToast } from "@/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import {
  createDepartment,
  updateDepartment,
} from "../_services/department.service";
import { Department } from "../_types/department.type";
import { UpdateDepartmentRequest } from "../_types/dto/department.dto";

export const useDepartmentFormLogic = (
  onClose: () => void,
  onSuccess: () => void,
  department: Department | null,
) => {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();
  const isEdit = !!department;

  const mutation = useMutation({
    mutationFn: (values: any) => {
      const payload: UpdateDepartmentRequest = {
        departmentName: _.isString(values.departmentName)
          ? _.trim(values.departmentName)
          : values.departmentName,
        description: _.isString(values.description)
          ? _.trim(values.description)
          : values.description,
      };
      return isEdit
        ? updateDepartment(department.departmentId, payload)
        : createDepartment(payload as any);
    },
    onSuccess: () => {
      toastSuccess(isEdit ? "Cập nhật thành công!" : "Khởi tạo thành công!");
      // 🚀 Đồng bộ toàn bộ hệ thống
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      onSuccess();
      onClose();
    },
    onError: (err: any) => toastError(err?.message || "Thao tác thất bại"),
  });

  return {
    isSubmitting: mutation.isPending,
    onSubmit: mutation.mutate,
    isEdit,
  };
};
