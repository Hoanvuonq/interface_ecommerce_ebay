"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Calculator, 
  Loader2, 
  Info,
  ShieldCheck,
  PlusCircle,
  MinusCircle
} from "lucide-react";

import { PayrollResponse } from "../../_types/payroll.type";
import { useCreatePayroll, useUpdatePayroll } from "../../_hooks/usePayroll";
import { useCreateUploadImage } from "../../_hooks/useEmployee";
import { FileUploadField } from "@/components/fileUploadField";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";
import { SectionHeader } from "@/components";

interface PayrollFormProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  mode: "create" | "update";
  payroll?: PayrollResponse | null;
  onSuccess: () => void;
}

export default function PayrollForm({
  open,
  onClose,
  employeeId,
  mode,
  payroll,
  onSuccess,
}: PayrollFormProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const { handleCreatePayroll, loading: creating } = useCreatePayroll();
  const { handleUpdatePayroll, loading: updating } = useUpdatePayroll();
  const { handleCreateUploadImage, loading: uploading } = useCreateUploadImage();

  const isSubmitting = creating || updating || uploading;

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      payMonth: "",
      baseSalary: 0,
      bonus: 0,
      deduction: 0,
      total: 0,
      attachmentFile: [] as any[],
      expectedPayDate: "",
      paidDate: "",
    }
  });

  // Theo dõi các giá trị để tính tổng lương gợi ý
  const watchedBase = watch("baseSalary") || 0;
  const watchedBonus = watch("bonus") || 0;
  const watchedDeduction = watch("deduction") || 0;
  const suggestedTotal = Number(watchedBase) + Number(watchedBonus) - Number(watchedDeduction);

  useEffect(() => {
    if (open) {
      if (mode === "update" && payroll) {
        reset({
          payMonth: payroll.payMonth,
          baseSalary: payroll.baseSalary,
          bonus: payroll.bonus || 0,
          deduction: payroll.deduction || 0,
          total: payroll.total,
          expectedPayDate: payroll.expectedPayDate ? dayjs(payroll.expectedPayDate).format("YYYY-MM-DD") : "",
          paidDate: payroll.paidDate ? dayjs(payroll.paidDate).format("YYYY-MM-DDTHH:mm") : "",
          attachmentFile: payroll.attachmentUrl ? [{
            uid: "-1", name: "payroll-file", status: "done", url: payroll.attachmentUrl
          }] : [],
        });
      } else {
        reset({
          payMonth: dayjs().format("YYYY-MM"),
          baseSalary: 0, bonus: 0, deduction: 0, total: 0,
          expectedPayDate: dayjs().endOf("month").format("YYYY-MM-DD"),
          attachmentFile: [],
        });
      }
    }
  }, [open, mode, payroll, reset]);

  const onFormSubmit = async (values: any) => {
    let attachmentUrl = payroll?.attachmentUrl;
    const file = values.attachmentFile?.[0];

    // Logic Upload File
    if (file?.originFileObj) {
      const uploadRes = await handleCreateUploadImage({
        file: file.originFileObj,
        path: `payrolls/${employeeId}/${Date.now()}-${file.originFileObj.name}`,
      });
      if (uploadRes?.url) attachmentUrl = uploadRes.url;
    } else if (values.attachmentFile?.length === 0) {
      attachmentUrl = undefined;
    }

    const payload = {
      payMonth: values.payMonth,
      baseSalary: Number(values.baseSalary),
      bonus: Number(values.bonus),
      deduction: Number(values.deduction),
      total: Number(values.total),
      attachmentUrl,
      expectedPayDate: new Date(values.expectedPayDate).toISOString(),
      ...(values.paidDate && { paidDate: new Date(values.paidDate).toISOString() }),
    };

    const res = mode === "create" 
      ? await handleCreatePayroll(employeeId, payload)
      : await handleUpdatePayroll(employeeId, payroll!.id, payload);

    if (res?.data) {
      toastSuccess(mode === "create" ? "Tạo thành công" : "Cập nhật thành công");
      onSuccess();
      onClose();
    }
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={mode === "create" ? "Khởi tạo bảng lương" : "Cập nhật bảng lương"}
      width="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 pb-6">
        
        {/* Section 1: Chu kỳ & Thời gian */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Tháng lương" type="month" {...register("payMonth", { required: true })} disabled={mode === "update"} />
          <InputField label="Hạn trả dự kiến" type="date" {...register("expectedPayDate", { required: true })} />
        </div>

        {/* Section 2: Con số tài chính */}
        <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 space-y-6">
          <SectionHeader icon={<Calculator className="text-orange-500" />} title="Chi tiết thu nhập" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Lương cơ bản (VND)" type="number" {...register("baseSalary", { required: true, min: 0 })} icon={<DollarSign size={14}/>} />
            <InputField label="Tiền thưởng (+)" type="number" {...register("bonus")} icon={<PlusCircle size={14} className="text-emerald-500"/>} />
            <InputField label="Khấu trừ (-)" type="number" {...register("deduction")} icon={<MinusCircle size={14} className="text-red-400"/>} />
          </div>

          {/* Suggested Total Alert */}
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-2xl border-dashed">
            <div className="flex items-center gap-2 text-orange-700">
              <Info size={16} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Gợi ý thực lĩnh:</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-orange-600 italic">
                {new Intl.NumberFormat("vi-VN").format(suggestedTotal)}
              </span>
              <button 
                type="button" 
                onClick={() => setValue("total", suggestedTotal)}
                className="text-[9px] font-semibold underline uppercase text-orange-400 hover:text-orange-600"
              >
                Áp dụng
              </button>
            </div>
          </div>

          <InputField 
            label="Tổng lương thực tế chốt (VND)" 
            type="number" 
            className="bg-white"
            {...register("total", { required: true, min: 0 })} 
            icon={<ShieldCheck size={14} className="text-blue-500"/>}
          />
        </div>

        {/* Section 3: Hồ sơ chứng từ */}
        <div className="space-y-4">
          <SectionHeader icon={<FileText className="text-blue-500" />} title="Minh chứng thanh toán" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <Controller
                name="attachmentFile"
                control={control}
                render={({ field }) => (
                  <FileUploadField
                    value={field.value}
                    onChange={field.onChange}
                    maxCount={1}
                    description="PDF/Ảnh sao kê lương"
                  />
                )}
              />
            </div>
            {mode === "update" && (
              <InputField label="Ngày đã chi trả thực tế" type="datetime-local" {...register("paidDate")} />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-8 py-3.5 rounded-2xl font-semibold uppercase text-[11px] tracking-widest text-gray-600 hover:bg-gray-100 transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gray-900 hover:bg-orange-500 text-white px-10 py-3.5 rounded-2xl font-semibold uppercase text-[11px] tracking-widest shadow-xl shadow-gray-200 transition-all duration-500 flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
            {mode === "create" ? "Phê duyệt bảng lương" : "Cập nhật dữ liệu"}
          </button>
        </div>
      </form>
    </PortalModal>
  );
}



const InputField = React.forwardRef(({ label, icon, error, className, ...props }: any, ref: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-semibold uppercase text-gray-600 tracking-widest ml-1 flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      ref={ref}
      className={cn(
        "w-full h-12 px-4 rounded-2xl border bg-white outline-none transition-all text-sm font-bold",
        "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5",
        props.disabled && "bg-gray-50 text-gray-600 border-gray-100 cursor-not-allowed",
        className
      )}
      {...props}
    />
  </div>
));