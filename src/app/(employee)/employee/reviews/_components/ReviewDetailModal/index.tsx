"use client";

import React from "react";
import dayjs from "dayjs";
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  Package, 
  Star, 
  Copy, 
  MessageSquare,
  BadgeCheck,
  Hash,
  RotateCw
} from "lucide-react";
import { ReviewResponse, ReviewStatus, ReviewType } from "../../_types/review.type";
import { cn } from "@/utils/cn";

interface ReviewDetailModalProps {
  review: ReviewResponse | null;
  onClose: () => void;
}

export default function ReviewDetailModal({
  review,
  onClose,
}: ReviewDetailModalProps) {
  if (!review) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Bạn có thể thêm toast thông báo ở đây
  };

  const getStatusStyle = (status: ReviewStatus) => {
    const configs = {
      [ReviewStatus.PENDING]: "bg-orange-50 text-orange-600 border-gray-100",
      [ReviewStatus.APPROVED]: "bg-emerald-50 text-emerald-600 border-emerald-100",
      [ReviewStatus.REJECTED]: "bg-red-50 text-red-600 border-red-100",
      [ReviewStatus.FLAGGED]: "bg-amber-50 text-amber-600 border-amber-100",
    };
    return configs[status] || "bg-gray-50 text-gray-600";
  };

  const getTypeStyle = (type: ReviewType) => {
    const configs = {
      [ReviewType.PRODUCT]: "bg-blue-50 text-blue-600 border-blue-100",
      [ReviewType.SHOP]: "bg-purple-50 text-purple-600 border-purple-100",
      [ReviewType.ORDER]: "bg-cyan-50 text-cyan-600 border-cyan-100",
    };
    return configs[type] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem 
          icon={<Hash size={14}/>} 
          label="ID Review" 
          value={review.id} 
          copyable 
          onCopy={() => copyToClipboard(review.id)}
        />
        <div className="flex gap-2 items-center">
          <span className={cn("px-3 py-1 rounded-full text-[10px] font-semibold uppercase border", getTypeStyle(review.reviewType))}>
            {review.reviewType}
          </span>
          <span className={cn("px-3 py-1 rounded-full text-[10px] font-semibold uppercase border", getStatusStyle(review.status))}>
            {review.status}
          </span>
        </div>
      </div>

      {/* 2. Main Content Card */}
      <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <User size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900">{review.username}</h4>
                {review.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    <BadgeCheck size={10} /> Đã mua hàng
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 font-medium">Buyer ID: {review.buyerId}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={cn(i < review.rating ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200")} />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-500">{review.rating}/5 sao</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm italic text-gray-600 text-sm leading-relaxed">
          "{review.comment || "Người dùng không để lại lời nhắn"}"
        </div>
      </div>

      {/* 3. Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-1">
        <StatDetail 
          icon={<CheckCircle2 size={16} className="text-emerald-500" />} 
          label="Hữu ích" 
          value={review.helpfulCount} 
        />
        <StatDetail 
          icon={<XCircle size={16} className="text-red-400" />} 
          label="Không hữu ích" 
          value={review.notHelpfulCount} 
        />
        <StatDetail 
          icon={<Star size={16} className="text-orange-400" />} 
          label="Điểm tin cậy" 
          value={review.helpfulnessScore} 
        />
      </div>

      {/* 4. Order & Seller Response Section */}
      <div className="space-y-4">
        {review.orderId && (
          <div className="flex items-center justify-between p-3 bg-white border border-dashed border-gray-200 rounded-xl">
             <div className="flex items-center gap-2 text-gray-500">
               <Package size={16} />
               <span className="text-xs font-bold uppercase tracking-widest">Mã đơn hàng:</span>
             </div>
             <button 
              onClick={() => copyToClipboard(review.orderId!)}
              className="text-xs font-mono font-bold text-orange-600 hover:underline flex items-center gap-1"
             >
               {review.orderId} <Copy size={12} />
             </button>
          </div>
        )}

        {review.sellerResponse && (
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 flex items-center gap-2">
              <MessageSquare size={14} /> Phản hồi từ người bán
            </label>
            <div className="bg-orange-50/30 border-l-4 border-gray-400 p-4 rounded-r-xl text-sm text-gray-700 leading-relaxed">
              {review.sellerResponse}
            </div>
          </div>
        )}

        {review.rejectionReason && review.status === ReviewStatus.REJECTED && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <h5 className="text-[10px] font-semibold text-red-500 uppercase mb-1">Lý do từ chối kiểm duyệt</h5>
            <p className="text-sm text-red-700 font-medium">{review.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* 5. Footer Metadata */}
      <div className="pt-4 border-t border-gray-100 flex flex-wrap justify-between gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1"><Calendar size={12}/> Tạo: {dayjs(review.createdDate).format("DD/MM/YYYY HH:mm")}</div>
          <div className="flex items-center gap-1"><RotateCw size={12}/> Sửa: {dayjs(review.lastModifiedDate).format("DD/MM/YYYY HH:mm")}</div>
        </div>
        <div className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">Version: {review.version}</div>
      </div>
    </div>
  );
}
    // Sub-components nội bộ để sạch code
const InfoItem = ({ label, value, icon, copyable, onCopy }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 flex items-center gap-1">
      {icon} {label}
    </label>
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{value}</span>
      {copyable && (
        <button onClick={onCopy} className="text-gray-500 hover:text-orange-500 transition-colors">
          <Copy size={12} />
        </button>
      )}
    </div>
  </div>
);

const StatDetail = ({ icon, label, value }: any) => (
  <div className="flex flex-col items-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-105">
    <div className="mb-1">{icon}</div>
    <span className="text-[10px] font-semibold text-gray-600 uppercase mb-1">{label}</span>
    <span className="text-xl font-semibold text-gray-800 italic leading-none">{value}</span>
  </div>
);