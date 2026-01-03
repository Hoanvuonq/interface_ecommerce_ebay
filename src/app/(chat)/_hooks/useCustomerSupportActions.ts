/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
  acceptSupportConversation,
  assignSupportConversation,
} from "../_services/customer-support.service";
import { useToast } from "@/hooks/useToast";

const { success: messageSuccess, error: messageError } = useToast();
/**
 * Hook các action dành riêng cho customer support trên phía staff
 * - Accept conversation (chuyển từ WAITING_FOR_STAFF -> ACTIVE)
 * - Assign conversation cho staff khác
 */
export function useCustomerSupportActions() {
  const [accepting, setAccepting] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const handleAcceptConversation = useCallback(
    async (conversationId: string): Promise<any> => {
      if (!conversationId) return null;
      try {
        setAccepting(true);
        const res = await acceptSupportConversation(conversationId);
        if (res?.success) {
          messageSuccess("Đã nhận xử lý cuộc trò chuyện");
        }
        return res;
      } catch (err: any) {
        const errMsg =
          err?.message ||
          "Không thể nhận xử lý cuộc trò chuyện, vui lòng thử lại";
        messageError(errMsg);
        return null;
      } finally {
        setAccepting(false);
      }
    },
    []
  );

  const handleAssignConversation = useCallback(
    async (conversationId: string, staffUserId: string): Promise<any> => {
      if (!conversationId || !staffUserId) return null;
      try {
        setAssigning(true);
        const res = await assignSupportConversation(
          conversationId,
          staffUserId
        );
        if (res?.success) {
          messageSuccess("Đã chuyển cuộc trò chuyện cho nhân viên khác");
        }
        return res;
      } catch (err: any) {
        const errMsg =
          err?.message ||
          "Không thể chuyển cuộc trò chuyện, vui lòng thử lại";
        messageError(errMsg);
        return null;
      } finally {
        setAssigning(false);
      }
    },
    []
  );

  return {
    accepting,
    assigning,
    handleAcceptConversation,
    handleAssignConversation,
  };
}


