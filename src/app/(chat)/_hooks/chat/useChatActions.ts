import { useChatStore } from "../../_store/chatStore";
import { useSendMessage } from "../useMessage";
import { MessageType } from "../../_types/chat.dto"; 

export const useChatActions = () => {
  const { activeConversationId, addMessage, replyingToMessage, setReplyingTo } = useChatStore();
  const { handleSendMessage } = useSendMessage();

  const onSendMessage = async (content: string, attachments: any[] = []) => {
    if (!activeConversationId) return;

    let messageType = MessageType.TEXT;
    if (attachments.length > 0) {
      const firstFile = attachments[0];
      const mime = firstFile.mimeType || firstFile.type || "";
      
      if (mime.startsWith("image/")) messageType = MessageType.IMAGE;
      else if (mime.startsWith("video/")) messageType = MessageType.VIDEO;
      else messageType = MessageType.FILE;
    }

    const res = await handleSendMessage({
      conversationId: activeConversationId,
      content: content?.trim() || "", 
      attachments,
      type: messageType,
      replyToMessageId: replyingToMessage?.id 
    });

    if (res?.success) {
      addMessage(activeConversationId, res.data);
      setReplyingTo(null); 
    }
    
    return res;
  };

  return { onSendMessage };
};