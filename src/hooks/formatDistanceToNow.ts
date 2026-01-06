import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
export const formatTimeFriendly = (dateInput: string | Date) => {
  if (!dateInput) return "";
  try {
    const date = new Date(dateInput);
    const now = new Date();
    
    // Nếu tin nhắn gửi trong vòng 1 phút -> "Vừa xong"
    if (now.getTime() - date.getTime() < 60000) {
      return "Vừa xong";
    }

    // Nếu tin nhắn gửi trong ngày hôm nay -> "10:30"
    if (isToday(date)) {
      return format(date, "HH:mm");
    }

    // Nếu tin nhắn gửi hôm qua -> "Hôm qua, 10:30"
    if (isYesterday(date)) {
      return `Hôm qua, ${format(date, "HH:mm")}`;
    }

    // Nếu tin nhắn cũ hơn (trong năm nay) -> "20/10, 10:30"
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, "dd/MM, HH:mm");
    }

    // Nếu khác năm -> "20/10/2024"
    return format(date, "dd/MM/yyyy");
  } catch {
    return "";
  }
};