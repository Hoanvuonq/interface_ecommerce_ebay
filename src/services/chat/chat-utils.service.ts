import {
  Message,
  Participant,
  Conversation,
  User,
  ConversationType,
  MessageStatus,
  ReportStatus,
  MS_IN_MINUTE,
  MS_IN_HOUR,
  MS_IN_DAY,
  CONVERSATION_TYPE_MAP,
  MESSAGE_STATUS_MAP,
  REPORT_STATUS_DISPLAY_MAP,
  REPORT_STATUS_COLOR_MAP,
  ONLINE_THRESHOLD_MINUTES,
  MS_IN_WEEK,
  SENSITIVE_WORDS,
} from "@/types/chat/chat";


export function isMessageDeleted(
  message: Message,
  currentUsername?: string
): boolean {
  if (message.deletedAt) {
    return true;
  }

  const isDeletedForMe =
    message.deletedType === "DELETE_FOR_ME" &&
    !!message.deletedBy &&
    !!currentUsername &&
    message.deletedBy === currentUsername;

  return Boolean(isDeletedForMe);
}

/**
 * Format conversation title
 */
export function formatConversationTitle(
  participants: Participant[],
  currentUserId: string,
  maxLength = 30
): string {
  if (!participants || participants.length === 0) {
    return "Cuộc trò chuyện";
  }

  const otherParticipants = participants.filter(
    (p) => p.userId !== currentUserId
  );

  if (otherParticipants.length === 0) {
    return "Bạn";
  }

  if (otherParticipants.length === 1) {
    const p = otherParticipants[0];
    return p.displayName || p.username || "Người dùng";
  }

  // Multiple participants
  const names = otherParticipants
    .slice(0, 3)
    .map((p) => p.displayName || p.username || "Người dùng")
    .join(", ");

  let title = names;

  if (otherParticipants.length > 3) {
    title = `${names} và ${otherParticipants.length - 3} người khác`;
  }

  return truncateText(title, maxLength);
}

/**
 * Get conversation type display name
 */
export function getConversationTypeDisplay(
  type: ConversationType | string
): string {
  return CONVERSATION_TYPE_MAP[type as ConversationType] || type;
}

/**
 * Get message status display
 */
export function getMessageStatusDisplay(
  status: MessageStatus | string
): string {
  return MESSAGE_STATUS_MAP[status as MessageStatus] || status;
}

/**
 * Get report status display
 */
export function getReportStatusDisplay(status: ReportStatus | string): string {
  return REPORT_STATUS_DISPLAY_MAP[status as ReportStatus] || status;
}

/**
 * Get report status color
 */
export function getReportStatusColor(status: ReportStatus | string): string {
  return REPORT_STATUS_COLOR_MAP[status as ReportStatus] || "default";
}

/**
 * Check if user is online
 */
export function isUserOnline(
  lastSeen: string | undefined,
  threshold = ONLINE_THRESHOLD_MINUTES
): boolean {
  if (!lastSeen) return false;
  const lastSeenTime = new Date(lastSeen).getTime();
  const now = new Date().getTime();
  const diffMinutes = (now - lastSeenTime) / (1000 * 60);
  return diffMinutes <= threshold;
}

/**
 * Format user status
 */
export function formatUserStatus(lastSeen: string | undefined): string {
  if (!lastSeen) return "Không xác định";

  if (isUserOnline(lastSeen)) {
    return "Đang hoạt động";
  }

  const date = new Date(lastSeen);
  const now = new Date();
  const diffMilliseconds = now.getTime() - date.getTime();

  if (diffMilliseconds < MS_IN_HOUR) {
    const minutes = Math.floor(diffMilliseconds / MS_IN_MINUTE);
    return `Hoạt động ${minutes} phút trước`;
  }

  if (diffMilliseconds < MS_IN_DAY) {
    const hours = Math.floor(diffMilliseconds / MS_IN_HOUR);
    return `Hoạt động ${hours} giờ trước`;
  }

  if (diffMilliseconds < MS_IN_WEEK) {
    const days = Math.floor(diffMilliseconds / MS_IN_DAY);
    return `Hoạt động ${days} ngày trước`;
  }

  return date.toLocaleDateString("vi-VN");
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string | undefined,
  maxLength: number
): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Parse mention from message (Trích xuất User ID)
 */
export function parseMentions(message: string): string[] {
  const mentionRegex = /@\[[^\]]+\]\(([^)]+)\)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(message)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
}

/**
 * Format message with mentions (Thay thế mention bằng @DisplayName)
 */
export function formatMessageWithMentions(
  message: string,
  users: Record<string, Pick<User, "displayName" | "username">>
): string {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  return message.replace(mentionRegex, (match, displayName, userId) => {
    const user = users[userId];
    const name = user?.displayName || user?.username || displayName;
    return `@${name}`;
  });
}

/**
 * Check if message contains sensitive content
 */
export function containsSensitiveContent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return SENSITIVE_WORDS.some((word) => lowerMessage.includes(word));
}

/**
 * Generate conversation preview
 */
export function generateConversationPreview(
  lastMessage: Message | undefined,
  maxLength = 50
): string {
  if (!lastMessage) return "Chưa có tin nhắn";

  let preview = "";

  switch (lastMessage.type) {
    case "TEXT":
      preview = lastMessage.content || "";
      break;
    case "IMAGE":
      preview = "📷 Hình ảnh";
      break;
    case "VIDEO":
      preview = "🎥 Video";
      break;
    case "AUDIO":
      preview = "🎵 Âm thanh";
      break;
    case "FILE":
      preview = `📎 ${lastMessage.fileName || "Tệp đính kèm"}`;
      break;
    case "LOCATION":
      preview = "📍 Vị trí";
      break;
    case "PRODUCT":
      preview = `🛍️ ${lastMessage.productName || "Sản phẩm"}`;
      break;
    case "SYSTEM":
      preview = "⚙️ Thông báo hệ thống";
      break;
    case "REPLY":
      preview = "↩️ Đã trả lời";
      break;
    default:
      preview = lastMessage.content || "Tin nhắn";
  }

  return truncateText(preview, maxLength);
}

/**
 * Sort conversations by priority
 */
export function sortConversationsByPriority(
  conversations: Conversation[]
): Conversation[] {
  return conversations.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

    const getTime = (c: Conversation) =>
      new Date(
        c.lastMessageTime || c.lastModifiedDate || c.updatedAt || 0
      ).getTime();

    const aTime = getTime(a);
    const bTime = getTime(b);

    return bTime - aTime;
  });
}

function searchParticipantNames(
  participants: Participant[],
  searchTerm: string
): boolean {
  if (!participants || participants.length === 0) return false;

  return participants.some((p) => {
    const name = (p.displayName || p.username || "").toLowerCase();
    return name.includes(searchTerm);
  });
}

/**
 * Filter conversations by search keyword (Lọc cuộc trò chuyện theo từ khóa)
 */
export function filterConversationsByKeyword(
  conversations: Conversation[],
  keyword: string
): Conversation[] {
  if (!keyword.trim()) return conversations;

  const searchTerm = keyword.toLowerCase().trim();

  return conversations.filter((conversation) => {
    const title = formatConversationTitle(
      conversation.participants,
      conversation.currentUserId || ""
    ).toLowerCase();
    if (title.includes(searchTerm)) return true;
    const lastMessageContent = (
      conversation.lastMessage?.content || ""
    ).toLowerCase();
    if (lastMessageContent.includes(searchTerm)) return true;
    if (searchParticipantNames(conversation.participants, searchTerm))
      return true;

    return false;
  });
}
