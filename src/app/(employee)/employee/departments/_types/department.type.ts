export type Department = {
  departmentId: string;
  departmentName: string;
  description: string;
  totalEmployees: number;
  totalPositions: number;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  deleted: boolean;
  version: number;
};

export type DepartmentDetail = {
  departmentId: string;
  departmentName: string;
  description: string;
  positions: Position[];
  totalEmployees: number;
  totalPositions: number;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  deleted: boolean;
  version: number;
};

export type Position = {
  positionId: string;
  positionName: string;
  description: string;
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  deleted: boolean;
  version: number;
};

export type DepartmentStatistics = {
  totalDepartments: number;
  totalPositions: number;
  totalEmployees: number;
  positions: Record<string, number>; 
  employees: Record<string, number>; 
};
