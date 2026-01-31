export interface PayrollResponse {
  id: string;
  payMonth: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  total: number;
  paid: boolean;
  paidDate: string;
  expectedPayDate: string;
  attachmentUrl?: string;
}

export interface PayrollCreateRequest {
  payMonth: string;
  baseSalary: number;
  bonus?: number;
  deduction?: number;
  total: number;
  attachmentUrl?: string;
  expectedPayDate: string;
}

export interface PayrollUpdateRequest {
  payMonth: string;
  baseSalary: number;
  bonus?: number;
  deduction?: number;
  total: number;
  attachmentUrl?: string;
  paidDate?: string;
  expectedPayDate: string;
}

export interface PayRollPageResponse {
  payrolls: PayrollResponse[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface GetPayrollsRequest {
  year?: number;
  page?: number;
  size?: number;
  sortBy?: "payMonth" | "baseSalary" | "total" | "paidDate";
  direction?: "ASC" | "DESC";
}
