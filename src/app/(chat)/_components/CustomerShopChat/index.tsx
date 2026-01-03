// "use client";

// import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { ConversationList } from "../ConversationList";
// import { ChatEmptyState } from "../ChatEmptyState";
// import { ChatHeader } from "../ChatHeader";
// import { QuickReplies } from "../QuickReplies";
// import { ProductPicker } from "../ProductPicker";
// import { ChatInputArea } from "../ChatInputArea";
// import { OrderPicker } from "../OrderPicker";
// import { MessageList } from "../MessageList";
// import {
//   Drawer,
//   Input,
//   Button,
//   Menu,
//   Alert,
//   App,
//   Popconfirm,
//   message as antMessage,
// } from "antd";
// import type { MenuProps } from "antd";
// import type { UploadFile, UploadProps } from "antd";
// import {
//   SearchOutlined,

//   InfoCircleOutlined,
//   VideoCameraOutlined,
//   ShoppingCartOutlined,
//   RollbackOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   CloseOutlined,
// } from "@ant-design/icons";

// import { ImageAttachment } from "../ImageAttachment";
// import { VideoAttachment } from "../VideoAttachment";
// import { FileAttachment } from "../FileAttachment";
// import { AudioAttachment } from "../AudioAttachment";
// import { TypingIndicator } from "../TypingIndicator";
// import { usePresignedUpload} from "@/hooks/usePresignedUpload";
// import { UploadContext } from "@/types/storage/storage.types";
// let EmojiPicker: React.ComponentType<any> | null = null;
// try {
//   EmojiPicker = require("emoji-picker-react").default;
// } catch {
//   console.log("Emoji picker not available");
// }
// import { useFilterConversationsCreatedBy } from "../../_hooks";
// import {
//   ConversationType,
//   ConversationStatus,
//   MessageType,
//   AttachmentType,
//   ConversationResponse,
//   MessageResponse,
//   QuickReply,
//   MessageStatus,
//   ParticipantRole,
// }  from "../../_types/chat.dto";
// import { RoleEnum } from "@/auth/_types/auth";
// import {
//   useGetMessages,
//   useSendMessage,
//   useUpdateMessage,
//   useDeleteMessage,
//   useSendOrderCard,
//   useSendProductCard,
// } from "../../_hooks";
// import { orderService } from "@/services/orders/order.service";
// import { publicProductService } from "@/services/products/product.service";
// import { toPublicUrl } from "@/utils/storage/url";
// import type { Message as ChatMessage, Conversation, ChatUser }  from "../../_types/chat.type";
// // import { isMessageDeleted } from "@/app/(chat)/_services";
// import { isMessageDeleted } from "../../_services/chat-utils.service";

// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";
// import { useRouter } from "next/navigation";
// const createdShopConversationsCache = new Set<string>();
// import { QUICK_REPLIES } from "../../_constants/quickReplies";
// import { MessageContent } from "../MessageContent";
// import { BadgeWrapper } from "../BadgeWrapper";
// import { DeleteMessageModal } from "../DeleteMessageModal";
// import _ from "lodash";

// // Hooks & Store
// import { useChatStore } from "../../_store/chatStore";
// import { useChatLogic } from "../../_hooks/chat/useChatLogic";
// import { useChatWebSocket, useWebSocketContext } from "@/providers/WebSocketProvider";
// import { getStoredUserDetail } from "@/utils/jwt";
// import { CustomerShopChatProps,resolveOrderItemImageUrl } from "../../_types/customerShopChat.type";

// export const CustomerShopChat: React.FC<CustomerShopChatProps> = ({
//   open,
//   onClose,
//   height = 640,
//   targetShopId,
//   targetShopName,
// }) => {
//   const store = useChatStore();
//   const { loadInitialMessages, onSendMessage, onRevokeMessage } = useChatLogic();
// const [deleteConfirmMsg, setDeleteConfirmMsg] = useState<any>(null);

//   const [conversations, setConversations] = useState<ConversationResponse[]>([]);
//   const [messagesByConversation, setMessagesByConversation] = useState<
//     Record<string, ChatMessage[]>
//   >({});
//   const [selectedConversation, setSelectedConversation] =
//     useState<ConversationResponse | null>(null);
//   const [activeConversationId, setActiveConversationId] = useState<
//     string | null
//   >(null);

//   const [attachments, setAttachments] = useState<UploadFile[]>([]);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);
//   const emojiPickerRef = useRef<HTMLDivElement>(null);
  
//   const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);
//   const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
//   const inputRef = useRef<any>(null);
  
//   const [showOrderPicker, setShowOrderPicker] = useState(false);
//   const [showProductPicker, setShowProductPicker] = useState(false);
//   const [orders, setOrders] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [loadingOrders, setLoadingOrders] = useState(false);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
//   const [sendingOrderCard, setSendingOrderCard] = useState(false);
//   const [sendingProductCard, setSendingProductCard] = useState(false);
//   const [orderSearchText, setOrderSearchText] = useState("");
//   const [productSearchText, setProductSearchText] = useState("");


//   const { uploadFile: uploadFilePresigned, uploading: isUploading } = usePresignedUpload();

//   const activeConversationIdRef = useRef<string | null>(null);
//   useEffect(() => {
//     activeConversationIdRef.current = activeConversationId;
//   }, [activeConversationId]);

//   const fetchConversationsRef = useRef<(() => Promise<void>) | null>(null);

//   const [searchText, setSearchText] = useState("");
//   const [messageText, setMessageText] = useState("");
//   const [showQuickReplies, setShowQuickReplies] = useState(false);
//   const [isMobileChatView, setIsMobileChatView] = useState(false);
//   const [isInitializingMessages, setIsInitializingMessages] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [conversationPagination, setConversationPagination] = useState<
//     Record<string, { page: number; hasMore: boolean }>
//   >({});
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   const previousScrollHeight = useRef(0);
//   const isLoadingMoreRef = useRef(false);
//   const { handleFilterConversationsCreatedBy } = useFilterConversationsCreatedBy();
//   const { handleGetMessages, loading: loadingMessages } = useGetMessages();
//   const { handleSendMessage } = useSendMessage();
//   const { handleUpdateMessage } = useUpdateMessage();
//   const { handleDeleteMessage: deleteMessageAPI } = useDeleteMessage();
//   const { handleSendOrderCard: sendOrderCardApi } = useSendOrderCard();
//   const { handleSendProductCard: sendProductCardApi } = useSendProductCard();
//   const { modal } = App.useApp();
//   const {
//     subscribeToConversation,
//     subscribeToPersonalMessages,
//     subscribeToConversationUpdates,
//     connected: wsConnected,
//   } = useChatWebSocket();
//   const { connect, disconnect } = useWebSocketContext();
//   const router = useRouter();
//   const [newMessageAlert, setNewMessageAlert] = useState(false);
//   const [latestMessageId, setLatestMessageId] = useState<string | null>(null);
//   const prevMessageCountRef = useRef(0);
//   const userDetail = getStoredUserDetail();
//   const currentUserId = userDetail?.userId;
//   const createdBy = userDetail?.username;

//   // Ref để lấy currentUserId mới nhất (tránh stale closure trong WebSocket handlers)
//   const currentUserIdRef = useRef<string | undefined>(currentUserId);
//   useEffect(() => {
//     currentUserIdRef.current = currentUserId;
//   }, [currentUserId]);

//   const userHasRole = useCallback((user: ChatUser | null | undefined, role: RoleEnum) => {
//     if (!user || !role) return false;

//     const normalize = (value?: string | RoleEnum) =>
//       typeof value === "string" ? value.toUpperCase() : value;

//     if (Array.isArray(user.roles) && user.roles.length > 0) {
//       return user.roles.some((r) => normalize(r) === role);
//     }

//     const fallback = user.role ?? user.roleName;
//     return normalize(fallback) === role;
//   }, []);

//   /**
//    * Helper function để lấy shop participant
//    * Xử lý trường hợp user có nhiều role: dùng ParticipantRole.SHOP (role trong conversation)
//    * Giống ShopCustomerChatWidget.tsx
//    */
//   const getShopParticipant = useCallback((conv: Conversation | ConversationResponse | null) => {
//     if (!conv || !conv.participants || conv.participants.length === 0 || !currentUserId) {
//       return null;
//     }
    
//     // Ưu tiên 1: Tìm participant có ParticipantRole.SHOP (role trong conversation)
//     // Đây là cách đúng để xác định shop khi user có nhiều role
//     const shopByRole = conv.participants.find(
//       (p) => p.role === ParticipantRole.SHOP
//     );
//     if (shopByRole) {
//       return shopByRole;
//     }
    
//     // Ưu tiên 2: Tìm participant không phải current user và có user.role === SHOP
//     // (fallback cho trường hợp không có ParticipantRole)
//     const shopByUserRole = conv.participants.find(
//       (p) => p.user?.userId !== currentUserId && userHasRole(p.user as ChatUser, RoleEnum.SHOP)
//     );
//     if (shopByUserRole) {
//       return shopByUserRole;
//     }
    
//     // Ưu tiên 3: Tìm participant không phải current user (fallback cuối cùng)
//     const otherParticipant = conv.participants.find(
//       (p) => p.user?.userId !== currentUserId
//     );
//     return otherParticipant || null;
//   }, [currentUserId, userHasRole]);

//   /**
//    * Helper function để lấy shop name từ conversation
//    * Ưu tiên lấy trực tiếp từ participant.user
//    */
//   const getShopName = useCallback((conv: Conversation | ConversationResponse | null) => {
//     const shop = getShopParticipant(conv);
//     console.log("shop", shop);
//     if (!shop) {
//       return conv?.name || "Shop";
//     }
//     // Ưu tiên lấy trực tiếp từ participant.user: shopName > username > conv.name
//     return shop.user?.shopName || 
//            shop.user?.username || 
//            conv?.name || 
//            "Shop";
//   }, [getShopParticipant]);

