import { ChatAttachment } from "../../_store/chatStore";

export interface ChatInputAreaProps {
  messageText: string;
  setMessageText: (val: string) => void;
  onSendMessage: () => void;
  onAttachmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  isUploading: boolean;
  sendingMessage: boolean;
  disabled: boolean;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: boolean) => void;
  onEmojiClick: (emojiData: any) => void;
  toggleOrderPicker: () => void;
  toggleProductPicker: () => void;
  showQuickReplies?: boolean;
  setShowQuickReplies?: (val: boolean) => void;
  editingMessage: any;
  replyingToMessage: any;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}