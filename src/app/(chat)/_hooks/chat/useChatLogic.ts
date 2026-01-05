import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useChatStore } from "../../_store/chatStore";
import {
  useGetMessages,
  useSendMessage,
  useDeleteMessage,
  useSendOrderCard,
  useSendProductCard,
  useUpdateMessage,
} from "../useMessage";
import { useFilterConversationsCreatedBy } from "../useConversation";
import { orderService } from "@/services/orders/order.service";
import { publicProductService } from "@/services/products/product.service";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { UploadContext } from "@/types/storage/storage.types";
import {
  ConversationType,
  MessageType,
  ParticipantRole,
  ConversationResponse,
} from "../../_types/chat.dto";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";
import { useMemo, useCallback, useEffect } from "react";
import { getStoredUserDetail } from "@/utils/jwt";
import { toPublicUrl } from "@/utils/storage/url";

export const useChatLogic = (targetShopId?: string) => {
  const store = useChatStore();
  const { success: toastSuccess, error: toastError } = useToast();
  const userDetail = getStoredUserDetail();
  const currentUserId = userDetail?.userId;

  // ... (Các hook API giữ nguyên)
  const { handleGetMessages } = useGetMessages();
  const { handleSendMessage } = useSendMessage();
  const { handleDeleteMessage } = useDeleteMessage();
  const { handleUpdateMessage } = useUpdateMessage();
  const { handleSendOrderCard } = useSendOrderCard();
  const { handleSendProductCard } = useSendProductCard();
  const { handleFilterConversationsCreatedBy } =
    useFilterConversationsCreatedBy();
  const { uploadFile } = usePresignedUpload();

  // --- 1. CONVERSATIONS ---
  const { data: conversationsData, refetch: refetchConversations } = useQuery({
    queryKey: ["chat", "conversations", currentUserId, store.searchText],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await handleFilterConversationsCreatedBy({
        userId: currentUserId,
        createdBy: userDetail?.username,
        keyword: store.searchText,
        types: [ConversationType.BUYER_TO_SHOP],
        page: 0,
        size: 30,
      });

      const items = res?.data?.content || res?.data?.items || res?.data || [];

      // Map dữ liệu và ép kiểu về ConversationResponse
      return items.map((it: any) => ({
        ...it,
        // Đảm bảo map các trường context nếu API trả về tên khác
        contextShopId: it.contextShopId,
        contextProductId: it.contextProductId,
        contextOrderId: it.contextOrderId,
        createdDate: it.createdDate || it.createdAt || new Date().toISOString(),
        lastModifiedDate:
          it.lastModifiedDate ||
          it.lastMessageAt ||
          it.updatedAt ||
          new Date().toISOString(),
      })) as ConversationResponse[];
    },
    enabled: !!currentUserId,
  });
  
