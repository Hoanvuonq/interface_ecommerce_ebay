/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  WEBSOCKET_CONFIG,
  createStompHeaders,
  getWebSocketURL,
  parseWebSocketMessage,
  validateWebSocketConfig,
} from "@/config/websocket/websocket.config";
import { WebSocketState } from "@/config/websocket/websocket.type";

export class WebSocketService {
  private static instance: WebSocketService;
  private stompClient: any = null;
  private connected = false;
  private state: WebSocketState = WebSocketState.DISCONNECTED;
  private subscriptions: Map<string, any> = new Map();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private typingThrottle: Map<string, NodeJS.Timeout> = new Map();
  private lastTypingSent: Map<string, number> = new Map();

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Kết nối WebSocket với cấu hình tối ưu
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 🔒 CRITICAL: Prevent multiple connections
        if (this.state === WebSocketState.CONNECTED && this.connected && this.stompClient?.connected) {
          resolve();
          return;
        }

        if (this.state === WebSocketState.CONNECTING) {
          resolve();
          return;
        }

        // Validate configuration
        if (!validateWebSocketConfig()) {
          reject(new Error("Invalid WebSocket configuration"));
          return;
        }

        this.state = WebSocketState.CONNECTING;

        // Import SockJS và Stomp dynamically
        Promise.all([import("sockjs-client"), import("@stomp/stompjs")])
          .then(([{ default: SockJS }, { Stomp }]) => {
            // ✅ Backend yêu cầu token qua query parameter (?token=xxx) - ưu tiên
            // Hoặc qua STOMP headers (Authorization: Bearer xxx) - backup
            const wsUrl = getWebSocketURL(token);
            const socket = new SockJS(wsUrl);
            this.stompClient = Stomp.over(socket);

            // Configure STOMP client
            this.stompClient.heartbeat.outgoing =
              WEBSOCKET_CONFIG.connection.heartbeatOutgoing;
            this.stompClient.heartbeat.incoming =
              WEBSOCKET_CONFIG.connection.heartbeatIncoming;
            this.stompClient.reconnectDelay =
              WEBSOCKET_CONFIG.connection.reconnectDelay;

            // Enable debug in development
            if (WEBSOCKET_CONFIG.connection.debug) {
              this.stompClient.debug = (str: string) => {
                console.log("STOMP: " + str);
              };
            } else {
              this.stompClient.debug = () => { }; // Disable debug in production
            }

            // Connection timeout
            const connectTimeout = setTimeout(() => {
              if (this.state === WebSocketState.CONNECTING) {
                this.state = WebSocketState.ERROR;
                reject(new Error("WebSocket connection timeout"));
              }
            }, WEBSOCKET_CONFIG.connection.connectTimeout);

            this.stompClient.connect(
              createStompHeaders(token),
              (frame: any) => {
                clearTimeout(connectTimeout);
                console.log("WebSocket connected:", frame);
                this.connected = true;
                this.state = WebSocketState.CONNECTED;
                this.reconnectAttempts = 0;

                // Clear any existing reconnect timer
                if (this.reconnectTimer) {
                  clearTimeout(this.reconnectTimer);
                  this.reconnectTimer = null;
                }

                resolve();
              },
              (error: any) => {
                clearTimeout(connectTimeout);
                console.error("WebSocket connection error:", error);
                this.connected = false;
                this.state = WebSocketState.ERROR;

                // Handle specific error types
                const errorStatus =
                  error.headers?.["status"] || error.headers?.["message"];

                // Connection limit exceeded (429 Too Many Requests)
                if (
                  errorStatus === "429" ||
                  errorStatus === "TOO_MANY_CONNECTIONS"
                ) {
                  const errorMessage =
                    "Bạn đã mở quá nhiều kết nối. Vui lòng đóng các tab/ứng dụng khác và thử lại.";
                  console.error("Connection limit reached:", errorMessage);
                  reject(new Error(errorMessage));
                  return;
                }

                // Authentication failed (401)
                if (errorStatus === "401" || errorStatus === "UNAUTHORIZED") {
                  const errorMessage =
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
                  console.error("Authentication failed:", errorMessage);
                  reject(new Error(errorMessage));
                  return;
                }

                // Forbidden (403)
                if (errorStatus === "403" || errorStatus === "FORBIDDEN") {
                  const errorMessage =
                    "Bạn không có quyền truy cập. Vui lòng kiểm tra quyền của tài khoản.";
                  console.error("Access forbidden:", errorMessage);
                  reject(new Error(errorMessage));
                  return;
                }

                // Auto reconnect logic for other errors
                this.handleReconnection(token, reject);
              }
            );
          })
          .catch((importError) => {
            console.error(
              "Failed to import WebSocket dependencies:",
              importError
            );
            this.state = WebSocketState.ERROR;
            reject(importError);
          });
      } catch (error) {
        this.state = WebSocketState.ERROR;
        reject(error);
      }
    });
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnection(
    token: string,
    reject: (reason?: any) => void
  ): void {
    if (
      this.reconnectAttempts >= WEBSOCKET_CONFIG.connection.maxReconnectAttempts
    ) {
      reject(
        new Error(
          `WebSocket connection failed after ${this.reconnectAttempts} attempts`
        )
      );
      return;
    }

    this.reconnectAttempts++;
    this.state = WebSocketState.RECONNECTING;


    this.reconnectTimer = setTimeout(() => {
      this.connect(token).catch((error) => {
        console.error("Reconnection failed:", error);
        this.handleReconnection(token, reject);
      });
    }, WEBSOCKET_CONFIG.connection.reconnectDelay);
  }

  /**
   * Ngắt kết nối WebSocket
   */
  disconnect(): void {
    this.state = WebSocketState.DISCONNECTING;

    // Clear reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Clear typing throttles
    this.typingThrottle.forEach((timeout) => clearTimeout(timeout));
    this.typingThrottle.clear();
    this.lastTypingSent.clear();

    // Unsubscribe all subscriptions
    this.subscriptions.forEach((subscription) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    });
    this.subscriptions.clear();

    // Disconnect STOMP client
    if (this.stompClient && this.connected) {
      try {
        this.stompClient.disconnect();
      } catch (error) {
        console.error("Error disconnecting STOMP client:", error);
      }
    }

    this.connected = false;
    this.state = WebSocketState.DISCONNECTED;
    this.reconnectAttempts = 0;

    console.log("WebSocket disconnected");
  }

  /**
   * Subscribe topic với error handling tốt hơn
   */
  subscribe(topic: string, callback: (message: any) => void): () => void {
    if (!this.connected || !this.stompClient || !this.stompClient.connected) {
      console.warn("WebSocket not connected, cannot subscribe to", topic);
      return () => { };
    }

    try {
      const subscription = this.stompClient.subscribe(topic, (message: any) => {
        try {
          const parsedData = parseWebSocketMessage(message);
          if (parsedData) {
            callback(parsedData);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error, message);
        }
      });

      this.subscriptions.set(topic, subscription);

      // Return unsubscribe function
      return () => {
        try {
          subscription.unsubscribe();
          this.subscriptions.delete(topic);
        } catch (error) {
          console.error(`Error unsubscribing from topic ${topic}:`, error);
        }
      };
    } catch (error) {
      console.error(`Failed to subscribe to topic ${topic}:`, error);
      return () => { };
    }
  }

  /**
   * Gửi message qua WebSocket với error handling
   * Note: Backend rate limiting sẽ tự động reject message nếu vượt quá limit
   * Frontend không nhận được error callback, message chỉ đơn giản không được gửi
   */
  send(destination: string, data: any): void {
    // Check connection status more thoroughly
    // Note: @stomp/stompjs v6+ uses `stompClient.connected` property
    // But some versions might not have it, so we check our internal state too
    const isStompConnected =
      this.stompClient?.connected !== undefined
        ? this.stompClient.connected
        : this.connected; // Fallback to our internal state

    if (
      !this.connected ||
      !this.stompClient ||
      !isStompConnected ||
      this.state !== WebSocketState.CONNECTED
    ) {
      console.warn(
        "WebSocket not connected, cannot send message to",
        destination,
        {
          connected: this.connected,
          hasStompClient: !!this.stompClient,
          stompConnected: isStompConnected,
          state: this.state,
        }
      );
      return;
    }

    try {
      const messageData =
        typeof data === "string" ? data : JSON.stringify(data);

      // Double check before sending
      if (!this.stompClient || !this.connected) {
        console.warn("Connection lost before sending message");
        return;
      }

      this.stompClient.send(destination, {}, messageData);

      if (WEBSOCKET_CONFIG.connection.debug) {
        console.log(`Message sent to ${destination}:`, data);
      }
    } catch (error: any) {
      console.error(`Failed to send message to ${destination}:`, error);

      // If error is about no connection, update our state
      if (
        error?.message?.includes("no underlying") ||
        error?.message?.includes("not connected")
      ) {
        console.warn("STOMP connection lost, updating state");
        this.connected = false;
        this.state = WebSocketState.DISCONNECTED;
      }
      // Don't throw error, just log it to prevent app crash
    }
  }

  /**
   * Subscribe nhận tin nhắn conversation
   */
  subscribeToConversation(
    conversationId: string,
    callback: (message: any) => void
  ): () => void {
    return this.subscribe(
      WEBSOCKET_CONFIG.topics.conversation(conversationId),
      callback
    );
  }

  /**
   * Subscribe nhận tin nhắn cá nhân
   */
  subscribeToPersonalMessages(callback: (message: any) => void): () => void {
    return this.subscribe(WEBSOCKET_CONFIG.topics.personalMessages, callback);
  }

  /**
   * Subscribe presence updates
   */
  subscribeToPresence(callback: (presence: any) => void): () => void {
    return this.subscribe(WEBSOCKET_CONFIG.topics.presence, callback);
  }

  /**
   * Subscribe typing indicators
   */
  subscribeToTyping(
    conversationId: string,
    callback: (typing: any) => void
  ): () => void {
    return this.subscribe(
      WEBSOCKET_CONFIG.topics.typing(conversationId),
      callback
    );
  }

  /**
   * Subscribe notifications
   */
  subscribeToNotifications(callback: (notification: any) => void): () => void {
    return this.subscribe(WEBSOCKET_CONFIG.topics.notifications, callback);
  }

  /**
   * Subscribe to staff support queue (for customer support staff)
   * Nhận updates về support conversations: NEW_SUPPORT_CONVERSATION, CONVERSATION_ACCEPTED, NEW_SUPPORT_MESSAGE
   */
  subscribeToStaffSupportQueue(callback: (data: any) => void): () => void {
    return this.subscribe(WEBSOCKET_CONFIG.topics.staffSupportQueuePersonal, callback);
  }

  /**
   * Subscribe to staff support queue stats
   * Nhận cập nhật thống kê: waitingCount, activeCount
   */
  subscribeToStaffSupportQueueStats(callback: (stats: any) => void): () => void {
    return this.subscribe(WEBSOCKET_CONFIG.topics.staffStats, callback);
  }

  /**
   * Gửi typing indicator với client-side throttling
   * Throttle: chỉ gửi tối đa 1 lần mỗi 2 giây để tránh spam
   */
  sendTypingIndicator(
    conversationId: string,
    isTyping: boolean,
    userId: string
  ): void {
    if (!this.connected || !this.stompClient) {
      return;
    }

    const key = `${conversationId}-${userId}`;
    const now = Date.now();
    const lastSent = this.lastTypingSent.get(key) || 0;
    const THROTTLE_INTERVAL = 2000; // 2 seconds

    // Clear existing throttle if user stops typing
    if (!isTyping) {
      if (this.typingThrottle.has(key)) {
        clearTimeout(this.typingThrottle.get(key)!);
        this.typingThrottle.delete(key);
      }
      // Always send stop typing immediately
      this.send(WEBSOCKET_CONFIG.destinations.typing(conversationId), {
        isTyping: false,
        userId,
        timestamp: new Date().toISOString(),
      });
      this.lastTypingSent.delete(key);
      return;
    }

    // Throttle: only send if enough time has passed
    if (now - lastSent < THROTTLE_INTERVAL) {
      // Clear existing throttle and set new one
      if (this.typingThrottle.has(key)) {
        clearTimeout(this.typingThrottle.get(key)!);
      }

      // Schedule to send after throttle interval
      const timeout = setTimeout(() => {
        this.send(WEBSOCKET_CONFIG.destinations.typing(conversationId), {
          isTyping: true,
          userId,
          timestamp: new Date().toISOString(),
        });
        this.lastTypingSent.set(key, Date.now());
        this.typingThrottle.delete(key);
      }, THROTTLE_INTERVAL - (now - lastSent));

      this.typingThrottle.set(key, timeout);
      return;
    }

    // Send immediately if enough time has passed
    this.send(WEBSOCKET_CONFIG.destinations.typing(conversationId), {
      isTyping: true,
      userId,
      timestamp: new Date().toISOString(),
    });
    this.lastTypingSent.set(key, now);
  }

  /**
   * Update presence
   */
  updatePresence(status: "ONLINE" | "OFFLINE" | "AWAY" | "IDLE" | "DO_NOT_DISTURB" | "INVISIBLE"): void {
    this.send(WEBSOCKET_CONFIG.destinations.presence, {
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Join conversation
   */
  joinConversation(conversationId: string): void {
    this.send(WEBSOCKET_CONFIG.destinations.joinConversation(conversationId), {
      conversationId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Leave conversation
   */
  leaveConversation(conversationId: string): void {
    this.send(WEBSOCKET_CONFIG.destinations.leaveConversation(conversationId), {
      conversationId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    // Check if STOMP client exists and is connected
    // Some versions of @stomp/stompjs might not have .connected property
    const isStompConnected =
      this.stompClient?.connected !== undefined
        ? this.stompClient.connected === true
        : this.connected; // Fallback to our internal state

    return (
      this.connected &&
      this.stompClient !== null &&
      isStompConnected &&
      this.state === WebSocketState.CONNECTED
    );
  }

  /**
   * Get current connection state
   */
  getState(): WebSocketState {
    return this.state;
  }

  /**
   * Get reconnection attempts count
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  /**
   * Get active subscriptions count
   */
  getSubscriptionsCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Get all active subscription topics
   */
  getActiveTopics(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Force reconnection
   */
  forceReconnect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.disconnect();
      setTimeout(() => {
        this.connect(token).then(resolve).catch(reject);
      }, 1000);
    });
  }
}
