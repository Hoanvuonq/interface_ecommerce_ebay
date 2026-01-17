export interface WorkDay {
  dayId: number;
  label: string;
  shortLabel: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}
export const DAYS_OF_WEEK: WorkDay[] = [
  { dayId: 0, label: "Chủ nhật", shortLabel: "S", isActive: false, startTime: "09:00", endTime: "18:00" },
  { dayId: 1, label: "Thứ hai", shortLabel: "M", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 2, label: "Thứ ba", shortLabel: "T", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 3, label: "Thứ tư", shortLabel: "W", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 4, label: "Thứ năm", shortLabel: "T", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 5, label: "Thứ sáu", shortLabel: "F", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 6, label: "Thứ bảy", shortLabel: "S", isActive: false, startTime: "09:00", endTime: "18:00" },
];