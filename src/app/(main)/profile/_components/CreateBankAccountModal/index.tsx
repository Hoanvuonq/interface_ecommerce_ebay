"use client";

import React from "react";
import BankSelector from "../BankSelector";
import { CreateBankAccountModalProps } from "./type";
import { PortalModal } from "@/features/PortalModal";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";
import { FormInput } from "@/components/formInput";
import { Checkbox } from "@/components/checkbox";

export const CreateBankAccountModal = ({
  isOpen,
  onClose,
  editingId,
  formData,
  setFormData,
  errors,
  submitting,
  handleSubmit,
}: CreateBankAccountModalProps) => {
  const headerContent = (
    <div className="flex items-center gap-2">
      <h3 className="text-xl font-bold text-gray-800">
        {editingId ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
      </h3>
    </div>
  );

  const footerContent = (
    <div className="flex items-center gap-3">
      <Button variant="edit" onClick={onClose}>
        Hủy bỏ
      </Button>
      <ButtonField
        form="bankForm"
        htmlType="submit"
        type="login"
        loading={submitting}
        className="flex w-40 items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
      >
        <span className="flex items-center gap-2">
          {submitting && <Loader2 className="animate-spin h-4 w-4" />}
          {editingId ? "Cập nhật" : "Thêm mới"}
        </span>
      </ButtonField>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={headerContent}
      footer={footerContent}
      width="max-w-lg"
    >
      <div className="py-2">
        <form id="bankForm" onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-orange-50 border border-gray-100 rounded-lg p-4 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-orange-800 leading-relaxed">
              Tài khoản được đặt làm <strong>mặc định</strong> sẽ được ưu tiên
              sử dụng để nhận tiền khi rút tiền từ ví.
            </p>
          </div>

          <FormInput
            label="Số tài khoản"
            required
            placeholder="Nhập số tài khoản"
            value={formData.bankAccountNumber}
            error={errors.bankAccountNumber}
            onChange={(e) =>
              setFormData({ ...formData, bankAccountNumber: e.target.value })
            }
          />

          <div>
            <label className="text-[12px] font-bold text-gray-600 ml-1 mb-2 block">
              Ngân hàng <span className="text-red-500">*</span>
            </label>
            <BankSelector
              value={formData.bankName}
              onChange={(val) => setFormData({ ...formData, bankName: val })}
            />
            {errors.bankName && (
              <p className="mt-1 text-[10px] font-medium text-red-500 ml-1">
                {errors.bankName}
              </p>
            )}
          </div>

          <FormInput
            label="Tên chủ tài khoản"
            required
            placeholder="NGUYEN VAN A"
            className="uppercase placeholder:normal-case"
            value={formData.bankAccountHolder}
            error={errors.bankAccountHolder}
            onChange={(e) =>
              setFormData({
                ...formData,
                bankAccountHolder: e.target.value.toUpperCase(),
              })
            }
          />

          <FormInput
            label="Chi nhánh"
            placeholder="VD: CN Hoàn Kiếm (Không bắt buộc)"
            value={formData.branch}
            error={errors.branch}
            onChange={(e) =>
              setFormData({ ...formData, branch: e.target.value })
            }
          />

          <Checkbox
            label="Đặt làm tài khoản mặc định"
            checked={formData.isDefault}
            onChange={(e) =>
              setFormData({ ...formData, isDefault: e.target.checked })
            }
          />
        </form>
      </div>
    </PortalModal>
  );
};
