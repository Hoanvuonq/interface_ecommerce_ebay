"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ConversationType, ConversationStatus } from "../_types/chat.dto";
import type { Conversation, Message } from "../_types/chat.type";
import { useChatWebSocket } from "@/providers/WebSocketProvider";
import { getCustomerSupportConversations } from "../_services";
import { getStoredUserDetail } from "@/utils/jwt";
import { useToast } from "@/hooks/useToast";
const { success: messageSuccess, error: messageError } = useToast();


export const useEmployeeConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState<ConversationType | undefined>(
    undefined
  );
  const [filterStatus, setFilterStatus] = useState<
    ConversationStatus | undefined
  >(undefined);

  const isInitializingRef = useRef(false); // Ngăn gọi API 2 lần
  const [loadingConversations, setLoadingConversations] = useState(false);

  // Get current user from localStorage
  const userDetail = getStoredUserDetail();
  const currentUserId = userDetail?.userId;

  // WebSocket connection for real-time updates
  const {
    connected: wsConnected,
    subscribeToPersonalMessages,
    subscribeToConversation,
    subscribeToConversationUpdates,
    subscribeToSupportQueue,
    subscribeToSupportQueuePersonal,
  } = useChatWebSocket();

  /**
   * Load danh sách conversations
   * Sử dụng endpoint customer-support với logic:
   * - Tab "Tất cả" (status = null): WAITING (tất cả) + ACTIVE (chỉ của current user)
   * - Tab "Hàng chờ" (status = WAITING_FOR_STAFF): Tất cả WAITING (tất cả nhân viên đều thấy)
   * - Tab "Đang xử lý" (status = ACTIVE): Chỉ conversations mà current user đang xử lý
   */
  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
    

      // Gọi API customer-support với status filter
      // Backend sẽ tự động xử lý:
      // - status = null: combine WAITING (tất cả) + ACTIVE (chỉ của current user)
      // - status = WAITING_FOR_STAFF: tất cả WAITING
      // - status = ACTIVE: chỉ conversations mà current user đang xử lý
      const response = await getCustomerSupportConversations({
        status: filterStatus ? (filterStatus.toUpperCase() as "ACTIVE" | "WAITING_FOR_STAFF" | "ARCHIVED" | "BLOCKED" | "DELETED" | "SUSPENDED") : undefined,
        page: 0,
        size: 100,
        sort: "lastMessageAt,desc",
      });

     

      if (response?.success && response?.data) {
        // Response có thể là PageResponse hoặc array
        const items =
          response.data.content || response.data.items || response.data || [];

      

        if (Array.isArray(items)) {
          // Filter theo keyword nếu có (client-side filtering cho keyword)
          let filtered = items;
          if (searchKeyword && searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase().trim();
            filtered = items.filter(
              (conv: Conversation) =>
                conv.name?.toLowerCase().includes(keyword) ||
                conv.id?.toLowerCase().includes(keyword)
            );
          }

          setConversations(filtered);
          setFilteredConversations(filtered);

          // Auto select first conversation nếu chưa có conversation nào được chọn
          // Dùng callback để tránh dependency vào selectedConversationId
          setSelectedConversationId((prev) => {
            if (!prev && filtered.length > 0) {
              return filtered[0].id;
            }
            return prev;
          });
        }
      } else {
        console.warn(
          "[EmployeeConversations] No conversations data in response"
        );
        setConversations([]);
        setFilteredConversations([]);
      }
    } catch (error) {
      console.error(
        "[EmployeeConversations] Failed to load conversations:",
        error
      );
      messageError("Không thể tải danh sách cuộc trò chuyện");
    } finally {
      setLoadingConversations(false);
    }
  }, [
    filterStatus,
    searchKeyword,
    // Loại bỏ selectedConversationId khỏi dependencies để tránh vòng lặp
  ]);

  /**
   * Initialize - Load conversations lần đầu
   */
  const initialize = useCallback(async () => {
    // Ngăn gọi API 2 lần (React Strict Mode issue)
    if (isInitializingRef.current) {
      return;
    }

    try {
      isInitializingRef.current = true;
      setIsInitializing(true);

      await loadConversations();
    } catch (error) {
      console.error("[EmployeeConversations] Failed to initialize:", error);
    } finally {
      setIsInitializing(false);
      // Reset ref sau 1 giây để cho phép retry nếu cần
      setTimeout(() => {
        isInitializingRef.current = false;
      }, 1000);
    }
  }, [loadConversations]);

  /**
   * Refresh danh sách conversations
   */
  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  /**
   * Filter conversations theo keyword - API đã handle, chỉ cần sync với conversations
   * Client-side filtering được loại bỏ vì API filter đã đầy đủ
   */
  useEffect(() => {
    // API đã filter theo keyword rồi, chỉ cần sync filteredConversations với conversations
    setFilteredConversations(conversations);
  }, [conversations]);

  /**
   * Apply filters (status) - chỉ load khi filter thay đổi (không phải lần đầu)
   * Note: Type filter đã fix cứng là BUYER_TO_PLATFORM và SHOP_TO_PLATFORM
   */
  const prevFilterStatusRef = useRef<ConversationStatus | undefined>(filterStatus);
  const prevSearchKeywordRef = useRef<string>(searchKeyword);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  // Mark as initialized after first load completes
  useEffect(() => {
    if (!isInitializing && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      prevFilterStatusRef.current = filterStatus;
      prevSearchKeywordRef.current = searchKeyword;
    }
  }, [isInitializing, filterStatus, searchKeyword]);

  // Handle status filter changes - reload immediately (no debounce)
  useEffect(() => {
    // Skip nếu chưa initialize hoặc giá trị chưa thay đổi
    if (isInitializing || !hasInitializedRef.current || prevFilterStatusRef.current === filterStatus) {
      if (!hasInitializedRef.current) {
        prevFilterStatusRef.current = filterStatus;
      }
      return;
    }

    // Chỉ load khi filter status thực sự thay đổi
    prevFilterStatusRef.current = filterStatus;
    // Clear search debounce nếu có
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    loadConversations();
  }, [filterStatus, loadConversations, isInitializing]);

  // Handle search keyword changes - debounce 500ms
  useEffect(() => {
    // Skip nếu chưa initialize hoặc giá trị chưa thay đổi
    if (isInitializing || !hasInitializedRef.current || prevSearchKeywordRef.current === searchKeyword) {
      if (!hasInitializedRef.current) {
        prevSearchKeywordRef.current = searchKeyword;
      }
      return;
    }

    // Clear previous debounce
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Debounce search keyword - chỉ reload sau 500ms khi user ngừng gõ
    // Capture giá trị hiện tại để dùng trong callback
    const currentKeyword = searchKeyword;
    searchDebounceRef.current = setTimeout(() => {
      // Chỉ reload nếu giá trị vẫn giống như khi timeout được tạo
      // (nếu đã thay đổi, useEffect sẽ tạo timeout mới)
      if (prevSearchKeywordRef.current !== currentKeyword && hasInitializedRef.current) {
        prevSearchKeywordRef.current = currentKeyword;
        loadConversations();
      }
    }, 500);

    // Cleanup
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchKeyword, loadConversations, isInitializing]);

  /**
   * Store loadConversations callback in ref to avoid re-subscriptions
   */
  const loadConversationsRef = useRef(loadConversations);
  useEffect(() => {
    loadConversationsRef.current = loadConversations;
  }, [loadConversations]);

  /**
   * WebSocket: Subscribe to personal messages for conversation list updates
   */
  useEffect(() => {
    if (!wsConnected) {
     
      return;
    }


    // Handler để xử lý message updates cho conversation list
    const handleMessageUpdate = (incomingMessage: Message) => {
      // Update conversations: move conversation with new message to top
      setConversations((prev) => {
        const conversationId = incomingMessage.conversationId;
        const convIndex = prev.findIndex((c) => c.id === conversationId);

        if (convIndex === -1) {
          // Conversation chưa có trong danh sách → load lại
        
          loadConversationsRef.current();
          return prev;
        }

        // Update conversation và move lên đầu
        const updatedConversations = [...prev];
        const [conversation] = updatedConversations.splice(convIndex, 1);

        // Update lastMessage và unreadCount
        const updatedConversation = {
          ...conversation,
          lastMessage: incomingMessage.content,
          lastMessagePreview: incomingMessage.content,
          lastMessageAt: incomingMessage.sentAt,
          lastMessageTime: incomingMessage.sentAt,
          unreadCount:
            selectedConversationId === conversationId
              ? 0 // Nếu đang xem conversation này → không tăng unread
              : (conversation.unreadCount || 0) + 1,
        };

        // Move lên đầu danh sách
        return [updatedConversation, ...updatedConversations];
      });
    };

    // Handler để xử lý conversation events (NEW_CONVERSATION, CONVERSATION_UPDATED, etc.)
    const handleConversationEvent = (data: unknown) => {

      try {
        // Backend payload: { type: "NEW_CONVERSATION" | "CONVERSATION_UPDATED" | "CONVERSATION_STATUS_CHANGED", data: Conversation, timestamp: ... }
        const event = data as {
          type: string;
          data?: Conversation;
          conversationId?: string;
          status?: string;
        };

        if (event.type === "NEW_CONVERSATION") {
         ;
          // Reload toàn bộ danh sách để lấy conversation mới
          loadConversationsRef.current();
        } else if (event.type === "CONVERSATION_UPDATED") {
        
          // Reload để cập nhật thông tin conversation
          loadConversationsRef.current();
        } else if (event.type === "CONVERSATION_STATUS_CHANGED") {
         
          // Reload để cập nhật status
          loadConversationsRef.current();
        }
      } catch (error) {
        console.error(
          "[EmployeeConversations] Failed to process conversation event:",
          error
        );
      }
    };

    // Subscribe to personal messages: /user/queue/messages
    const unsubscribePersonal = subscribeToPersonalMessages((data: unknown) => {
     

      try {
        // Backend sends: { data: Message, type: string, timestamp: string }
        const messageWrapper = data as { data?: Message; type?: string };
        const incomingMessage = messageWrapper.data || (data as Message);

        if (!incomingMessage || !incomingMessage.id) {
          console.warn(
            "[EmployeeConversations] Invalid personal message structure:",
            data
          );
          return;
        }

        handleMessageUpdate(incomingMessage);
      } catch (error) {
        console.error(
          "[EmployeeConversations] Failed to process personal message:",
          error
        );
      }
    });

    // Subscribe to conversation updates: /user/queue/conversations
    const unsubscribeConversationUpdates = subscribeToConversationUpdates(
      handleConversationEvent
    );

    // Handler để xử lý support queue events (NEW_SUPPORT_CONVERSATION, CONVERSATION_ACCEPTED, etc.)
    const handleSupportQueueEvent = (data: unknown) => {

      try {
        // Backend payload: { type: "NEW_SUPPORT_CONVERSATION" | "CONVERSATION_ACCEPTED" | "NEW_SUPPORT_MESSAGE" | "CONVERSATION_ASSIGNED", data: Conversation, timestamp: ... }
        const event = data as {
          type: string;
          data?: Conversation;
          conversationId?: string;
          message?: Message;
          fromStaffId?: string;
          toStaffId?: string;
        };

        if (event.type === "NEW_SUPPORT_CONVERSATION") {
         
          // Kiểm tra xem conversation có match với filter hiện tại không
          if (event.data) {
            const newConversation = event.data;
            
            // Logic filter:
            // - Tab "Tất cả" (filterStatus === undefined): Thêm nếu status là WAITING_FOR_STAFF (conversation mới luôn có status này)
            // - Tab "Hàng chờ" (filterStatus === WAITING_FOR_STAFF): Thêm nếu status là WAITING_FOR_STAFF
            // - Tab "Đang xử lý" (filterStatus === ACTIVE): Không thêm (conversation mới không có status ACTIVE)
            // - Tab "Đã lưu trữ" (filterStatus === ARCHIVED): Không thêm
            const matchesFilter = 
              filterStatus === undefined 
                ? newConversation.status === ConversationStatus.WAITING_FOR_STAFF
                : newConversation.status === filterStatus;

            if (matchesFilter) {
              setConversations((prev) => {
                // Kiểm tra xem conversation đã tồn tại chưa (tránh duplicate)
                const exists = prev.some((c) => c.id === newConversation.id);
                if (exists) {
                
                  return prev.map((c) =>
                    c.id === newConversation.id ? newConversation : c
                  );
                }
               
                return [newConversation, ...prev];
              });
            } else {
            
            }
          }
        } else if (event.type === "CONVERSATION_ACCEPTED") {
         
          loadConversationsRef.current();
        } else if (event.type === "NEW_SUPPORT_MESSAGE") {
          // Tin nhắn mới trong support conversation - update conversation trong list
          if (event.conversationId && event.message) {
            setConversations((prev) => {
              const convIndex = prev.findIndex(
                (c) => c.id === event.conversationId
              );

              if (convIndex === -1) {
               
                loadConversationsRef.current();
                return prev;
              }

              // Update conversation và move lên đầu
              const updatedConversations = [...prev];
              const [conversation] = updatedConversations.splice(convIndex, 1);

              const updatedConversation = {
                ...conversation,
                lastMessage: event.message?.content,
                lastMessagePreview: event.message?.content,
                lastMessageAt: event.message?.sentAt,
                lastMessageTime: event.message?.sentAt,
                unreadCount:
                  selectedConversationId === event.conversationId
                    ? 0
                    : (conversation.unreadCount || 0) + 1,
              };

              return [updatedConversation, ...updatedConversations];
            });
          }
        } else if (event.type === "CONVERSATION_ASSIGNED") {
        
          
          if (event.data && event.toStaffId && currentUserId) {
            const assignedConversation = event.data;
            const isAssignedToMe = event.toStaffId === currentUserId;
            const isAssignedFromMe = event.fromStaffId === currentUserId;
            
            setConversations((prev) => {
              const convIndex = prev.findIndex(
                (c) => c.id === assignedConversation.id
              );
              
              // Nếu conversation được assign cho mình
              if (isAssignedToMe) {
                // Nếu đang ở tab "Đang xử lý" (ACTIVE) → thêm vào danh sách
                if (filterStatus === ConversationStatus.ACTIVE) {
                  if (convIndex === -1) {
                    // Conversation chưa có trong danh sách → thêm vào đầu
                   
                    return [assignedConversation, ...prev];
                  } else {
                    // Conversation đã có → update
                   
                    const updatedConversations = [...prev];
                    updatedConversations[convIndex] = assignedConversation;
                    return updatedConversations;
                  }
                } else if (filterStatus === undefined) {
                  // Tab "Tất cả" → update nếu đã có, không thêm nếu chưa có (vì có thể đã có trong WAITING)
                  if (convIndex !== -1) {
                    const updatedConversations = [...prev];
                    updatedConversations[convIndex] = assignedConversation;
                    return updatedConversations;
                  }
                }
              }
              
              // Nếu conversation được assign cho người khác (không phải mình)
              if (!isAssignedToMe && isAssignedFromMe) {
                // Nếu đang ở tab "Đang xử lý" (ACTIVE) → remove khỏi danh sách
                if (filterStatus === ConversationStatus.ACTIVE && convIndex !== -1) {
                  
                  return prev.filter((c) => c.id !== assignedConversation.id);
                } else if (filterStatus === undefined) {
                  // Tab "Tất cả" → update nếu đã có (có thể chuyển từ ACTIVE sang WAITING)
                  if (convIndex !== -1) {
                    const updatedConversations = [...prev];
                    updatedConversations[convIndex] = assignedConversation;
                    return updatedConversations;
                  }
                }
              }
              
              // Nếu conversation được assign giữa 2 người khác → update nếu đã có trong danh sách
              if (!isAssignedToMe && !isAssignedFromMe && convIndex !== -1) {
               
                const updatedConversations = [...prev];
                updatedConversations[convIndex] = assignedConversation;
                return updatedConversations;
              }
              
              return prev;
            });
          }
        }
      } catch (error) {
        console.error(
          "[EmployeeConversations] Failed to process support queue event:",
          error
        );
      }
    };

    // Subscribe to support queue: /topic/staff/support-queue (broadcast) và /user/queue/staff/support-queue (personal)
    // Subscribe cả 2 để đảm bảo nhận được event từ backend
    const unsubscribeSupportQueue = subscribeToSupportQueue(
      handleSupportQueueEvent
    );
    const unsubscribeSupportQueuePersonal = subscribeToSupportQueuePersonal(
      handleSupportQueueEvent
    );

    // Subscribe to selected conversation topic if available
    let unsubscribeConversation: (() => void) | undefined;
    if (selectedConversationId) {
     
      unsubscribeConversation = subscribeToConversation(
        selectedConversationId,
        (data: unknown) => {
          
          try {
            // Backend sends: { data: Message, type: string, timestamp: string }
            const messageWrapper = data as { data?: Message; type?: string };
            const incomingMessage = messageWrapper.data || (data as Message);

            if (!incomingMessage || !incomingMessage.id) {
              console.warn(
                "[EmployeeConversations] Invalid message structure:",
                data
              );
              return;
            }

            handleMessageUpdate(incomingMessage);
          } catch (error) {
            console.error(
              "[EmployeeConversations] Failed to process conversation message:",
              error
            );
          }
        }
      );
    }

    return () => {
    
      unsubscribePersonal();
      unsubscribeConversationUpdates();
      unsubscribeSupportQueue();
      unsubscribeSupportQueuePersonal();
      if (unsubscribeConversation) {
        unsubscribeConversation();
      }
    };
  }, [
    wsConnected,
    subscribeToPersonalMessages,
    subscribeToConversation,
    subscribeToConversationUpdates,
    subscribeToSupportQueue,
    subscribeToSupportQueuePersonal,
    filterStatus,
    currentUserId,
    selectedConversationId,
    selectedConversationId,
    filterStatus,
  ]);

  /**
   * Select conversation
   */
  const selectConversation = useCallback((conversationId: string | null) => {
    setSelectedConversationId(conversationId);
  }, []);

  /**
   * Get selected conversation
   */
  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  /**
   * Update search keyword
   */
  const updateSearchKeyword = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  /**
   * Update filter type
   */
  const updateFilterType = useCallback((type: ConversationType | undefined) => {
    setFilterType(type);
  }, []);

  /**
   * Update filter status
   */
  const updateFilterStatus = useCallback(
    (status: ConversationStatus | undefined) => {
      setFilterStatus(status);
    },
    []
  );

  /**
   * Get unread count
   */
  const unreadCount = conversations.reduce(
    (count, conv) => count + (conv.unreadCount || 0),
    0
  );

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedConversationId(null);
  }, []);

  return {
    // State
    conversations: filteredConversations,
    allConversations: conversations,
    selectedConversation,
    selectedConversationId,
    isInitializing,
    unreadCount,
    searchKeyword,
    filterType,
    filterStatus,

    // Loading states
    loadingConversations,

    // WebSocket status
    wsConnected,

    // Actions
    initialize,
    refreshConversations,
    selectConversation,
    clearSelection,
    updateSearchKeyword,
    updateFilterType,
    updateFilterStatus,
  };
};
