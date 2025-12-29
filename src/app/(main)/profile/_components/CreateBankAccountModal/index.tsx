"use client";

import React from "react";
import BankSelector from "../BankSelector";
import { CreateBankAccountModalProps } from "./type";
import { PortalModal } from "@/features/PortalModal"; // Import component tái sử dụng
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/button/button";
import { ButtonField } from "@/components";

export const CreateBankAccountModal = ({
  isOpen,
  onClose,
  visible, // Có thể bỏ nếu đã dùng isOpen
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
    <>
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
    </>
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
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-orange-800 leading-relaxed">
              Tài khoản được đặt làm <strong>mặc định</strong> sẽ được ưu tiên
              sử dụng để nhận tiền khi rút tiền từ ví.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.bankAccountNumber
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
              } focus:ring-4 focus:outline-none transition-all`}
              placeholder="Nhập số tài khoản"
              value={formData.bankAccountNumber}
              onChange={(e) =>
                setFormData({ ...formData, bankAccountNumber: e.target.value })
              }
            />
            {errors.bankAccountNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.bankAccountNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ngân hàng <span className="text-red-500">*</span>
            </label>
            <BankSelector
              value={formData.bankName}
              onChange={(val) => setFormData({ ...formData, bankName: val })}
            />
            {errors.bankName && (
              <p className="mt-1 text-sm text-red-500">{errors.bankName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên chủ tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.bankAccountHolder
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
              } focus:ring-4 focus:outline-none transition-all uppercase placeholder:normal-case`}
              placeholder="NGUYEN VAN A"
              value={formData.bankAccountHolder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankAccountHolder: e.target.value.toUpperCase(),
                })
              }
            />
            {errors.bankAccountHolder && (
              <p className="mt-1 text-sm text-red-500">
                {errors.bankAccountHolder}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Chi nhánh
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all"
              placeholder="VD: CN Hoàn Kiếm (Không bắt buộc)"
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="isDefault"
              type="checkbox"
              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer accent-orange-500"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Đặt làm tài khoản mặc định
            </label>
          </div>
        </form>
      </div>
    </PortalModal>
  );
};
