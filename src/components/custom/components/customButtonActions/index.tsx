"use client";

import { ButtonField } from "@/components";
import { Button } from "@/components/button/button";
import { cn } from "@/utils/cn";
import { Loader2, LucideIcon, Save } from "lucide-react";
import React from "react";

interface ICustomButtonActions {
  isLoading?: boolean;
  isDisabled?: boolean;
  hasChanges?: boolean;
  cancelText?: string;
  submitText?: string;
  submitIcon?: LucideIcon;
  onCancel: () => void;
  onSubmit?: () => void; 
  formId?: string;
  className?: string;
  containerClassName?: string;
}

export const CustomButtonActions: React.FC<ICustomButtonActions> = ({
  isLoading = false,
  isDisabled = false,
  hasChanges = true,
  cancelText = "Hủy bỏ",
  submitText = "Lưu thay đổi",
  submitIcon: SubmitIcon = Save,
  onCancel,
  onSubmit,
  formId,
  className,
  containerClassName,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-gray-100",
        containerClassName
      )}
    >
      <Button
        variant="edit"
        type="button"
        disabled={isLoading}
        onClick={onCancel}
        className="px-6 rounded-4xl font-bold uppercase text-[11px] tracking-widest h-10 border border-gray-200"
      >
        {cancelText}
      </Button>

      <ButtonField
        form={formId}
        htmlType={formId ? "submit" : "button"}
        onClick={onSubmit}
        type="login"
        disabled={isLoading || isDisabled || !hasChanges}
        className={cn(
          " px-2 h-10! rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-xl border-0 flex items-center justify-center gap-2 transition-all active:scale-95",
          !hasChanges || isDisabled || isLoading,
          className
        )}
      >
        <span className="flex gap-2 items-center">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            SubmitIcon && <SubmitIcon size={16} />
          )}
          {submitText}
        </span>
      </ButtonField>
    </div>
  );
};