//   /**
//    * Helper function để lấy shop avatar từ conversation
//    * Ưu tiên lấy trực tiếp từ participant.user
//    */
//   const getShopAvatar = useCallback((conv: Conversation | ConversationResponse | null) => {
//     const shop = getShopParticipant(conv);
//     if (!shop) {
//       return conv?.avatarUrl;
//     }
//     // Ưu tiên lấy trực tiếp từ participant.user: logoUrl > image > conv.avatarUrl
//     return shop.user?.logoUrl || 
//            shop.user?.image || 
//            conv?.avatarUrl || 
//            undefined;
//   }, [getShopParticipant]);

//   /**
//    * Helper function để lấy shopId từ conversation
//    * Xử lý trường hợp user có nhiều role: dùng ParticipantRole.SHOP để xác định shop
//    */
//   const getShopId = useCallback((conv: Conversation | ConversationResponse | null): string | null => {
//     if (!conv) return null;
    
//     // 1. Ưu tiên lấy từ contextShopId nếu có (từ ConversationResponse)
//     if ('contextShopId' in conv && conv.contextShopId) {
//       console.log("[CustomerShopChat] getShopId: Found from contextShopId:", conv.contextShopId);
//       return conv.contextShopId;
//     }
    
//     // 2. Lấy từ participants - tìm participant có ParticipantRole.SHOP (role trong conversation)
//     // Đây là cách đúng để xác định shop khi user có nhiều role
//     if ('participants' in conv && conv.participants && conv.participants.length > 0) {
//       // Ưu tiên: Tìm participant có ParticipantRole.SHOP
//       const shopByParticipantRole = conv.participants.find(
//         (p) => p.role === ParticipantRole.SHOP
//       );
//       if (shopByParticipantRole?.user?.shopId) {
//         console.log("[CustomerShopChat] getShopId: Found from ParticipantRole.SHOP:", shopByParticipantRole.user.shopId);
//         return shopByParticipantRole.user.shopId;
//       }
      
//       // Fallback: Dùng getShopParticipant (có logic xử lý nhiều role)
//       const shop = getShopParticipant(conv as Conversation);
//       if (shop?.user?.shopId) {
//         console.log("[CustomerShopChat] getShopId: Found from getShopParticipant:", shop.user.shopId);
//         return shop.user.shopId;
//       }
//     }
    
//     // 3. Nếu có targetShopId, kiểm tra xem có phải shopId không
//     // (targetShopId có thể là shopId hoặc userId, cần kiểm tra trong participants)
//     if (targetShopId) {
//       if ('participants' in conv && conv.participants && conv.participants.length > 0) {
//         // Tìm participant có ParticipantRole.SHOP và shopId/userId khớp với targetShopId
//         const matchingParticipant = conv.participants.find(
//           (p) => p.role === ParticipantRole.SHOP && 
//                  (p.user?.shopId === targetShopId || p.user?.userId === targetShopId)
//         );
//         if (matchingParticipant?.user?.shopId) {
//           console.log("[CustomerShopChat] getShopId: Found from targetShopId match (ParticipantRole.SHOP):", matchingParticipant.user.shopId);
//           return matchingParticipant.user.shopId;
//         }
        
//         // Fallback: Tìm participant có shopId = targetShopId hoặc userId = targetShopId
//         const fallbackMatch = conv.participants.find(
//           (p) => (p.user?.shopId === targetShopId || p.user?.userId === targetShopId) &&
//                  (userHasRole(p.user as ChatUser, RoleEnum.SHOP) || p.role === ParticipantRole.SHOP)
//         );
//         if (fallbackMatch?.user?.shopId) {
//           console.log("[CustomerShopChat] getShopId: Found from targetShopId fallback:", fallbackMatch.user.shopId);
//           return fallbackMatch.user.shopId;
//         }
//       }
//     }
    
//     console.warn("[CustomerShopChat] getShopId: No shopId found in conversation:", conv);
//     return null;
//   }, [getShopParticipant, targetShopId, userHasRole]);

//   const isMyMessage = useCallback(
//     (message: ChatMessage | undefined) => {
//       if (!message) return false;
//       // Check user.userId (API trả về ở user.userId)
//       const messageSenderId = message.user?.userId;
//       return messageSenderId === currentUserId;
//     },
//     [currentUserId]
//   );

//   // Helper functions để lấy thông tin sender từ message
//   const getMessageSender = useCallback((message: ChatMessage | MessageResponse): "customer" | "shop" | "system" => {
//     const messageSenderId = message.user?.userId;
//     const isMine = messageSenderId === currentUserId;
//     return isMine ? "customer" : "shop";
//   }, [currentUserId]);

//   const getMessageSenderName = useCallback((message: ChatMessage | MessageResponse): string => {
//     const messageSenderId = message.user?.userId;
//     const isMine = messageSenderId === currentUserId;
//     if (isMine) {
//       return "Bạn";
//     }
//     // Ưu tiên kiểm tra đối phương có shopName/shopId/logoUrl (không dùng role)
//     const hasShopInfo = !!(message.user?.shopName || message.user?.shopId || message.user?.logoUrl);
//     if (hasShopInfo) {
//       return message.user?.shopName || message.user?.username || "Shop";
//     }
//     return message.user?.fullNameBuyer ||
//       message.user?.fullNameEmployee ||
//       message.user?.username ||
//       "Shop";
//   }, [currentUserId]);

//   const getMessageSenderAvatar = useCallback((message: ChatMessage | MessageResponse): string | undefined => {
//     const messageSenderId = message.user?.userId;
//     const isMine = messageSenderId === currentUserId;
//     if (isMine) {
//       return undefined;
//     }
//     // Ưu tiên kiểm tra đối phương có shopName/shopId/logoUrl (không dùng role)
//     const hasShopInfo = !!(message.user?.shopName || message.user?.shopId || message.user?.logoUrl);
//     if (hasShopInfo) {
//       // Nếu có shop info → ưu tiên logoUrl, nếu không có thì fallback về image
//       const logoUrl = message.user?.logoUrl;
//       const image = message.user?.image;
//       if (logoUrl) {
//         return toPublicUrl(logoUrl);
//       }
//       if (image) {
//         return toPublicUrl(image);
//       }
//       return undefined;
//     }
//     // Mặc định → image
//     const image = message.user?.image;
//     if (image) {
//       return toPublicUrl(image);
//     }
//     return undefined;
//   }, [currentUserId]);

//   const messages = useMemo(() => {
//     if (!activeConversationId) return [];
//     const chatMessages = messagesByConversation[activeConversationId] || [];
//     return chatMessages;
//   }, [activeConversationId, messagesByConversation]);



//   const loadMoreMessages = useCallback(async () => {
//     if (!activeConversationId) return;
//     const pagination = conversationPagination[activeConversationId];

//     if (isLoadingMore || !hasMoreMessages || pagination?.hasMore === false) {
//       return;
//     }

//     try {
//       setIsLoadingMore(true);
//       isLoadingMoreRef.current = true;
//       const nextPage = (pagination?.page ?? currentPage) + 1;
//       const response = await handleGetMessages(activeConversationId, {
//         page: nextPage,
//         size: 20,
//         sort: "createdDate,desc",
//       });

//       if (response?.success && response?.data) {
//         const data = response.data;
//         const items = Array.isArray(data)
//           ? data
//           : data?.content || data?.items || [];
//         const totalPages = Array.isArray(data) ? 1 : data?.totalPages ?? 1;

//         if (Array.isArray(items) && items.length > 0) {
//           setMessagesByConversation((prev) => {
//             const existing = prev[activeConversationId] || [];
//             return {
//               ...prev,
//               [activeConversationId]: [...[...items].reverse(), ...existing],
//             };
//           });
//           const hasMore =
//             totalPages > 1 ? nextPage < totalPages - 1 : items.length === 20;
//           setConversationPagination((prev) => ({
//             ...prev,
//             [activeConversationId]: { page: nextPage, hasMore },
//           }));
//           setHasMoreMessages(hasMore);
//           setCurrentPage(nextPage);
//         } else {
//           setConversationPagination((prev) => ({
//             ...prev,
//             [activeConversationId]: {
//               page: pagination?.page ?? 0,
//               hasMore: false,
//             },
//           }));
//           setHasMoreMessages(false);
//         }
//       }
//     } catch (error) {
//       console.error("[CustomerShopChat] Failed to load more messages", error);
//     } finally {
//       setIsLoadingMore(false);
//       isLoadingMoreRef.current = false;
//     }
//   }, [
//     activeConversationId,
//     conversationPagination,
//     currentPage,
//     handleGetMessages,
//     hasMoreMessages,
//     isLoadingMore,
//   ]);

//   const sendMessage = useCallback(
//     async (content: string) => {
//       console.log("[CustomerShopChat] sendMessage called:", {
//         activeConversationId,
//         content: content.trim(),
//         currentUserId,
//       });

//       if (!activeConversationId || !content.trim()) {
//         console.warn(
//           "[CustomerShopChat] sendMessage blocked - missing conversation or content:",
//           {
//             activeConversationId,
//             content: content.trim(),
//           }
//         );
//         return false;
//       }
//       if (!currentUserId) {
//         console.warn(
//           "[CustomerShopChat] sendMessage blocked - no currentUserId"
//         );
//         return false;
//       }

//       try {
//         setSendingMessage(true);
//         console.log("[CustomerShopChat] Calling handleSendMessage...");
//         const response = await handleSendMessage({
//           conversationId: activeConversationId,
//           content: content.trim(),
//           type: MessageType.TEXT,
//           replyToMessageId: replyingToMessage?.id,
//         });

//         console.log("[CustomerShopChat] handleSendMessage response:", response);

