/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  CreatePositionRequest,
  GetAllDepartmentsRequest,
} from "../_types/dto/department.dto";
import {
  getAllDepartments,
  getDepartmentDetailById,
  createDepartment,
  updateDepartment,
  getAllPositionsByDepartment,
  addPositionToDepartment,
  addListPositionToDepartment,
  removePositionFromDepartment,
  getDepartmentStatistics,
} from "../_services/department.service";
import { ApiResponse } from "@/api/_types/api.types";

export function useGetAllDepartments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllDepartments = async (
    payload?: GetAllDepartmentsRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllDepartments(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách phòng ban thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllDepartments, loading, error };
}

export function useGetDepartmentDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetDepartmentDetail = async (
    departmentId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDepartmentDetailById(departmentId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy chi tiết phòng ban thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetDepartmentDetail, loading, error };
}

export function useCreateDepartment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDepartment = async (
    payload: CreateDepartmentRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createDepartment(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo phòng ban thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateDepartment, loading, error };
}

export function useUpdateDepartment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateDepartment = async (
    departmentId: string,
    payload: UpdateDepartmentRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateDepartment(departmentId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật phòng ban thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateDepartment, loading, error };
}

export function useGetAllPositionsByDepartment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllPositionsByDepartment = async (
    departmentId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllPositionsByDepartment(departmentId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách chức vụ thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllPositionsByDepartment, loading, error };
}

export function useAddPositionToDepartment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPositionToDepartment = async (
    departmentId: string,
    payload: CreatePositionRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await addPositionToDepartment(departmentId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Thêm chức vụ thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleAddPositionToDepartment, loading, error };
}

export function useAddListPositionToDepartment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddListPositionToDepartment = async (
    departmentId: string,
    payload: CreatePositionRequest[]
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await addListPositionToDepartment(departmentId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Thêm danh sách chức vụ thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleAddListPositionToDepartment, loading, error };
}

export function useRemovePositionFromDepartment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemovePositionFromDepartment = async (
    departmentId: string,
    positionId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await removePositionFromDepartment(departmentId, positionId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa chức vụ thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRemovePositionFromDepartment, loading, error };
}

export function useGetDepartmentStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetDepartmentStatistics = async (): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDepartmentStatistics();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thống kê phòng ban thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetDepartmentStatistics, loading, error };
}

