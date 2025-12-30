"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import dayjs from "dayjs";
import { 
  useCreateEmployee, 
  useGetAllDepartments, 
  useGetAllPositionsByDepartment, 
  useUpdateEmployee 
} from "../_hooks/useEmployee";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import { toPublicUrl } from "@/utils/storage/url";
import { Employee, EmployeeStatus, Gender, WorkerType } from "../_types/employee.type";

export const useEmployeeFormLogic = (
  open: boolean, 
  mode: "create" | "update", 
  employee: Employee | null,
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const { handleUpdateEmployee, loading: updateLoading } = useUpdateEmployee();
  const { handleCreateEmployee, loading: createLoading } = useCreateEmployee();
  const { handleGetAllDepartments } = useGetAllDepartments();
  const { handleGetAllPositionsByDepartment } = useGetAllPositionsByDepartment();
  const { uploadFile: uploadPresigned } = usePresignedUpload();

  const { data: departments = [], isLoading: depLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await handleGetAllDepartments();
      return res?.data?.departments || [];
    },
    enabled: open,
  });

  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const { data: positions = [], isLoading: posLoading } = useQuery({
    queryKey: ["positions", selectedDeptId],
    queryFn: async () => {
      if (!selectedDeptId) return [];
      const res = await handleGetAllPositionsByDepartment(selectedDeptId);
      return res?.data || [];
    },
    enabled: !!selectedDeptId,
  });

  const isSubmitting = createLoading || updateLoading;

  const processFormSubmit = async (values: any) => {
    let avatarUrl = mode === "update" ? employee?.imageUrl : null;
    
    const fileObj = _.get(values, "imageUrl[0].originFileObj");
    if (fileObj) {
      const res = await uploadPresigned(fileObj, UploadContext.EMPLOYEE_AVATAR);
      if (res.finalUrl) avatarUrl = res.finalUrl;
      else if (res.path) {
        const ext = typeof fileObj.name === "string"
          ? ((_.last((fileObj.name as string).split('.')) as string)?.toLowerCase().replace('jpeg', 'jpg') || 'jpg')
          : 'jpg';
        avatarUrl = toPublicUrl(`${res.path.replace(/^pending\//, 'public/')}_orig.${ext}`);
      }
    } else if (mode === "update" && _.isEmpty(values.imageUrl)) {
      avatarUrl = null;
    }

    const dateFields = ["startDate", "endDate", "dateOfBirth"];
    const formattedDates = _.mapValues(_.pick(values, dateFields), (val) => 
      val ? new Date(val).toISOString() : null
    );

    const payload = {
      ...values,
      ...formattedDates,
      imageUrl: avatarUrl,
    };

    const result = mode === "create" 
      ? await handleCreateEmployee(payload) 
      : await handleUpdateEmployee(employee!.employeeId, payload);

    if (result) {
      onSuccess?.();
      onClose?.();
    }
  };

  return {
    departments,
    positions,
    depLoading,
    posLoading,
    isSubmitting,
    setSelectedDeptId,
    processFormSubmit
  };
};