//         if (response?.success && response?.data) {
//           const newMessage: ChatMessage = response.data;

//           // Optimistic update: thêm message vào conversation messages
//           setMessagesByConversation((prev) => {
//             const existing = prev[activeConversationId] || [];
//             const alreadyExists = existing.some(
//               (msg) => msg.id === newMessage.id
//             );
//             if (alreadyExists) {
//               return prev;
//             }
//             return {
//               ...prev,
//               [activeConversationId]: [...existing, newMessage],
//             };
//           });

//           // Update conversation list và đẩy lên đầu (giống ShopCustomerChatWidget.tsx)
//           setConversations((prev) => {
//             const convIndex = prev.findIndex(
//               (conv) => conv.id === activeConversationId
//             );

//             if (convIndex === -1) {
//               // Conversation không tìm thấy → không cập nhật
//               return prev;
//             }

//             // Update conversation và move lên đầu
//             const updatedConversations = [...prev];
//             const [conversation] = updatedConversations.splice(convIndex, 1);

//             const messageSenderId = newMessage.user?.userId;
//             const isMine = messageSenderId === currentUserId;
//             const sender = isMine ? "customer" : "shop";

//             let senderName: string;
//             let senderAvatar: string | undefined;
//             if (isMine) {
//               senderName = "Bạn";
//               senderAvatar = undefined;
//             } else {
//               // Ưu tiên kiểm tra đối phương có shopName/shopId/logoUrl (không dùng role)
//               const hasShopInfo = !!(newMessage.user?.shopName || newMessage.user?.shopId || newMessage.user?.logoUrl);
//               if (hasShopInfo) {
//                 senderName = newMessage.user?.shopName || newMessage.user?.username || "Shop";
//                 senderAvatar = newMessage.user?.logoUrl || undefined;
//               } else {
//                 senderName = newMessage.user?.fullNameBuyer ||
//                   newMessage.user?.fullNameEmployee ||
//                   newMessage.user?.username ||
//                   "Shop";
//                 senderAvatar = newMessage.user?.image || undefined;
//               }
//             }

//             const updatedConversation: ConversationResponse = {
//               ...conversation,
//               lastMessageId: newMessage.id,
//               lastMessageAt: newMessage.sentAt,
//               lastMessagePreview: newMessage.content || "",
//               lastModifiedDate: newMessage.sentAt, // Backend dùng lastModifiedDate
//             };

//             // Move lên đầu danh sách
//             return [updatedConversation, ...updatedConversations];
//           });

//           // Clear reply state after sending
//           setReplyingToMessage(null);
//           console.log("[CustomerShopChat] Message added to state successfully");
//           return true;
//         }
//         console.warn(
//           "[CustomerShopChat] handleSendMessage returned unsuccessful response"
//         );
//         return false;
//       } catch (error) {
//         console.error("[CustomerShopChat] Failed to send message", error);
//         return false;
//       } finally {
//         setSendingMessage(false);
//       }
//     },
//     [activeConversationId, currentUserId, handleSendMessage, replyingToMessage]
//   );

//   const scrollToBottom = useCallback((smooth = true) => {
//     if (smooth) {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     } else {
//       messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
//     }
//   }, []);

//   // Get status text helper
//   const getStatusText = useCallback((status?: string) => {
//     const map: Record<string, string> = {
//       PENDING: "Chờ xác nhận",
//       PENDING_PAYMENT: "Chờ thanh toán",
//       CONFIRMED: "Đã xác nhận",
//       PROCESSING: "Đang xử lý",
//       FULFILLING: "Đang xử lý",
//       SHIPPED: "Đang giao",
//       DELIVERED: "Đã giao",
//       COMPLETED: "Hoàn thành",
//       CANCELLED: "Đã hủy",
//     };
//     return map[status || ""] || status;
//   }, []);

//   // Fetch orders của buyer với shop cụ thể
//   const fetchOrders = useCallback(async () => {
//     const shopId = getShopId(selectedConversation);
//     if (!shopId) {
//       console.warn("[CustomerShopChat] No shopId found for selectedConversation:", selectedConversation);
//       return;
//     }
    
//     console.log("[CustomerShopChat] Fetching orders for shopId:", shopId);

//     try {
//       setLoadingOrders(true);
//       const result = await orderService.getBuyerOrdersByShop(shopId, 0, 20);
//       console.log("orders", result);
//       console.log("[CustomerShopChat] Orders:", result);
//       setOrders(result.content || []);
//     } catch (error) {
//       console.error("[CustomerShopChat] Failed to fetch orders:", error);
//       setOrders([]);
//     } finally {
//       setLoadingOrders(false);
//     }
//   }, [selectedConversation, getShopId]);

//   // Fetch products của shop
//   const fetchProducts = useCallback(async () => {
//     const shopId = getShopId(selectedConversation);
//     if (!shopId) {
//       console.warn("[CustomerShopChat] No shopId found for selectedConversation:", selectedConversation);
//       return;
//     }
    
//     console.log("[CustomerShopChat] Fetching products for shopId:", shopId);

//     try {
//       setLoadingProducts(true);
//       const response = await publicProductService.getByShop(shopId, 0, 20);
//       setProducts(response.data?.content || []);
//     } catch (error) {
//       console.error("[CustomerShopChat] Failed to fetch products:", error);
//       setProducts([]);
//     } finally {
//       setLoadingProducts(false);
//     }
//   }, [selectedConversation, getShopId]);

//   // Toggle order picker & fetch orders
//   const toggleOrderPicker = useCallback(() => {
//     if (!showOrderPicker && orders.length === 0) {
//       fetchOrders();
//     }
//     setShowOrderPicker(!showOrderPicker);
//     setSelectedOrder(null);
//   }, [showOrderPicker, orders.length, fetchOrders]);

//   // Toggle product picker & fetch products
//   const toggleProductPicker = useCallback(() => {
//     if (!showProductPicker && products.length === 0) {
//       fetchProducts();
//     }
//     setShowProductPicker(!showProductPicker);
//     setSelectedProduct(null);
//   }, [showProductPicker, products.length, fetchProducts]);

//   // Select an order (not send yet)
//   const handleSelectOrder = useCallback((order: any) => {
//     setSelectedOrder(order);
//   }, []);

//   // Select a product (not send yet)
//   const handleSelectProduct = useCallback((product: any) => {
//     setSelectedProduct(product);
//   }, []);

//   // Cancel selection
//   const handleCancelOrderSelection = useCallback(() => {
//     setSelectedOrder(null);
//   }, []);

//   const handleCancelProductSelection = useCallback(() => {
//     setSelectedProduct(null);
//   }, []);

//   // Handle send order card
//   const handleSendOrderCard = useCallback(async () => {
//     if (!selectedOrder) return;
//     if (!activeConversationId) {
//       console.warn("[CustomerShopChat] No conversation ID, cannot send order card");
//       return;
//     }

//     try {
//       setSendingOrderCard(true);
//       const response = await sendOrderCardApi({
//         conversationId: activeConversationId,
//         orderId: selectedOrder.orderId,
//         message: `Tôi cần hỗ trợ về đơn hàng #${selectedOrder.orderNumber}`,
//       });

//       if (response?.success && response?.data) {
//         console.log("[CustomerShopChat] Order card sent:", response.data.id);
        
//         // Add message to local state
//         const messages = messagesByConversation[activeConversationId] || [];
//         const newMessage: ChatMessage = response.data;
//         setMessagesByConversation((prev) => ({
//           ...prev,
//           [activeConversationId]: [...messages, newMessage],
//         }));
        
//         // Reset states
//         setShowOrderPicker(false);
//         setSelectedOrder(null);
//         setTimeout(() => scrollToBottom(), 100);
//       } else {
//         console.error("[CustomerShopChat] Failed to send order card:", response);
//       }
//     } catch (error) {
//       console.error("[CustomerShopChat] Error sending order card:", error);
//     } finally {
//       setSendingOrderCard(false);
//     }
//   }, [selectedOrder, activeConversationId, sendOrderCardApi, messagesByConversation, scrollToBottom]);

//   // Handle send product card
//   const handleSendProductCard = useCallback(async () => {
//     if (!selectedProduct) return;
//     if (!activeConversationId) {
//       console.warn("[CustomerShopChat] No conversation ID, cannot send product card");
//       return;
//     }

//     try {
//       setSendingProductCard(true);
//       const response = await sendProductCardApi({
//         conversationId: activeConversationId,
//         productId: selectedProduct.id,
//         message: `Tôi muốn hỏi về sản phẩm: ${selectedProduct.name}`,
//       });

//       if (response?.success && response?.data) {
//         console.log("[CustomerShopChat] Product card sent:", response.data.id);
        
//         // Add message to local state
//         const messages = messagesByConversation[activeConversationId] || [];
//         const newMessage: ChatMessage = response.data;
//         setMessagesByConversation((prev) => ({
//           ...prev,
//           [activeConversationId]: [...messages, newMessage],
//         }));
        
//         // Reset states
//         setShowProductPicker(false);
//         setSelectedProduct(null);
//         setTimeout(() => scrollToBottom(), 100);
//       } else {
//         console.error("[CustomerShopChat] Failed to send product card:", response);
//       }
//     } catch (error) {
//       console.error("[CustomerShopChat] Error sending product card:", error);
//     } finally {
//       setSendingProductCard(false);
//     }
//   }, [selectedProduct, activeConversationId, sendProductCardApi, messagesByConversation, scrollToBottom]);

//   // Handle send order card directly (without selecting)
//   const handleSendOrderCardDirect = useCallback(async (order: any) => {
//     if (!activeConversationId) {
//       console.warn("[CustomerShopChat] No conversation ID, cannot send order card");
//       return;
//     }

