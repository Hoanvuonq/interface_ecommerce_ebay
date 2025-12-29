export interface Task {
  key: string;
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  dueDate: string;
  department: string;
}

export interface SupportTicket {
  key: string;
  ticketId: string;
  customer: string;
  issue: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
}
