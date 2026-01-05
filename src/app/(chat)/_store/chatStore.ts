import { create } from "zustand";
import _ from "lodash";
import { ConversationResponse } from "../_types/chat.dto";
import type { Message as ChatMessage } from "../_types/chat.type";

// 1. Định nghĩa kiểu File đính kèm thuần túy
export interface ChatAttachment {
  id: string;
  file: File;
  previewUrl: string;
  type: string;
  name: string;
  size: number;
}

interface ChatState {
  // --- Data States ---
  conversations: ConversationResponse[];
  messagesByConversation: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  selectedConversation: ConversationResponse | null;
  realtimeMessages: Record<string, ChatMessage[]>;

  // --- UI States ---
  isInitializing: boolean;
  loadingMessages: boolean;
  isLoadingMore: boolean;
  hasMoreMessages: boolean;
  isMobileChatView: boolean;
  newMessageAlert: boolean; // <--- Có thể bạn cũng thiếu cái này

  // 👇 FIX: Thêm dòng này vào Interface
  latestMessageId: string | null;

  // --- Input & Action States ---
  messageText: string;
  searchText: string;
  showEmojiPicker: boolean;
  showQuickReplies: boolean;
  attachments: ChatAttachment[];
  replyingToMessage: ChatMessage | null;
  editingMessage: ChatMessage | null;
  typingUsers: string[];

  // --- Picker States ---
  showOrderPicker: boolean;
  showProductPicker: boolean;
  orderSearchText: string;
  productSearchText: string;
  orders: any[];
  products: any[];
  loadingOrders: boolean;
  loadingProducts: boolean;

  // --- ACTIONS ---
  setUiState: (patch: Partial<ChatState>) => void;
  setActiveConversation: (
    id: string | null,
    conv: ConversationResponse | null
  ) => void;

  // Message Actions
  addMessage: (convId: string, message: ChatMessage) => void;
  setMessages: (convId: string, messages: ChatMessage[]) => void;
  updateMessageInList: (
    convId: string,
    msgId: string,
    data: Partial<ChatMessage>
  ) => void;
  setReplyingTo: (msg: ChatMessage | null) => void;
  addRealtimeMessage: (convId: string, message: ChatMessage) => void;

  // File Actions
  addAttachments: (files: FileList | File[]) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;

  resetSession: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // --- Initial Values ---
  conversations: [],
  messagesByConversation: {},
  realtimeMessages: {},
  activeConversationId: null,
  selectedConversation: null,
  isInitializing: false,
  loadingMessages: false,
  isLoadingMore: false,
  hasMoreMessages: true,
  isMobileChatView: false,
  newMessageAlert: false, // Init value

  // 👇 Init value cho latestMessageId
  latestMessageId: null,

  messageText: "",
  searchText: "",
  showEmojiPicker: false,
  showQuickReplies: false,
  attachments: [],
  replyingToMessage: null,
  editingMessage: null,
  typingUsers: [],
  showOrderPicker: false,
  showProductPicker: false,
  orderSearchText: "",
  productSearchText: "",
  orders: [],
  products: [],
  loadingOrders: false,
  loadingProducts: false,

  // --- Actions ---
  setUiState: (patch) => set((state) => ({ ...state, ...patch })),

  setActiveConversation: (id, conv) =>
    set({
      activeConversationId: id,
      selectedConversation: conv,
      messageText: "",
      attachments: [],
      replyingToMessage: null,
      editingMessage: null,
      showEmojiPicker: false,
      realtimeMessages: {},
    }),

  setMessages: (convId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [convId]: messages,
      },
    })),

  addMessage: (convId, message) =>
    set((state) => {
      const current = state.messagesByConversation[convId] || [];
      if (_.some(current, { id: message.id })) return state;
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [convId]: [...current, message],
        },
      };
    }),

  setReplyingTo: (msg) => set({ replyingToMessage: msg, editingMessage: null }),

  addRealtimeMessage: (convId, message) =>
    set((state) => {
      const current = state.realtimeMessages[convId] || [];
      if (_.some(current, { id: message.id })) return state;

      // Cập nhật cả latestMessageId khi có tin nhắn mới
      return {
        latestMessageId: message.id, // <--- Cập nhật ở đây
        realtimeMessages: {
          ...state.realtimeMessages,
          [convId]: [...current, message],
        },
      };
    }),

  updateMessageInList: (convId, msgId, data) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [convId]: _.map(state.messagesByConversation[convId], (m) =>
          m.id === msgId ? { ...m, ...data } : m
        ),
      },
      realtimeMessages: {
        ...state.realtimeMessages,
        [convId]: _.map(state.realtimeMessages[convId] || [], (m) =>
          m.id === msgId ? { ...m, ...data } : m
        ),
      },
    })),

  addAttachments: (files) =>
    set((state) => {
      const fileArray = files instanceof FileList ? Array.from(files) : files;
      const newItems: ChatAttachment[] = fileArray.map((f) => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        previewUrl: URL.createObjectURL(f),
        name: f.name,
        type: f.type.startsWith("image") ? "image" : "video",
        size: f.size,
      }));
      return { attachments: [...state.attachments, ...newItems] };
    }),

  removeAttachment: (id) =>
    set((state) => {
      const item = state.attachments.find((a) => a.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return { attachments: state.attachments.filter((a) => a.id !== id) };
    }),

  clearAttachments: () =>
    set((state) => {
      state.attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));
      return { attachments: [] };
    }),

  resetSession: () =>
    set((state) => {
      state.attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));
      return {
        activeConversationId: null,
        selectedConversation: null,
        attachments: [],
        messageText: "",
      };
    }),
}));