//     try {
//       setSendingOrderCard(true);
//       const response = await sendOrderCardApi({
//         conversationId: activeConversationId,
//         orderId: order.orderId,
//         message: `Tôi cần hỗ trợ về đơn hàng #${order.orderNumber}`,
//       });

//       if (response?.success && response?.data) {
//         console.log("[CustomerShopChat] Order card sent:", response.data.id);
        
//         // Add message to local state
//         const messages = messagesByConversation[activeConversationId] || [];
//         const newMessage: ChatMessage = response.data;
//         setMessagesByConversation((prev) => ({
//           ...prev,
//           [activeConversationId]: [...messages, newMessage],
//         }));
        
//         setTimeout(() => scrollToBottom(), 100);
//       } else {
//         console.error("[CustomerShopChat] Failed to send order card:", response);
//       }
//     } catch (error) {
//       console.error("[CustomerShopChat] Error sending order card:", error);
//     } finally {
//       setSendingOrderCard(false);
//     }
//   }, [activeConversationId, sendOrderCardApi, messagesByConversation, scrollToBottom]);

//   // Handle send product card directly (without selecting)
//   const handleSendProductCardDirect = useCallback(async (product: any) => {
//     if (!activeConversationId) {
//       console.warn("[CustomerShopChat] No conversation ID, cannot send product card");
//       return;
//     }

//     try {
//       setSendingProductCard(true);
//       const response = await sendProductCardApi({
//         conversationId: activeConversationId,
//         productId: product.id,
//         message: `Tôi muốn hỏi về sản phẩm: ${product.name}`,
//       });

//       if (response?.success && response?.data) {
//         console.log("[CustomerShopChat] Product card sent:", response.data.id);
        
//         // Add message to local state
//         const messages = messagesByConversation[activeConversationId] || [];
//         const newMessage: ChatMessage = response.data;
//         setMessagesByConversation((prev) => ({
//           ...prev,
//           [activeConversationId]: [...messages, newMessage],
//         }));
        
//         setTimeout(() => scrollToBottom(), 100);
//       } else {
//         console.error("[CustomerShopChat] Failed to send product card:", response);
//       }
//     } catch (error) {
//       console.error("[CustomerShopChat] Error sending product card:", error);
//     } finally {
//       setSendingProductCard(false);
//     }
//   }, [activeConversationId, sendProductCardApi, messagesByConversation, scrollToBottom]);

//   // Handle view order details
//   const handleViewOrderDetails = useCallback((order: any) => {
//     router.push(`/orders/${order.orderId}`);
//   }, [router]);

//   // Handle view product details
//   const handleViewProductDetails = useCallback((product: any) => {
//     router.push(`/products/${product.id}`);
//   }, [router]);

//   // Filter orders by search text
//   const filteredOrders = useMemo(() => {
//     if (!orderSearchText.trim()) return orders;
//     const keyword = orderSearchText.toLowerCase();
//     return orders.filter((order) => {
//       const orderNumber = order.orderNumber?.toLowerCase() || "";
//       const productNames = order.items?.map((item: any) => item.productName?.toLowerCase() || "").join(" ") || "";
//       return orderNumber.includes(keyword) || productNames.includes(keyword);
//     });
//   }, [orders, orderSearchText]);

//   // Filter products by search text
//   const filteredProducts = useMemo(() => {
//     if (!productSearchText.trim()) return products;
//     const keyword = productSearchText.toLowerCase();
//     return products.filter((product) => {
//       const name = product.name?.toLowerCase() || "";
//       return name.includes(keyword);
//     });
//   }, [products, productSearchText]);

//   /**
//    * Handle scroll event - detect when user scrolls to top to load more
//    */
//   const handleScroll = useCallback(() => {
//     const container = messagesContainerRef.current;
//     if (!container) return;

//     // Detect scroll to top (with 100px threshold)
//     const isNearTop = container.scrollTop < 100;

//     if (
//       isNearTop &&
//       hasMoreMessages &&
//       !isLoadingMore &&
//       !isLoadingMoreRef.current
//     ) {
//       console.log(
//         "[CustomerShopChat] User scrolled to top, loading more messages"
//       );
//       isLoadingMoreRef.current = true;

//       // Store current scroll height để restore position sau khi load
//       previousScrollHeight.current = container.scrollHeight;

//       loadMoreMessages();
//     }
//   }, [hasMoreMessages, isLoadingMore, loadMoreMessages]);

//   useEffect(() => {
//     if (!isLoadingMore && isLoadingMoreRef.current) {
//       const container = messagesContainerRef.current;
//       if (container && previousScrollHeight.current > 0) {
//         const newScrollHeight = container.scrollHeight;
//         const scrollDiff = newScrollHeight - previousScrollHeight.current;
//         container.scrollTop = scrollDiff;
//         previousScrollHeight.current = 0;
//       }
//       isLoadingMoreRef.current = false;
//     }
//   }, [isLoadingMore]);

//   useEffect(() => {
//     if (
//       messages.length > prevMessageCountRef.current &&
//       prevMessageCountRef.current > 0
//     ) {
//       const latest = messages[messages.length - 1];
//       // Check if message is from shop (not customer)
//       if (getMessageSender(latest) !== "customer") {
//         setNewMessageAlert(true);
//         setLatestMessageId(latest.id);

//         // Play notification sound
//         try {
//           const audio = new Audio("/notification.mp3");
//           audio.volume = 0.3;
//           audio.play().catch((err) => {
//             console.log(
//               "[CustomerShopChat] Could not play notification sound:",
//               err
//             );
//           });
//         } catch (err) {
//           console.log("[CustomerShopChat] Audio not available:", err);
//         }

//         setTimeout(() => {
//           setNewMessageAlert(false);
//           setLatestMessageId(null);
//         }, 2000);
//       }
//     }
//     prevMessageCountRef.current = messages.length;
//     if (!isLoadingMore && !isLoadingMoreRef.current) {
//       scrollToBottom();
//     }
//   }, [isLoadingMore, messages, scrollToBottom]);

//   useEffect(() => {
//     if (
//       !isInitializingMessages &&
//       !loadingMessages &&
//       messages.length > 0 &&
//       activeConversationId
//     ) {
//       const timeout = setTimeout(() => {
//         scrollToBottom(false);
//       }, 120);
//       return () => clearTimeout(timeout);
//     }
//     return undefined;
//   }, [
//     activeConversationId,
//     isInitializingMessages,
//     loadingMessages,
//     messages.length,
//     scrollToBottom,
//   ]);

//   // WebSocket subscriptions - Tham khảo ShopCustomerChatWidget.tsx
//   useEffect(() => {
//     if (!wsConnected) {
//       return undefined;
//     }

//     console.log(
//       "[CustomerShopChat] Subscribing to WebSocket topics..."
//     );

//     /**
//      * Handler để xử lý message updates cho conversation list
//      * Tham khảo ShopCustomerChatWidget.tsx: Đơn giản và hiệu quả
//      * - Tìm conversation trong danh sách
//      * - Update lastMessage và unreadCount
//      * - Move conversation lên đầu danh sách (LUÔN LUÔN move lên đầu khi có tin nhắn mới)
//      * QUAN TRỌNG: Sử dụng ref để lấy activeConversationId mới nhất (tránh stale closure)
//      */
//     const handleMessageUpdate = (incomingMessage: ChatMessage) => {
//       // Sử dụng ref để lấy currentUserId mới nhất (tránh stale closure)
//       const currentUserIdValue = currentUserIdRef.current;

//       console.log(
//         "[CustomerShopChat] ========== handleMessageUpdate called ==========",
//         "\nMessage ID:", incomingMessage.id,
//         "\nConversation ID:", incomingMessage.conversationId,
//         "\nCurrent User ID:", currentUserIdValue,
//         "\nContent:", incomingMessage.content?.substring(0, 50)
//       );

//       const targetConversationId = incomingMessage.conversationId;
//       const currentActiveConversationId = activeConversationIdRef.current;

//       // Add message to conversation messages (nếu đang xem conversation này)
//       setMessagesByConversation((prev) => {
//         const existing = prev[targetConversationId] || [];
//         const alreadyExists = existing.some(
//           (msg) => msg.id === incomingMessage.id
//         );
//         if (alreadyExists) return prev;

//         // Chỉ thêm message nếu đang xem conversation này
//         if (targetConversationId === currentActiveConversationId) {
//           return {
//             ...prev,
//             [targetConversationId]: [...existing, incomingMessage],
//           };
//         }

//         return prev;
//       });

//       // Update conversations: move conversation with new message to top
//       setConversations((prev) => {
//         const conversationId = incomingMessage.conversationId;
//         const convIndex = prev.findIndex((c) => c.id === conversationId);

//         console.log(
//           "[CustomerShopChat] Finding conversation:",
//           conversationId,
//           "found at index:",
//           convIndex,
//           "total conversations:",
//           prev.length
//         );

//         if (convIndex === -1) {
//           // Conversation chưa có trong danh sách → load lại
//           console.log(
//             "[CustomerShopChat] New conversation detected from message, reloading..."
//           );
//           fetchConversationsRef.current?.();
//           return prev;
//         }

//         // Update conversation và move lên đầu
//         const updatedConversations = [...prev];
//         const [conversation] = updatedConversations.splice(convIndex, 1);

//         // Update lastMessage và unreadCount
//         // GIỐNG HỆT ShopCustomerChatWidget.tsx: Đơn giản, không kiểm tra isMine
//         // Chỉ kiểm tra xem có đang xem conversation này không
//         // Convert message inline để tránh stale closure (giống ShopCustomerChatWidget)
//         const messageSenderId = incomingMessage.user?.userId;
//         const isMine = messageSenderId === currentUserIdValue; // Sử dụng ref thay vì currentUserId trực tiếp
//         const sender = isMine ? "customer" : "shop";

