export type Gender = "MALE" | "FEMALE" | "OTHER";

export type EmployeeStatus =
  | "ACTIVE"
  | "RESIGNED"
  | "ON_LEAVE"
  | "TERMINATED"
  | "RETIRED";

export type WorkerType =
  | "FULL_TIME"
  | "PART_TIME"
  | "PROBATION"
  | "INTERN"
  | "CONTRACTUAL";

export const statusColorMap: Record<EmployeeStatus, string> = {
  ACTIVE: "green",
  RESIGNED: "red",
  ON_LEAVE: "orange",
  TERMINATED: "volcano",
  RETIRED: "gray",
};

export const statusLabelMap: Record<EmployeeStatus, string> = {
  ACTIVE: "Đang làm việc",
  RESIGNED: "Đã nghỉ việc",
  ON_LEAVE: "Đang nghỉ phép",
  TERMINATED: "Bị chấm dứt",
  RETIRED: "Đã nghỉ hưu",
};

export const genderLabelMap: Record<Gender, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

export const workerTypeLabelMap: Record<WorkerType, string> = {
  FULL_TIME: "Toàn thời gian",
  PART_TIME: "Bán thời gian",
  PROBATION: "Thử việc",
  INTERN: "Thực tập",
  CONTRACTUAL: "Hợp đồng",
};

export type Employee = {
  employeeId: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  phone: string;
  addressDetail: string;
  status: EmployeeStatus;
  type: WorkerType;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  username: string;
  email: string;
  roleName: string; // Backward compatible: join tất cả roles bằng ", "
  roles?: string[]; // Alias cho roleNames để nhất quán với User type
  roleNames?: string[]; // Danh sách tất cả roles
  userStatus: UserStatus;
  startDate: string;
  endDate: string | null;
  imageUrl: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  deleted: boolean;
  version: number;
};

export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED" | "DELETED";

export const userStatusLabelMap: Record<UserStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Chưa kích hoạt",
  LOCKED: "Bị khóa",
  DELETED: "Đã bị xóa",
};

export const userStatusColorMap: Record<UserStatus, string> = {
  ACTIVE: "green",
  INACTIVE: "orange",
  LOCKED: "red",
  DELETED: "gray",
};

// Statistics Types
export type EmployeeStatistics = {
  totalEmployees: number;
  status: Record<string, number>; // Status -> count
  workType: Record<string, number>; // WorkType -> count
  gender: Record<string, number>; // Gender -> count
  department: Record<string, number>; // Department name -> count
  position: Record<string, number>; // Position name -> count
};

export type EmployeeTimeStatistics = {
  year: number;
  month: number;
  todayNewEmployees: number;
  yesterdayNewEmployees: number;
  thisWeekNewEmployees: number;
  lastWeekNewEmployees: number;
  weekGrowthRate: number;
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  lastYear: number;
  monthGrowthRate: number;
  yearGrowthRate: number;
  monthlyGrowth: Array<{ month: number; count: number }>;
  dailyGrowth: Array<{ day: number; count: number }>;
  top5Days: Array<{ day: number; count: number }>;
  weeklyDistribution: Array<{ dayOfWeek: string; count: number }>;
  availableMonthsYears: Array<{ year: number; month: number }>;
};

export type AvailableMonthYear = {
  year: number;
  month: number;
};
