/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateEmployeeRequest,
  CreateImageRequest,
  GetAllEmployeesRequest,
  UpdateEmployeeRequest,
}  from "../_types/dto/employee.dto";
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";
import { generateIdempotencyKey } from "@/utils/generateIdempotencyKey";

const API_ENDPOINT_EMPLOYEE = "v1/employees";
const API_ENDPOINT_DEPARTMENT = "v1/departments";
const API_ENDPOINT_POSITION = "v1/positions";
const API_ENDPOINT_STORAGE = "v1/storage";

export async function getAllEmployees(
  payload: GetAllEmployeesRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEE}`,
    method: "GET",
    params: payload,
  });
}

export async function updateEmployee(
  employeeId: string,
  payload: UpdateEmployeeRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEE}/${employeeId}`,
    method: "PUT",
    data: payload,
  });
}

export async function createEmployee(
  payload: CreateEmployeeRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEE}`,
    method: "POST",
    data: payload,
  });
}

export async function getAllDepartments(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}`,
    method: "GET",
  });
}

export async function getAllPositions(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_POSITION}`,
    method: "GET",
  });
}

export async function getAllPositionsByDepartment(
  departmentId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_DEPARTMENT}/${departmentId}/positions`,
    method: "GET",
  });
}

export async function createUploadImage(
  payload: CreateImageRequest
): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.path) {
    formData.append("path", payload.path);
  }

  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_STORAGE}/upload`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function getEmployeeStatistics(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEE}/statistics`,
    method: "GET",
  });
}

export async function getEmployeeStatisticsTime(
  year: number,
  month: number
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEE}/statistics/time`,
    method: "GET",
    params: { year, month },
    headers: {
          "Idempotency-Key": generateIdempotencyKey(),
        },
  });
}

export async function getEmployeeStatisticsAvailable(): Promise<
  ApiResponse<any>
> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEE}/statistics/available`,
    method: "GET",
  });
}