//         let senderName: string;
//         let senderAvatar: string | undefined;
//         if (isMine) {
//           senderName = "Bạn";
//           senderAvatar = undefined;
//         } else {
//           // Ưu tiên kiểm tra đối phương có shopName/shopId/logoUrl (không dùng role)
//           const hasShopInfo = !!(incomingMessage.user?.shopName || incomingMessage.user?.shopId || incomingMessage.user?.logoUrl);
//           if (hasShopInfo) {
//             senderName = incomingMessage.user?.shopName || incomingMessage.user?.username || "Shop";
//             senderAvatar = incomingMessage.user?.logoUrl || undefined;
//           } else {
//             senderName = incomingMessage.user?.fullNameBuyer ||
//               incomingMessage.user?.fullNameEmployee ||
//               incomingMessage.user?.username ||
//               "Shop";
//             senderAvatar = incomingMessage.user?.image || undefined;
//           }
//         }

//         const updatedConversation: ConversationResponse = {
//           ...conversation,
//           lastMessageId: incomingMessage.id,
//           lastMessageAt: incomingMessage.sentAt,
//           lastMessagePreview: incomingMessage.content || "",
//           lastModifiedDate: incomingMessage.sentAt, // Backend dùng lastModifiedDate
//           unreadCount:
//             conversationId === currentActiveConversationId
//               ? 0 // Nếu đang xem conversation này → không tăng unread
//               : (conversation.unreadCount || 0) + 1, // Nếu không đang xem → tăng unread (bất kể là tin nhắn của ai)
//         };

//         // Move lên đầu danh sách
//         return [updatedConversation, ...updatedConversations];
//       });
//     };

//     // Handler để xử lý incoming messages từ WebSocket
//     const handleIncomingMessage = (data: unknown) => {
//       try {
//         // Backend sends: { data: Message | Conversation, type: string, timestamp: string }
//         const eventWrapper = data as { data?: ChatMessage | any; type?: string };
//         const eventType = eventWrapper.type;

//         // Xử lý MESSAGE_UPDATED event - cập nhật message đã chỉnh sửa
//         if (eventType === "MESSAGE_UPDATED") {
//           console.log(
//             "[CustomerShopChat] Received MESSAGE_UPDATED event, updating message"
//           );
//           const updatedMessage = eventWrapper.data as ChatMessage;
//           if (updatedMessage?.id) {
//             // Update trong active messages nếu đang xem conversation đó
//             if (updatedMessage.conversationId === activeConversationId) {
//               setMessagesByConversation((prev) => {
//                 const convMessages = prev[activeConversationId] || [];
//                 const updatedMessages = convMessages.map((msg) =>
//                   msg.id === updatedMessage.id ? { ...msg, ...updatedMessage, isEdited: true } : msg
//                 );
//                 return {
//                   ...prev,
//                   [activeConversationId]: updatedMessages,
//                 };
//               });
//             }
//             // Update trong conversation list
//             handleMessageUpdate(updatedMessage);
//           }
//           return;
//         }

//         // Xử lý MESSAGE_DELETED event - đánh dấu message đã bị xóa
//         if (eventType === "MESSAGE_DELETED") {
//           console.log(
//             "[CustomerShopChat] Received MESSAGE_DELETED event, marking message as deleted"
//           );
//           const deletedEvent = data as { messageId?: string; deleteForEveryone?: boolean };
//           if (deletedEvent?.messageId && activeConversationId) {
//             // Update trong active messages nếu đang xem conversation đó
//             setMessagesByConversation((prev) => {
//               const convMessages = prev[activeConversationId] || [];
//               const updatedMessages = convMessages.map((msg) =>
//                 msg.id === deletedEvent.messageId
//                   ? {
//                       ...msg,
//                       deletedAt: deletedEvent.deleteForEveryone ? new Date().toISOString() : undefined,
//                       deletedType: deletedEvent.deleteForEveryone ? "DELETE_FOR_EVERYONE" : "DELETE_FOR_ME",
//                       deletedBy: deletedEvent.deleteForEveryone ? undefined : currentUserIdRef.current,
//                       content: deletedEvent.deleteForEveryone ? "" : msg.content,
//                     }
//                   : msg
//               );
//               return {
//                 ...prev,
//                 [activeConversationId]: updatedMessages,
//               };
//             });
//           }
//           return;
//         }

//         // Chỉ xử lý NEW_MESSAGE events cho messages mới
//         if (eventType && eventType !== "NEW_MESSAGE") {
//           console.log(
//             "[CustomerShopChat] Ignoring unknown event type:",
//             eventType
//           );
//           return;
//         }

//         // Extract message từ data.data hoặc data trực tiếp (legacy format không có type)
//         const incomingMessage = eventWrapper?.data || (data as ChatMessage);

//         if (!incomingMessage || !incomingMessage.id) {
//           console.warn(
//             "[CustomerShopChat] Invalid message structure:",
//             data
//           );
//           return;
//         }

//         // Cập nhật conversation list khi có tin nhắn mới
//         // QUAN TRỌNG: Gọi handleMessageUpdate để đẩy conversation lên đầu và cập nhật unreadCount
//         handleMessageUpdate(incomingMessage);
//       } catch (error) {
//         console.error(
//           "[CustomerShopChat] Failed to process message:",
//           error
//         );
//       }
//     };

//     // Handler để xử lý conversation events (NEW_CONVERSATION, CONVERSATION_UPDATED, etc.)
//     // GIỐNG HỆT ShopCustomerChatWidget.tsx
//     const handleConversationEvent = (data: unknown) => {
//       console.log("[CustomerShopChat] Received conversation event:", data);

//       try {
//         // Backend payload: { type: "NEW_CONVERSATION" | "CONVERSATION_UPDATED" | "CONVERSATION_STATUS_CHANGED", data: Conversation, timestamp: ... }
//         const event = data as {
//           type: string;
//           data?: any;
//           conversationId?: string;
//           status?: string;
//         };

//         if (event.type === "NEW_CONVERSATION") {
//           console.log(
//             "[CustomerShopChat] New conversation created, reloading list..."
//           );
//           // Reload toàn bộ danh sách để lấy conversation mới
//           fetchConversationsRef.current?.();
//         } else if (event.type === "CONVERSATION_UPDATED") {
//           console.log(
//             "[CustomerShopChat] Conversation updated, reloading list..."
//           );
//           // Reload để cập nhật thông tin conversation
//           fetchConversationsRef.current?.();
//         } else if (event.type === "CONVERSATION_STATUS_CHANGED") {
//           console.log(
//             "[CustomerShopChat] Conversation status changed, reloading list..."
//           );
//           // Reload để cập nhật status
//           fetchConversationsRef.current?.();
//         }
//       } catch (error) {
//         console.error(
//           "[CustomerShopChat] Failed to process conversation event:",
//           error
//         );
//       }
//     };

//     // Subscribe to personal messages: /user/queue/messages
//     // QUAN TRỌNG: Subscribe vào personal messages để nhận tin nhắn từ TẤT CẢ conversations
//     const unsubscribePersonal = subscribeToPersonalMessages(
//       handleIncomingMessage
//     );

//     // Subscribe to conversation updates: /user/queue/conversations
//     // GIỐNG HỆT ShopCustomerChatWidget.tsx
//     const unsubscribeConversationUpdates = subscribeToConversationUpdates(
//       handleConversationEvent
//     );

//     // Subscribe to selected conversation topic if available
//     // QUAN TRỌNG: Subscribe vào conversation topic khi có conversation được chọn
//     let unsubscribeConversation: (() => void) | undefined;
//     if (activeConversationId) {
//       console.log(
//         "[CustomerShopChat] Subscribing to conversation topic:",
//         activeConversationId
//       );
//       unsubscribeConversation = subscribeToConversation(
//         activeConversationId,
//         (data: unknown) => {
//           console.log(
//             "[CustomerShopChat] Received conversation topic message:",
//             data
//           );

//           try {
//             // Backend sends: { data: Message | Conversation, type: string, timestamp: string }
//             const eventWrapper = data as { data?: ChatMessage | any; type?: string };
//             const eventType = eventWrapper.type;

//             // Xử lý MESSAGE_UPDATED event - cập nhật message đã chỉnh sửa
//             if (eventType === "MESSAGE_UPDATED") {
//               console.log(
//                 "[CustomerShopChat] Received MESSAGE_UPDATED from conversation topic, updating message"
//               );
//               const updatedMessage = eventWrapper.data as ChatMessage;
//               if (updatedMessage?.id && updatedMessage.conversationId === activeConversationId) {
//                 setMessagesByConversation((prev) => {
//                   const convMessages = prev[activeConversationId] || [];
//                   const updatedMessages = convMessages.map((msg) =>
//                     msg.id === updatedMessage.id ? { ...msg, ...updatedMessage, isEdited: true } : msg
//                   );
//                   return {
//                     ...prev,
//                     [activeConversationId]: updatedMessages,
//                   };
//                 });
//                 handleMessageUpdate(updatedMessage);
//               }
//               return;
//             }

//             // Xử lý MESSAGE_DELETED event - đánh dấu message đã bị xóa
//             if (eventType === "MESSAGE_DELETED") {
//               console.log(
//                 "[CustomerShopChat] Received MESSAGE_DELETED from conversation topic, marking message as deleted"
//               );
//               const deletedEvent = data as { messageId?: string; deleteForEveryone?: boolean };
//               if (deletedEvent?.messageId && activeConversationId) {
//                 setMessagesByConversation((prev) => {
//                   const convMessages = prev[activeConversationId] || [];
//                   const updatedMessages = convMessages.map((msg) =>
//                     msg.id === deletedEvent.messageId
//                       ? {
//                           ...msg,
//                           deletedAt: deletedEvent.deleteForEveryone ? new Date().toISOString() : undefined,
//                           deletedType: deletedEvent.deleteForEveryone ? "DELETE_FOR_EVERYONE" : "DELETE_FOR_ME",
//                           deletedBy: deletedEvent.deleteForEveryone ? undefined : currentUserIdRef.current,
//                           content: deletedEvent.deleteForEveryone ? "" : msg.content,
//                         }
//                       : msg
//                   );
//                   return {
//                     ...prev,
//                     [activeConversationId]: updatedMessages,
//                   };
//                 });
//               }
//               return;
//             }

