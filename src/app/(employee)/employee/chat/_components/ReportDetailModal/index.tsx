"use client";

import React from "react";
import { PortalModal } from "@/features/PortalModal";
import {
  User,
  Calendar,
  MessageSquare,
  FileText,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Copy,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/utils/cn";
import Image from "next/image"; // Nên dùng Next Image nếu có thể
import { ReportReason,ReportStatus } from "@/app/(chat)/_types/chat.dto";

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReport: any; // Thay bằng Interface Report của bạn
  onUpdateStatus: (report: any) => void;
  renderStatus: (status: ReportStatus) => React.ReactNode;
  renderReason: (reason: ReportReason) => React.ReactNode;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  onClose,
  selectedReport,
  onUpdateStatus,
  renderStatus,
  renderReason,
}) => {
  if (!selectedReport) return null;

  const evidenceUrls = (() => {
    try {
      const parsed = JSON.parse(selectedReport.evidence);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return selectedReport.evidence ? [selectedReport.evidence] : [];
    }
  })();

  const InfoRow = ({ icon: Icon, label, children, fullWidth = false }: any) => (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50/50 border border-gray-100",
        fullWidth ? "col-span-2" : "col-span-2 sm:col-span-1",
      )}
    >
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={14} strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-sm font-bold text-gray-800">{children}</div>
    </div>
  );

  const UserCard = ({ title, name, id, avatar }: any) => (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex-1">
      <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter italic">
        {title}
      </span>
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-orange-100 border-2 border-white shadow-md">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-orange-500 font-bold uppercase italic text-sm">
              {name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-gray-800 truncate uppercase leading-tight">
            {name}
          </span>
          <span className="text-[10px] font-medium text-gray-400 font-mono truncate tracking-tighter">
            ID: {id}
          </span>
        </div>
      </div>
    </div>
  );

  const footerButtons = (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
      >
        Đóng
      </button>
      <button
        onClick={() => onUpdateStatus(selectedReport)}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all border-0"
      >
        Cập nhật trạng thái <ChevronRight size={16} strokeWidth={3} />
      </button>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-3xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 uppercase text-sm tracking-tight leading-none">
              Chi tiết báo cáo
            </span>
            <span className="text-[10px] font-bold text-gray-400 mt-1 italic tracking-widest">
              Case ID: #{selectedReport.id?.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>
      }
      footer={footerButtons}
    >
      <div className="space-y-6 py-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* User Identity Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <UserCard
            title="Người báo cáo"
            name={selectedReport.reporterName}
            id={selectedReport.reporterId}
            avatar={selectedReport.reporterAvatar}
          />
          <UserCard
            title="Đối tượng bị báo cáo"
            name={selectedReport.reportedUserName}
            id={selectedReport.reportedUserId}
            avatar={selectedReport.reportedUserAvatar}
          />
        </div>

        {/* Core Information Grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoRow icon={AlertTriangle} label="Lý do vi phạm">
            {renderReason(selectedReport.reason)}
          </InfoRow>
          <InfoRow icon={ShieldCheck} label="Trạng thái xử lý">
            {renderStatus(selectedReport.status)}
          </InfoRow>
          <InfoRow icon={Calendar} label="Ngày khởi tạo">
            {dayjs(selectedReport.createdDate).format("DD/MM/YYYY HH:mm")}
          </InfoRow>
          <InfoRow icon={MessageSquare} label="ID Cuộc trò chuyện">
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="font-mono text-[11px] group-hover:text-orange-600 transition-colors uppercase italic">
                {selectedReport.conversationId}
              </span>
              <Copy
                size={12}
                className="text-gray-300 group-hover:text-orange-500"
              />
            </div>
          </InfoRow>
          <InfoRow icon={FileText} label="Nội dung mô tả" fullWidth>
            <p className="font-medium text-gray-600 leading-relaxed italic">
              {selectedReport.description}
            </p>
          </InfoRow>
        </div>

        {/* Evidence Images */}
        {evidenceUrls.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <ExternalLink size={14} className="text-orange-500" />
              <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                Bằng chứng hình ảnh
              </h4>
            </div>
            <div className="flex flex-wrap gap-3 p-4 rounded-3xl bg-gray-50/50 border border-dashed border-gray-200 shadow-inner">
              {evidenceUrls.map((url: string, index: number) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-transform cursor-zoom-in group"
                >
                  <img
                    src={url}
                    alt="Evidence"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Handling Section */}
        {(selectedReport.adminNotes || selectedReport.handledAt) && (
          <div className="p-5 rounded-4xl bg-orange-50/30 border border-orange-100/50 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Clock size={80} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-600" />
              <h4 className="text-[11px] font-bold uppercase text-orange-800 tracking-widest italic">
                Nhật ký xử lý Admin
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedReport.adminNotes && (
                <div className="col-span-2 space-y-1">
                  <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">
                    Ghi chú phản hồi
                  </span>
                  <p className="text-sm font-semibold text-gray-700 italic">
                    {selectedReport.adminNotes}
                  </p>
                </div>
              )}
              {selectedReport.handledAt && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">
                    Thời gian hoàn tất
                  </span>
                  <p className="text-xs font-bold text-gray-700 leading-none italic">
                    {dayjs(selectedReport.handledAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              )}
              {selectedReport.actionTaken && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">
                    Hành động thực thi
                  </span>
                  <p className="text-xs font-bold text-gray-700 leading-none italic uppercase">
                    {selectedReport.actionTaken}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PortalModal>
  );
};
