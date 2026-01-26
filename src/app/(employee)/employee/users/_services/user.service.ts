/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetUsersByRoleEmployeeRequest,
  GetUsersRequest,
  UpdateUserRequest,
} from "../_types/dto/user.dto";
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";

const API_ENDPOINT_ACCOUNT = "v1/users";
const API_ENDPOINT_ROLE = "v1/roles";

export const generateIdempotencyKey = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    try {
      return crypto.randomUUID();
    } catch (e) {}
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export async function getAllUsers(
  payload: GetUsersRequest,
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}`,
    method: "GET",
    params: payload,
  });
}

export async function getUserDetailById(
  userId: string,
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/${userId}`,
    method: "GET",
  });
}

export async function unLockUser(userId: string): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/${userId}/unlock`,
    method: "PATCH",
  });
}

export async function lockUser(
  userId: string,
  reason: string,
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/${userId}/lock`,
    method: "PATCH",
    params: { reason },
  });
}

export async function updateUser(
  userId: string,
  payload: UpdateUserRequest,
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/${userId}`,
    method: "PUT",
    data: payload,
  });
}

export async function getAllRoles(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ROLE}`,
    method: "GET",
  });
}

export async function getUserStatistics(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/statistics`,
    method: "GET",
  });
}

export async function getUserStatisticsTime(
  year: number,
  month: number,
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/statistics/time`,
    method: "GET",
    params: { year, month },
  });
}

export async function getUserStatisticsBehavior(
  year: number,
  month: number,
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/statistics/behavior`,
    method: "GET",
    params: { year, month },
    headers: {
      "Idempotency-Key": generateIdempotencyKey(),
    },
  });
}

export async function getUserStatisticsAvailableLogins(): Promise<
  ApiResponse<any>
> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/statistics/available-logins`,
    method: "GET",
  });
}

export async function getUserStatisticsAvailableUsers(): Promise<
  ApiResponse<any>
> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/statistics/available-users`,
    method: "GET",
  });
}

export async function getAllUsersByRoleEmployee(
  payload: GetUsersByRoleEmployeeRequest,
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/roles`,
    method: "GET",
    params: payload,
  });
}

export async function getAllUsersEmployee(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ACCOUNT}/employees`,
    method: "GET",
  });
}
