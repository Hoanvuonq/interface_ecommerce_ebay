/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  PayrollCreateRequest,
  PayrollUpdateRequest,
  GetPayrollsRequest,
}  from "../_types/payroll.type";
import {
  getPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
  markAsPaid,
  getPayrollStatistics,
}  from "../_service/payroll.service";

export function useGetPayrolls() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPayrolls = async (
    employeeId: string,
    params?: GetPayrollsRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPayrolls(employeeId, params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách bảng lương thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetPayrolls, loading, error };
}

export function useGetPayrollById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPayrollById = async (
    employeeId: string,
    payrollId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPayrollById(employeeId, payrollId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy chi tiết bảng lương thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetPayrollById, loading, error };
}

export function useCreatePayroll() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePayroll = async (
    employeeId: string,
    payload: PayrollCreateRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createPayroll(employeeId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo bảng lương thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreatePayroll, loading, error };
}

export function useUpdatePayroll() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePayroll = async (
    employeeId: string,
    payrollId: string,
    payload: PayrollUpdateRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updatePayroll(employeeId, payrollId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật bảng lương thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdatePayroll, loading, error };
}

export function useDeletePayroll() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeletePayroll = async (
    employeeId: string,
    payrollId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deletePayroll(employeeId, payrollId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa bảng lương thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeletePayroll, loading, error };
}

export function useMarkAsPaid() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkAsPaid = async (
    employeeId: string,
    payrollId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await markAsPaid(employeeId, payrollId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đánh dấu trả lương thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleMarkAsPaid, loading, error };
}

export function useGetPayrollStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPayrollStatistics = async (
    employeeId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPayrollStatistics(employeeId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thống kê bảng lương thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetPayrollStatistics, loading, error };
}
