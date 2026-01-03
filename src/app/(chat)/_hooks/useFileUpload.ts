/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  uploadFile,
  uploadImage,
  uploadVideo,
  uploadAudio,
} from "../_services";
import { useToast } from "@/hooks/useToast";
const { success: messageSuccess, error: messageError } = useToast();

/**
 * Hook để upload file
 */
export function useUploadFile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadFile = async (file: File): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadFile(file);
      if (res.success) {
        messageSuccess("Upload file thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Upload file thất bại");
      messageError(err?.message || "Upload file thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUploadFile, loading, error };
}

/**
 * Hook để upload image
 */
export function useUploadImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadImage = async (file: File): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      if (res.success) {
        messageSuccess("Upload hình ảnh thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Upload hình ảnh thất bại");
      messageError(err?.message || "Upload hình ảnh thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUploadImage, loading, error };
}

/**
 * Hook để upload video
 */
export function useUploadVideo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadVideo = async (file: File): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadVideo(file);
      if (res.success) {
        messageSuccess("Upload video thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Upload video thất bại");
      messageError(err?.message || "Upload video thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUploadVideo, loading, error };
}

/**
 * Hook để upload audio
 */
export function useUploadAudio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadAudio = async (file: File): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadAudio(file);
      if (res.success) {
        messageSuccess("Upload audio thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Upload audio thất bại");
      messageError(err?.message || "Upload audio thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUploadAudio, loading, error };
}
