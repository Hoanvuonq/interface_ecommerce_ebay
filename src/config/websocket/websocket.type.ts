/**
 * WebSocket connection states
 */
export enum WebSocketState {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTING = "DISCONNECTING",
  DISCONNECTED = "DISCONNECTED",
  RECONNECTING = "RECONNECTING",
  ERROR = "ERROR",
}

/**
 * WebSocket event types
 */
export interface WebSocketEventData<T = any> {
  type: string;
  data: T;
  timestamp: string;
  conversationId?: string;
  userId?: string;
}

/**
 * Typing indicator data
 */
export interface TypingIndicatorData {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
  timestamp: string;
}

/**
 * Presence data
 */
export interface PresenceData {
  userId: string;
  status: "ONLINE" | "OFFLINE" | "AWAY";
  lastSeen?: string;
  timestamp: string;
}

/**
 * Message data
 */
export interface MessageData {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: string;
  timestamp: string;
  attachments?: any[];
  reactions?: any[];
  isEdited?: boolean;
  replyTo?: string;
}

/**
 * Notification data
 */
export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}