/**
 * WebSocket Configuration
 */

import { WebSocketEventData } from "./websocket.type";

export const WEBSOCKET_CONFIG = {
  // WebSocket endpoint
  endpoint: process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws/chat`
    : "http://localhost:8888/ws/chat",

  // Connection settings
  connection: {
    connectTimeout: 10000,

    heartbeatIncoming: 10000, // Nhận heartbeat từ server
    heartbeatOutgoing: 10000, // Gửi heartbeat đến server

    // Reconnection settings
    reconnectDelay: 5000,
    maxReconnectAttempts: 5,

    // Debug mode
    debug: process.env.NODE_ENV === "development",
  },

  // STOMP settings
  stomp: {
    // Broker prefixes
    brokerURL: "/topic",
    userDestinationPrefix: "/user",
    applicationDestinationPrefix: "/app",

    // Queue prefixes
    queuePrefix: "/queue",
    topicPrefix: "/topic",
  },

  // Chat specific topics
  topics: {
    // Conversation messages
    conversation: (conversationId: string) =>
      `/topic/conversation/${conversationId}`,

    // Personal messages
    personalMessages: "/user/queue/messages",

    // Typing indicators
    typing: (conversationId: string) =>
      `/topic/conversation/${conversationId}/typing`,

    // User presence
    presence: "/topic/presence",

    // Notifications
    notifications: "/user/queue/notifications",

    // 💳 Payment realtime updates (NEW)
    payments: "/user/queue/payments",

    // System announcements
    announcements: "/topic/announcements",

    // Staff Support Queue (for customer support staff)
    staffSupportQueue: "/topic/staff/support-queue", // Broadcast to all staff
    staffSupportQueuePersonal: "/user/queue/staff/support-queue", // Personal queue for each staff
    staffStats: "/user/queue/staff/stats", // Stats updates for staff
  },

  // Destinations for sending messages
  destinations: {
    // Send message
    sendMessage: "/app/chat/send",

    // Typing indicator
    typing: (conversationId: string) => `/app/chat/${conversationId}/typing`,

    // Presence update
    presence: "/app/presence/update",

    // Join conversation
    joinConversation: (conversationId: string) =>
      `/app/chat/${conversationId}/join`,

    // Leave conversation
    leaveConversation: (conversationId: string) =>
      `/app/chat/${conversationId}/leave`,
  },

  // Staff Support Queue destinations (for subscribe mapping)
  staffSubscriptions: {
    // Subscribe to support queue updates
    supportQueue: "/staff/support-queue",
    // Subscribe to support queue stats
    supportQueueStats: "/queue/staff/stats",
  },

  // Message types
  messageTypes: {
    MESSAGE_SENT: "MESSAGE_SENT",
    MESSAGE_RECEIVED: "MESSAGE_RECEIVED",
    MESSAGE_UPDATED: "MESSAGE_UPDATED",
    MESSAGE_DELETED: "MESSAGE_DELETED",
    MESSAGE_REACTION: "MESSAGE_REACTION",
    TYPING_START: "TYPING_START",
    TYPING_STOP: "TYPING_STOP",
    USER_ONLINE: "USER_ONLINE",
    USER_OFFLINE: "USER_OFFLINE",
    USER_AWAY: "USER_AWAY",
    CONVERSATION_UPDATED: "CONVERSATION_UPDATED",
    CONVERSATION_STATUS_CHANGED: "CONVERSATION_STATUS_CHANGED",
    NOTIFICATION: "NOTIFICATION",
    // Staff Support Queue Events
    NEW_SUPPORT_CONVERSATION: "NEW_SUPPORT_CONVERSATION",
    CONVERSATION_ACCEPTED: "CONVERSATION_ACCEPTED",
    NEW_SUPPORT_MESSAGE: "NEW_SUPPORT_MESSAGE",
    SUPPORT_QUEUE_STATS_UPDATE: "SUPPORT_QUEUE_STATS_UPDATE",
    INITIAL_SUPPORT_QUEUE_DATA: "INITIAL_SUPPORT_QUEUE_DATA",
    // 💳 Payment Events (NEW)
    PAYMENT_STATUS_UPDATE: "PAYMENT_STATUS_UPDATE",
    BATCH_PAYMENT_STATUS_UPDATE: "BATCH_PAYMENT_STATUS_UPDATE",
    PAYMENT_EXPIRED: "PAYMENT_EXPIRED",
    PAYMENT_QR_UPDATE: "PAYMENT_QR_UPDATE",
  },

  // Error codes
  errorCodes: {
    CONNECTION_FAILED: "WS_CONNECTION_FAILED",
    AUTHENTICATION_FAILED: "WS_AUTH_FAILED",
    SUBSCRIPTION_FAILED: "WS_SUBSCRIPTION_FAILED",
    MESSAGE_SEND_FAILED: "WS_MESSAGE_SEND_FAILED",
    RECONNECTION_FAILED: "WS_RECONNECTION_FAILED",
  },
} as const;

/**
 * Get WebSocket URL with authentication
 */
export function getWebSocketURL(token?: string): string {
  const baseUrl = WEBSOCKET_CONFIG.endpoint;
  return token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
}

/**
 * Validate WebSocket configuration
 */
export function validateWebSocketConfig(): boolean {
  try {
    const { endpoint, connection } = WEBSOCKET_CONFIG;

    if (!endpoint) {
      console.error("WebSocket endpoint is not configured");
      return false;
    }

    if (connection.connectTimeout <= 0) {
      console.error("WebSocket connect timeout must be positive");
      return false;
    }

    if (connection.maxReconnectAttempts < 0) {
      console.error("WebSocket max reconnect attempts must be non-negative");
      return false;
    }

    return true;
  } catch (error) {
    console.error("WebSocket configuration validation failed:", error);
    return false;
  }
}

/**
 * Create STOMP headers with authentication
 */
export function createStompHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Parse WebSocket message
 */
export function parseWebSocketMessage<T = any>(
  message: any
): WebSocketEventData<T> | null {
  try {
    console.log("[parseWebSocketMessage] Raw message:", message);

    if (typeof message === "string") {
      const parsed = JSON.parse(message);
      console.log("[parseWebSocketMessage] Parsed from string:", parsed);
      return parsed;
    }

    if (message.body) {
      const parsed = JSON.parse(message.body);
      console.log("[parseWebSocketMessage] Parsed from message.body:", parsed);
      return parsed;
    }

    console.log("[parseWebSocketMessage] Returning message as-is:", message);
    return message;
  } catch (error) {
    console.error(
      "[parseWebSocketMessage] Failed to parse:",
      error,
      "Message:",
      message
    );
    return null;
  }
}

/**
 * Create WebSocket message
 */
export function createWebSocketMessage<T = any>(
  type: string,
  data: T,
  conversationId?: string,
  userId?: string
): WebSocketEventData<T> {
  return {
    type,
    data,
    timestamp: new Date().toISOString(),
    conversationId,
    userId,
  };
}
