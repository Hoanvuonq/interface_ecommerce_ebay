"use client";

import { useRef } from "react";
import BankSelector from "../BankSelector";
import { CreateBankAccountModalProps } from "./type";
import { useClickOutside } from "@/hooks/useClickOutside";

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
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => {
    if (isOpen) onClose();
  });
  return (
    <>
      <div
        
        className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-transform duration-300 ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-orange-50/50">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <form id="bankForm" onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Tài khoản được đặt làm <strong>mặc định</strong> sẽ được ưu
                  tiên sử dụng để nhận tiền khi rút tiền từ ví.
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
                    setFormData({
                      ...formData,
                      bankAccountNumber: e.target.value,
                    })
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
                  onChange={(val) =>
                    setFormData({ ...formData, bankName: val })
                  }
                  className=""
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
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 cursor-pointer rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              form="bankForm"
              disabled={submitting}
              className={`px-6 py-2.5 cursor-pointer rounded-lg text-white font-medium shadow-md transition-all flex items-center gap-2
                ${
                  submitting
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
                }
              `}
            >
              {submitting && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
