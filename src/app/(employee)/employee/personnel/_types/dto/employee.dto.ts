import { EmployeeStatus, Gender, WorkerType } from "../employee.type";

export interface GetAllEmployeesRequest {
    fullName?: string;
    gender?: Gender;
    status?: EmployeeStatus[];
    types?: WorkerType[];
    departmentId?: string;
    positionId?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
}

export interface UpdateEmployeeRequest {
    fullName?: string;
    gender?: Gender;
    dateOfBirth?: string;
    phone?: string;
    addressDetail?: string;
    status?: EmployeeStatus[];
    types?: WorkerType[];
    startDate?: string;
    endDate?: string;
    imageUrl?: string;
    positionId?: string;
    managerId?: string;
}

export interface CreateEmployeeRequest {
    fullName?: string;
    gender?: Gender;
    dateOfBirth?: string;
    phone?: string;
    addressDetail?: string;
    types?: WorkerType[];
    startDate?: string;
    imageUrl?: string;
    positionId?: string;
    managerId?: string;
    username?: string;
    password?: string;
    email?: string;
}

export interface CreateImageRequest {
    file: File;
    path?: string;
}