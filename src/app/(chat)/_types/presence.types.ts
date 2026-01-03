/**
 * User Presence Status Types
 * Trạng thái online/offline của user
 */

export enum UserPresenceStatus {
  /**
   * 🟢 Online - User đang active
   */
  ONLINE = "ONLINE",

  /**
   * 🟡 Idle - User không active > 5 phút
   */
  IDLE = "IDLE",

  /**
   * 🟠 Away - User không active > 15 phút
   */
  AWAY = "AWAY",

  /**
   * 🔴 Do Not Disturb - User set DND
   */
  DO_NOT_DISTURB = "DO_NOT_DISTURB",

  /**
   * ⚪ Invisible - User online nhưng hiển thị offline
   */
  INVISIBLE = "INVISIBLE",

  /**
   * ⚫ Offline - User thực sự offline
   */
  OFFLINE = "OFFLINE",
}

export interface UserPresence {
  userId: string;
  status: UserPresenceStatus;
  lastSeen?: string;
  description?: string;
}

export interface PresenceUpdateEvent {
  type: "PRESENCE_STATUS_UPDATE" | "USER_ONLINE" | "USER_OFFLINE";
  userId: string;
  status?: UserPresenceStatus;
  description?: string;
  timestamp: string;
}

/**
 * Check if status indicates user is available (can receive messages)
 */
export function isAvailable(status: UserPresenceStatus): boolean {
  return status === UserPresenceStatus.ONLINE || status === UserPresenceStatus.IDLE;
}

/**
 * Check if status indicates user is active
 */
export function isActive(status: UserPresenceStatus): boolean {
  return status === UserPresenceStatus.ONLINE;
}

/**
 * Check if status indicates user is offline
 */
export function isOffline(status: UserPresenceStatus): boolean {
  return status === UserPresenceStatus.OFFLINE;
}

/**
 * Get status display text
 */
export function getStatusText(status: UserPresenceStatus): string {
  const statusMap: Record<UserPresenceStatus, string> = {
    [UserPresenceStatus.ONLINE]: "Đang hoạt động",
    [UserPresenceStatus.IDLE]: "Đang rảnh",
    [UserPresenceStatus.AWAY]: "Đang vắng mặt",
    [UserPresenceStatus.DO_NOT_DISTURB]: "Không làm phiền",
    [UserPresenceStatus.INVISIBLE]: "Ẩn",
    [UserPresenceStatus.OFFLINE]: "Offline",
  };
  return statusMap[status] || "Không xác định";
}

/**
 * Get status color
 */
export function getStatusColor(status: UserPresenceStatus): string {
  const colorMap: Record<UserPresenceStatus, string> = {
    [UserPresenceStatus.ONLINE]: "#52c41a", // Green
    [UserPresenceStatus.IDLE]: "#faad14", // Yellow
    [UserPresenceStatus.AWAY]: "#fa8c16", // Orange
    [UserPresenceStatus.DO_NOT_DISTURB]: "#f5222d", // Red
    [UserPresenceStatus.INVISIBLE]: "#8c8c8c", // Gray
    [UserPresenceStatus.OFFLINE]: "#8c8c8c", // Gray
  };
  return colorMap[status] || "#8c8c8c";
}

/**
 * Get status icon
 */
export function getStatusIcon(status: UserPresenceStatus): string {
  const iconMap: Record<UserPresenceStatus, string> = {
    [UserPresenceStatus.ONLINE]: "🟢",
    [UserPresenceStatus.IDLE]: "🟡",
    [UserPresenceStatus.AWAY]: "🟠",
    [UserPresenceStatus.DO_NOT_DISTURB]: "🔴",
    [UserPresenceStatus.INVISIBLE]: "⚪",
    [UserPresenceStatus.OFFLINE]: "⚫",
  };
  return iconMap[status] || "⚫";
}

