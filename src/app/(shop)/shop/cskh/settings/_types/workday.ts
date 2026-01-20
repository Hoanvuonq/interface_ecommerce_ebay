export interface WorkDay {
  dayId: number;
  value: string;
  label: string;
  shortLabel: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

export const DAYS_OF_WEEK: WorkDay[] = [
  { dayId: 1, value: "MONDAY", label: "Thứ hai", shortLabel: "M", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 2, value: "TUESDAY", label: "Thứ ba", shortLabel: "T", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 3, value: "WEDNESDAY", label: "Thứ tư", shortLabel: "W", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 4, value: "THURSDAY", label: "Thứ năm", shortLabel: "T", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 5, value: "FRIDAY", label: "Thứ sáu", shortLabel: "F", isActive: true, startTime: "09:00", endTime: "18:00" },
  { dayId: 6, value: "SATURDAY", label: "Thứ bảy", shortLabel: "S", isActive: false, startTime: "09:00", endTime: "18:00" },
  { dayId: 0, value: "SUNDAY", label: "Chủ nhật", shortLabel: "S", isActive: false, startTime: "09:00", endTime: "18:00" },
];