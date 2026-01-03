import { useChatStore } from "../../_store/chatStore";
import { useGetMessages, useSendMessage, useDeleteMessage } from "../useMessage";
import { MessageType } from "../../_types/chat.dto";
import _ from "lodash";

export const useChatLogic = () => {
  const store = useChatStore();
  const { handleGetMessages } = useGetMessages();
  const { handleSendMessage } = useSendMessage();
  const { handleDeleteMessage } = useDeleteMessage();

  const loadInitialMessages = async (conversationId: string) => {
    if (!conversationId) return;
    store.setLoadingMessages(true);
    try {
      const res = await handleGetMessages(conversationId, { page: 0, size: 20, sort: "createdDate,desc" });
      if (res?.success) {
        store.setMessages(conversationId, _.reverse([...res.data.content]));
      }
    } finally {
      store.setLoadingMessages(false);
    }
  };

  const onSendMessage = async (content: string, attachments: any[] = []) => {
    if (!store.activeConversationId) return;
    const res = await handleSendMessage({
      conversationId: store.activeConversationId,
      content: content.trim(),
      attachments,
      type: attachments.length > 0 ? MessageType.IMAGE : MessageType.TEXT,
      replyToMessageId: store.replyingToMessage?.id
    });
    if (res?.success) {
      store.addMessage(store.activeConversationId, res.data);
      store.setReplyingTo(null);
    }
    return res;
  };

  const onRevokeMessage = async (messageId: string) => {
    if (!store.activeConversationId) return;
    const res = await handleDeleteMessage(messageId, { deleteType: "DELETE_FOR_EVERYONE" });
    if (res?.success) {
      store.updateMessageInList(store.activeConversationId, messageId, {
        content: "",
        deletedAt: new Date().toISOString(),
        deletedType: "DELETE_FOR_EVERYONE"
      });
    }
    return res;
  };

  return { loadInitialMessages, onSendMessage, onRevokeMessage };
};