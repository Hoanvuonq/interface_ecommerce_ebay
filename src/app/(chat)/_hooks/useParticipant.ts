/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  addParticipants,
  removeParticipant,
  leaveConversation,
  promoteParticipant,
  demoteParticipant,
  getParticipants,
  updateNickname,
  shareToConversation,
} from "../_services";
import { AddParticipantRequest, ShareContentRequest } from "../_types/chat.dto";
import { useToast } from "@/hooks/useToast";
const { success: messageSuccess, error: messageError } = useToast();

/**
 * Hook để thêm thành viên vào nhóm
 */
export function useAddParticipants() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddParticipants = async (
    conversationId: string,
    payload: AddParticipantRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await addParticipants(conversationId, payload);
      if (res.success) {
        messageSuccess("Thêm thành viên thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Thêm thành viên thất bại");
      messageError(err?.message || "Thêm thành viên thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleAddParticipants, loading, error };
}

/**
 * Hook để xóa thành viên khỏi nhóm
 */
export function useRemoveParticipant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemoveParticipant = async (
    conversationId: string,
    userId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await removeParticipant(conversationId, userId);
      if (res.success) {
        messageSuccess("Xóa thành viên thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa thành viên thất bại");
      messageError(err?.message || "Xóa thành viên thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleRemoveParticipant, loading, error };
}

/**
 * Hook để rời khỏi nhóm
 */
export function useLeaveConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLeaveConversation = async (
    conversationId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveConversation(conversationId);
      if (res.success) {
        messageSuccess("Rời nhóm thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Rời nhóm thất bại");
      messageError(err?.message || "Rời nhóm thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleLeaveConversation, loading, error };
}

/**
 * Hook để promote thành admin
 */
export function usePromoteParticipant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePromoteParticipant = async (
    conversationId: string,
    userId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await promoteParticipant(conversationId, userId);
      if (res.success) {
        messageSuccess("Thăng cấp thành admin thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Thăng cấp thất bại");
      messageError(err?.message || "Thăng cấp thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handlePromoteParticipant, loading, error };
}

/**
 * Hook để demote xuống member
 */
export function useDemoteParticipant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoteParticipant = async (
    conversationId: string,
    userId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await demoteParticipant(conversationId, userId);
      if (res.success) {
        messageSuccess("Hạ cấp xuống member thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Hạ cấp thất bại");
      messageError(err?.message || "Hạ cấp thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDemoteParticipant, loading, error };
}

/**
 * Hook để lấy danh sách thành viên
 */
export function useGetParticipants() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetParticipants = async (
    conversationId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getParticipants(conversationId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách thành viên thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetParticipants, loading, error };
}

/**
 * Hook để đặt nickname
 */
export function useUpdateNickname() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateNickname = async (
    conversationId: string,
    userId: string,
    nickname: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateNickname(conversationId, userId, nickname);
      if (res.success) {
        messageSuccess("Cập nhật nickname thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật nickname thất bại");
      messageError(err?.message || "Cập nhật nickname thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateNickname, loading, error };
}

/**
 * Hook để share sản phẩm vào conversation
 */
export function useShareToConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShareToConversation = async (
    conversationId: string,
    payload: ShareContentRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await shareToConversation(conversationId, payload);
      if (res.success) {
        messageSuccess("Chia sẻ sản phẩm thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Chia sẻ sản phẩm thất bại");
      messageError(err?.message || "Chia sẻ sản phẩm thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleShareToConversation, loading, error };
}
