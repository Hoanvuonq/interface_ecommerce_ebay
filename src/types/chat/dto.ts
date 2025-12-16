export enum ParticipantRole {
  BUYER = "BUYER",
  SHOP = "SHOP",
  PLATFORM = "PLATFORM",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  MODERATOR = "MODERATOR",
}

export enum ConversationType {
  BUYER_TO_SHOP = "BUYER_TO_SHOP",
  BUYER_TO_PLATFORM = "BUYER_TO_PLATFORM",
  SHOP_TO_PLATFORM = "SHOP_TO_PLATFORM",
  GROUP = "GROUP",
  BUYER_TO_BUYER = "BUYER_TO_BUYER",
  SYSTEM = "SYSTEM",
  USER_TO_USER = "USER_TO_USER",
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  FILE = "FILE",
  AUDIO = "AUDIO",
  STICKER = "STICKER",
  PRODUCT_CARD = "PRODUCT_CARD",
  ORDER_CARD = "ORDER_CARD",
  VOUCHER_CARD = "VOUCHER_CARD",
  LOCATION = "LOCATION",
  SYSTEM = "SYSTEM",
}

export enum MessageStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
}

export enum ConversationStatus {
  ACTIVE = "ACTIVE",
  WAITING_FOR_STAFF = "WAITING_FOR_STAFF",
  ARCHIVED = "ARCHIVED",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
  SUSPENDED = "SUSPENDED",
}

export enum ReportStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export enum ReportReason {
  SPAM = "SPAM",
  HARASSMENT = "HARASSMENT",
  INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
  FAKE_PRODUCT = "FAKE_PRODUCT",
  SCAM = "SCAM",
  HATE_SPEECH = "HATE_SPEECH",
  VIOLENCE = "VIOLENCE",
  OTHER = "OTHER",
}

// ==================== BASE INTERFACES ====================

export interface BaseRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface BaseResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ==================== ATTACHMENT & REACTION DTOs ====================

export enum AttachmentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE",
}