//             // Chỉ xử lý NEW_MESSAGE events cho messages mới
//             if (eventType && eventType !== "NEW_MESSAGE") {
//               console.log(
//                 "[CustomerShopChat] Ignoring unknown event type from conversation topic:",
//                 eventType
//               );
//               return;
//             }

//             const incomingMessage = eventWrapper?.data || (data as ChatMessage);

//             if (!incomingMessage || !incomingMessage.id) {
//               console.warn(
//                 "[CustomerShopChat] Invalid message structure:",
//                 data
//               );
//               return;
//             }

//             handleMessageUpdate(incomingMessage);
//           } catch (error) {
//             console.error(
//               "[CustomerShopChat] Failed to process conversation message:",
//               error
//             );
//           }
//         }
//       );
//     }

//     return () => {
//       console.log(
//         "[CustomerShopChat] Unsubscribing from WebSocket topics"
//       );
//       unsubscribePersonal();
//       unsubscribeConversationUpdates();
//       if (unsubscribeConversation) {
//         unsubscribeConversation();
//       }
//     };
//   }, [
//     wsConnected,
//     subscribeToConversation,
//     subscribeToPersonalMessages,
//     subscribeToConversationUpdates,
//     activeConversationId,
//     currentUserId, // Cần currentUserId để re-subscribe khi nó thay đổi (giống ShopCustomerChatWidget)
//   ]);
//   // Stable refs for handlers to avoid effect thrashing when function identities change
//   const filterHandlerRef = useRef(handleFilterConversationsCreatedBy );
//   useEffect(() => {
//     filterHandlerRef.current = handleFilterConversationsCreatedBy;
//   }, [handleFilterConversationsCreatedBy]);

//   // Connect WebSocket when drawer opens
//   useEffect(() => {
//     if (open) {
//       console.log("[CustomerShopChat] Drawer opened, connecting WebSocket...");
//       connect().catch((err) => {
//         console.error("[CustomerShopChat] Failed to connect WebSocket:", err);
//       });
//     } else {
//       // Reset state when drawer closes (KHÔNG có targetShopId)
//       // Nếu có targetShopId thì giữ nguyên state để lần mở tiếp theo vẫn vào conversation đó
//       if (!targetShopId) {
//         console.log(
//           "[CustomerShopChat] Drawer closed without targetShopId, resetting selection"
//         );
//         setSelectedConversation(null);
//         setActiveConversationId(null);
//         setIsMobileChatView(false);
//       }
//     }

//     // Disconnect when drawer closes
//     return () => {
//       if (open) {
//         console.log(
//           "[CustomerShopChat] Drawer closed, disconnecting WebSocket..."
//         );
//         disconnect();
//       }
//     };
//   }, [open, targetShopId, connect, disconnect]);

//   // Responsive: reset mobile chat view when switching to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) setIsMobileChatView(false);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [selectedConversation, messages]);

//   // Fetch conversations from API with type BUYER_TO_SHOP
//   useEffect(() => {
//     let aborted = false;

//     const fetchConversations = async () => {
//       if (!currentUserId) return;
//       const res = await handleFilterConversationsCreatedBy({
//         userId: currentUserId,
//         createdBy: createdBy,
//         keyword: searchText,
//         types: [ConversationType.BUYER_TO_SHOP],
//         page: 0,
//         size: 30,
//       });
//       console.log("[CustomerShopChat] Fetch conversations response:", res);
//       if (aborted) return;
//       const items =
//         res?.data?.content || // PageResponse
//         res?.data?.items || // fallback
//         res?.data || // direct array
//         [];

//       const conversations: ConversationResponse[] = (items as any[]).map((it: any) => ({
//         id: it.id,
//         conversationType: it.conversationType || ConversationType.BUYER_TO_SHOP,
//         name: it.name,
//         avatarUrl: it.avatarUrl,
//         status: it.status || ConversationStatus.ACTIVE,
//         lastMessageId: it.lastMessageId,
//         lastMessageAt: it.lastMessageAt || it.lastModifiedDate,
//         lastMessagePreview: it.lastMessagePreview || "",
//         totalMessages: it.totalMessages || 0,
//         unreadCount: it.unreadCount || 0,
//         isMuted: it.isMuted || false,
//         isPinned: it.isPinned || false,
//         isArchived: it.isArchived || false,
//         contextProductId: it.contextProductId,
//         contextOrderId: it.contextOrderId,
//         contextShopId: it.contextShopId,
//         participants: it.participants || [],
//         metadata: it.metadata,
//         createdDate: it.createdDate || it.createdAt || new Date().toISOString(), // Ưu tiên createdDate từ backend
//         lastModifiedDate: it.lastModifiedDate || it.lastMessageAt || it.updatedAt || new Date().toISOString(), // Ưu tiên lastModifiedDate từ backend
//       }));

//       // Sử dụng trực tiếp ConversationResponse, không cần map
//       setConversations(conversations);

//       // CHỈ auto-select nếu KHÔNG có targetShopId
//       // (targetShopId sẽ được xử lý bởi useEffect riêng bên dưới)
//       if (!targetShopId && !selectedConversation && conversations.length > 0) {
//         // Không auto-select - để user tự chọn
//         console.log("[CustomerShopChat] Conversations loaded, waiting for user selection");
//       }
//     };

//     // Lưu hàm fetchConversations vào ref để dùng trong WebSocket handler
//     fetchConversationsRef.current = fetchConversations;

//     // CHỜ WebSocket connected trước khi fetch conversations
//     if (open && wsConnected && currentUserId) {
//       console.log("[CustomerShopChat] WebSocket connected, loading conversations...");
//       fetchConversations();
//     }
//     return () => {
//       aborted = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchText, open, currentUserId, wsConnected]); // Thêm wsConnected dependency

//   // Auto select first conversation ONLY when drawer opens with targetShopId
//   useEffect(() => {
//     if (open && targetShopId && conversations.length > 0 && !selectedConversation) {
//       // Chỉ auto-select khi có targetShopId (chat trực tiếp với shop)
//       const targetConv = conversations.find((c) => 
//         c.participants?.some((p) => p.user?.userId === targetShopId)
//       );
//       if (targetConv) {
//         console.log("[CustomerShopChat] Auto-selecting conversation for target shop:", targetShopId);
//         setSelectedConversation(targetConv);
//         setActiveConversationId(targetConv.id);
//       }
//     }
//   }, [open, targetShopId, conversations, selectedConversation]);

//   // Ensure conversation with targetShopId exists and select it when opening
//   // CHỜ WebSocket connected trước khi thực hiện
//   useEffect(() => {
//     if (!wsConnected) {
//       console.log("[CustomerShopChat] Waiting for WebSocket connection before ensuring target conversation...");
//       return;
//     }
//     let aborted = false;
//     const ensureAndSelectTargetConversation = async () => {
//       if (!open || !targetShopId || !currentUserId) return;

//       console.log(
//         "[CustomerShopChat] Ensuring conversation exists for target shop:",
//         targetShopId
//       );

//       // Skip if already ensured in this session
//       if (createdShopConversationsCache.has(targetShopId)) {
//         console.log(
//           "[CustomerShopChat] Conversation already ensured for shop:",
//           targetShopId
//         );
//         return;
//       }

//       // Skip if currently selected conversation already matches target
//       if (selectedConversation?.participants?.some((p) => p.user?.userId === targetShopId)) {
//         console.log(
//           "[CustomerShopChat] Target shop conversation already selected"
//         );
//         createdShopConversationsCache.add(targetShopId);
//         return;
//       }

//       // Fetch list and select if exists
//       try {
//         const refreshed = await filterHandlerRef.current({
//           userId: currentUserId,
//           keyword: "",
//           types: [ConversationType.BUYER_TO_SHOP],
//           page: 0,
//           size: 30,
//         });
//         const items =
//           refreshed?.data?.content ||
//           refreshed?.data?.items ||
//           refreshed?.data ||
//           [];

//         // Map về ConversationResponse type (backend dùng createdDate và lastModifiedDate)
//         const conversations: ConversationResponse[] = (items as any[]).map((it: any) => ({
//           id: it.id,
//           conversationType: it.conversationType || ConversationType.BUYER_TO_SHOP,
//           name: it.name,
//           avatarUrl: it.avatarUrl,
//           status: it.status || ConversationStatus.ACTIVE,
//           lastMessageId: it.lastMessageId,
//           lastMessageAt: it.lastMessageAt || it.lastModifiedDate,
//           lastMessagePreview: it.lastMessagePreview || "",
//           totalMessages: it.totalMessages || 0,
//           unreadCount: it.unreadCount || 0,
//           isMuted: it.isMuted || false,
//           isPinned: it.isPinned || false,
//           isArchived: it.isArchived || false,
//           contextProductId: it.contextProductId,
//           contextOrderId: it.contextOrderId,
//           contextShopId: it.contextShopId,
//           participants: it.participants || [],
//           metadata: it.metadata,
//           createdDate: it.createdDate || it.createdAt || new Date().toISOString(), // Ưu tiên createdDate từ backend
//           lastModifiedDate: it.lastModifiedDate || it.lastMessageAt || it.updatedAt || new Date().toISOString(), // Ưu tiên lastModifiedDate từ backend
//         }));

