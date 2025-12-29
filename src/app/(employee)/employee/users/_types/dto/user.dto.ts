import { RoleEnum } from "@/auth/_types/auth";

type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED" | "DELETED";

export interface GetUsersRequest {
  username?: string;
  email?: string;
  statuses?: UserStatus[];
  roleNames?: string[];
  sort?: "asc" | "desc";
  page?: number;
  size?: number;
  isDeleted?: boolean;
}

export interface UpdateUserRequest {
  status?: UserStatus;
  role?: RoleEnum;
}

export interface GetUsersByRoleEmployeeRequest {
  username?: string;
  roleNames?: RoleEnum[];
  page?: number;
  size?: number;
  sort?: "createdDate,desc";
}