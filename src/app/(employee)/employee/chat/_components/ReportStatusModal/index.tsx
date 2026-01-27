"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PortalModal } from "@/features/PortalModal";
import {
  FormInput,
  SelectComponent,
  ButtonField,
  SectionHeader,
} from "@/components";
import { Button } from "@/components/button";
import {
  RefreshCw,
  ClipboardEdit,
  CheckCircle2,
  Loader2,
  MessageSquareQuote,
  AlertCircle,
} from "lucide-react";
import { ReportStatus } from "@/app/(chat)/_types/chat.dto";

interface ReportStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReport: any; // Thay bằng Interface Report của bạn
  onSubmit: (values: {
    status: ReportStatus;
    adminNote: string;
  }) => Promise<void>;
  loading?: boolean;
}

export const ReportStatusModal: React.FC<ReportStatusModalProps> = ({
  isOpen,
  onClose,
  selectedReport,
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: ReportStatus.PENDING,
      adminNote: "",
    },
  });

  // Đồng bộ giá trị khi mở modal
  useEffect(() => {
    if (isOpen && selectedReport) {
      reset({
        status: selectedReport.status || ReportStatus.PENDING,
        adminNote: selectedReport.adminNotes || "",
      });
    }
  }, [isOpen, selectedReport, reset]);

  const currentStatus = watch("status");

  const statusOptions = [
    { label: "Chờ xử lý", value: ReportStatus.PENDING },
    { label: "Đã xem xét", value: ReportStatus.REVIEWED },
    { label: "Đã giải quyết", value: ReportStatus.RESOLVED },
    { label: "Từ chối", value: ReportStatus.REJECTED },
  ];

  const onLocalSubmit = (data: any) => {
    onSubmit(data);
  };

  const renderHeader = (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
        <RefreshCw size={20} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-gray-800 uppercase text-sm tracking-tight leading-none">
          Cập nhật thực thi
        </span>
        <span className="text-[10px] font-bold text-gray-400 mt-1 italic tracking-widest uppercase">
          Status transition protocol
        </span>
      </div>
    </div>
  );

  const renderFooter = (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button
        variant="edit"
        type="button"
        onClick={onClose}
        className="px-8 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest text-gray-400 hover:bg-gray-100 transition-all border-gray-200"
      >
        Hủy bỏ
      </Button>
      <ButtonField
        htmlType="submit"
        type="login"
        form="report-status-form"
        disabled={loading}
        className="w-48! flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <span className="flex items-center gap-2 tracking-widest uppercase">
            Xác nhận cập nhật <CheckCircle2 size={16} strokeWidth={3} />
          </span>
        )}
      </ButtonField>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={renderHeader}
      footer={renderFooter}
      width="max-w-xl"
    >
      <form
        id="report-status-form"
        onSubmit={handleSubmit(onLocalSubmit)}
        className="space-y-6 py-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        {/* Banner tóm tắt ca báo cáo */}
        <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 flex justify-between items-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.2em] block mb-1">
              Đang xử lý báo cáo
            </span>
            <h4 className="text-white font-mono text-lg font-bold tracking-tighter italic leading-none uppercase">
              #{selectedReport?.id?.slice(-8)}
            </h4>
          </div>
          <div className="relative z-10 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Hiện tại: {selectedReport?.status}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeader icon={ClipboardEdit} title="Điều chỉnh trạng thái" />

          <div className="p-6 rounded-4xl bg-gray-50/50 border border-gray-100 space-y-6 shadow-inner">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-widest">
                Trạng thái mới <span className="text-red-500">*</span>
              </label>
              <SelectComponent
                options={statusOptions}
                value={currentStatus}
                onChange={(val) => setValue("status", val)}
                className="rounded-2xl h-12 shadow-sm border-gray-200"
              />
            </div>

            {/* Admin Note Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-1 text-gray-700">
                <MessageSquareQuote size={14} className="text-orange-500" />
                <label className="text-[12px] font-bold uppercase tracking-widest">
                  Ghi chú Admin
                </label>
              </div>
              <FormInput
                isTextArea
                placeholder="Nhập nội dung phản hồi hoặc lý do đưa ra quyết định xử lý này..."
                {...register("adminNote", {
                  maxLength: {
                    value: 500,
                    message: "Ghi chú không được vượt quá 500 ký tự",
                  },
                })}
                error={errors.adminNote?.message as string}
                className="min-h-32 shadow-sm"
              />
              <div className="flex justify-between px-1">
                <div className="flex items-center gap-1 opacity-40">
                  <AlertCircle size={10} />
                  <span className="text-[9px] font-bold uppercase italic">
                    Dữ liệu sẽ được lưu vào lịch sử
                  </span>
                </div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">
                  {watch("adminNote").length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </PortalModal>
  );
};