export interface MessageAttachmentResponse {
  id?: string;
  messageId?: string;
  type: AttachmentType;
  fileName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // seconds
  metadata?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface MessageReactionResponse {
  id?: string;
  messageId?: string;
  userId: string;
  userName: string;
  emoji: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface ReactionSummaryResponse {
  emoji: string;
  count: number;
  userIds: string[];
  userNames?: string[];
  isReactedByMe?: boolean;
  createdDate?: string;
  lastModifiedDate?: string;
}

// ==================== PARTICIPANT DTOs ====================

export interface ParticipantResponse {
  id?: string;
  user: {
    userId: string;
    username: string;
    email?: string;
    image?: string;
    role?: string;
    fullNameBuyer?: string;
    fullNameEmployee?: string;
    shopId?: string;
    shopName?: string;
    logoUrl?: string;
  };
  role: ParticipantRole;
  nickname?: string;
  unreadCount?: number;
  isMuted?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  isActive?: boolean;
  lastReadAt?: string;
  joinedAt: string;
  leftAt?: string;
  addedByUserId?: string;
  isOnline?: boolean;
  presenceStatus?:
    | "ONLINE"
    | "IDLE"
    | "AWAY"
    | "DO_NOT_DISTURB"
    | "INVISIBLE"
    | "OFFLINE";
  lastSeen?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface AddParticipantRequest {
  userIds: string[];
  notificationMessage?: string; // Optional: Tin nhắn thông báo khi thêm participants
}

export interface UpdateNicknameRequest {
  nickname: string;
}

// ==================== CONVERSATION DTOs ====================

export interface ConversationResponse {
  id: string;
  conversationType: ConversationType;
  name?: string;
  avatarUrl?: string;
  status: ConversationStatus;
  lastMessageId?: string;
  lastMessageAt?: string; // ISO 8601 format
  lastMessagePreview?: string;
  totalMessages: number;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  isArchived: boolean;
  participants?: ParticipantResponse[];
  metadata?: string; // JSON string
  createdBy?: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  deleted?: boolean;
  version?: number;
}

export interface ConversationListResponse {
  id: string;
  conversationType: ConversationType;
  name?: string;
  avatarUrl?: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  contextProductId?: string;
  contextShopId?: string;
  status?: ConversationStatus; // Status của conversation (WAITING_FOR_STAFF, ACTIVE, etc.)
}

export interface CreateConversationRequest {
  conversationType: ConversationType;
  participantIds: string[];
  name?: string;
  avatarUrl?: string;
}

export interface UpdateConversationRequest {
  name?: string; // Max 255 chars
  avatarUrl?: string;
  isArchived?: boolean; // Archive/unarchive conversation
  isMuted?: boolean; // Mute/unmute notifications
  isPinned?: boolean; // Pin/unpin conversation
  metadata?: string; // JSON string for custom metadata
}

export interface GetConversationsRequest extends BaseRequest {
  conversationType?: ConversationType;
  status?: ConversationStatus;
  keyword?: string;
}

export interface FilterConversationsRequest {
  userId?: string;
  keyword?: string;
  status?: ConversationStatus;
  types?: ConversationType[];
  page?: number;
  size?: number;
  sort?: string;
}

export interface FilterConversationsCreatedByRequest {
  userId?: string;
  keyword?: string;
  createdBy?: string;
  status?: ConversationStatus;
  types?: ConversationType[];
  page?: number;
  size?: number;
  sort?: string;
}

// ==================== MESSAGE DTOs ====================

export interface MessageResponse {
  id: string;
  conversationId: string;
  user: {
    userId: string;
    username: string;
    email?: string;
    image?: string; // Avatar URL (backend uses 'image', not 'avatarUrl')
    role?: string;
    fullNameBuyer?: string;
    fullNameEmployee?: string;
    shopId?: string;
    shopName?: string;
    logoUrl?: string;
  };
  type: MessageType;
  content?: string; // Optional vì có thể chỉ có attachments
  status: MessageStatus;
  replyToMessageId?: string;
  replyToMessage?: MessageResponse;
  attachments?: MessageAttachmentResponse[];
  reactions?: MessageReactionResponse[];
  reactionsSummary?: ReactionSummaryResponse[];
  metadata?: string; // JSON string
  isDeleted: boolean;
  deletedType?: string; // DELETE_FOR_ME, DELETE_FOR_EVERYONE
  deletedAt?: string;
  isEdited: boolean;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  editedAt?: string;
  createdBy?: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  deleted: boolean;
  version?: number;
}

export interface SendMessageRequest {
  conversationId: string;
  type: MessageType;
  content?: string; // Optional, max 5000 chars (có thể chỉ gửi attachments)
  replyToMessageId?: string;
  metadata?: string; // JSON string
  clientMessageId?: string; // UUID from client (để xử lý duplicate, optimistic UI)
  attachments?: Array<{
    fileUrl: string; // Required: URL của file đã upload
    fileName?: string;
    fileSize?: number; // bytes
    mimeType?: string;
    thumbnailUrl?: string;
    width?: number; // px
    height?: number; // px
    duration?: number; // seconds (cho video/audio)
  }>;
}

export interface UpdateMessageRequest {
  content: string;
}

export interface DeleteMessageRequest {
  deleteType?: "DELETE_FOR_ME" | "DELETE_FOR_EVERYONE"; // Optional, default: "DELETE_FOR_ME"
}

export interface ReactMessageRequest {
  emoji: string;
  // Note: Backend tự động toggle (không cần action field)
  // Nếu user đã react emoji này -> bỏ reaction
  // Nếu chưa react -> thêm reaction mới
}

export interface MarkReadRequest {
  messageIds?: string[]; // Optional: Danh sách message IDs cần đánh dấu đã đọc. Nếu null/empty: đánh dấu TẤT CẢ
  lastReadMessageId?: string; // Optional: ID của tin nhắn cuối cùng mà user đã đọc
}

export interface GetMessagesRequest extends BaseRequest {
  conversationId: string;
  keyword?: string;
  messageType?: MessageType;
  fromDate?: string;
  toDate?: string;
}

export interface FindMessagesRequest extends BaseRequest {
  conversationId?: string;
  senderId?: string;
  keyword?: string;
  types?: string[];
  statuses?: string[];
  beforeTimestamp?: string;
}

// ==================== REPORT DTOs ====================

export interface ReportResponse {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterAvatar?: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar?: string;
  conversationId: string;
  messageId?: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  handledByAdminId?: string;
  adminNotes?: string;
  actionTaken?: string;
  evidence?: string;
  handledAt?: string;
  // Audit fields
  createdBy?: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  deleted?: boolean;
  version?: number;
}

export interface CreateReportRequest {
  reportedUserId: string;
  conversationId: string;
  messageId?: string;
  reason: ReportReason;
  description: string;
  evidence?: string[];
}

export interface UpdateReportStatusRequest {
  status: ReportStatus;
  adminNote?: string;
}

export interface GetReportsRequest extends BaseRequest {
  status?: ReportStatus;
  reason?: ReportReason;
  reporterId?: string;
  reportedUserId?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

// ==================== SHOP TEMPLATE DTOs ====================

export enum TemplateCategory {
  GREETING = "GREETING",
  PRODUCT_INFO = "PRODUCT_INFO",
  SHIPPING = "SHIPPING",
  PAYMENT = "PAYMENT",
  SUPPORT = "SUPPORT",
  CLOSING = "CLOSING",
  VIP = "VIP",
  PROMOTION = "PROMOTION",
  OTHER = "OTHER",
}

export interface TemplateResponse {
  id: string;
  shopId: string;
  name: string; // Backend dùng 'name', không phải 'title'
  shortcut?: string; // Phím tắt (VD: /hello, /thankyou)
  content: string;
  displayOrder?: number; // Thứ tự hiển thị
  isActive: boolean;
  usageCount: number;
  createdDate: string;
  lastModifiedDate: string;
  // Backend không có 'category' field
}

export interface CreateTemplateRequest {
  name: string; // Required, max 255 chars
  shortcut?: string; // Optional, max 50 chars
  content: string; // Required, max 5000 chars
  displayOrder?: number; // Optional, default: 0
  isActive?: boolean; // Optional, default: true
}

export interface UpdateTemplateRequest {
  name?: string; // Optional, max 255 chars
  shortcut?: string; // Optional, max 50 chars
  content?: string; // Optional, max 5000 chars
  displayOrder?: number; // Optional
  isActive?: boolean; // Optional
}

export interface GetTemplatesRequest extends BaseRequest {
  keyword?: string; // Tìm kiếm theo keyword (name hoặc content)
  isActive?: boolean;
  // Backend không có filter theo category
}

// ==================== SHOP SETTINGS DTOs ====================

export interface ShopChatSettingsResponse {
  id: string;
  shopId: string;
  isAutoReplyEnabled: boolean;
  isOfflineMessageEnabled: boolean;
  businessHoursStart: string;
  businessHoursEnd: string;
  workingDays: string;
  autoReplyMessage: string;
  offlineMessage: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface UpdateShopChatSettingsRequest {
  isAutoReplyEnabled?: boolean;
  isOfflineMessageEnabled?: boolean;
  businessHoursStart?: string;
  businessHoursEnd?: string;
  workingDays?: string;
  autoReplyMessage?: string;
  offlineMessage?: string;
}

// ==================== ADMIN STATISTICS DTOs ====================

export interface ChatStatisticsResponse {
  totalConversations: number;
  totalMessages: number;
  totalReports: number;
  activeConversations: number;
  pendingReports: number;
  conversationsByType: Record<ConversationType, number>;
  messagesByType: Record<MessageType, number>;
  reportsByStatus: Record<ReportStatus, number>;
  reportsByReason: Record<ReportReason, number>;
  dailyMessageCount: Array<{
    date: string;
    count: number;
  }>;
  topActiveUsers: Array<{
    userId: string;
    userName: string;
    messageCount: number;
    conversationCount: number;
  }>;
}

export interface GetChatStatisticsRequest {
  startDate?: string;
  endDate?: string;
  conversationType?: ConversationType;
}

// ==================== FILE UPLOAD DTOs ====================

export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  uploadedAt: string;
}

// ==================== WEBSOCKET DTOs ====================

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface PresenceUpdate {
  userId: string;
  status:
    | "ONLINE"
    | "OFFLINE"
    | "AWAY"
    | "IDLE"
    | "DO_NOT_DISTURB"
    | "INVISIBLE";
  lastSeenAt?: string;
  description?: string;
}

export interface PresenceStatusUpdateEvent {
  type: "PRESENCE_STATUS_UPDATE";
  userId: string;
  status:
    | "ONLINE"
    | "OFFLINE"
    | "AWAY"
    | "IDLE"
    | "DO_NOT_DISTURB"
    | "INVISIBLE";
  description?: string;
  timestamp: string;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  conversationId?: string;
  data: T;
  timestamp: string;
}

// ==================== SHARE CONTENT DTOs ====================

export interface ShareProductRequest {
  contextType: "PRODUCT";
  contextId: string;
  message?: string;
  metadata?: {
    productName: string;
    productPrice: number;
    productImage: string;
    productUrl?: string;
  };
}

export interface ShareOrderRequest {
  contextType: "ORDER";
  contextId: string;
  message?: string;
  metadata?: {
    orderNumber: string;
    orderStatus: string;
    orderTotal: number;
    orderDate: string;
  };
}

export interface ShareVoucherRequest {
  contextType: "VOUCHER";
  contextId: string;
  message?: string;
  metadata?: {
    voucherCode: string;
    voucherDiscount: string;
    voucherExpiry: string;
    voucherDescription: string;
  };
}

export type ShareContentRequest =
  | ShareProductRequest
  | ShareOrderRequest
  | ShareVoucherRequest;

// ==================== ERROR CODES ====================

export enum ChatErrorCode {
  CONVERSATION_NOT_FOUND = "CONVERSATION_NOT_FOUND",
  CONVERSATION_ACCESS_DENIED = "CONVERSATION_ACCESS_DENIED",
  MESSAGE_NOT_FOUND = "MESSAGE_NOT_FOUND",
  MESSAGE_EDIT_TIME_EXPIRED = "MESSAGE_EDIT_TIME_EXPIRED",
  NOT_CONVERSATION_ADMIN = "NOT_CONVERSATION_ADMIN",
  PARTICIPANT_ALREADY_EXISTS = "PARTICIPANT_ALREADY_EXISTS",
  PARTICIPANT_NOT_FOUND = "PARTICIPANT_NOT_FOUND",
  FILE_UPLOAD_FAILED = "FILE_UPLOAD_FAILED",
  ADMIN_ACCESS_REQUIRED = "ADMIN_ACCESS_REQUIRED",
  SHOP_SETTING_NOT_FOUND = "SHOP_SETTING_NOT_FOUND",
  TEMPLATE_NOT_FOUND = "TEMPLATE_NOT_FOUND",
  REPORT_NOT_FOUND = "REPORT_NOT_FOUND",
  INVALID_CONVERSATION_TYPE = "INVALID_CONVERSATION_TYPE",
  INVALID_MESSAGE_TYPE = "INVALID_MESSAGE_TYPE",
  WEBSOCKET_CONNECTION_FAILED = "WEBSOCKET_CONNECTION_FAILED",
}

export interface FilterRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProductCardSendRequest {
  conversationId: string;
  productId: string;
  message?: string;
  replyToMessageId?: string;
  clientMessageId?: string;
}

export interface OrderCardSendRequest {
  conversationId: string;
  orderId: string;
  message?: string;
  replyToMessageId?: string;
  clientMessageId?: string;
}

// ==================== QUICK REPLY DTOs ====================

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  category: string;
}
