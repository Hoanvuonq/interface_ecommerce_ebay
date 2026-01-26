/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  getPermissions,
  getPermissionDetail,
  createPermission,
  createPermissionsBulk,
  updatePermission,
  deletePermission,
  getRoles,
  getRoleDetail,
  getRoleStatistics,
  getRolePermissions,
  updateRolePermissions as updateRolePermissionsService,
  createRole as createRoleService,
  updateRole as updateRoleService,
  deleteRole as deleteRoleService,
  updateUserPermissions,
  getUserPermissionDetail,
  updateRolePermissions,
  createRole,
  updateRole,
  deleteRole,
} from "../_services/rbac.service";
import {
  GetPermissionsRequest,
  CreatePermissionRequest,
  CreatePermissionsBulkRequest,
  UpdatePermissionRequest,
  GetRolesRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  GetRolePermissionsRequest,
  UpdateRolePermissionsRequest,
  UpdateUserPermissionsRequest,
  Role,
  Permission,
  RoleStatisticsResponse,
} from "../_types/dto/rbac.dto";
import { ApiResponse } from "@/api/_types/api.types";
import { useToast } from "@/hooks/useToast";
// ============================================
// MAIN RBAC HOOK (Tổng hợp)
// ============================================

export function useRBAC() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [roleStatistics, setRoleStatistics] =
    useState<RoleStatisticsResponse | null>(null);

  // Pagination state for roles
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Pagination state for role permissions
  const [rolePermissionsPage, setRolePermissionsPage] = useState(0);
  const [rolePermissionsSize, setRolePermissionsSize] = useState(10);
  const [rolePermissionsTotalElements, setRolePermissionsTotalElements] =
    useState(0);
  const [rolePermissionsTotalPages, setRolePermissionsTotalPages] = useState(0);

  // Fetch roles with pagination
  const fetchRoles = async (params?: GetRolesRequest) => {
    setLoading(true);
    try {
      const res = await getRoles(params);
      if (res.success && res.data) {
        setRoles(res.data.content);
        setPage(res.data.page);
        setSize(res.data.size);
        setTotalElements(res.data.totalElements);
        setTotalPages(res.data.totalPages);
      }
    } catch (error: any) {
      error(error?.message || "Lấy danh sách vai trò thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch role statistics
  const fetchRoleStatistics = async () => {
    try {
      const res = await getRoleStatistics();
      if (res.success && res.data) {
        setRoleStatistics(res.data);
      }
    } catch (error: any) {
      console.error("Lấy thống kê vai trò thất bại:", error);
    }
  };

  // Fetch all permissions (for selection)
  const fetchAllPermissions = async (params?: GetPermissionsRequest) => {
    setLoading(true);
    try {
      const res = await getPermissions(params);
      if (res.success && res.data) {
        setAllPermissions(res.data.content);
      }
    } catch (error: any) {
      error(error?.message || "Lấy danh sách quyền hạn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch role permissions
  const fetchRolePermissions = async (
    roleId: string,
    params?: GetRolePermissionsRequest,
  ) => {
    setLoading(true);
    try {
      const res = await getRolePermissions(roleId, params);
      if (res.success && res.data) {
        setRolePermissions(res.data.content);
        setRolePermissionsPage(res.data.page);
        setRolePermissionsSize(res.data.size);
        setRolePermissionsTotalElements(res.data.totalElements);
        setRolePermissionsTotalPages(res.data.totalPages);
      }
    } catch (error: any) {
      error(error?.message || "Lấy quyền hạn của vai trò thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Create role
  const createRole = async (payload: CreateRoleRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await createRoleService(payload);
      if (res.success) {
        success("Tạo vai trò thành công!");
        return true;
      }
      return false;
    } catch (error: any) {
      error(error?.message || "Tạo vai trò thất bại!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update role
  const updateRole = async (
    roleId: string,
    payload: UpdateRoleRequest,
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await updateRoleService(roleId, payload);
      if (res.success) {
        success("Cập nhật vai trò thành công!");
        return true;
      }
      return false;
    } catch (error: any) {
      error(error?.message || "Cập nhật vai trò thất bại!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete role
  const deleteRole = async (roleId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await deleteRoleService(roleId);
      if (res.success) {
        success("Xóa vai trò thành công!");
        return true;
      }
      return false;
    } catch (error: any) {
      error(error?.message || "Xóa vai trò thất bại!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update role permissions
  const updateRolePermissions = async (
    roleId: string,
    payload: UpdateRolePermissionsRequest,
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await updateRolePermissionsService(roleId, payload);
      if (res.success) {
        return true;
      }
      return false;
    } catch (error: any) {
      error(error?.message || "Cập nhật quyền hạn thất bại!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    roles,
    allPermissions,
    rolePermissions,
    roleStatistics,
    page,
    size,
    totalElements,
    totalPages,
    rolePermissionsPage,
    rolePermissionsSize,
    rolePermissionsTotalElements,
    rolePermissionsTotalPages,
    setPage,
    setSize,
    fetchRoles,
    fetchRoleStatistics,
    fetchAllPermissions,
    fetchRolePermissions,
    createRole,
    updateRole,
    deleteRole,
    updateRolePermissions,
  };
}

// ============================================
// PERMISSION HOOKS
// ============================================

/**
 * Hook to get list of permissions
 */
export function useGetPermissions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPermissions = async (
    params?: GetPermissionsRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPermissions(params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách permission thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetPermissions, loading, error };
}

/**
 * Hook to get permission detail
 */
export function useGetPermissionDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPermissionDetail = async (
    permissionId: string,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPermissionDetail(permissionId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy chi tiết permission thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetPermissionDetail, loading, error };
}

/**
 * Hook to create permission
 */
export function useCreatePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePermission = async (
    payload: CreatePermissionRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createPermission(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo permission thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreatePermission, loading, error };
}

/**
 * Hook to create multiple permissions at once (bulk)
 */
export function useCreatePermissionsBulk() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePermissionsBulk = async (
    payload: CreatePermissionsBulkRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createPermissionsBulk(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo nhiều permissions thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreatePermissionsBulk, loading, error };
}

/**
 * Hook to update permission
 */
export function useUpdatePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePermission = async (
    permissionId: string,
    payload: UpdatePermissionRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updatePermission(permissionId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật permission thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdatePermission, loading, error };
}

/**
 * Hook to delete permission
 */
export function useDeletePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeletePermission = async (
    permissionId: string,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deletePermission(permissionId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa permission thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeletePermission, loading, error };
}

// ============================================
// ROLE HOOKS
// ============================================

/**
 * Hook to get list of roles
 */
export function useGetRoles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRoles = async (
    params?: GetRolesRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRoles(params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách role thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetRoles, loading, error };
}

/**
 * Hook to get role detail
 */
export function useGetRoleDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRoleDetail = async (
    roleId: string,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRoleDetail(roleId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy chi tiết role thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetRoleDetail, loading, error };
}

/**
 * Hook to get role statistics
 */
export function useGetRoleStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRoleStatistics =
    async (): Promise<ApiResponse<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRoleStatistics();
        return res;
      } catch (err: any) {
        setError(err?.message || "Lấy thống kê role thất bại");
        return null;
      } finally {
        setLoading(false);
      }
    };

  return { handleGetRoleStatistics, loading, error };
}

/**
 * Hook to get role permissions
 */
export function useGetRolePermissions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRolePermissions = async (
    roleId: string,
    params?: GetRolePermissionsRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRolePermissions(roleId, params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy permissions của role thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetRolePermissions, loading, error };
}

/**
 * Hook to update role permissions
 */
export function useUpdateRolePermissions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateRolePermissions = async (
    roleId: string,
    payload: UpdateRolePermissionsRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateRolePermissions(roleId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật permissions của role thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateRolePermissions, loading, error };
}

/**
 * Hook to create role
 */
export function useCreateRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRole = async (
    payload: CreateRoleRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createRole(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo role thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateRole, loading, error };
}

/**
 * Hook to update role
 */
export function useUpdateRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateRole = async (
    roleId: string,
    payload: UpdateRoleRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateRole(roleId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật role thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateRole, loading, error };
}

/**
 * Hook to delete role
 */
export function useDeleteRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteRole = async (
    roleId: string,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteRole(roleId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa role thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteRole, loading, error };
}

// ============================================
// USER PERMISSION HOOKS
// ============================================

/**
 * Hook to update user permissions
 */
export function useUpdateUserPermissions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUserPermissions = async (
    userId: string,
    payload: UpdateUserPermissionsRequest,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateUserPermissions(userId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật extra permissions của user thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateUserPermissions, loading, error };
}

/**
 * Hook to get user permission detail
 */
export function useGetUserPermissionDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserPermissionDetail = async (
    userId: string,
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserPermissionDetail(userId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy chi tiết permissions của user thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetUserPermissionDetail, loading, error };
}
