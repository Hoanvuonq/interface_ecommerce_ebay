/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CreateEmployeeRequest,
  CreateImageRequest,
  GetAllEmployeesRequest,
  UpdateEmployeeRequest,
} from "../_types/dto/employee.dto";
import {
  createEmployee,
  createUploadImage,
  getAllDepartments,
  getAllEmployees,
  getAllPositions,
  getAllPositionsByDepartment,
  getEmployeeStatistics,
  getEmployeeStatisticsAvailable,
  getEmployeeStatisticsTime,
  updateEmployee,
} from "../_service/employee.service";
import { ApiResponseOrder } from "@/types/orders/order.types";
import { useState } from "react";

export function useGetAllEmployees() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllEmployees = async (
    payload: GetAllEmployeesRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllEmployees(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách nhân viên thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllEmployees, loading, error };
}

export function useUpdateEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateEmployee = async (
    employeeId: string,
    payload: UpdateEmployeeRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateEmployee(employeeId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật nhân viên thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateEmployee, loading, error };
}

export function useCreateEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateEmployee = async (
    payload: CreateEmployeeRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createEmployee(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Thêm nhân viên thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateEmployee, loading, error };
}

export function useGetAllDepartments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllDepartments = async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllDepartments();
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

export function useGetAllPositions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllPositions = async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllPositions();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách chức vụ thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllPositions, loading, error };
}

export function useGetAllPositionsByDepartment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllPositionsByDepartment = async (
    departmentId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllPositionsByDepartment(departmentId);
      return res;
    } catch (err: any) {
      setError(
        err?.message || "Lấy danh sách chức vụ trong phòng ban thất bại"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllPositionsByDepartment, loading, error };
}

export function useCreateUploadImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUploadImage = async (
    payload: CreateImageRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createUploadImage(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tải lên hình ảnh thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateUploadImage, loading, error };
}

export function useGetEmployeeStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetEmployeeStatistics =
    async (): Promise<ApiResponseOrder<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEmployeeStatistics();
        return res;
      } catch (err: any) {
        setError(err?.message || "Lấy thống kê nhân viên thất bại");
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { handleGetEmployeeStatistics, loading, error };
}

// 2️⃣ Lấy thống kê theo thời gian (năm + tháng)
export function useGetEmployeeStatisticsTime() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetEmployeeStatisticsTime = async (
    year: number,
    month: number
  ): Promise<ApiResponseOrder<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployeeStatisticsTime(year, month);
      return res;
    } catch (err: any) {
      setError(
        err?.message || "Lấy thống kê nhân viên theo thời gian thất bại"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetEmployeeStatisticsTime, loading, error };
}

// 3️⃣ Lấy danh sách tháng/năm khả dụng (để fill vào dropdown filter)
export function useGetEmployeeStatisticsAvailable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetEmployeeStatisticsAvailable =
    async (): Promise<ApiResponseOrder<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEmployeeStatisticsAvailable();
        return res;
      } catch (err: any) {
        setError(err?.message || "Lấy danh sách tháng/năm khả dụng thất bại");
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { handleGetEmployeeStatisticsAvailable, loading, error };
}
