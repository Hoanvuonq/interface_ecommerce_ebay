/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import {
  Permission,
  PermissionPageResponse,
  GetPermissionsRequest,
  CreatePermissionRequest,
  CreatePermissionsBulkRequest,
  UpdatePermissionRequest,
  Role,
  RolePageResponse,
  GetRolesRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleStatisticsResponse,
  GetRolePermissionsRequest,
  UpdateRolePermissionsRequest,
  UpdateUserPermissionsRequest,
  UserPermissionDetailResponse,
} from "../_types/dto/rbac.dto";


const API_ENDPOINT_PERMISSIONS = "v1/permissions";
const API_ENDPOINT_ROLES = "v1/roles";
const API_ENDPOINT_USERS = "v1/users";

export async function getPermissions(
  params?: GetPermissionsRequest,
): Promise<ApiResponse<PermissionPageResponse>> {
  return request<ApiResponse<PermissionPageResponse>>({
    url: `/${API_ENDPOINT_PERMISSIONS}`,
    method: "GET",
    params: {
      permissionName: params?.permissionName,
      isDeleted: params?.isDeleted ?? false,
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sort: params?.sort,
    },
  });
}

export async function getPermissionDetail(
  permissionId: string,
): Promise<ApiResponse<Permission>> {
  return request<ApiResponse<Permission>>({
    url: `/${API_ENDPOINT_PERMISSIONS}/${permissionId}`,
    method: "GET",
  });
}

/**
 * Create new permission
 */
export async function createPermission(
  payload: CreatePermissionRequest,
): Promise<ApiResponse<Permission>> {
  return request<ApiResponse<Permission>>({
    url: `/${API_ENDPOINT_PERMISSIONS}`,
    method: "POST",
    data: payload,
  });
}

/**
 * Create multiple permissions at once (bulk)
 */
export async function createPermissionsBulk(
  payload: CreatePermissionsBulkRequest,
): Promise<ApiResponse<Permission[]>> {
  return request<ApiResponse<Permission[]>>({
    url: `/${API_ENDPOINT_PERMISSIONS}/bulk`,
    method: "POST",
    data: payload,
  });
}

/**
 * Update permission by ID
 */
export async function updatePermission(
  permissionId: string,
  payload: UpdatePermissionRequest,
): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>({
    url: `/${API_ENDPOINT_PERMISSIONS}/${permissionId}`,
    method: "PUT",
    data: payload,
  });
}

/**
 * Delete permission by ID (soft delete)
 */
export async function deletePermission(
  permissionId: string,
): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>({
    url: `/${API_ENDPOINT_PERMISSIONS}/${permissionId}`,
    method: "DELETE",
  });
}

// ============================================
// ROLE APIs
// ============================================

/**
 * Get list of roles with pagination and filters
 */
export async function getRoles(
  params?: GetRolesRequest,
): Promise<ApiResponse<RolePageResponse>> {
  return request<ApiResponse<RolePageResponse>>({
    url: `/${API_ENDPOINT_ROLES}`,
    method: "GET",
    params: {
      roleName: params?.roleName,
      isDeleted: params?.isDeleted ?? false,
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sort: params?.sort,
    },
  });
}

/**
 * Get role detail by ID
 */
export async function getRoleDetail(
  roleId: string,
): Promise<ApiResponse<Role>> {
  return request<ApiResponse<Role>>({
    url: `/${API_ENDPOINT_ROLES}/${roleId}`,
    method: "GET",
  });
}

/**
 * Get role statistics
 */
export async function getRoleStatistics(): Promise<
  ApiResponse<RoleStatisticsResponse>
> {
  return request<ApiResponse<RoleStatisticsResponse>>({
    url: `/${API_ENDPOINT_ROLES}/statistics`,
    method: "GET",
  });
}

/**
 * Get permissions of a role
 */
export async function getRolePermissions(
  roleId: string,
  params?: GetRolePermissionsRequest,
): Promise<ApiResponse<PermissionPageResponse>> {
  return request<ApiResponse<PermissionPageResponse>>({
    url: `/${API_ENDPOINT_ROLES}/${roleId}/permissions`,
    method: "GET",
    params: {
      ...params,
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    },
  });
}

/**
 * Update permissions for a role
 */
export async function updateRolePermissions(
  roleId: string,
  payload: UpdateRolePermissionsRequest,
): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>({
    url: `/${API_ENDPOINT_ROLES}/${roleId}/permissions`,
    method: "PUT",
    data: payload,
  });
}

/**
 * Create new role
 */
export async function createRole(
  payload: CreateRoleRequest,
): Promise<ApiResponse<Role>> {
  return request<ApiResponse<Role>>({
    url: `/${API_ENDPOINT_ROLES}`,
    method: "POST",
    data: payload,
  });
}

/**
 * Update role by ID
 */
export async function updateRole(
  roleId: string,
  payload: UpdateRoleRequest,
): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>({
    url: `/${API_ENDPOINT_ROLES}/${roleId}`,
    method: "PUT",
    data: payload,
  });
}

/**
 * Delete role by ID (soft delete)
 */
export async function deleteRole(roleId: string): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>({
    url: `/${API_ENDPOINT_ROLES}/${roleId}`,
    method: "DELETE",
  });
}

// ============================================
// USER PERMISSION APIs
// ============================================

/**
 * Update user permissions
 */
export async function updateUserPermissions(
  userId: string,
  payload: UpdateUserPermissionsRequest,
): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>({
    url: `/${API_ENDPOINT_USERS}/${userId}/permissions`,
    method: "PUT",
    data: payload,
  });
}

/**
 * Get user permission detail (including role permissions and user permissions)
 */
export async function getUserPermissionDetail(
  userId: string,
): Promise<ApiResponse<UserPermissionDetailResponse>> {
  return request<ApiResponse<UserPermissionDetailResponse>>({
    url: `/${API_ENDPOINT_USERS}/${userId}/detail`,
    method: "GET",
  });
}
