export interface CreateDepartmentRequest {
  departmentName: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  departmentName: string;
  description?: string;
}

export interface CreatePositionRequest {
  positionName: string;
  description?: string;
}

export interface GetAllDepartmentsRequest {
  departmentName?: string;
  page?: number;
  size?: number;
  sort?: "asc" | "desc";
}

export interface GetAllPositionsRequest {
  positionName?: string;
  departmentId?: string;
  page?: number;
  size?: number;
  sort?: "asc" | "desc";
}
