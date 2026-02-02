"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { WebSocketService } from "@/app/(chat)/_services";
import { isAuthenticated as checkAuth } from "@/utils/local.storage";

interface WebSocketContextType {
  connected: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (
    topic: string,
    callback: (message: unknown) => void
  ) => () => void;
  sendMessage: (destination: string, data: unknown) => void;
  reconnect: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function WebSocketProvider({
  children,
  autoConnect = true,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
}: WebSocketProviderProps) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsServiceRef = useRef<WebSocketService>( null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>( null);
  const hasTriedConnectWithoutTokenRef = useRef(false); 

  // ✅ Check user info thay vì token (tokens được lưu trong HttpOnly cookies)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return checkAuth();
    }
    return false;
  });

  // Listen for user info changes in localStorage (khi user login/logout)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "users") {
        const hasUser = !!e.newValue;
        setIsAuthenticated(hasUser);
        // Reset flag khi user info thay đổi
        hasTriedConnectWithoutTokenRef.current = false;
      }
    };

    // Listen for storage events (từ tab/window khác)
    window.addEventListener("storage", handleStorageChange);

    // Polling để check user info changes trong cùng tab (vì storage event chỉ fire từ tab khác)
    const checkUserInterval = setInterval(() => {
      const currentHasUser = checkAuth();
      if (currentHasUser !== isAuthenticated) {
        setIsAuthenticated(currentHasUser);
        hasTriedConnectWithoutTokenRef.current = false;
      }
    }, 1000); // Check mỗi 1 giây

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkUserInterval);
    };
  }, [isAuthenticated]);

  // Initialize WebSocket service
  useEffect(() => {
    wsServiceRef.current = WebSocketService.getInstance();
  }, []);

  const connect = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !wsServiceRef.current) {
      setError("User not authenticated");
      return;
    }

    try {
      setError(null);
      await wsServiceRef.current.connect("");
      setConnected(true);
      setReconnectAttempts(0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "WebSocket connection failed";
      setError(errorMessage);
      setConnected(false);
      console.error("WebSocket connection error:", err);

      // Auto reconnect logic
      if (reconnectAttempts < maxReconnectAttempts) {
        setReconnectAttempts((prev) => prev + 1);
        reconnectTimeoutRef.current = setTimeout(() => {
         
          connect();
        }, reconnectInterval);
      }
    }
  }, [isAuthenticated, reconnectAttempts, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback((): void => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
      setConnected(false);
      setError(null);
      setReconnectAttempts(0);
    }
  }, []);

  const subscribe = useCallback(
    (topic: string, callback: (message: unknown) => void): (() => void) => {
      if (!wsServiceRef.current) {
        console.warn("WebSocket not initialized, cannot subscribe to", topic);
        return () => { };
      }

      // Check connection status from service directly (not from state)
      if (!wsServiceRef.current.isConnected()) {
        // Auto-trigger connect if authenticated but not connected
        if (isAuthenticated) {
          // Connect and then retry subscription after delay
          wsServiceRef.current.connect("").then(() => {
            if (wsServiceRef.current?.isConnected()) {
              wsServiceRef.current.subscribe(topic, callback);
            }
          }).catch((err) => {
            console.error("[WebSocket] Failed to auto-connect for subscription:", err);
          });
        } else {
          console.warn(`[WebSocket] Not connected and not authenticated, cannot subscribe to ${topic}`);
        }
        return () => { };
      }

      try {
        return wsServiceRef.current.subscribe(topic, callback);
      } catch (err) {
        console.error("Failed to subscribe to", topic, err);
        return () => { };
      }
    },
    [isAuthenticated] // Added isAuthenticated dependency
  );

  const sendMessage = useCallback(
    (destination: string, data: unknown): void => {
      if (!wsServiceRef.current) {
        console.warn("WebSocket not initialized, cannot send message");
        return;
      }

      // Check connection status from service directly
      if (!wsServiceRef.current.isConnected()) {
        console.warn("WebSocket not connected, cannot send message");
        return;
      }

      try {
        wsServiceRef.current.send(destination, data);
      } catch (err) {
        console.error("Failed to send WebSocket message:", err);
      }
    },
    [] // No dependencies - stable function
  );

  const reconnect = useCallback(async (): Promise<void> => {
    disconnect();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    await connect();
  }, [disconnect, connect]);

  /**
   * Khi accessToken được refresh (qua Axios interceptor), tự động reconnect WebSocket
   * để các request SockJS tiếp theo không bị anonymous / 404 nữa.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleTokenRefreshed = () => {
      if (!isAuthenticated) return;
   
      reconnect();
    };

    window.addEventListener("auth-token-refreshed", handleTokenRefreshed);
    return () => {
      window.removeEventListener("auth-token-refreshed", handleTokenRefreshed);
    };
  }, [isAuthenticated, reconnect]);

  // Auto connect when authenticated - chỉ chạy khi có user info
  useEffect(() => {
    // Nếu không có user info, đánh dấu đã thử và return (không gọi connect)
    if (!isAuthenticated) {
      if (!hasTriedConnectWithoutTokenRef.current) {
        hasTriedConnectWithoutTokenRef.current = true;
       
      }
      return;
    }

    // Chỉ auto-connect khi có user info, authenticated, và chưa connected
    if (autoConnect && isAuthenticated && !connected) {
     
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, isAuthenticated]); // Loại bỏ connected và connect để tránh loop

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  const contextValue: WebSocketContextType = {
    connected,
    error,
    connect,
    disconnect,
    subscribe,
    sendMessage,
    reconnect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
}

// Hook for specific chat features
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
      return subscribe(
        `/topic/conversation/${conversationId}/typing`,
        callback
      );
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

  const sendTypingIndicator = useCallback(
    (conversationId: string, isTyping: boolean, userId: string) => {
      sendMessage(`/app/chat/${conversationId}/typing`, {
        isTyping,
        userId,
      });
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
    subscribeToPayments,  // 💳 NEW
    sendTypingIndicator,
    updatePresence,
  };
}
