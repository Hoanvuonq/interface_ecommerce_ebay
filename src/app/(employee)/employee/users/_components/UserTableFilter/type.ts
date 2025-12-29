export const DATA_TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "ACTIVE", label: "Hoạt động" },
  { key: "INACTIVE", label: "Chờ kích hoạt" },
  { key: "LOCKED", label: "Bị khóa" },
  { key: "DELETED", label: "Đã xóa" },
];

export interface UserTableFilterProps {
  logic: any;
}