//         // Sử dụng trực tiếp ConversationResponse, không cần map
//         if (aborted) return;
//         setConversations(conversations);
//         // Tìm conversation có participant với userId = targetShopId
//         const found = conversations.find((conv) => 
//           conv.participants?.some((p) => p.user?.userId === targetShopId)
//         ) || null;
//         if (found) {
//           console.log(
//             "[CustomerShopChat] Found target shop conversation, selecting it"
//           );
//           setSelectedConversation(found);
//           setActiveConversationId(found.id);
//           createdShopConversationsCache.add(targetShopId);

//           // Chuyển sang mobile chat view khi có targetShopId
//           if (window.innerWidth < 768) {
//             setIsMobileChatView(true);
//           }

//           // Load messages for target conversation
//           await loadInitialMessages(found.id);
//         }
//       } catch (error) {
//         console.error(
//           "[CustomerShopChat] Failed to ensure target conversation:",
//           error
//         );
//         // Ignore errors; as a fallback, try selecting from existing list if any matches
//         const fallback =
//           conversations.find((c) => 
//             c.participants?.some((p) => p.user?.userId === targetShopId)
//           ) || null;
//         if (fallback) {
//           console.log("[CustomerShopChat] Using fallback conversation");
//           setSelectedConversation(fallback);
//           setActiveConversationId(fallback.id);
//           if (window.innerWidth < 768) {
//             setIsMobileChatView(true);
//           }
//         }
//       }
//     };
//     ensureAndSelectTargetConversation();
//     return () => {
//       aborted = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, targetShopId, targetShopName, currentUserId, wsConnected]); // Thêm wsConnected

//   const handleSelectConversation = useCallback(
//     async (conversation: ConversationResponse) => {
//       console.log("[CustomerShopChat] Selecting conversation:", conversation.id);

//       // Nếu đang chọn lại conversation đã chọn trước đó, refresh messages
//       const isReselecting = selectedConversation?.id === conversation.id;

//       setSelectedConversation(conversation);
//       setActiveConversationId(conversation.id);
//       setShowQuickReplies(false);

//       // Chuyển sang mobile chat view khi select conversation
//       if (window.innerWidth < 768) {
//         setIsMobileChatView(true);
//       }

//       // Reset unread count
//       setConversations((prev) =>
//         prev.map((conv) =>
//           conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
//         )
//       );

//       // LUÔN load lại messages khi select conversation để đảm bảo có tin nhắn mới nhất
//       // Điều này đảm bảo khi user ẩn conversation đi rồi chọn lại sẽ có đầy đủ messages
//       console.log(
//         "[CustomerShopChat] Loading messages for conversation:",
//         conversation.id,
//         isReselecting ? "(refreshing - reselected)" : "(first time or reopened)"
//       );

//       // Luôn load lại messages để đảm bảo có tin nhắn mới nhất
//       await loadInitialMessages(conversation.id);
//     },
//     [
//       loadInitialMessages,
//       selectedConversation, // Cần để check reselect
//     ]
//   );




//   const filteredConversations = useMemo(() => {
//     const q = searchText.trim().toLowerCase();
//     if (!q) return conversations;
//     return conversations.filter((c) => {
//       // Lấy shop participant (không phải currentUserId)
//       const shopParticipant = c.participants?.find(
//         (p) => p.user?.userId !== currentUserId
//       );
//       const name = (shopParticipant?.user?.shopName || 
//                    shopParticipant?.user?.username || 
//                    c.name || 
//                    "").toLowerCase();
//       const email = (shopParticipant?.user?.email || "").toLowerCase();
//       const last = (c.lastMessagePreview || "").toLowerCase();
//       return name.includes(q) || email.includes(q) || last.includes(q);
//     });
//   }, [conversations, searchText, currentUserId]);

//   const formatTime = (timestamp: string) => {
//     try {
//       return formatDistanceToNow(new Date(timestamp), {
//         addSuffix: true,
//         locale: vi,
//       });
//     } catch {
//       const date = new Date(timestamp);
//       return date.toLocaleTimeString("vi-VN", {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     }
//   };

//   // Handle emoji click
//   const handleEmojiClick = (emojiData: { emoji: string }) => {
//     setMessageText((prev) => prev + emojiData.emoji);
//     setShowEmojiPicker(false);
//   };

//   // Handle attachment change
//   const handleAttachmentChange: UploadProps["onChange"] = (info: any) => {
//     setAttachments(info.fileList);
//   };

//   // Remove attachment
//   const handleRemoveAttachment = (file: UploadFile) => {
//     setAttachments((prev) => prev.filter((f) => f.uid !== file.uid));
//   };

//   // Handle edit message
//   const handleEditMessage = async (message: ChatMessage) => {
//     setEditingMessage(message);
//     setMessageText(message.content || "");
//     setReplyingToMessage(null);
//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 100);
//   };

//   // State để track message đang được confirm delete (giữ cho hợp đồng cũ)
//   const [deleteConfirmState, setDeleteConfirmState] = useState<{
//     message: ChatMessage | null;
//   }>({ message: null });

//   // Handle delete message - mở modal confirm trong phạm vi Drawer
//   const handleDeleteMessage = (message: ChatMessage) => {
//     if (!message.id) return;
//     const container = document.querySelector(".ant-drawer-body") as HTMLElement | null;
//     modal.confirm({
//       title: "Thu hồi tin nhắn",
//       content: "Bạn có muốn thu hồi tin nhắn này? (Tin nhắn sẽ bị xóa khỏi cuộc trò chuyện)",
//       okText: "Thu hồi",
//       cancelText: "Hủy",
//       okButtonProps: { danger: true },
//       centered: true,
//       getContainer: () => container || document.body,
//       onOk: () => executeDelete(message),
//     });
//   };

//   // Execute delete sau khi confirm
//   const executeDelete = async (targetMessage?: ChatMessage) => {
//     const message = targetMessage ?? deleteConfirmState.message;
//     if (!message?.id) return;

//     try {
//       const result = await deleteMessageAPI(message.id, {
//         deleteType: "DELETE_FOR_EVERYONE",
//       });
//       if (result?.success) {
//         // Optimistic update - real-time sẽ cập nhật từ WebSocket
//         setMessagesByConversation((prev) => {
//           const convMessages = prev[activeConversationId || ""] || [];
//           return {
//             ...prev,
//             [activeConversationId || ""]: convMessages.map((m) =>
//               m.id === message.id
//                 ? {
//                     ...m,
//                     deletedAt: new Date().toISOString(),
//                     deletedType: "DELETE_FOR_EVERYONE",
//                     content: "",
//                   }
//                 : m
//             ),
//           };
//         });
//         antMessage.success("Đã thu hồi tin nhắn");
//       }
//     } catch (error) {
//       console.error("Failed to delete message:", error);
//       antMessage.error("Không thể thu hồi tin nhắn");
//     } finally {
//       setDeleteConfirmState({ message: null });
//     }
//   };

//   const getMessageMenuItems = (message: ChatMessage, isMine: boolean): MenuProps["items"] => {
//     const items: MenuProps["items"] = [
//       {
//         key: "reply",
//         label: "Trả lời",
//         icon: <RollbackOutlined />,
//         onClick: () => {
//           setReplyingToMessage(message);
//           setEditingMessage(null);
//           setTimeout(() => {
//             inputRef.current?.focus();
//           }, 100);
//         },
//       },
//     ];

//     const currentUsername = userDetail?.username;
//     const messageIsDeleted = isMessageDeleted(message, currentUsername);
    
//     if (isMine && !messageIsDeleted) {
//       // Check time constraints
//       const sentAt = new Date(message.sentAt);
//       const now = new Date();
//       const hoursSinceSent = (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60);
      
//       // Check if message can be edited (within 24h, is TEXT type, and not already edited)
//       // Handle both enum and string types (giống CustomerSupportChat.tsx)
//       const messageTypeStr = message.type?.toString().toLowerCase() || "text";
//       const isTextType = messageTypeStr === "text" || message.type === MessageType.TEXT;
//       const isNotEdited = !(message as any).isEdited && !message.isEdited;
//       const canEdit = hoursSinceSent <= 24 && isTextType && isNotEdited;

//       if (canEdit) {
//         items.push({
//           key: "edit",
//           label: "Chỉnh sửa",
//           icon: <EditOutlined />,
//           onClick: () => handleEditMessage(message),
//         });
//       }

//       // Check if message is within 1h for delete for everyone (thu hồi)
//       // isMine (isCustomer) đã được kiểm tra ở trên, nên chỉ cần check thời gian
//       const canDeleteForEveryone = hoursSinceSent <= 1;

//       if (canDeleteForEveryone) {
//         items.push({
//           key: "delete-for-everyone",
//           label: "Thu hồi",
//           icon: <DeleteOutlined />,
//           danger: true,
//           onClick: () => handleDeleteMessage(message),
//         });
//       }
//     }

//     return items;
//   };

//   // Close emoji picker on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
//         setShowEmojiPicker(false);
//       }
//     };

//     if (showEmojiPicker) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showEmojiPicker]);

//   const conversationMenu = (
//     <Menu
//       items={[
//         {
//           key: "info",
//           icon: <InfoCircleOutlined />,
//           label: "Xem thông tin",
//         },
//       ]}
//     />
//   );

//   return (
//     <Drawer
//       open={open}
//       onClose={onClose}
//       width={980}
//       placement="right"
//       mask={false}
//       maskClosable
//       title="Chat với Shop"
//       styles={{ body: { padding: 0 } }}
//     >
//       <div className="flex h-[100vh]">
//         <ConversationList
//           conversations={filteredConversations}
//           selectedConversationId={selectedConversation?.id}
//           onSelect={handleSelectConversation}
//           searchText={searchText}
//           onSearchChange={setSearchText}
//           height={height}
//           isMobileView={isMobileChatView}
//           getShopAvatar={getShopAvatar}
//           getShopName={getShopName}
//         />

