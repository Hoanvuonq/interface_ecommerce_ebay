import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useChatStore } from "../../_store/chatStore";
import {
  useGetMessages,
  useSendMessage,
  useDeleteMessage,
} from "../useMessage";
import { orderService } from "@/services/orders/order.service";
import { publicProductService } from "@/services/products/product.service";
import { usePresignedUpload } from "@/hooks/usePresignedUpload"; // Hook của bạn
import { UploadContext } from "@/types/storage/storage.types"; // Enum context
import { MessageType } from "../../_types/chat.dto";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";
import { useMemo } from "react";

export const useChatLogic = () => {
  const store = useChatStore();
  const { success: toastSuccess, error: toastError } = useToast();

  // API Hooks
  const { handleGetMessages } = useGetMessages();
  const { handleSendMessage } = useSendMessage();
  const { handleDeleteMessage } = useDeleteMessage();

  // 👇 SỬ DỤNG HOOK CỦA BẠN (CHỈ LẤY uploadFile)
  const { uploadFile } = usePresignedUpload();

  // --- 1. GET MESSAGES ---
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
    const serverMessages = _.flatMap(
      messagesData?.pages,
      (page) => page.content || []
    );
    const reversedServerMessages = _.reverse([...serverMessages]);
    const realtimeMsgs =
      store.realtimeMessages[store.activeConversationId || ""] || [];
    return _.uniqBy([...reversedServerMessages, ...realtimeMsgs], "id");
  }, [messagesData, store.realtimeMessages, store.activeConversationId]);

  // --- 2. PICKERS DATA ---
  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["chat", "orders", store.orderSearchText],
    queryFn: async () => {
      const res = await orderService.getBuyerOrdersByShop(
        "shop-id-placeholder",
        0,
        20
      );
      return res.content || [];
    },
    enabled: store.showOrderPicker,
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["chat", "products", store.productSearchText],
    queryFn: async () => {
      const res = await publicProductService.getByShop(
        "shop-id-placeholder",
        0,
        20
      );
      return res.data?.content || [];
    },
    enabled: store.showProductPicker,
  });

  // --- 3. SEND MESSAGE (Đã Fix Logic Upload) ---
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const text = store.messageText.trim();
      const files = store.attachments;

      if (!store.activeConversationId || (!text && files.length === 0)) return;

      // A. Upload Files
      let uploadedAttachments: any[] = [];
      if (files.length > 0) {
        const uploadPromises = files.map(async (att) => {
          // Xác định Context dựa trên loại file
          const context = att.type.startsWith("video")
            ? UploadContext.CHAT_VIDEO
            : UploadContext.CHAT_IMAGE;

          // Gọi hàm uploadFile từ hook của bạn
          const res = await uploadFile(att.file, context);

          // Kiểm tra kết quả trả về từ hook (PresignedUploadResult)
          if (res && res.finalUrl) {
            return {
              fileUrl: res.finalUrl,
              fileName: att.name,
              mimeType: att.file.type, // Lấy từ File gốc
              fileSize: att.size,
            };
          }
          return null;
        });
        const results = await Promise.all(uploadPromises);
        uploadedAttachments = results.filter(Boolean);
      }

      // B. Determine Message Type
      let type = MessageType.TEXT;
      if (uploadedAttachments.length > 0) {
        const mime = uploadedAttachments[0].mimeType || "";
        if (mime.startsWith("image/")) type = MessageType.IMAGE;
        else if (mime.startsWith("video/")) type = MessageType.VIDEO;
        else type = MessageType.FILE;
      }

      // C. Send API
      return await handleSendMessage({
        conversationId: store.activeConversationId,
        content: text,
        type,
        attachments: uploadedAttachments,
        replyToMessageId: store.replyingToMessage?.id,
      });
    },
    onSuccess: (res) => {
      if (res?.success) {
        store.addRealtimeMessage(store.activeConversationId!, res.data);
        store.setUiState({ messageText: "" });
        store.setReplyingTo(null);
        store.clearAttachments();
      }
    },
    onError: () => toastError("Gửi tin nhắn thất bại"),
  });

  // --- 4. REVOKE ---
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

  return {
    messages,
    orders,
    products,
    isInitializing,
    isLoadingMore: isFetchingNextPage,
    loadingOrders,
    loadingProducts,
    isSending: sendMessageMutation.isPending,

    typingUsers: store.typingUsers,
    latestMessageId: store.latestMessageId || null,

    loadMoreMessages: fetchNextPage,
    hasMoreMessages: hasNextPage,
    onSendMessage: sendMessageMutation.mutate,
    onRevokeMessage: revokeMutation.mutate,

    // Refetch manual
    loadInitialMessages: () => isInitializing,
  };
};
