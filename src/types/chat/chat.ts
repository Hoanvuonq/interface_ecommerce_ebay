
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'LOCATION' | 'PRODUCT' | 'SYSTEM' | 'REPLY';

/**
 * Định nghĩa cho trạng thái gửi/nhận tin nhắn.
 */
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'PENDING';

/**
 * Định nghĩa loại xóa tin nhắn.
 */
export type MessageDeletedType = 'DELETE_FOR_ME' | 'DELETE_FOR_EVERYONE';

/**
 * Định nghĩa các loại Cuộc trò chuyện.
 */
export type ConversationType = 'DIRECT' | 'GROUP' | 'SUPPORT' | 'ANNOUNCEMENT' | 'PRIVATE_GROUP';

/**
 * Định nghĩa trạng thái báo cáo (Report Status).
 */
export type ReportStatus = 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'REJECTED' | 'CLOSED';


/**
 * Thông tin chi tiết của một người tham gia.
 */
export interface Participant {
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role?: 'MEMBER' | 'ADMIN' | 'MODERATOR';
  joinedAt: string;
}

/**
 * Thông tin chi tiết của một tin nhắn.
 */
export interface Message {
  id: string;
  clientMessageId: string;
  type: MessageType;
  content?: string;
  timestamp: string;
  senderId: string; // userId của người gửi
  
  // Trạng thái xóa
  deletedAt?: string | null;
  deletedType?: MessageDeletedType | null;
  deletedBy?: string | null; // username của người xóa
  
  // Chi tiết file/media/product (dùng cho preview)
  fileName?: string;
  productName?: string;
  fileSize?: number;

  // Trạng thái gửi/đã đọc
  status: MessageStatus;
  readBy: string[]; // Danh sách userId đã đọc
}

/**
 * Thông tin chi tiết của một cuộc trò chuyện.
 */
export interface Conversation {
  id: string;
  type: ConversationType;
  participants: Participant[];
  lastMessage?: Message;
  lastMessageTime?: string;
  lastModifiedDate?: string; // fallback 1
  updatedAt?: string; // fallback 2
  isPinned: boolean;
  unreadCount: number;
  
  // Thêm các trường cho việc tìm kiếm/hiển thị
  name?: string; // Tên nhóm (nếu là GROUP)
  currentUserId?: string; // ID của người dùng hiện tại (dùng cho formatTitle)
}

/**
 * Thông tin cơ bản về người dùng (dùng cho format mention/status).
 */
export interface User {
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  lastSeen?: string;
  isOnline: boolean;
}

export const MS_IN_MINUTE = 60000;
export const MS_IN_HOUR = 3600000;
export const MS_IN_DAY = 86400000;
export const MS_IN_WEEK = 604800000;
export const ONLINE_THRESHOLD_MINUTES = 5;

export const CONVERSATION_TYPE_MAP: Record<ConversationType | string, string> = {
  DIRECT: "Trò chuyện riêng",
  GROUP: "Nhóm chat",
  SUPPORT: "Hỗ trợ khách hàng",
  ANNOUNCEMENT: "Thông báo",
  PRIVATE_GROUP: "Nhóm riêng tư",
};

export const MESSAGE_STATUS_MAP: Record<MessageStatus | string, string> = {
  SENT: "Đã gửi",
  DELIVERED: "Đã nhận",
  READ: "Đã đọc",
  FAILED: "Gửi thất bại",
  PENDING: "Đang chờ",
};

export const REPORT_STATUS_DISPLAY_MAP: Record<ReportStatus | string, string> = {
  PENDING: "Chờ xử lý",
  REVIEWING: "Đang xem xét",
  RESOLVED: "Đã giải quyết",
  REJECTED: "Từ chối",
  CLOSED: "Đã đóng",
};

export const REPORT_STATUS_COLOR_MAP: Record<ReportStatus | string, string> = {
  PENDING: "orange",
  REVIEWING: "blue",
  RESOLVED: "green",
  REJECTED: "red",
  CLOSED: "gray",
};

export const SENSITIVE_WORDS = ["spam", "scam", "hack", "virus"];