import { RoleEnum } from "@/auth/_types/auth";
import {
  ConversationType,
  ConversationStatus,
  MessageType,
  MessageStatus,
  ParticipantRole,
  ReportStatus,
  ReportReason,
  TemplateCategory,
  ReportResponse,
} from "../_types/chat.dto";

// ==================== CORE TYPES ====================

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: RoleEnum;
  isOnline: boolean;
  lastSeenAt?: string;
  createdDate: string; // Backend dùng createdDate
}

export interface Participant {
  user: ChatUser;
  role: ParticipantRole;
  nickname?: string;
  isOnline: boolean;
  lastSeenAt?: string;
  joinedAt: string;
}

export interface Conversation {
  id: string;
  conversationType: ConversationType;
  name?: string;
  avatarUrl?: string;
  status: ConversationStatus;
  lastMessageId?: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  totalMessages: number;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  isArchived: boolean;
  contextProductId?: string;
  contextOrderId?: string;
  contextShopId?: string;
  participants: Participant[];
  metadata?: Record<string, any>;
  createdDate: string;
  lastModifiedDate: string;
}

export interface MessageAttachment {
  id?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface MessageReaction {
  id?: string;
  emoji: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdDate: string; // Backend dùng createdDate
}

export interface Message {
  id: string;
  conversationId: string;
  user: ChatUser;
  type: MessageType;
  content: string;
  status: MessageStatus;
  sentAt: string;
  readAt?: string;
  deliveredAt?: string;
  isDeleted: boolean;
  deletedType?: string; // DELETE_FOR_ME, DELETE_FOR_EVERYONE
  deletedBy?: string; // Username của user đã xóa (dùng cho DELETE_FOR_ME)
  deletedAt?: string;
  isEdited: boolean;
  editedAt?: string;
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
  reactionsSummary: Array<{
    emoji: string;
    count: number;
    userIds: string[];
  }>;
  replyToMessageId?: string;
  replyToMessage?: Message;
  metadata?: Record<string, any>;
  clientMessageId?: string;
}

export interface Report {
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
  evidence: string[];
  adminNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  createdDate: string; // Backend dùng createdDate
  lastModifiedDate?: string; // Backend dùng lastModifiedDate
}

export interface Template {
  id: string;
  shopId: string;
  title: string;
  content: string;
  category: TemplateCategory;
  isActive: boolean;
  usageCount: number;
  createdDate: string; // Backend dùng createdDate
  lastModifiedDate?: string; // Backend dùng lastModifiedDate
}

export interface ShopChatSettings {
  id: string;
  shopId: string;
  isAutoReplyEnabled: boolean;
  isOfflineMessageEnabled: boolean;
  businessHoursStart: string;
  businessHoursEnd: string;
  workingDays: string[];
  autoReplyMessage: string;
  offlineMessage: string;
  createdDate: string; // Backend dùng createdDate
  lastModifiedDate?: string; // Backend dùng lastModifiedDate
}

// ==================== FILTER & SEARCH TYPES ====================

export interface ConversationFilters {
  type?: ConversationType;
  status?: ConversationStatus;
  keyword?: string;
  participantId?: string;
  startDate?: string;
  endDate?: string;
  hasUnread?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface MessageFilters {
  conversationId: string;
  type?: MessageType;
  senderId?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  hasAttachments?: boolean;
  hasReactions?: boolean;
}

export interface ReportFilters {
  status?: ReportStatus;
  reason?: ReportReason;
  reporterId?: string;
  reportedUserId?: string;
  conversationId?: string;
  startDate?: string;
  endDate?: string;
}

export interface TemplateFilters {
  category?: TemplateCategory;
  keyword?: string;
  isActive?: boolean;
  shopId?: string;
}

// ==================== STATISTICS TYPES ====================

export interface ChatStatistics {
  totalConversations: number;
  totalMessages: number;
  totalReports: number;
  totalUsers: number;
  activeConversations: number;
  pendingReports: number;
  averageResponseTime: number;
  conversationsByType: Record<ConversationType, number>;
  messagesByType: Record<MessageType, number>;
  reportsByStatus: Record<ReportStatus, number>;
  reportsByReason: Record<ReportReason, number>;
  dailyStats: Array<{
    date: string;
    conversations: number;
    messages: number;
    reports: number;
  }>;
  topActiveUsers: Array<{
    userId: string;
    userName: string;
    userAvatar?: string;
    messageCount: number;
    conversationCount: number;
    lastActiveAt: string;
  }>;
  topReportedUsers: Array<{
    userId: string;
    userName: string;
    userAvatar?: string;
    reportCount: number;
    lastReportAt: string;
  }>;
}

export interface ConversationStatistics {
  id: string;
  totalMessages: number;
  totalParticipants: number;
  averageResponseTime: number;
  messagesByType: Record<MessageType, number>;
  participantActivity: Array<{
    userId: string;
    userName: string;
    messageCount: number;
    lastMessageAt: string;
  }>;
  dailyActivity: Array<{
    date: string;
    messageCount: number;
  }>;
}

// ==================== UI STATE TYPES ====================

export interface ChatUIState {
  selectedConversationId?: string;
  isTyping: boolean;
  typingUsers: Array<{
    userId: string;
    userName: string;
  }>;
  onlineUsers: string[];
  unreadCounts: Record<string, number>;
  lastSeenMessages: Record<string, string>;
}

export interface ConversationListState {
  conversations: Conversation[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  page: number;
  filters: ConversationFilters;
}

export interface MessageListState {
  messages: Message[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  page: number;
  optimisticMessages: Message[];
}

export interface ReportListState {
  reports: Report[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  page: number;
  filters: ReportFilters;
}

// ==================== WEBSOCKET TYPES ====================

export interface WebSocketEvent<T = any> {
  type: WebSocketEventType;
  conversationId?: string;
  userId?: string;
  data: T;
  timestamp: string;
}

export enum WebSocketEventType {
  MESSAGE_SENT = "MESSAGE_SENT",
  MESSAGE_DELIVERED = "MESSAGE_DELIVERED",
  MESSAGE_READ = "MESSAGE_READ",
  MESSAGE_DELETED = "MESSAGE_DELETED",
  MESSAGE_EDITED = "MESSAGE_EDITED",
  MESSAGE_REACTION_ADDED = "MESSAGE_REACTION_ADDED",
  MESSAGE_REACTION_REMOVED = "MESSAGE_REACTION_REMOVED",
  TYPING_START = "TYPING_START",
  TYPING_STOP = "TYPING_STOP",
  USER_ONLINE = "USER_ONLINE",
  USER_OFFLINE = "USER_OFFLINE",
  CONVERSATION_CREATED = "CONVERSATION_CREATED",
  CONVERSATION_UPDATED = "CONVERSATION_UPDATED",
  CONVERSATION_ARCHIVED = "CONVERSATION_ARCHIVED",
  PARTICIPANT_ADDED = "PARTICIPANT_ADDED",
  PARTICIPANT_REMOVED = "PARTICIPANT_REMOVED",
  PARTICIPANT_ROLE_CHANGED = "PARTICIPANT_ROLE_CHANGED",
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface PresenceEvent {
  userId: string;
  status: "ONLINE" | "OFFLINE" | "AWAY" | "IDLE" | "DO_NOT_DISTURB" | "INVISIBLE";
  lastSeenAt?: string;
  description?: string;
}

export interface PresenceStatusUpdateEvent {
  type: "PRESENCE_STATUS_UPDATE";
  userId: string;
  status: "ONLINE" | "OFFLINE" | "AWAY" | "IDLE" | "DO_NOT_DISTURB" | "INVISIBLE";
  description?: string;
  timestamp: string;
}

// ==================== FORM TYPES ====================

export interface SendMessageForm {
  content: string;
  type: MessageType;
  attachments: File[];
  replyToMessageId?: string;
}

export interface CreateConversationForm {
  type: ConversationType;
  recipientId: string;
  name?: string;
  initialMessage?: string;
  contextProductId?: string;
  contextOrderId?: string;
}

export interface CreateReportForm {
  reportedUserId: string;
  conversationId: string;
  messageId?: string;
  reason: ReportReason;
  description: string;
  evidence: File[];
}

export interface CreateTemplateForm {
  title: string;
  content: string;
  category: TemplateCategory;
  isActive: boolean;
}

export interface UpdateShopSettingsForm {
  isAutoReplyEnabled: boolean;
  isOfflineMessageEnabled: boolean;
  businessHoursStart: string;
  businessHoursEnd: string;
  workingDays: string[];
  autoReplyMessage: string;
  offlineMessage: string;
}

// ==================== PAGINATION TYPES ====================

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ==================== UTILITY TYPES ====================

export type ConversationWithLastMessage = Conversation & {
  lastMessage?: Message;
  recipient?: Participant;
};

export type MessageWithSender = Message & {
  sender: Participant;
};

export type ReportWithDetails = Report & {
  reporter: User;
  reportedUser: User;
  conversation: Conversation;
  message?: Message;
};

// ==================== COMPONENT PROPS TYPES ====================

export interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  loading?: boolean;
  error?: string;
}

export interface MessageListProps {
  messages: Message[];
  conversationId: string;
  currentUserId: string;
  onSendMessage: (content: string, type?: MessageType) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactMessage: (messageId: string, emoji: string) => void;
  loading?: boolean;
  error?: string;
}

export interface ChatWindowProps {
  conversation?: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, type?: MessageType) => void;
  onLoadMoreMessages: () => void;
  loading?: boolean;
  error?: string;
}

export interface ReportTableProps {
  reports: Report[];
  onUpdateReportStatus: (reportId: string, status: ReportStatus, note?: string) => void;
  onDeleteReport: (reportId: string) => void;
  onViewReport: (report: Report) => void;
  loading?: boolean;
  error?: string;
}

// ==================== HOOK RETURN TYPES ====================

export interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  createConversation: (data: CreateConversationForm) => Promise<Conversation>;
  updateConversation: (id: string, data: Partial<Conversation>) => Promise<Conversation>;
  archiveConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  sendMessage: (data: SendMessageForm) => Promise<Message>;
  editMessage: (id: string, content: string) => Promise<Message>;
  deleteMessage: (id: string) => Promise<void>;
  reactMessage: (id: string, emoji: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
}

export interface UseReportsReturn {
  reports: ReportResponse[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  createReport: (data: CreateReportForm) => Promise<Report>;
  updateReportStatus: (id: string, status: ReportStatus, note?: string) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
}

export interface UseWebSocketReturn {
  connected: boolean;
  error?: string;
  sendMessage: (message: any) => void;
  subscribe: (topic: string, callback: (message: any) => void) => () => void;
  disconnect: () => void;
}

// ==================== CONSTANTS ====================

export const MESSAGE_TYPES = Object.values(MessageType);
export const CONVERSATION_TYPES = Object.values(ConversationType);
export const REPORT_REASONS = Object.values(ReportReason);
export const REPORT_STATUSES = Object.values(ReportStatus);
export const TEMPLATE_CATEGORIES = Object.values(TemplateCategory);

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const SUPPORTED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg'];
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

export const EMOJI_LIST = [
  '👍', '👎', '❤️', '😂', '😮', '😢', '😡', '👏', '🎉', '🔥',
  '💯', '✅', '❌', '⭐', '💎', '🚀', '💪', '🙏', '👌', '✨'
];

export const WEBSOCKET_ENDPOINTS = {
  CHAT: '/ws/chat',
  NOTIFICATIONS: '/ws/notifications',
  PRESENCE: '/ws/presence',
} as const;

export const API_ENDPOINTS = {
  CONVERSATIONS: '/api/v1/chat/conversations',
  MESSAGES: '/api/v1/chat/messages',
  CUSTOMER_SUPPORT: '/api/v1/chat/customer-support',
  REPORTS: '/api/v1/chat/reports',
  ADMIN_REPORTS: '/api/v1/chat/admin/reports',
  TEMPLATES: '/api/v1/chat/shop/templates',
  SETTINGS: '/api/v1/chat/shop/settings',
  UPLOAD: '/api/v1/chat/upload',
  STATISTICS: '/api/v1/chat/admin/statistics',
  ADMIN_CONVERSATIONS: '/api/v1/chat/admin/conversations',
  ADMIN_MESSAGES: '/api/v1/chat/admin/messages',
} as const;

export interface ChatUser {
  userId: string;
  username: string;
  image: string;
  email: string;
  roles?: (RoleEnum | string)[];
  role?: RoleEnum | string;
  roleName?: RoleEnum | string;
  fullNameBuyer: string;
  fullNameEmployee: string;
  shopId: string;
  shopName: string;
  logoUrl: string;
}
