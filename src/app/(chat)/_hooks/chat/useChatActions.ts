import { useChatStore } from "../../_store/chatStore";
import { useSendMessage } from "../useMessage";
import { MessageType } from "../../_types/chat.dto"; 

export const useChatActions = () => {
  const { activeConversationId, addMessage } = useChatStore();
  const { handleSendMessage } = useSendMessage();

  const onSendMessage = async (content: string, attachments: any[] = []) => {
    if (!activeConversationId) return;

    let messageType = MessageType.TEXT;
    
    if (attachments.length > 0) {
      const firstType = attachments[0].mimeType || "";
      if (firstType.startsWith("image/")) messageType = MessageType.IMAGE;
      else if (firstType.startsWith("video/")) messageType = MessageType.VIDEO;
      else messageType = MessageType.FILE;
    }

    const res = await handleSendMessage({
      conversationId: activeConversationId,
      content,
      attachments,
      type: messageType, 
    });

    if (res?.success) {
      addMessage(activeConversationId, res.data);
    }
    
    return res;
  };

  return { onSendMessage };
};