/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetUsersByRoleEmployeeRequest,
  GetUsersRequest,
  UpdateUserRequest,
}  from "../_types/dto/user.dto";
import {
  getAllRoles,
  getAllUsers,
  getAllUsersByRoleEmployee,
  getUserDetailById,
  getUserStatistics,
  getUserStatisticsAvailableLogins,
  getUserStatisticsAvailableUsers,
  getUserStatisticsBehavior,
  getUserStatisticsTime,
  lockUser,
  unLockUser,
  updateUser,
} from "../_services/user.service";
import { ApiResponseOrder } from "@/types/orders/order.types";
import { useState } from "react";

export function useGetAllUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllUsers = async (payload: GetUsersRequest): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsers(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách người dùng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllUsers, loading, error };
}

export function useGetUserDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserDetail = async (userId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserDetailById(userId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy chi tiết người dùng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetUserDetail, loading, error };
}

export function useUnLockUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnLockUser = async (userId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await unLockUser(userId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Mở khóa người dùng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUnLockUser, loading, error };
}

export function useLockUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLockUser = async (
    userId: string,
    reason: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await lockUser(userId, reason);
      return res;
    } catch (err: any) {
      setError(err?.message || "Khóa người dùng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLockUser, loading, error };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUser = async (
    userId: string,
    payload: UpdateUserRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateUser(userId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Khóa người dùng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateUser, loading, error };
}

export function useGetAllRoles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllRoles = async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllRoles();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách vai trò thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllRoles, loading, error };
}

export function useGetUserStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserStatistics =
    async (): Promise<ApiResponseOrder<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserStatistics();
        return res;
      } catch (err: any) {
        setError(err?.message || "Lấy thống kê tài khoản người dùng thất bại");
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { handleGetUserStatistics, loading, error };
}

export function useGetUserStatisticsTime() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserStatisticsTime = async (
    year: number,
    month: number
  ): Promise<ApiResponseOrder<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserStatisticsTime(year, month);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thống kê theo thời gian thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetUserStatisticsTime, loading, error };
}

export function useGetUserStatisticsBehavior() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserStatisticsBehavior = async (
    year: number,
    month: number
  ): Promise<ApiResponseOrder<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserStatisticsBehavior(year, month);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thống kê hành vi người dùng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetUserStatisticsBehavior, loading, error };
}

export function useGetUserStatisticsAvailableLogins() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserStatisticsAvailableLogins =
    async (): Promise<ApiResponseOrder<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserStatisticsAvailableLogins();
        return res;
      } catch (err: any) {
        setError(
          err?.message || "Lấy danh sách tháng/năm bảng đăng nhập thất bại"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { handleGetUserStatisticsAvailableLogins, loading, error };
}

export function useGetUserStatisticsAvailableUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserStatisticsAvailableUsers =
    async (): Promise<ApiResponseOrder<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserStatisticsAvailableUsers();
        return res;
      } catch (err: any) {
        setError(
          err?.message || "Lấy danh sách tháng/năm bảng tài khoản thất bại"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { handleGetUserStatisticsAvailableUsers, loading, error };
}

export function useGetAllUsersByRoleEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllUsersByRoleEmployee = async (
    payload: GetUsersByRoleEmployeeRequest
  ): Promise<ApiResponseOrder<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsersByRoleEmployee(payload);
      return res;
    } catch (err: any) {
      setError(
        err?.message ||
          "Lấy danh sách người dùng theo vai trò nhân viên thất bại"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllUsersByRoleEmployee, loading, error };
}
