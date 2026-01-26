/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// PERMISSION DTOs
// ============================================

/**
 * Permission Entity
 */
export interface Permission {
  permissionId: string;
  permissionName: string;
  description: string;
  createdBy?: string;
  lastModifiedBy?: string;
  createdDate: string;
  lastModifiedDate: string;
  isDeleted: boolean;
}

/**
 * Get Permissions Request (Query Parameters)
 */
export interface GetPermissionsRequest {
  permissionName?: string;
  sort?: string;
  page?: number;
  size?: number;
  isDeleted?: boolean;
}



/**
 * Create Permission Request
 */
export interface CreatePermissionRequest {
  permissionName: string;
  description: string;
}

/**
 * Create Multiple Permissions Request (Bulk)
 * Backend expects: List<PermissionCreateRequest>
 */
export type CreatePermissionsBulkRequest = CreatePermissionRequest[];

/**
 * Update Permission Request
 */
export interface UpdatePermissionRequest {
  permissionName: string;
  description: string;
}

/**
 * Permission Page Response
 */
export interface PermissionPageResponse {
  content: Permission[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// ============================================
// ROLE DTOs
// ============================================

/**
 * Role Entity
 */
export interface Role {
  roleId: string;
  roleName: string;
  description: string;
  createdBy?: string;
  lastModifiedBy?: string;
  createdDate: string;
  lastModifiedDate: string;
  isDeleted: boolean;
}

/**
 * Get Roles Request (Query Parameters)
 */
export interface GetRolesRequest {
  roleName?: string;
  sort?: string;
  page?: number;
  size?: number;
  isDeleted?: boolean;
}

/**
 * Create Role Request
 */
export interface CreateRoleRequest {
  roleName: string;
  description: string;
}

/**
 * Update Role Request
 */
export interface UpdateRoleRequest {
  roleName: string;
  description: string;
}

/**
 * Role Page Response
 */
export interface RolePageResponse {
  content: Role[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

/**
 * Role Statistics Response
 */
export interface RoleStatisticsResponse {
  totalRoles: number;
  activeRoles: number;
  deletedRoles: number;
  roleDistribution: Record<string, number>;
}

/**
 * Get Role Permissions Request (Query Parameters)
 */
export interface GetRolePermissionsRequest {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Update Role Permissions Request
 */
export interface UpdateRolePermissionsRequest {
  permissionIds: string[];
}


export interface UpdateUserPermissionsRequest {
  newPermissionIds: string[];
}

export interface UserPermissionDetailResponse {
  userId: string;
  username: string;
  email: string;
  image?: string;
  reason?: string | null;
  status: string;
  isDeleted: boolean;
  roleName: string;
  createdBy?: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate: string;
  deleted: boolean;
  version: number;
  lockedAt?: string | null;
  rolePermissions: Permission[];
  userPermissions: Permission[];
}

