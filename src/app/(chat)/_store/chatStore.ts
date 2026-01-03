import { create } from 'zustand';
import _ from "lodash";
import { ConversationResponse } from '../_types/chat.dto';
import type { Message as ChatMessage } from "../_types/chat.type";

interface ChatState {
  conversations: ConversationResponse[];
  messagesByConversation: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  selectedConversation: ConversationResponse | null;
  replyingToMessage: ChatMessage | null;
  editingMessage: ChatMessage | null;
  loadingMessages: boolean;

  setConversations: (convs: ConversationResponse[]) => void;
  setActiveConversation: (id: string | null, conv: ConversationResponse | null) => void;
  setMessages: (convId: string, messages: ChatMessage[]) => void;
  addMessage: (convId: string, message: ChatMessage) => void;
  updateMessageInList: (convId: string, msgId: string, newData: Partial<ChatMessage>) => void;
  setReplyingTo: (msg: ChatMessage | null) => void;
  setEditing: (msg: ChatMessage | null) => void;
  setLoadingMessages: (val: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  messagesByConversation: {},
  activeConversationId: null,
  selectedConversation: null,
  replyingToMessage: null,
  editingMessage: null,
  loadingMessages: false,

  setConversations: (convs) => set({ conversations: convs }),
  setActiveConversation: (id, conv) => set({ 
    activeConversationId: id, 
    selectedConversation: conv,
    replyingToMessage: null,
    editingMessage: null 
  }),
  setMessages: (convId, messages) => set((state) => ({
    messagesByConversation: { ...state.messagesByConversation, [convId]: messages }
  })),
  addMessage: (convId, message) => set((state) => {
    const existing = state.messagesByConversation[convId] || [];
    if (_.some(existing, { id: message.id })) return state;
    return {
      messagesByConversation: { ...state.messagesByConversation, [convId]: [...existing, message] }
    };
  }),
  updateMessageInList: (convId, msgId, newData) => set((state) => ({
    messagesByConversation: {
      ...state.messagesByConversation,
      [convId]: _.map(state.messagesByConversation[convId], (m) => 
        m.id === msgId ? { ...m, ...newData } : m
      )
    }
  })),
  setReplyingTo: (msg) => set({ replyingToMessage: msg, editingMessage: null }),
  setEditing: (msg) => set({ editingMessage: msg, replyingToMessage: null }),
  setLoadingMessages: (val) => set({ loadingMessages: val }),
}));