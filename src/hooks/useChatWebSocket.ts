// useChatWebSocket.ts

import { useCallback } from "react";
import { useWebSocketContext } from "@/providers/WebSocketProvider";
export function useChatWebSocket() {
  const { connected, subscribe, sendMessage } = useWebSocketContext();

  const subscribeToConversation = useCallback(
    (conversationId: string, callback: (message: unknown) => void) => {
      return subscribe(`/topic/conversation/${conversationId}`, callback);
    },
    [subscribe]
  );

  const subscribeToPersonalMessages = useCallback(
    (callback: (message: unknown) => void) => {
      return subscribe("/user/queue/messages", callback);
    },
    [subscribe]
  );

  const subscribeToPresence = useCallback(
    (callback: (presence: unknown) => void) => {
      return subscribe("/topic/presence", callback);
    },
    [subscribe]
  );

  const subscribeToTyping = useCallback(
    (conversationId: string, callback: (typing: unknown) => void) => {
      return subscribe(`/topic/conversation/${conversationId}/typing`, callback);
    },
    [subscribe]
  );
  
  const subscribeToConversationUpdates = useCallback(
    (callback: (event: unknown) => void) => {
      return subscribe("/user/queue/conversations", callback);
    },
    [subscribe]
  );
  
  const subscribeToNotifications = useCallback(
    (callback: (notification: unknown) => void) => {
      return subscribe("/user/queue/notifications", callback);
    },
    [subscribe]
  );
  
  const subscribeToSupportQueue = useCallback(
    (callback: (event: unknown) => void) => {
      return subscribe("/topic/staff/support-queue", callback);
    },
    [subscribe]
  );
  
  const subscribeToSupportQueuePersonal = useCallback(
    (callback: (event: unknown) => void) => {
      return subscribe("/user/queue/staff/support-queue", callback);
    },
    [subscribe]
  );
  
  const subscribeToSupportQueueStats = useCallback(
    (callback: (stats: unknown) => void) => {
      return subscribe("/user/queue/staff/stats", callback);
    },
    [subscribe]
  );
  
  // 💳 Payment realtime subscription (NEW)
  const subscribeToPayments = useCallback(
    (callback: (payment: unknown) => void) => {
      return subscribe("/user/queue/payments", callback);
    },
    [subscribe]
  );

  // --- MESSAGE SENDING ---
  const sendTypingIndicator = useCallback(
    (conversationId: string, isTyping: boolean, userId: string) => {
      sendMessage(`/app/chat/${conversationId}/typing`, { isTyping, userId });
    },
    [sendMessage]
  );

  const updatePresence = useCallback(
    (status: "ONLINE" | "OFFLINE" | "AWAY") => {
      sendMessage("/app/presence/update", { status });
    },
    [sendMessage]
  );

  return {
    connected,
    subscribeToConversation,
    subscribeToPersonalMessages,
    subscribeToPresence,
    subscribeToTyping,
    subscribeToConversationUpdates,
    subscribeToNotifications,
    subscribeToSupportQueue,
    subscribeToSupportQueuePersonal,
    subscribeToSupportQueueStats,
    subscribeToPayments,
    sendTypingIndicator,
    updatePresence,
  };
}