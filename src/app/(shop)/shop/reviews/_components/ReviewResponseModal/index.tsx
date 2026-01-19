"use client";

import React, { useState } from "react";
import { MessageSquare, Send, X, Lightbulb, Loader2 } from "lucide-react";
import { useCreateReviewResponse } from "../../_hooks/useShopReview";
import { useToast } from "@/hooks/useToast";
import { PortalModal } from "@/features/PortalModal"; 

interface ReviewResponseModalProps {
  open: boolean;
  reviewId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

<<<<<<< HEAD
export const ReviewResponseModal =({
=======
export default function ReviewResponseModal({
>>>>>>> 8a2068ab96d618c3c925402d94a049953fa71d7b
  open,
  reviewId,
  onClose,
  onSuccess,
<<<<<<< HEAD
}: ReviewResponseModalProps) =>{
=======
}: ReviewResponseModalProps) {
>>>>>>> 8a2068ab96d618c3c925402d94a049953fa71d7b
  const [responseValue, setResponseValue] = useState("");
  const [error, setError] = useState("");
  const { handleCreateReviewResponse, loading } = useCreateReviewResponse();
  const { success: toastSuccess, error: toastError } = useToast();

  const validate = () => {
    if (!responseValue.trim()) {
      setError("Vui lòng nhập nội dung phản hồi!");
      return false;
    }
    if (responseValue.length < 10) {
      setError("Phản hồi nên có ít nhất 10 ký tự để có ý nghĩa!");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !reviewId) return;

    try {
      const res = await handleCreateReviewResponse(reviewId, {
        response: responseValue,
      });

      if (res && res.data) {
        toastSuccess("Đã gửi phản hồi thành công!");
        setResponseValue("");
        onSuccess();
        onClose();
      } else {
        toastError(res?.message || "Không thể gửi phản hồi!");
      }
    } catch (err) {
      console.error("Submit failed:", err);
      toastError("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleClose = () => {
    setResponseValue("");
    setError("");
    onClose();
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={handleClose}
      width="max-w-2xl"
      className="p-0 overflow-hidden rounded-2xl"
    >
      {/* Header với Gradient mượt hơn */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
            <MessageSquare size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Trả lời đánh giá
            </h2>
            <p className="text-indigo-100 text-sm opacity-90">
              Gửi phản hồi chuyên nghiệp đến khách hàng
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white">
        {/* Lời khuyên UI hiện đại hơn */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
          <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <p className="text-slate-600 text-sm leading-relaxed">
            <span className="font-bold text-slate-800">Lời khuyên:</span> Trả
            lời chuyên nghiệp giúp xây dựng niềm tin và cải thiện uy tín của
            shop trong mắt khách hàng tiềm năng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
              Nội dung phản hồi <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={responseValue}
              onChange={(e) => setResponseValue(e.target.value)}
              maxLength={1000}
              placeholder="Ví dụ: Cảm ơn bạn đã đánh giá! Chúng tôi rất vui khi sản phẩm đáp ứng được mong đợi của bạn..."
              className={`w-full p-4 text-slate-700 bg-slate-50 border rounded-xl focus:outline-none focus:ring-4 transition-all resize-none ${
                error
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />

            <div className="flex justify-between items-center px-1">
              <span className="text-red-500 text-xs font-medium">{error}</span>
              <span
                className={`text-xs font-bold ${
                  responseValue.length > 900
                    ? "text-orange-500"
                    : "text-slate-400"
                }`}
              >
                {responseValue.length}/1000
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Gửi phản hồi
            </button>
          </div>
        </form>
      </div>
    </PortalModal>
  );
}
