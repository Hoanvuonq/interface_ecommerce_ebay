export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED" | "DELETED";

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

export type User = {
  userId: string;
  username: string;
  email: string;
  image: string;
  fullName: string;
  reason: string;
  status: UserStatus;
  deleted: boolean;
  roleName: string;
  roles?: string[]; 
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
  lockedAt: string;
};

export type BaseUserDetail = {
  userId: string;
  username: string;
  email: string;
  image?: string;
  reason?: string;
  status: UserStatus;
  isDeleted?: boolean;
  deleted: boolean;
  roleName: string;
  roles?: string[]; 
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  version?: number;
  lockedAt?: string;
  // IDs để truy cập nhanh
  buyerId?: string;
  shopId?: string;
  employeeId?: string;
  // Objects chứa thông tin chi tiết
  buyer?: BuyerResponse;
  shop?: ShopResponse;
  employee?: EmployeeResponse;
  // Permissions (từ UserDetailResponse)
  rolePermissions?: Permission[];
  userPermissions?: Permission[];
};

export type Permission = {
  permissionId: string;
  permissionName: string;
  description?: string;
  isDeleted?: boolean;
  createdBy?: string;
  lastModifiedBy?: string;
  createdDate?: string;
  lastModifiedDate?: string;
};

// BuyerResponse từ backend
export type BuyerResponse = {
  buyerId: string;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: Gender;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  deleted: boolean;
  version?: number;
};

// ShopResponse từ backend
export type ShopResponse = {
  shopId: string;
  shopName: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: ShopStatus; // Lưu ý: tên field là "status" không phải "shopStatus"
  rejectedReason?: string;
  verifyBy?: string;
  verifyDate?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  deleted: boolean;
  version?: number;
  userId?: string;
  username?: string;
};

// EmployeeResponse từ backend
export type EmployeeResponse = {
  employeeId: string;
  fullName: string;
  gender?: Gender;
  dateOfBirth?: string;
  phone?: string;
  addressDetail?: string;
  status: EmployeeStatus; // Lưu ý: tên field là "status" không phải "employeeStatus"
  type?: WorkerType;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  username?: string;
  email?: string;
  roleName?: string; // Backward compatible
  roleNames?: string[]; // Danh sách tất cả roles
  userStatus?: UserStatus;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  deleted: boolean;
  version?: number;
};

export type BuyerDetail = BaseUserDetail & {
  buyerId: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
};

export type ShopDetail = BaseUserDetail & {
  shopId: string;
  shopName: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  shopStatus: ShopStatus;
  onVacation: boolean;
  rejectedReason: string;
  verifyBy: string;
  verifyDate: string;
};

export type EmployeeDetail = BaseUserDetail & {
  employeeId: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  phone: string;
  addressDetail: string;
  employeeStatus: EmployeeStatus;
  type: WorkerType;
  startDate: string;
  endDate: string;
  imageUrl: string;
};

export type AdminDetail = EmployeeDetail;

export type UserDetail =
  | BuyerDetail
  | ShopDetail
  | AdminDetail
  | EmployeeDetail;

export const statusColorMap: Record<UserStatus, string> = {
  ACTIVE: "green",
  INACTIVE: "orange",
  LOCKED: "red",
  DELETED: "gray",
};

export const statusLabelMap: Record<UserStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Chưa kích hoạt",
  LOCKED: "Bị khóa",
  DELETED: "Đã bị xóa",
};

export const employeeStatusColorMap: Record<EmployeeStatus, string> = {
  ACTIVE: "green",
  RESIGNED: "red",
  ON_LEAVE: "orange",
  TERMINATED: "volcano",
  RETIRED: "gray",
};

export const employeeStatusLabelMap: Record<EmployeeStatus, string> = {
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

export type ShopStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED"
  | "CLOSED";

export const shopColorMap: Record<ShopStatus, string> = {
  PENDING: "orange",
  ACTIVE: "green",
  REJECTED: "red",
  SUSPENDED: "volcano",
  CLOSED: "gray",
};

export const shopLabelMap: Record<ShopStatus, string> = {
  PENDING: "Chờ duyệt",
  ACTIVE: "Đang hoạt động",
  REJECTED: "Bị từ chối",
  SUSPENDED: "Bị tạm khóa",
  CLOSED: "Đã đóng",
};

export const genderOptions = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
];

export const employeeStatusOptions = [
  { label: "Đang làm việc", value: "ACTIVE" },
  { label: "Đã nghỉ việc", value: "RESIGNED" },
  { label: "Đang nghỉ phép", value: "ON_LEAVE" },
  { label: "Bị chấm dứt", value: "TERMINATED" },
  { label: "Đã nghỉ hưu", value: "RETIRED" },
];

export const workTypeOptions = [
  { label: "Toàn thời gian", value: "FULL_TIME" },
  { label: "Bán thời gian", value: "PART_TIME" },
  { label: "Đang thử việc", value: "PROBATION" },
  { label: "Thực tập sinh", value: "INTERN" },
  { label: "Hợp đồng", value: "CONTRACTUAL" },
]

export const shopStatusOptions = [
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Bị từ chối", value: "REJECTED" },
  { label: "Bị tạm khóa", value: "SUSPENDED" },
  { label: "Đã đóng", value: "CLOSED" },
];