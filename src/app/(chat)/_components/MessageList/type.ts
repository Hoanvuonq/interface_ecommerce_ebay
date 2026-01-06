import { RefObject } from "react";
import type { Message as ChatMessage } from "../../_types/chat.type";
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

export interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isInitializing: boolean;
  isLoadingMore: boolean;
  hasMoreMessages: boolean;
  typingUsers?: string[];
  activeConversationId: string | null;
  latestMessageId?: string | null;

  messagesContainerRef: RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;

  getMessageSender: (m: ChatMessage) => "customer" | "shop" | "system";
  getMessageSenderName: (m: ChatMessage) => string;
  getMessageSenderAvatar: (m: ChatMessage) => string | undefined;
    formatTime: (ts: string) => string;
  isMessageDeleted: (m: ChatMessage, username?: string) => boolean;
  getMessageMenuItems: (
    m: ChatMessage,
    isMine: boolean
  ) => (MenuItem | boolean | undefined)[];
  currentUsername?: string;

  isLoadingMessages?: boolean;
}