useEffect(() => {
  if (conversationsData && !_.isEqual(conversationsData, store.conversations)) {
    store.setConversations(conversationsData);
  }
}, [conversationsData]);

  useEffect(() => {
    const ensureTargetConversation = async () => {
      if (!targetShopId || !currentUserId || !conversationsData) return;

      if (
        store.selectedConversation?.participants?.some(
          (p) => p.user?.userId === targetShopId
        )
      ) {
        return;
      }

      const existingConv = conversationsData.find((c: any) =>
        c.participants?.some((p: any) => p.user?.userId === targetShopId)
      );

      if (existingConv) {
        store.setActiveConversation(existingConv.id, existingConv);
        if (window.innerWidth < 768) {
          store.setUiState({ isMobileChatView: true });
        }
      }
    };
    ensureTargetConversation();
  }, [
    targetShopId,
    currentUserId,
    conversationsData,
    store.selectedConversation,
  ]);

  // --- 2. GET MESSAGES (Giữ nguyên) ---
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInitializing,
  } = useInfiniteQuery({
    queryKey: ["chat", "messages", store.activeConversationId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!store.activeConversationId) return { content: [], totalPages: 0 };
      const res = await handleGetMessages(store.activeConversationId, {
        page: pageParam,
        size: 20,
        sort: "createdDate,desc",
      });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.number < lastPage.totalPages - 1
        ? lastPage.number + 1
        : undefined,
    enabled: !!store.activeConversationId,
  });

  const messages = useMemo(() => {
    if (!store.activeConversationId) return [];

    const storeMsgs =
      store.messagesByConversation[store.activeConversationId] || [];
    const realtimeMsgs =
      store.realtimeMessages[store.activeConversationId] || [];

    return _.uniqBy([...storeMsgs, ...realtimeMsgs], "id");
  }, [
    store.messagesByConversation,
    store.realtimeMessages,
    store.activeConversationId,
  ]);

  const getShopId = useCallback(() => {
    const conv = store.selectedConversation;
    if (!conv) return null;

    if (conv.contextShopId) return conv.contextShopId;

    if (conv.participants) {
      const shopByRole = conv.participants.find(
        (p) => p.role === ParticipantRole.SHOP
      );
      // Sử dụng optional chaining (?.) an toàn
      if (shopByRole?.user?.shopId) return shopByRole.user.shopId;

      const otherParticipant = conv.participants.find(
        (p) => p.user?.userId !== currentUserId
      );
      if (otherParticipant?.user?.shopId) return otherParticipant.user.shopId;
    }
    return null;
  }, [store.selectedConversation, currentUserId]);

  // Helper lấy Avatar (Chuẩn)
  const getShopAvatar = useCallback(
    (conv: ConversationResponse | null | undefined) => {
      // 0. Base check
      if (!conv) return undefined;

      // 1. Tìm người đóng vai trò SHOP
      const shopParticipant = conv.participants?.find(
        (p) => p.role === ParticipantRole.SHOP
      );

      // Nếu tìm thấy shop và có logo
      if (shopParticipant?.user?.logoUrl) {
        return toPublicUrl(shopParticipant.user.logoUrl);
      }

      // 2. Fallback: Tìm người không phải mình (trong chat 1-1 thì đó là đối phương)
      if (currentUserId) {
        const otherParticipant = conv.participants?.find(
          (p) => p.user?.userId !== currentUserId
        );

        if (otherParticipant?.user) {
          // Ưu tiên logoUrl -> image
          const url =
            otherParticipant.user.logoUrl || otherParticipant.user.image;
          if (url) return toPublicUrl(url);
        }
      }

      // 3. Cuối cùng dùng avatar của conversation (nếu có)
      return conv.avatarUrl ? toPublicUrl(conv.avatarUrl) : undefined;
    },
    [currentUserId]
  );

  // Helper lấy Tên (Chuẩn)
  const getShopName = useCallback(
    (conv: ConversationResponse | null | undefined) => {
      if (!conv) return "Shop";

      // 1. Tìm shop theo role
      const shopParticipant = conv.participants?.find(
        (p) => p.role === ParticipantRole.SHOP
      );
      if (shopParticipant?.user) {
        return (
          shopParticipant.user.shopName ||
          shopParticipant.user.username ||
          "Shop"
        );
      }

      // 2. Fallback tìm đối phương
      if (currentUserId) {
        const otherParticipant = conv.participants?.find(
          (p) => p.user?.userId !== currentUserId
        );
        if (otherParticipant?.user) {
          return (
            otherParticipant.user.shopName ||
            otherParticipant.user.fullNameEmployee ||
            otherParticipant.user.username ||
            "Shop"
          );
        }
      }

      return conv.name || "Shop";
    },
    [currentUserId]
  );

  // --- 4. DATA FETCHING CHO PICKER ---
  // Sử dụng getShopId() trực tiếp
  const activeShopId = getShopId();

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["chat", "orders", activeShopId, store.orderSearchText],
    queryFn: async () => {
      if (!activeShopId) return [];
      const res = await orderService.getBuyerOrdersByShop(activeShopId, 0, 20);
      return res.content || [];
    },
    enabled: store.showOrderPicker && !!activeShopId,
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["chat", "products", activeShopId, store.productSearchText],
    queryFn: async () => {
      if (!activeShopId) return [];
      const res = await publicProductService.getByShop(activeShopId, 0, 20);
      return res.data?.content || [];
    },
    enabled: store.showProductPicker && !!activeShopId,
  });

  // --- 5. MUTATIONS (Send/Revoke) - Giữ nguyên logic ---
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const text = store.messageText.trim();
      const files = store.attachments;

      if (!store.activeConversationId || (!text && files.length === 0)) return;

      let uploadedAttachments: any[] = [];
      if (files.length > 0) {
        const uploadPromises = files.map(async (att) => {
          const context = att.type.startsWith("video")
            ? UploadContext.CHAT_VIDEO
            : UploadContext.CHAT_IMAGE;
          const res = await uploadFile(att.file, context);
          if (res && res.finalUrl) {
            return {
              fileUrl: res.finalUrl,
              fileName: att.name,
              mimeType: att.file.type,
              fileSize: att.size,
            };
          }
          return null;
        });
        const results = await Promise.all(uploadPromises);
        uploadedAttachments = results.filter(Boolean);
      }

      let type = MessageType.TEXT;
      if (uploadedAttachments.length > 0) {
        const mime = uploadedAttachments[0].mimeType || "";
        if (mime.startsWith("image/")) type = MessageType.IMAGE;
        else if (mime.startsWith("video/")) type = MessageType.VIDEO;
        else type = MessageType.FILE;
      }

      if (store.editingMessage) {
        return await handleUpdateMessage(store.editingMessage.id, {
          content: text,
        });
      } else {
        return await handleSendMessage({
          conversationId: store.activeConversationId,
          content: text,
          type,
          attachments: uploadedAttachments,
          replyToMessageId: store.replyingToMessage?.id,
        });
      }
    },
    onSuccess: (res) => {
      if (res?.success) {
        if (store.editingMessage) {
          store.updateMessageInList(
            store.activeConversationId!,
            store.editingMessage.id,
            res.data
          );
          store.setUiState({ editingMessage: null });
        } else {
          store.addRealtimeMessage(store.activeConversationId!, res.data);
        }
        store.setUiState({ messageText: "" });
        store.setReplyingTo(null);
        store.clearAttachments();
      }
    },
    onError: () => toastError("Gửi tin nhắn thất bại"),
  });

  const sendCardMutation = useMutation({
    mutationFn: async (params: {
      type: "order" | "product";
      id: string;
      message: string;
    }) => {
      if (!store.activeConversationId) return;
      if (params.type === "order") {
        return await handleSendOrderCard({
          conversationId: store.activeConversationId,
          orderId: params.id,
          message: params.message,
        });
      } else {
        return await handleSendProductCard({
          conversationId: store.activeConversationId,
          productId: params.id,
          message: params.message,
        });
      }
    },
    onSuccess: (res) => {
      if (res?.success) {
        store.addRealtimeMessage(store.activeConversationId!, res.data);
        store.setUiState({
          showOrderPicker: false,
          showProductPicker: false,
        });
      }
    },
    onError: () => toastError("Gửi thông tin thất bại"),
  });

  const revokeMutation = useMutation({
    mutationFn: async (msgId: string) => {
      return await handleDeleteMessage(msgId, {
        deleteType: "DELETE_FOR_EVERYONE",
      });
    },
    onSuccess: (_, msgId) => {
      toastSuccess("Đã thu hồi tin nhắn");
      if (store.activeConversationId) {
        store.updateMessageInList(store.activeConversationId, msgId, {
          content: "",
          deletedAt: new Date().toISOString(),
          deletedType: "DELETE_FOR_EVERYONE",
        });
      }
    },
    onError: () => toastError("Không thể thu hồi tin nhắn"),
  });
  useEffect(() => {
    if (messagesData?.pages && store.activeConversationId) {
      const allFetchedMessages = _.flatMap(
        messagesData.pages,
        (page) => page.content || []
      );
      const reversed = _.reverse([...allFetchedMessages]);

      store.setMessages(store.activeConversationId, reversed);
    }
  }, [messagesData, store.activeConversationId]);