//         <div  
//           className={`flex-1 min-w-0 ${isMobileChatView ? "block" : "hidden md:block"
//             }`}
//           style={{ display: isMobileChatView ? "block" : undefined }}
//         >
//           {selectedConversation ? (
//             <div className="h-full flex flex-col bg-white">
//               {newMessageAlert && (
//                 <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
//                   <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13 10V3L4 14h7v7l9-11h-7z"
//                       />
//                     </svg>
//                     <span className="text-sm font-medium">Tin nhắn mới!</span>
//                   </div>
//                 </div>
//               )}

//               {/* Header */}
//               <ChatHeader 
//                 selectedConversation={selectedConversation}
//                 currentUserId={currentUserId}
//                 wsConnected={wsConnected}
//                 onBackMobile={() => setIsMobileChatView(false)}
//                 getShopAvatar={getShopAvatar}
//                 getShopName={getShopName}
//               />
//               {!currentUserId && (
//                 <Alert
//                   message="Yêu cầu đăng nhập"
//                   description={
//                     <div>
//                       <p className="mb-2">
//                         Bạn cần đăng nhập để sử dụng tính năng chat với Shop.
//                       </p>
//                       <button
//                         onClick={() => router.push("/login")}
//                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
//                       >
//                         <span>Đăng nhập ngay</span>
//                       </button>
//                     </div>
//                   }
//                   type="warning"
//                   showIcon
//                   className="mx-4 mt-4"
//                 />
//               )}

//               {/* Messages */}
//              <MessageList
//                 messages={messages}
//                 currentUserId={currentUserId}
//                 currentUsername={userDetail?.username}
//                 isInitializing={isInitializingMessages}
//                 isLoadingMessages={loadingMessages}
//                 isLoadingMore={isLoadingMore}
//                 hasMoreMessages={hasMoreMessages}
//                 typingUsers={typingUsers}
//                 activeConversationId={activeConversationId}
//                 latestMessageId={latestMessageId}
//                 messagesContainerRef={messagesContainerRef}
//                 messagesEndRef={messagesEndRef}
//                 onScroll={handleScroll}
//                 // Passing các helpers có sẵn trong file của bạn
//                 getMessageSender={getMessageSender}
//                 getMessageSenderName={getMessageSenderName}
//                 getMessageSenderAvatar={getMessageSenderAvatar}
//                 formatTime={formatTime}
//                 isMessageDeleted={isMessageDeleted}
//                 getMessageMenuItems={getMessageMenuItems}
//               />

//               {/* Quick Replies*/}
//               {!isInitializingMessages && (
//                  <QuickReplies
//                     showQuickReplies={showQuickReplies}
//                     setShowQuickReplies={setShowQuickReplies}
//                     onSelect={(qr) => onSendMessage(qr.content)}
//                     disabled={!currentUserId || sendingMessage}
//                   />
//               )}

//               {/* Attachment Preview */}
//               {attachments.length > 0 && (
//                 <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
//                   <div className="flex flex-wrap gap-2">
//                     {attachments.map((file) => (
//                       <div key={file.uid} className="relative group bg-white rounded-lg p-2 border border-gray-200">
//                         {file.type?.startsWith("image/") ? (
//                           <img
//                             src={file.thumbUrl || URL.createObjectURL(file.originFileObj as File)}
//                             alt={file.name}
//                             className="w-12 h-12 object-cover rounded"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
//                             <VideoCameraOutlined className="text-xl text-gray-400" />
//                           </div>
//                         )}
//                         <button
//                           onClick={() => handleRemoveAttachment(file)}
//                           className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Typing Indicator */}
//               {typingUsers.length > 0 && activeConversationId && (
//                 <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
//                   <TypingIndicator userIds={typingUsers} conversationId={activeConversationId} />
//                 </div>
//               )}

//               {/* Inline Order Picker Panel - Shopee Style */}
//               {showOrderPicker && (
//                 <div className="bg-white border-t border-gray-200 shadow-lg">
//                   {/* Header */}
//                   <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="text-sm text-orange-600 font-semibold flex items-center gap-2">
//                         <ShoppingCartOutlined />
//                         Đơn hàng
//                       </p>
//                       <button
//                         onClick={() => { setShowOrderPicker(false); setSelectedOrder(null); setOrderSearchText(""); }}
//                         className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                     {/* Search Input */}
//                     <Input
//                       placeholder="Tìm kiếm đơn hàng..."
//                       prefix={<SearchOutlined />}
//                       value={orderSearchText}
//                       onChange={(e:any) => setOrderSearchText(e.target.value)}
//                       allowClear
//                       className="rounded-lg"
//                     />
//                   </div>

//                   {/* Order List */}
//                   <OrderPicker  
//                     isVisible={showOrderPicker}
//                     onClose={() => {
//                       setShowOrderPicker(false);
//                       setSelectedOrder(null);
//                       setOrderSearchText("");
//                     }}
//                     orders={filteredOrders}
//                     isLoading={loadingOrders}
//                     searchText={orderSearchText}
//                     onSearchChange={setOrderSearchText}
//                     onSendDirect={handleSendOrderCardDirect}
//                     onViewDetails={handleViewOrderDetails}
//                     isSending={sendingOrderCard}
//                     getStatusText={getStatusText}
//                     resolveOrderItemImageUrl={resolveOrderItemImageUrl}
//                   />
//                 </div>
//               )}

//                 <ProductPicker
//                   isVisible={showProductPicker}
//                   onClose={() => {
//                     setShowProductPicker(false);
//                     setSelectedProduct(null);
//                     setProductSearchText("");
//                   }}
//                   products={filteredProducts}
//                   isLoading={loadingProducts}
//                   searchText={productSearchText}
//                   onSearchChange={setProductSearchText}
//                   onSendDirect={handleSendProductCardDirect}
//                   onViewDetails={handleViewProductDetails}
//                   isSending={sendingProductCard}
//                 />
//               {/* Reply/Edit Preview - Đặt lên trên, tách biệt khỏi input area */}
//               {(replyingToMessage || editingMessage) && (
//                 <div className="px-4 py-2 bg-white border-t border-gray-200">
//                   <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-2">
//                     <div className="flex-1 min-w-0">
//                       {editingMessage ? (
//                         <div>
//                           <div className="text-xs font-medium text-blue-700 mb-1">
//                             Đang chỉnh sửa tin nhắn
//                           </div>
//                           <div className="text-xs text-gray-600 line-through">
//                             {editingMessage.content}
//                           </div>
//                         </div>
//                       ) : replyingToMessage ? (
//                         <div>
//                           <div className="text-xs font-medium text-blue-700 mb-1">
//                             Trả lời{" "}
//                             {replyingToMessage.user?.userId === currentUserId
//                               ? "bạn"
//                               : replyingToMessage.user?.shopName ||
//                                 replyingToMessage.user?.fullNameBuyer ||
//                                 replyingToMessage.user?.fullNameEmployee ||
//                                 replyingToMessage.user?.username ||
//                                 "người khác"}
//                           </div>
//                           <div className="text-xs text-gray-600 truncate">
//                             {replyingToMessage.content || "Tin nhắn đã bị thu hồi"}
//                           </div>
//                         </div>
//                       ) : null}
//                     </div>
//                     <Button
//                       type="text"
//                       size="small"
//                       icon={<CloseOutlined />}
//                       onClick={() => {
//                         setReplyingToMessage(null);
//                         setEditingMessage(null);
//                       }}
//                       className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Input Area */}
//               <ChatInputArea
//                 inputRef={inputRef}
//                 messageText={messageText}
//                 setMessageText={setMessageText}
//                 onSendMessage={() => {
//                   onSendMessage(messageText);
//                   setMessageText("");
//                 }}
//                 showEmojiPicker={showEmojiPicker}
//                 setShowEmojiPicker={setShowEmojiPicker}
//                 onEmojiClick={(e) => setMessageText(prev => prev + e.emoji)}
//                 toggleOrderPicker={() => setShowOrderPicker(!showOrderPicker)}
//                 toggleProductPicker={() => setShowProductPicker(!showProductPicker)}
//                 replyingToMessage={store.replyingToMessage}
//                 editingMessage={store.editingMessage}
//                 isUploading={false}
//                 sendingMessage={false}
//                 disabled={!currentUserId}
//                 onAttachmentChange={() => {}}
//                 showQuickReplies={false}
//                 setShowQuickReplies={() => {}}
//               />
//             </div>
//           ) : (
//             <ChatEmptyState 
//               hasConversations={store.conversations.length > 0} 
//               onStartChat={() => {}}
//               onSearchFocus={() => inputRef.current?.focus()}
//             />
//           )}
//         </div>
//       </div>

//       <Popconfirm
//         title="Thu hồi tin nhắn"
//         description="Bạn có muốn thu hồi tin nhắn này? (Tin nhắn sẽ bị xóa khỏi cuộc trò chuyện)"
//         open={deleteConfirmState.message !== null}
//         onConfirm={() => executeDelete(deleteConfirmState.message || undefined)}
//         onCancel={() => setDeleteConfirmState({ message: null })}
//         okText="Thu hồi"
//         cancelText="Hủy"
//         okButtonProps={{ danger: true }}
//         placement="top"
//         getPopupContainer={() =>
//           (document.querySelector(".ant-drawer-body") as HTMLElement) ||
//           document.body
//         }
//         overlayStyle={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: "min(420px, calc(100% - 32px))",
//           maxWidth: 420,
//           zIndex: 1001,
//         }}
//       />
//     <DeleteMessageModal
//         isOpen={!!deleteConfirmMsg}
//         onCancel={() => setDeleteConfirmMsg(null)}
//         onConfirm={async () => {
//           await onRevokeMessage(deleteConfirmMsg.id);
//           setDeleteConfirmMsg(null);
//         }}
//       />
//     </Drawer>
//   );
// };

