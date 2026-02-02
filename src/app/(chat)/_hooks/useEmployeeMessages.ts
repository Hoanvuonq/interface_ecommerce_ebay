"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useGetMessages, useSendMessage } from "./useMessage";
import { MessageType } from "../_types/chat.dto";
import type { Message } from "../_types/chat.type";
import { getStoredUserDetail } from "@/utils/jwt";
import { useChatWebSocket } from "@/providers/WebSocketProvider";
import { useToast } from "@/hooks/useToast";
const { success: messageSuccess, error: messageError } = useToast();

/**
 * Custom hook để quản lý messages cho nhân viên trong một conversation
 */
export const useEmployeeMessages = (
  conversationId: string,
  onConversationUpdate?: (conversation: any) => void,
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const isInitializingRef = useRef(false); // Track để tránh gọi API 2 lần

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { handleGetMessages, loading: loadingMessages } = useGetMessages();
  const { handleSendMessage, loading: sendingMessage } = useSendMessage();

  // WebSocket connection for real-time updates
  const {
    connected: wsConnected,
    subscribeToConversation,
    subscribeToPersonalMessages,
  } = useChatWebSocket();

  // Get current user from localStorage
  const userDetail = getStoredUserDetail();
  const currentUserId = userDetail?.userId;
  const currentUsername = userDetail?.username;

  /**
   * Load messages cho conversation (initial load)
   */
  const loadMessages = useCallback(
    async (convId: string) => {
      if (!convId) {
        console.warn("[EmployeeMessages] No conversation ID provided");
        return;
      }

      try {
        const response = await handleGetMessages(convId, {
          page: 0,
          size: 20, // Load 20 messages đầu tiên
          sort: "createdDate,desc", // Mới nhất trước để dễ pagination
        });

        if (response?.success && response?.data) {
          // Response có thể là PageResponse hoặc array
          const items =
            response.data.content || response.data.items || response.data;
          const totalPages = response.data.totalPages || 1;

          if (Array.isArray(items)) {
            // Backend đã trả về deletedAt và deletedType, không cần set isDeleted nữa
            // Helper function isMessageDeleted sẽ check dựa trên deletedAt và deletedType
            const processedItems = items;
            // Reverse để hiển thị đúng thứ tự (cũ -> mới)
            setMessages(processedItems.reverse());
            setCurrentPage(0);
            setHasMoreMessages(totalPages > 1);
          }
        } else {
          console.warn("[EmployeeMessages] No messages data in response");
          setMessages([]);
        }
      } catch (error) {
        console.error("[EmployeeMessages] Failed to load messages:", error);
        messageError("Không thể tải tin nhắn");
      }
    },
    [handleGetMessages],
  );

  /**
   * Initialize messages khi chọn conversation
   */
  const initializeMessages = useCallback(async () => {
    if (!conversationId) {
      console.warn("[EmployeeMessages] No conversation ID");
      setMessages([]);
      return;
    }

    // Kiểm tra xem đã đang initialize cho conversation này chưa
    // Nếu đã đang initialize cho conversation này, bỏ qua
    if (isInitializingRef.current) {
      return;
    }

    try {
      isInitializingRef.current = true;
      setIsInitializing(true);

      // Clear messages trước khi load mới (đảm bảo không hiển thị messages cũ)
      setMessages([]);

      await loadMessages(conversationId);
    } catch (error) {
      console.error("[EmployeeMessages] Failed to initialize:", error);
      setMessages([]); // Clear messages nếu có lỗi
    } finally {
      setIsInitializing(false);
      // Reset ref sau khi hoàn thành
      setTimeout(() => {
        isInitializingRef.current = false;
      }, 500);
    }
  }, [conversationId, loadMessages]);

  /**
   * Send message
   */
  const sendMessage = useCallback(
    async (content: string, replyToMessageId?: string) => {
      if (!conversationId || !content.trim()) {
        console.warn(
          "[EmployeeMessages] Cannot send message - no conversation or empty content",
        );
        return false;
      }

      try {
        console.log("[EmployeeMessages] Sending message:", {
          conversationId,
          content: content.trim(),
          replyToMessageId,
        });
        const response = await handleSendMessage({
          conversationId,
          content: content.trim(),
          type: MessageType.TEXT,
          replyToMessageId,
        });

        if (response?.success && response?.data) {
          const newMessage = response.data;

          // Optimistic update: add message immediately, but check for duplicates
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === newMessage.id);
            if (exists) {
              return prev;
            }

            return [...prev, newMessage];
          });

          return true;
        }
        console.error("[EmployeeMessages] Failed to send message:", response);
        messageError("Không thể gửi tin nhắn");
        return false;
      } catch (error) {
        console.error("[EmployeeMessages] Failed to send message:", error);
        messageError("Không thể gửi tin nhắn");
        return false;
      }
    },
    [conversationId, handleSendMessage],
  );

  /**
   * Refresh messages
   */
  const refreshMessages = useCallback(() => {
    if (conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId, loadMessages]);

  /**
   * Load more messages (pagination)
   */
  const loadMoreMessages = useCallback(async () => {
    if (!conversationId || isLoadingMore || !hasMoreMessages) {
     
      return;
    }

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;


      const response = await handleGetMessages(conversationId, {
        page: nextPage,
        size: 20,
        sort: "createdDate,desc",
      });

      if (response?.success && response?.data) {
        const items =
          response.data.content || response.data.items || response.data;
        const totalPages = response.data.totalPages || 1;

        if (Array.isArray(items) && items.length > 0) {
          // Backend đã trả về deletedAt và deletedType, không cần set isDeleted nữa
          // Helper function isMessageDeleted sẽ check dựa trên deletedAt và deletedType
          const processedItems = items;
          // Prepend old messages (reverse để đúng thứ tự)
          setMessages((prev) => [...processedItems.reverse(), ...prev]);
          setCurrentPage(nextPage);
          setHasMoreMessages(nextPage < totalPages - 1);
        } else {
          setHasMoreMessages(false);
        }
      }
    } catch (error) {
      console.error("[EmployeeMessages] Failed to load more messages:", error);
      messageError("Không thể tải thêm tin nhắn");
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    conversationId,
    currentPage,
    hasMoreMessages,
    isLoadingMore,
    handleGetMessages,
  ]);

  /**
   * Check if message is from current user
   */
  const isMyMessage = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (message: any) => {
      // Handle case when message is undefined or null
      if (!message) {
        return false;
      }

      // Handle case when message is a string (senderId) - backward compatibility
      if (typeof message === "string") {
        return message === currentUserId;
      }

      // API trả về có cấu trúc: message.user?.userId hoặc message.senderId
      // Safe access với optional chaining
      const messageSenderId =
        message?.user?.userId ||
        message?.senderId ||
        message?.sender?.userId ||
        (typeof message === "string" ? message : null);

      if (!messageSenderId || !currentUserId) {
        return false;
      }

      const result = messageSenderId === currentUserId;
      return result;
    },
    [currentUserId],
  );

  // Store subscribe functions in refs để tránh re-subscriptions
  const subscribeToConversationRef = useRef<
    | ((
        conversationId: string,
        callback: (message: unknown) => void,
      ) => () => void)
    | null
  >(null);
  const subscribeToPersonalMessagesRef = useRef<
    ((callback: (message: unknown) => void) => () => void) | null
  >(null);
  const conversationIdRef = useRef<string>(conversationId);
  const prevConversationIdRef = useRef<string>(conversationId);

  // Update refs khi values thay đổi
  useEffect(() => {
    subscribeToConversationRef.current = subscribeToConversation;
    subscribeToPersonalMessagesRef.current = subscribeToPersonalMessages;
  }, [subscribeToConversation, subscribeToPersonalMessages]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Clear messages và reset state khi conversationId thay đổi
  // QUAN TRỌNG: Effect này phải chạy TRƯỚC khi initializeMessages được gọi
  useEffect(() => {
    // Chỉ xử lý khi conversationId thực sự thay đổi (không phải lần đầu mount)
    if (
      prevConversationIdRef.current &&
      prevConversationIdRef.current !== conversationId
    ) {
      console.log(
        "[EmployeeMessages] Conversation ID changed, clearing messages and resetting state:",
        prevConversationIdRef.current,
        "->",
        conversationId,
      );

      // Clear messages cũ NGAY LẬP TỨC
      setMessages([]);

      // Reset pagination state
      setCurrentPage(0);
      setHasMoreMessages(true);
      setIsLoadingMore(false);

      // Reset initializing ref để cho phép initialize lại với conversationId mới
      isInitializingRef.current = false;
    }

    // Update previous conversation ID (luôn cập nhật để track thay đổi)
    if (conversationId) {
      prevConversationIdRef.current = conversationId;
    }
  }, [conversationId]);

  /**
   * WebSocket: Subscribe to conversation topic for real-time updates
   * QUAN TRỌNG: Chỉ subscribe khi wsConnected hoặc conversationId thay đổi, không subscribe lại khi các function dependencies thay đổi
   */
  useEffect(() => {
    if (!wsConnected || !conversationId) {
      console.log("[EmployeeMessages] WebSocket not ready for subscription:", {
        wsConnected,
        conversationId,
      });
      return;
    }

    // Kiểm tra subscribe functions có sẵn chưa
    if (
      !subscribeToConversationRef.current ||
      !subscribeToPersonalMessagesRef.current
    ) {
      console.warn(
        "[EmployeeMessages] Subscribe functions not ready, skipping subscription",
      );
      return;
    }

    console.log(
      "[EmployeeMessages] Subscribing to conversation topic:",
      conversationId,
    );

    // Handler để xử lý message từ WebSocket
    // Sử dụng ref để lấy conversationId mới nhất
    const handleIncomingMessage = (data: unknown) => {
      console.log("[EmployeeMessages] Received WebSocket message:", data);

      try {
        // Backend sends: { data: Message | Conversation, type: string, timestamp: string }
        const eventWrapper = data as { data?: Message | any; type?: string };
        const eventType = eventWrapper.type;

        // Xử lý CONVERSATION_UPDATED event - cập nhật conversation info nhưng không thêm vào messages
        if (eventType === "CONVERSATION_UPDATED") {
         
          if (eventWrapper.data && onConversationUpdate) {
            onConversationUpdate(eventWrapper.data);
          }
          return; // Không thêm vào messages list
        }

        // Xử lý MESSAGE_UPDATED event - cập nhật message đã chỉnh sửa
        if (eventType === "MESSAGE_UPDATED") {
        
          const updatedMessage = eventWrapper.data as Message;
          if (updatedMessage?.id) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id
                  ? { ...msg, ...updatedMessage, isEdited: true }
                  : msg,
              ),
            );
          }
          return;
        }

        // Xử lý MESSAGE_DELETED event - đánh dấu message đã bị xóa
        if (eventType === "MESSAGE_DELETED") {
        
          const deletedEvent = data as {
            messageId?: string;
            deleteForEveryone?: boolean;
            type?: string;
          };
          if (deletedEvent?.messageId) {
           
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === deletedEvent.messageId
                  ? {
                      ...msg,
                      deletedAt: deletedEvent.deleteForEveryone
                        ? new Date().toISOString()
                        : undefined,
                      deletedType: deletedEvent.deleteForEveryone
                        ? "DELETE_FOR_EVERYONE"
                        : "DELETE_FOR_ME",
                      deletedBy: deletedEvent.deleteForEveryone
                        ? undefined
                        : currentUsername,
                      content: deletedEvent.deleteForEveryone
                        ? ""
                        : msg.content,
                    }
                  : msg,
              ),
            );
          } else {
            console.warn(
              "[EmployeeMessages] MESSAGE_DELETED event missing messageId:",
              data,
            );
          }
          return;
        }

        // Chỉ xử lý NEW_MESSAGE events cho messages
        if (eventType && eventType !== "NEW_MESSAGE") {
          console.log(
            "[EmployeeMessages] Ignoring unknown event type:",
            eventType,
          );
          return;
        }

        // Extract message từ data.data hoặc data trực tiếp (legacy format không có type)
        const incomingMessage = eventWrapper.data || (data as Message);

        // Validate message structure
        if (!incomingMessage || !incomingMessage.id) {
          console.warn("[EmployeeMessages] Invalid message structure:", data);
          return;
        }

        // Validate message phải có content hoặc attachments (tránh message rỗng)
        const hasContent =
          incomingMessage.content && incomingMessage.content.trim().length > 0;
        const hasAttachments =
          incomingMessage.attachments &&
          Array.isArray(incomingMessage.attachments) &&
          incomingMessage.attachments.length > 0;

        if (!hasContent && !hasAttachments) {
          console.warn(
            "[EmployeeMessages] Message has no content or attachments, ignoring:",
            incomingMessage.id,
          );
          return;
        }

        // Kiểm tra xem message đã tồn tại chưa (tránh duplicate)
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === incomingMessage.id);
          if (exists) {
            return prev;
          }

          return [...prev, incomingMessage];
        });
      } catch (error) {
        console.error(
          "[EmployeeMessages] Failed to process WebSocket message:",
          error,
        );
      }
    };

    // Subscribe to conversation topic: /topic/conversation/{conversationId}
    // Sử dụng ref để lấy function mới nhất
    const unsubscribeConversation = subscribeToConversationRef.current(
      conversationId,
      handleIncomingMessage,
    );

    // Subscribe to personal messages: /user/queue/messages
    // Sử dụng ref để lấy function mới nhất và conversationId từ ref
    const unsubscribePersonal = subscribeToPersonalMessagesRef.current(
      (data: unknown) => {
        console.log(
          "[EmployeeMessages] Received personal queue message:",
          data,
        );

        try {
          // Backend sends: { data: Message | Conversation, type: string, timestamp: string }
          const messageWrapper = data as {
            data?: Message | any;
            type?: string;
          };
          const eventType = messageWrapper.type;

          // Xử lý CONVERSATION_UPDATED event - cập nhật conversation info nhưng không thêm vào messages
          if (eventType === "CONVERSATION_UPDATED") {
            if (messageWrapper.data && onConversationUpdate) {
              onConversationUpdate(messageWrapper.data);
            }
            return; // Không thêm vào messages list
          }

          // Xử lý MESSAGE_UPDATED event - cập nhật message đã chỉnh sửa
          if (eventType === "MESSAGE_UPDATED") {
            const updatedMessage = messageWrapper.data as Message;
            if (updatedMessage?.id) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === updatedMessage.id
                    ? { ...msg, ...updatedMessage, isEdited: true }
                    : msg,
                ),
              );
            }
            return;
          }

          // Xử lý MESSAGE_DELETED event - đánh dấu message đã bị xóa
          if (eventType === "MESSAGE_DELETED") {
            // Backend gửi: { type: "MESSAGE_DELETED", messageId: "...", deleteForEveryone: true/false }
            const deletedEvent = data as {
              messageId?: string;
              deleteForEveryone?: boolean;
              type?: string;
            };
            if (deletedEvent?.messageId) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === deletedEvent.messageId
                    ? {
                        ...msg,
                        deletedAt: deletedEvent.deleteForEveryone
                          ? new Date().toISOString()
                          : undefined,
                        deletedType: deletedEvent.deleteForEveryone
                          ? "DELETE_FOR_EVERYONE"
                          : "DELETE_FOR_ME",
                        deletedBy: deletedEvent.deleteForEveryone
                          ? undefined
                          : currentUsername,
                        content: deletedEvent.deleteForEveryone
                          ? ""
                          : msg.content,
                      }
                    : msg,
                ),
              );
            } else {
              console.warn(
                "[EmployeeMessages] MESSAGE_DELETED event from personal queue missing messageId:",
                data,
              );
            }
            return;
          }

          // Chỉ xử lý NEW_MESSAGE events cho messages
          if (eventType && eventType !== "NEW_MESSAGE") {
            return;
          }

          const incomingMessage = messageWrapper.data || (data as Message);

          if (!incomingMessage || !incomingMessage.conversationId) {
            console.warn(
              "[EmployeeMessages] Invalid personal message structure:",
              data,
            );
            return;
          }

          // Sử dụng ref để lấy conversationId mới nhất
          const currentConversationId = conversationIdRef.current;
          // Chỉ xử lý tin nhắn thuộc conversation hiện tại
          if (incomingMessage.conversationId === currentConversationId) {
            handleIncomingMessage(data);
          } else {
          }
        } catch (error) {
          console.error(
            "[EmployeeMessages] Failed to process personal message:",
            error,
          );
        }
      },
    );

    return () => {
      unsubscribeConversation();
      unsubscribePersonal();
    };
    // CHỈ phụ thuộc vào wsConnected và conversationId - không phụ thuộc vào các function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsConnected, conversationId]);

  return {
    // State
    messages,
    setMessages, // Export for optimistic updates
    currentUserId,
    currentUser: userDetail,
    isInitializing,

    // Loading states
    loadingMessages,
    sendingMessage,
    isLoadingMore,

    // Pagination states
    hasMoreMessages,
    currentPage,

    // WebSocket status
    wsConnected,

    // Actions
    initializeMessages,
    sendMessage,
    refreshMessages,
    loadMoreMessages,
    isMyMessage,
  };
};