useEffect(() => {
  if (store.activeConversationId && messagesData?.pages) {
    // Gộp tất cả các trang tin nhắn lại
    const allFetchedMessages = _.flatMap(
      messagesData.pages,
      (page) => page.content || []
    );

    // Sắp xếp theo thời gian tăng dần (cũ trên, mới dưới) để MessageList render đúng
    const sorted = _.orderBy(allFetchedMessages, [(m) => new Date(m.createdDate).getTime()], ['asc']);
    
    store.setMessages(store.activeConversationId, sorted);
  }
}, [messagesData, store.activeConversationId]); 

  return {
    messages,
    conversations: conversationsData || [],
    orders,
    products,
    isInitializing,
    isLoadingMore: isFetchingNextPage,
    loadingOrders,
    loadingProducts,
    isSending: sendMessageMutation.isPending || sendCardMutation.isPending,
    activeConversationId: store.activeConversationId,
    typingUsers: store.typingUsers,
    latestMessageId: store.latestMessageId || null,

    // Export Helpers
    getShopAvatar,
    getShopName,

    loadMoreMessages: fetchNextPage,
    hasMoreMessages: hasNextPage,
    onSendMessage: sendMessageMutation.mutate,
    onRevokeMessage: revokeMutation.mutate,
    onSendOrderCard: (orderId: string, message: string) =>
      sendCardMutation.mutate({ type: "order", id: orderId, message }),
    onSendProductCard: (productId: string, message: string) =>
      sendCardMutation.mutate({ type: "product", id: productId, message }),
    refetchConversations,
    loadInitialMessages: () => isInitializing,
  };
};
