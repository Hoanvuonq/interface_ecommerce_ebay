/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  CreatePositionRequest,
  GetAllDepartmentsRequest,
} from "../_types/dto/department.dto";
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";

const API_ENDPOINT_DEPARTMENT = "v1/departments";

// Department APIs
export async function getAllDepartments(
  payload?: GetAllDepartmentsRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}`,
    method: "GET",
    params: payload,
  });
}

export async function getDepartmentDetailById(
  departmentId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}/${departmentId}`,
    method: "GET",
  });
}

export async function createDepartment(
  payload: CreateDepartmentRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}`,
    method: "POST",
    data: payload,
  });
}

export async function updateDepartment(
  departmentId: string,
  payload: UpdateDepartmentRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}/${departmentId}`,
    method: "PUT",
    data: payload,
  });
}

// Position APIs
export async function getAllPositionsByDepartment(
  departmentId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}/${departmentId}/positions`,
    method: "GET",
  });
}

export async function addPositionToDepartment(
  departmentId: string,
  payload: CreatePositionRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}/${departmentId}/positions`,
    method: "POST",
    data: payload,
  });
}

export async function addListPositionToDepartment(
  departmentId: string,
  payload: CreatePositionRequest[]
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}/${departmentId}/positions/list`,
    method: "POST",
    data: payload,
  });
}

export async function removePositionFromDepartment(
  departmentId: string,
  positionId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}/${departmentId}/positions/${positionId}`,
    method: "DELETE",
  });
}

// Statistics APIs
export async function getDepartmentStatistics(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}/statistics`,
    method: "GET",
  });
}
