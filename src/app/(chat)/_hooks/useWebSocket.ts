/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { WebSocketService } from "../_services";
import {
  Message,
  WebSocketEvent,
  TypingEvent,
  PresenceEvent,
} from "../_types/chat.type";

/**
 * Hook để quản lý WebSocket connection
 */
export function useWebSocket(token?: string) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string>();
  const wsRef = useRef<WebSocketService>(undefined);
  const subscriptionsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    if (!token) return;

    const ws = WebSocketService.getInstance();
    wsRef.current = ws;
    const currentSubscriptions = subscriptionsRef.current;

    const connect = async () => {
      try {
        await ws.connect(token);
        setConnected(true);
        setError(undefined);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "WebSocket connection failed";
        setError(errorMessage);
        setConnected(false);
      }
    };

    connect();

    return () => {
      // Cleanup subscriptions
      currentSubscriptions.forEach((unsubscribe) => unsubscribe());
      currentSubscriptions.clear();

      ws.disconnect();
      setConnected(false);
    };
  }, [token]);

  const subscribe = useCallback(
    (topic: string, callback: (message: any) => void) => {
      if (!wsRef.current || !connected) {
        console.warn("WebSocket not connected, cannot subscribe to", topic);
        return () => {};
      }

      try {
        const unsubscribe = wsRef.current.subscribe(topic, callback);
        subscriptionsRef.current.set(topic, unsubscribe);
        return unsubscribe;
      } catch (err) {
        console.error("Failed to subscribe to", topic, err);
        return () => {};
      }
    },
    [connected]
  );

  const sendMessage = useCallback(
    (message: any) => {
      if (!wsRef.current || !connected) {
        console.warn("WebSocket not connected, cannot send message");
        return;
      }

      try {
        wsRef.current.send("/app/message", message);
      } catch (err) {
        console.error("Failed to send WebSocket message:", err);
      }
    },
    [connected]
  );

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      const currentSubscriptions = subscriptionsRef.current;
      currentSubscriptions.forEach((unsubscribe) => unsubscribe());
      currentSubscriptions.clear();
      wsRef.current.disconnect();
      setConnected(false);
    }
  }, []);

  return {
    connected,
    error,
    subscribe,
    sendMessage,
    disconnect,
  };
}

/**
 * Hook để lắng nghe tin nhắn mới trong conversation
 */
export function useConversationMessages(
  conversationId: string,
  token?: string
) {
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const { subscribe, connected } = useWebSocket(token);

  useEffect(() => {
    if (!conversationId || !connected) return;

    const unsubscribe = subscribe(
      `/topic/conversation/${conversationId}`,
      (event: WebSocketEvent<Message>) => {
        if (event.type === "MESSAGE_SENT" && event.data) {
          setNewMessages((prev) => [...prev, event.data]);
        }
      }
    );

    return unsubscribe;
  }, [conversationId, connected, subscribe]);

  const clearNewMessages = useCallback(() => {
    setNewMessages([]);
  }, []);

  return {
    newMessages,
    clearNewMessages,
  };
}

/**
 * Hook để quản lý typing indicator
 */
export function useTypingIndicator(conversationId: string, token?: string) {
  const [typingUsers, setTypingUsers] = useState<
    Array<{ userId: string; userName: string }>
  >([]);
  const { subscribe, connected } = useWebSocket(token);
  const wsRef = useRef<WebSocketService>(undefined);

  useEffect(() => {
    wsRef.current = WebSocketService.getInstance();
  }, []);

  useEffect(() => {
    if (!conversationId || !connected) return;

    const unsubscribe = subscribe(
      `/topic/conversation/${conversationId}/typing`,
      (event: TypingEvent) => {
        setTypingUsers((prev) => {
          if (event.isTyping) {
            // Add user to typing list if not already there
            const exists = prev.some((user) => user.userId === event.userId);
            if (!exists) {
              return [
                ...prev,
                { userId: event.userId, userName: event.userName },
              ];
            }
            return prev;
          } else {
            // Remove user from typing list
            return prev.filter((user) => user.userId !== event.userId);
          }
        });
      }
    );

    return unsubscribe;
  }, [conversationId, connected, subscribe]);

  const sendTypingIndicator = useCallback(
    (isTyping: boolean, userId: string) => {
      if (wsRef.current && connected) {
        wsRef.current.sendTypingIndicator(conversationId, isTyping, userId);
      }
    },
    [conversationId, connected]
  );

  return {
    typingUsers,
    sendTypingIndicator,
  };
}

/**
 * Hook để quản lý user presence
 */
export function usePresence(token?: string) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [userStatuses, setUserStatuses] = useState<Map<string, string>>(new Map());
  const { subscribe, connected } = useWebSocket(token);
  const wsRef = useRef<WebSocketService>(undefined);

  useEffect(() => {
    wsRef.current = WebSocketService.getInstance();
  }, []);

  useEffect(() => {
    if (!connected) return;

    // Subscribe to general presence topic
    const unsubscribeGeneral = subscribe("/topic/presence", (event: any) => {
      // Handle PRESENCE_STATUS_UPDATE event
      if (event.type === "PRESENCE_STATUS_UPDATE") {
        setUserStatuses((prev) => {
          const newMap = new Map(prev);
          newMap.set(event.userId, event.status);
          return newMap;
        });

        // Update online users set
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          if (event.status === "ONLINE" || event.status === "IDLE") {
            newSet.add(event.userId);
          } else if (event.status === "OFFLINE") {
            newSet.delete(event.userId);
          }
          return newSet;
        });
      }
      // Handle legacy PresenceEvent
      else if (event.userId) {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          if (event.status === "ONLINE" || event.status === "IDLE") {
            newSet.add(event.userId);
          } else {
            newSet.delete(event.userId);
          }
          return newSet;
        });
      }
    });

    // Subscribe to personal presence queue
    const unsubscribePersonal = subscribe("/user/queue/presence", (event: any) => {
      // Handle PRESENCE_STATUS_UPDATE event
      if (event.type === "PRESENCE_STATUS_UPDATE") {
        setUserStatuses((prev) => {
          const newMap = new Map(prev);
          newMap.set(event.userId, event.status);
          return newMap;
        });
      }
    });

    return () => {
      unsubscribeGeneral();
      unsubscribePersonal();
    };
  }, [connected, subscribe]);

  const updatePresence = useCallback(
    (status: "ONLINE" | "OFFLINE" | "AWAY" | "IDLE" | "DO_NOT_DISTURB" | "INVISIBLE") => {
      if (wsRef.current && connected) {
        wsRef.current.updatePresence(status);
      }
    },
    [connected]
  );

  return {
    onlineUsers: Array.from(onlineUsers),
    userStatuses: Object.fromEntries(userStatuses),
    updatePresence,
  };
}
