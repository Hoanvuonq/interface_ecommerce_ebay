"use client";

import { SelectComponent } from "@/components/SelectComponent";
import { cn } from "@/utils/cn";
import { AlertTriangle, Ban, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ModerateReviewRequest, ReviewStatus } from "../../_types/review.type";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";

interface ModerateReviewModalProps {
  onCancel: () => void;
  onSubmit: (payload: ModerateReviewRequest) => Promise<void>;
}

export default function ModerateReviewModal({
  onCancel,
  onSubmit,
}: ModerateReviewModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ModerateReviewRequest>({
    defaultValues: {
      status: ReviewStatus.APPROVED,
    },
  });

  const currentStatus = watch("status");

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const onFormSubmit = async (data: ModerateReviewRequest) => {
    const payload: ModerateReviewRequest = {
      status: data.status,
      rejectionReason:
        data.status === ReviewStatus.REJECTED
          ? data.rejectionReason
          : undefined,
    };
    await onSubmit(payload);
  };

  const statusOptions = [
    { label: "Duyệt (APPROVED)", value: ReviewStatus.APPROVED },
    { label: "Từ chối (REJECTED)", value: ReviewStatus.REJECTED },
    { label: "Đánh dấu (FLAGGED)", value: ReviewStatus.FLAGGED },
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">
          Trạng thái kiểm duyệt
        </label>
        <Controller
          name="status"
          control={control}
          rules={{ required: "Vui lòng chọn trạng thái" }}
          render={({ field }) => (
            <SelectComponent
              options={statusOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Chọn trạng thái..."
            />
          )}
        />
      </div>

      {currentStatus === ReviewStatus.REJECTED && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-xs font-semibold uppercase tracking-widest text-red-500 ml-1 flex items-center gap-1">
            <Ban size={14} /> Lý do từ chối
          </label>
          <textarea
            {...register("rejectionReason", {
              required:
                currentStatus === ReviewStatus.REJECTED
                  ? "Vui lòng nhập lý do từ chối"
                  : false,
              maxLength: {
                value: 500,
                message: "Lý do không được quá 500 ký tự",
              },
            })}
            rows={4}
            className={cn(
              "w-full px-4 py-3 rounded-2xl border bg-slate-50/50 outline-none transition-all text-sm font-medium resize-none shadow-inner",
              errors.rejectionReason
                ? "border-red-400 focus:ring-4 focus:ring-red-50"
                : "border-slate-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50"
            )}
            placeholder="Nhập lý do cụ thể (Spam, ngôn từ thiếu văn hóa, ảnh không liên quan...)"
          />
          {errors.rejectionReason && (
            <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tighter">
              {errors.rejectionReason.message}
            </p>
          )}
        </div>
      )}

      <div
        className={cn(
          "p-4 rounded-2xl border flex gap-3 transition-colors duration-500",
          currentStatus === ReviewStatus.APPROVED &&
            "bg-emerald-50 border-emerald-100 text-emerald-700",
          currentStatus === ReviewStatus.REJECTED &&
            "bg-red-50 border-red-100 text-red-700",
          currentStatus === ReviewStatus.FLAGGED &&
            "bg-amber-50 border-amber-100 text-amber-700"
        )}
      >
        <div className="shrink-0 mt-0.5">
          {currentStatus === ReviewStatus.APPROVED && (
            <CheckCircle2 size={18} />
          )}
          {currentStatus === ReviewStatus.REJECTED && <Ban size={18} />}
          {currentStatus === ReviewStatus.FLAGGED && (
            <AlertTriangle size={18} />
          )}
        </div>
        <p className="text-[11px] font-medium leading-relaxed uppercase tracking-tight">
          {currentStatus === ReviewStatus.APPROVED &&
            "Hành động này sẽ hiển thị công khai đánh giá trên cửa hàng."}
          {currentStatus === ReviewStatus.REJECTED &&
            "Đánh giá sẽ bị ẩn. Người dùng sẽ nhận được lý do từ chối."}
          {currentStatus === ReviewStatus.FLAGGED &&
            "Đánh giá sẽ được giữ lại để quản trị viên cao cấp xem xét thêm."}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="edit" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <ButtonField
          form="address-form"
          htmlType="submit"
          type="login"
          disabled={isSubmitting}
          className={cn(
            "flex-[1.5] py-3.5 rounded-2xl font-semibold uppercase text-[11px] tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2",
            currentStatus === ReviewStatus.REJECTED
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
              : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20",
            isSubmitting && "opacity-70 cursor-wait"
          )}
        >
          <span className="flex items-center gap-2">
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Xác nhận kiểm duyệt"
            )}
          </span>
        </ButtonField>
      </div>
    </form>
  );
}
