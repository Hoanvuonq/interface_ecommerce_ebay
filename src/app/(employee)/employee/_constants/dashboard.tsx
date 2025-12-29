import { CheckCircle, Clock, RefreshCw, Trophy } from "lucide-react";
import { SupportTicket, Task } from "../_types/dashboard";

export const stats = [
  {
    title: "Nhiệm vụ hoàn thành",
    value: 23,
    total: 30,
    icon: <CheckCircle className="w-6 h-6" />,
    gradient: "from-green-500 to-green-600",
    bgLight: "bg-green-50",
    textColor: "text-green-600",
    progressColor: "bg-green-500",
    percent: 76,
  },
  {
    title: "Ticket hỗ trợ đang xử lý",
    value: 8,
    total: 12,
    icon: <RefreshCw className="w-6 h-6" />,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    progressColor: "bg-blue-500",
    percent: 67,
  },
  {
    title: "Yêu cầu chờ duyệt",
    value: 5,
    total: 10,
    icon: <Clock className="w-6 h-6" />,
    gradient: "from-orange-500 to-orange-600",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    progressColor: "bg-orange-500",
    percent: 67,
  },
  {
    title: "Đánh giá khách hàng",
    value: 4.8,
    total: 5,
    icon: <Trophy className="w-6 h-6" />,
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-600",
    progressColor: "bg-purple-500",
    percent: 96,
  },
];

// 📋 My Tasks
export const myTasks: Task[] = [
  {
    key: "1",
    id: "TASK-001",
    title: "Xử lý yêu cầu hoàn tiền #ORD-12345",
    priority: "high",
    status: "in_progress",
    dueDate: "Hôm nay, 15:00",
    department: "Chăm sóc KH",
  },
  {
    key: "2",
    id: "TASK-002",
    title: "Kiểm tra tồn kho sản phẩm điện tử",
    priority: "medium",
    status: "pending",
    dueDate: "Ngày mai, 10:00",
    department: "Kho vận",
  },
  {
    key: "3",
    id: "TASK-003",
    title: "Cập nhật thông tin khách hàng VIP",
    priority: "low",
    status: "pending",
    dueDate: "03/11/2025",
    department: "Chăm sóc KH",
  },
  {
    key: "4",
    id: "TASK-004",
    title: "Báo cáo doanh thu tuần",
    priority: "high",
    status: "in_progress",
    dueDate: "Hôm nay, 17:00",
    department: "Kế toán",
  },
];

export const supportTickets: SupportTicket[] = [
  {
    key: "1",
    ticketId: "TK-5421",
    customer: "Nguyễn Văn A",
    issue: "Sản phẩm giao không đúng màu",
    status: "in_progress",
    createdAt: "10 phút trước",
  },
  {
    key: "2",
    ticketId: "TK-5420",
    customer: "Trần Thị B",
    issue: "Hủy đơn hàng #ORD-99888",
    status: "open",
    createdAt: "25 phút trước",
  },
  {
    key: "3",
    ticketId: "TK-5419",
    customer: "Lê Văn C",
    issue: "Hỏi về chính sách đổi trả",
    status: "resolved",
    createdAt: "1 giờ trước",
  },
];


export const DATA_METRICS = [
    {
      label: "Hoàn thành NV",
      val: "23/30",
      pct: 76,
      color: "from-orange-500 to-amber-500",
      bg: "bg-orange-50",
    },
    {
      label: "Giải quyết Ticket",
      val: "45/50",
      pct: 90,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
    },
    {
      label: "Hài lòng KH",
      val: "96%",
      pct: 96,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
  ];
